'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  calculateBaZi,
  BaZiCalculationResult,
  ELEMENT_ZH_MAP,
  ELEMENT_COLORS,
  STEMS_MAP,
  BRANCHES_MAP,
  getShiShen,
  SHISHEN_SHORT
} from '@/lib/metaphysics/bazi';
import { Sparkles, Compass } from 'lucide-react';
import { usePointsGate } from '@/components/site/PointsGateProvider';
import { MarkdownView } from '@/components/common/MarkdownView';
import { saveReading, getSavedReadings } from '@/lib/storage/reading-history';
import { DateTimePickerPopover } from './DateTimePickerPopover';

gsap.registerPlugin(useGSAP);

const NAYIN_EN_MAP: Record<string, string> = {
  '海中金': 'Sea Metal',
  '炉中火': 'Furnace Fire',
  '大林木': 'Forest Wood',
  '路旁土': 'Roadside Earth',
  '剑锋金': 'Sword Edge Metal',
  '山头火': 'Mountaintop Fire',
  '涧下水': 'Stream Water',
  '城头土': 'City Wall Earth',
  '白蜡金': 'White Wax Metal',
  '杨柳木': 'Willow Wood',
  '泉中水': 'Spring Water',
  '屋上土': 'Rooftop Earth',
  '霹雳火': 'Thunderbolt Fire',
  '松柏木': 'Pine & Cypress Wood',
  '长流水': 'Flowing Stream Water',
  '沙中金': 'Sand Gold Metal',
  '山下火': 'Foot-hill Fire',
  '平地木': 'Plains Wood',
  '壁上土': 'Wall Earth',
  '金箔金': 'Gold Leaf Metal',
  '覆灯火': 'Lamp Fire',
  '天河水': 'Heavenly River Water',
  '大驿土': 'Post Station Earth',
  '钗钏金': 'Hairpin Metal',
  '桑柘木': 'Mulberry Wood',
  '大溪水': 'Great Torrent Water',
  '沙中土': 'Desert Sand Earth',
  '天上火': 'Heavenly Sun Fire',
  '石榴木': 'Pomegranate Wood',
  '大海水': 'Ocean Water'
};

export function BaziChartGsap({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const containerRef = useRef<HTMLDivElement>(null);
  const chartBarsRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  // 表单状态
  const [year, setYear] = useState(1996);
  const [month, setMonth] = useState(8);
  const [day, setDay] = useState(18);
  const [hour, setHour] = useState(12);
  const [yearText, setYearText] = useState('1996');
  const [monthText, setMonthText] = useState('8');
  const [dayText, setDayText] = useState('18');
  const [hourText, setHourText] = useState('12');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [sect, setSect] = useState<1 | 2>(2);
  const [selectedDaYunIdx, setSelectedDaYunIdx] = useState(0);
  const [selectedLiuNianIdx, setSelectedLiuNianIdx] = useState(0);

  const [baziResult, setBaziResult] = useState<BaZiCalculationResult>(() =>
    calculateBaZi(1996, 8, 18, 12, 0, { gender: 'male', sect: 2 })
  );

  const syncNumericFields = (y: number, m: number, d: number, h: number) => {
    setYear(y); setYearText(String(y));
    setMonth(m); setMonthText(String(m));
    setDay(d); setDayText(String(d));
    setHour(h); setHourText(String(h));
  };

  const [aiReport, setAiReport] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const rawSessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!rawSessionId) return '';
    const list = getSavedReadings();
    const found = list.find((r) => r.id === rawSessionId);
    return found?.fullContent || '';
  });
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const pointsGate = usePointsGate();

  // 当输入变化时重新推演八字
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const y = Math.min(2100, Math.max(1900, parseInt(yearText, 10) || year));
    const m = Math.min(12, Math.max(1, parseInt(monthText, 10) || month));
    const d = Math.min(31, Math.max(1, parseInt(dayText, 10) || day));
    const h = Math.min(23, Math.max(0, Number.isNaN(parseInt(hourText, 10)) ? hour : parseInt(hourText, 10)));
    syncNumericFields(y, m, d, h);
    const res = calculateBaZi(y, m, d, h, 0, { gender, sect });
    setBaziResult(res);
    setSelectedDaYunIdx(0);
    setSelectedLiuNianIdx(0);
    setAiReport('');
  };

  // GSAP 动画：四柱与五行能量条动态伸展
  useGSAP(() => {
    if (chartBarsRef.current) {
      const bars = chartBarsRef.current.querySelectorAll('.wuxing-bar');
      gsap.fromTo(
        bars,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
      );
    }

    if (pillarsRef.current) {
      const pillarBoxes = pillarsRef.current.querySelectorAll('.pillar-box');
      gsap.fromTo(
        pillarBoxes,
        { y: 25, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.6, ease: 'back.out(1.5)' }
      );
    }
  }, { dependencies: [baziResult], scope: containerRef });

  // 八字 AI 报告生成完成自动存入用户档案
  useEffect(() => {
    if (aiReport && !isGeneratingAi && baziResult) {
      const yearGz = `${baziResult.pillars.year.gan}${baziResult.pillars.year.zhi}`;
      const monthGz = `${baziResult.pillars.month.gan}${baziResult.pillars.month.zhi}`;
      const dayGz = `${baziResult.pillars.day.gan}${baziResult.pillars.day.zhi}`;

      saveReading({
        type: 'bazi',
        title: isEn
          ? `BaZi Natal Chart (${yearGz} ${monthGz} ${dayGz})`
          : `八字命理全息洞察（${yearGz}年 ${monthGz}月 ${dayGz}日）`,
        question: isEn
          ? `Birth: ${year}-${month}-${day} ${hour}:00 (${gender})`
          : `出生公历：${year}年${month}月${day}日 ${hour}点（${gender === 'male' ? '乾造' : '坤造'}）`,
        summary: aiReport.slice(0, 140) + '...',
        fullContent: aiReport
      });
    }
  }, [aiReport, isGeneratingAi, baziResult, year, month, day, hour, gender, isEn]);

  // 生成 AI 命理全息报告：先扣 10 积分（失败弹「积分不足」），再流式推演
  const handleGenerateAiReport = async () => {
    const consumed = await pointsGate.consume('bazi');
    if (!consumed.ok) return;

    setIsGeneratingAi(true);
    setAiReport('');

    try {
      const response = await fetch('/api/east/bazi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          month,
          day,
          hour,
          gender,
          lang,
          points_ref: consumed.ref_id
        })
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') break;
              try {
                const data = JSON.parse(jsonStr);
                if (data.text) {
                  setAiReport(prev => prev + data.text);
                }
              } catch {
                // ignore
              }
            }
          }
        }
      } else if (response.status === 401 || response.status === 402) {
        // 未登录 / 积分不足：不降级本地引擎，避免绕过积分
        setIsGeneratingAi(false);
        return;
      } else {
        throw new Error('API unavailable');
      }
    } catch {
      // 降级使用本地专家推演
      const dm = baziResult.dayMaster;
      const dominant = baziResult.fiveElements.reduce((prev, curr) =>
        curr.percentage > prev.percentage ? curr : prev
      );
      const lacking = baziResult.fiveElements.reduce((prev, curr) =>
        curr.percentage < prev.percentage ? curr : prev
      );

      const report = isEn
        ? `### 🌟 Day Master Essence & Archetype
Your Day Pillar Heavenly Stem is **【${dm.nameEn}】**, classically revered as the archetype of “${dm.archetypeEn}”.
${dm.essenceEn}
Possesses balanced composure and disciplined resolve. When supported by lunar timing and resource stems, this chart indicates acute strategic foresight and durable leadership capacity.

---

### ✦ Five Elements Balance & Constitutional Dynamics
In your natal chart, **【${dominant.element}】** energy holds dominant strength (~${dominant.percentage}%), while **【${lacking.element}】** remains relatively latent.
- **Dynamic Interaction**: Robust Wood shaped by Metal becomes a Pillar; vigorous Fire tempered by Water creates lasting equilibrium.
- **Harmony Guidance**: ${baziResult.elementRecommendationsEn}

---

### ✦ Career Trajectory & Natural Genius
${dm.cosmicAdviceEn}
Thrives in environments requiring high intellectual barrier to entry, long-term architectural planning, and durable craftsmanship over high-frequency speculation.

---

### 🧭 Cosmic Guidance & Action Maxims
> *“The wise understand cosmic timing and navigate life with composed serenity. Cultivate your innate gifts and act in alignment with natural momentum to build enduring success.”*`
        : `### 🌟 原局元神与性格底色
你的日柱天干为**【${dm.nameZh}】**，古典命理中被称为“${dm.archetypeZh}”。
${dm.essenceZh}
此格人性格端正，行事有度。若得月令印绶扶持，更主聪颖博学，具有深远的战略眼光。

---

### ✦ 五行能量生克与格局调候
原局中，你的五行以**【${dominant.elementZh}】**气场最为旺盛（占比约 ${dominant.percentage}%），而**【${lacking.elementZh}】**能量相对潜藏。
- **生克机理**：强木得金，方成栋梁；火旺遇水，既济功成。
- **调候建议**：宜在日常决策与家居色彩中注重调和，让气场环环相生。

---

### ✦ 事业发展与天赋赛道
${dm.cosmicAdviceZh}
适合在需要战略规划、文化教育或核心专业壁垒的领域深耕，避免从事朝令夕改的高频投机。

---

### 🧭 后天补运与破局箴言
> *“君子知命而不惑，居易以俟命。善用自身的天赋禀赋，顺势而为，自能开疆拓土。”*`;

      let index = 0;
      const interval = setInterval(() => {
        index += 8;
        setAiReport(report.slice(0, index));
        if (index >= report.length) {
          clearInterval(interval);
        }
      }, 20);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* 出生信息输入表单 */}
      <div className="w-full rounded-sm bg-white border border-[#E4E4E7] p-5 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-serif text-[16px] sm:text-[17px] font-normal text-[#171717]">
            {isEn ? 'Four Pillars (BaZi)' : '生辰八字'}
          </h2>
          <span className="text-[12px] text-[#52525B]">
            {isEn
              ? `Solar Date: ${baziResult.birthSolar.year}-${String(baziResult.birthSolar.month).padStart(2, '0')}-${String(baziResult.birthSolar.day).padStart(2, '0')} · Zodiac [${baziResult.zodiacSignEn}]`
              : `农历：${baziResult.lunarString} · 生肖【${baziResult.zodiacSignZh}】`}
          </span>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* 现代农历日历选择器 + 一键当前时间 */}
          <div className="col-span-2 sm:col-span-5 flex flex-wrap items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-[#52525B]">
                {isEn ? 'Calendar:' : '日历选择：'}
              </span>
              <DateTimePickerPopover
                year={year}
                month={month}
                day={day}
                hour={hour}
                isEn={isEn}
                onChange={(y, m, d, h) => {
                  syncNumericFields(y, m, d, h);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const y = now.getFullYear();
                const m = now.getMonth() + 1;
                const d = now.getDate();
                const h = now.getHours();
                syncNumericFields(y, m, d, h);
                setBaziResult(calculateBaZi(y, m, d, h, 0, { gender, sect }));
                setSelectedDaYunIdx(0);
                setSelectedLiuNianIdx(0);
              }}
              className="px-2.5 py-1 rounded-sm border border-[#E4E4E7] bg-white hover:bg-[#F5F5F6] text-[11px] text-[#171717] cursor-pointer"
            >
              {isEn ? 'Use Current Time' : '填入当前时间'}
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Year' : '出生年份'}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={yearText}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                setYearText(raw);
                const n = parseInt(raw, 10);
                if (n >= 1900 && n <= 2100) setYear(n);
              }}
              onBlur={() => {
                const n = Math.min(2100, Math.max(1900, parseInt(yearText, 10) || year));
                setYear(n);
                setYearText(String(n));
              }}
              placeholder="1996"
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Month' : '月份'}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={monthText}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
                setMonthText(raw);
                const n = parseInt(raw, 10);
                if (n >= 1 && n <= 12) setMonth(n);
              }}
              onBlur={() => {
                const n = Math.min(12, Math.max(1, parseInt(monthText, 10) || month));
                setMonth(n);
                setMonthText(String(n));
              }}
              placeholder="1-12"
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Day' : '日期'}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={dayText}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
                setDayText(raw);
                const n = parseInt(raw, 10);
                if (n >= 1 && n <= 31) setDay(n);
              }}
              onBlur={() => {
                const n = Math.min(31, Math.max(1, parseInt(dayText, 10) || day));
                setDay(n);
                setDayText(String(n));
              }}
              placeholder="1-31"
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Hour (0-23)' : '出生时辰（0-23点）'}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={hourText}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
                setHourText(raw);
                const n = parseInt(raw, 10);
                if (!Number.isNaN(n) && n >= 0 && n <= 23) setHour(n);
              }}
              onBlur={() => {
                const parsed = parseInt(hourText, 10);
                const n = Math.min(23, Math.max(0, Number.isNaN(parsed) ? hour : parsed));
                setHour(n);
                setHourText(String(n));
              }}
              placeholder="0-23"
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Gender' : '性别'}
            </label>
            <div className="flex gap-1.5 h-10">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 rounded-sm text-[12px] font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                  gender === 'male'
                    ? 'bg-[#171717] text-white border border-[#171717]'
                    : 'bg-[#F5F5F6] text-[#52525B] border border-[#E4E4E7] hover:bg-[#E4E4E7] hover:text-[#171717]'
                }`}
              >
                {isEn ? 'Male' : '乾造 (男)'}
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 rounded-sm text-[12px] font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                  gender === 'female'
                    ? 'bg-[#171717] text-white border border-[#171717]'
                    : 'bg-[#F5F5F6] text-[#52525B] border border-[#E4E4E7] hover:bg-[#E4E4E7] hover:text-[#171717]'
                }`}
              >
                {isEn ? 'Female' : '坤造 (女)'}
              </button>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-5 flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-[12px] text-[#52525B]">
              <span>{isEn ? 'Late Zi (23:00):' : '早晚子时：'}</span>
              {([
                [2, isEn ? 'Split (Keep Day)' : '区分早晚子时'],
                [1, isEn ? 'Rollover at 23:00' : '23点换日柱'],
              ] as const).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSect(val)}
                  className={`px-2.5 py-1 rounded-sm text-[11px] font-medium border transition-colors cursor-pointer ${
                    sect === val
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'bg-[#F5F5F6] text-[#52525B] border-[#E4E4E7] hover:text-[#171717]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-5 pt-1">
            <button
              type="submit"
              className="w-full min-h-[44px] rounded-sm bg-[#171717] hover:bg-[#333333] text-white text-[14px] font-medium tracking-wide transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            >
              <span>{isEn ? 'Calculate BaZi Chart' : '开始排盘'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 四柱八字专业排盘表（对齐易瑞笔记 6 列 + 神煞 + 大运流年流月） */}
      <div ref={pillarsRef} className="w-full rounded-xl bg-white border border-zinc-200 overflow-hidden mb-6 shadow-xs">
        <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-700">
          <span>
            {baziResult.birthSolar.year}年{String(baziResult.birthSolar.month).padStart(2, '0')}月{String(baziResult.birthSolar.day).padStart(2, '0')}日 ({baziResult.lunarString.split(' ').slice(2).join('')}) {String(baziResult.birthSolar.hour).padStart(2, '0')}:00
          </span>
          <span className="text-zinc-500">{gender === 'male' ? '乾造' : '坤造'} · {sect === 2 ? '区分早晚子时' : '23点换日柱'}</span>
        </div>

        {(() => {
          const cols = [
            baziResult.pillars.year,
            baziResult.pillars.month,
            baziResult.pillars.day,
            baziResult.pillars.hour,
            ...(baziResult.extraPillars?.xiaoYun ? [baziResult.extraPillars.xiaoYun] : []),
            ...(baziResult.extraPillars?.liuNian ? [baziResult.extraPillars.liuNian] : []),
          ];
          const headers = ['年柱', '月柱', '日柱', '时柱', ...(baziResult.extraPillars?.xiaoYun ? ['小运'] : []), ...(baziResult.extraPillars?.liuNian ? ['流年'] : [])];
          const dayGan = baziResult.pillars.day.gan;

          return (
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-500">
                    <th className="py-2 px-2 font-normal w-12 text-left pl-3"></th>
                    {headers.map((h, i) => (
                      <th key={h} className={`py-2 px-2 font-normal ${i === 2 ? 'font-medium text-zinc-900' : ''} ${i === 4 ? 'border-l border-zinc-100' : ''}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <td className="py-1.5 px-2 text-left pl-3 text-zinc-400">主星</td>
                    {cols.map((p, i) => (
                      <td key={i} className={`py-1.5 px-2 text-zinc-700 font-medium ${i === 4 ? 'border-l border-zinc-100' : ''}`}>{p.shiShen || '—'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-left pl-3 text-zinc-400">{gender === 'male' ? '乾造' : '坤造'}</td>
                    {cols.map((p, i) => (
                      <td key={i} className={`pillar-box py-2 px-2 ${i === 4 ? 'border-l border-zinc-100' : ''}`}>
                        <div className="text-2xl sm:text-3xl font-serif font-medium" style={{ color: ELEMENT_COLORS[p.ganInfo.element] }}>
                          {p.gan}
                        </div>
                        <div className="text-2xl sm:text-3xl font-serif font-medium mt-0.5" style={{ color: ELEMENT_COLORS[p.zhiInfo.element] }}>
                          {p.zhi}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-left pl-3 text-zinc-400">藏干</td>
                    {cols.map((p, i) => (
                      <td key={i} className={`py-2 px-2 align-top ${i === 4 ? 'border-l border-zinc-100' : ''}`}>
                        {(p.hideGan || []).map((hg, hi) => (
                          <div key={hi} className="text-[11px] leading-5">
                            <span className="font-medium" style={{ color: ELEMENT_COLORS[STEMS_MAP[hg]?.element ?? 'Earth'] }}>{hg}</span>
                            <span className="text-zinc-500 ml-0.5">{p.shiShenZhi?.[hi] || ''}</span>
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-left pl-3 text-zinc-400">空亡</td>
                    {cols.map((p, i) => (
                      <td key={i} className={`py-1.5 px-2 text-zinc-600 ${i === 4 ? 'border-l border-zinc-100' : ''}`}>{p.xunKong || '—'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-left pl-3 text-zinc-400">星运</td>
                    {cols.map((p, i) => (
                      <td key={i} className={`py-1.5 px-2 text-zinc-700 ${i === 4 ? 'border-l border-zinc-100' : ''}`}>{p.xingYun || '—'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-left pl-3 text-zinc-400">自坐</td>
                    {cols.map((p, i) => (
                      <td key={i} className={`py-1.5 px-2 text-zinc-600 ${i === 4 ? 'border-l border-zinc-100' : ''}`}>{p.ziZuo || '—'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-left pl-3 text-zinc-400">纳音</td>
                    {cols.map((p, i) => (
                      <td key={i} className={`py-1.5 px-2 text-zinc-600 ${i === 4 ? 'border-l border-zinc-100' : ''}`}>{p.naYin || '—'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-left pl-3 text-zinc-400 align-top">神煞</td>
                    {cols.map((p, i) => (
                      <td key={i} className={`py-2 px-1 align-top text-[11px] leading-5 text-zinc-600 ${i === 4 ? 'border-l border-zinc-100' : ''}`}>
                        {(p.shenSha && p.shenSha.length > 0) ? p.shenSha.map((s) => <div key={s}>{s}</div>) : '—'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>

              {/* 胎元 / 胎息 / 命宫 / 身宫 */}
              <div className="px-4 py-2.5 bg-zinc-50/70 border-t border-zinc-200 flex flex-wrap justify-between gap-3 text-xs text-zinc-700">
                <span>胎元:{baziResult.taiYuan}</span>
                <span>胎息:{baziResult.taiXi}</span>
                <span>命宫:{baziResult.mingGong}</span>
                <span>身宫:{baziResult.shenGong}</span>
              </div>

              {/* 起运 + 司令 + 大运 / 流年 / 流月 三层联动 */}
              {baziResult.yun && (() => {
                const activeDy = baziResult.yun.daYun[selectedDaYunIdx] ?? baziResult.yun.daYun[0];
                const activeLn = activeDy?.liuNian[selectedLiuNianIdx] ?? activeDy?.liuNian[0];
                const renderGzBadge = (gz: string) => {
                  const g = gz[0];
                  const z = gz[1];
                  const gEl = STEMS_MAP[g]?.element ?? 'Earth';
                  const zEl = BRANCHES_MAP[z]?.element ?? 'Earth';
                  const gShort = SHISHEN_SHORT[getShiShen(dayGan, g)] ?? '';
                  const zMain = z === '子' ? '癸' : z === '丑' ? '己' : z === '寅' ? '甲' : z === '卯' ? '乙' : z === '辰' ? '戊' : z === '巳' ? '丙' : z === '午' ? '丁' : z === '未' ? '己' : z === '申' ? '庚' : z === '酉' ? '辛' : z === '戌' ? '戊' : '壬';
                  const zShort = SHISHEN_SHORT[getShiShen(dayGan, zMain)] ?? '';
                  return (
                    <div className="mt-1 space-y-0.5 leading-tight">
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="font-serif text-sm font-semibold" style={{ color: ELEMENT_COLORS[gEl] }}>{g}</span>
                        <span className="text-[9px] text-zinc-400">{gShort}</span>
                      </div>
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="font-serif text-sm font-semibold" style={{ color: ELEMENT_COLORS[zEl] }}>{z}</span>
                        <span className="text-[9px] text-zinc-400">{zShort}</span>
                      </div>
                    </div>
                  );
                };

                return (
                  <div className="p-4 border-t border-zinc-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
                      <span>起运 出生{baziResult.yun.startYear}年{baziResult.yun.startMonth}个月{baziResult.yun.startDay}天 时间 {baziResult.yun.startDate}</span>
                      {baziResult.siLing && (
                        <span>
                          司令：<strong style={{ color: ELEMENT_COLORS[STEMS_MAP[baziResult.siLing]?.element ?? 'Water'] }}>{baziResult.siLing}</strong>
                        </span>
                      )}
                    </div>

                    {/* 大运行 */}
                    <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
                      <div className="w-7 shrink-0 flex items-center justify-center text-xs text-zinc-500 leading-tight text-center">大<br />运</div>
                      {baziResult.yun.daYun.map((dy, idx) => {
                        const active = selectedDaYunIdx === idx;
                        return (
                          <button
                            key={dy.index}
                            type="button"
                            onClick={() => { setSelectedDaYunIdx(idx); setSelectedLiuNianIdx(0); }}
                            className={`min-w-13 rounded-md border px-1.5 py-1.5 text-center transition-colors cursor-pointer ${
                              active ? 'border-zinc-900 bg-zinc-100' : 'border-zinc-200 bg-white hover:border-zinc-400'
                            }`}
                          >
                            <div className="text-[10px] text-zinc-500">{dy.startYear}</div>
                            <div className="text-[10px] text-zinc-500">{dy.startAge}岁</div>
                            {dy.isXiaoYun ? (
                              <div className="mt-1 font-serif text-sm text-zinc-800 leading-tight">小<br />运</div>
                            ) : renderGzBadge(dy.ganZhi)}
                          </button>
                        );
                      })}
                    </div>

                    {/* 流年行 */}
                    {activeDy?.liuNian && (
                      <div className="flex items-stretch gap-1 overflow-x-auto pb-1 border-t border-zinc-100 pt-2">
                        <div className="w-7 shrink-0 flex items-center justify-center text-xs text-zinc-500 leading-tight text-center">流<br />年</div>
                        {activeDy.liuNian.map((ln, idx) => {
                          const active = selectedLiuNianIdx === idx;
                          return (
                            <button
                              key={ln.year}
                              type="button"
                              onClick={() => setSelectedLiuNianIdx(idx)}
                              className={`min-w-13 rounded-md border px-1.5 py-1.5 text-center transition-colors cursor-pointer ${
                                active ? 'border-zinc-900 bg-zinc-100' : 'border-zinc-200 bg-white hover:border-zinc-400'
                              }`}
                            >
                              <div className="text-[10px] text-zinc-500">{ln.year}</div>
                              <div className="text-[10px] text-zinc-500">{ln.age}岁</div>
                              {renderGzBadge(ln.ganZhi)}
                              {ln.xiaoYunGanZhi && <div className="mt-1 text-[10px] text-zinc-400">{ln.xiaoYunGanZhi}</div>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* 流月行 */}
                    {activeLn?.liuYue && (
                      <div className="flex items-stretch gap-1 overflow-x-auto pb-1 border-t border-zinc-100 pt-2">
                        <div className="w-7 shrink-0 flex items-center justify-center text-xs text-zinc-500 leading-tight text-center">流<br />月</div>
                        {activeLn.liuYue.map((ly) => (
                          <div key={ly.termName} className="min-w-12 rounded-md border border-zinc-100 bg-zinc-50/50 px-1 py-1.5 text-center">
                            <div className="text-[10px] text-zinc-500">{ly.termName}</div>
                            <div className="text-[10px] text-zinc-400">{ly.termDate}</div>
                            {renderGzBadge(ly.ganZhi)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })()}
      </div>

      {/* 五行能量雷达与平衡进度 (GSAP 动态拉伸) */}
      <div className="w-full rounded-sm bg-white border border-[#E4E4E7] p-5 sm:p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#171717]" />
            <h2 className="font-serif text-[17px] sm:text-[18px] font-normal text-[#171717]">
              {isEn ? 'Five Elements Energy Balance' : '原局五行气场能量分布'}
            </h2>
          </div>
          <span className="text-[12px] text-[#52525B]">
            {isEn ? 'Relative 100% distribution' : '总计 100% 相对生克比例'}
          </span>
        </div>

        <div ref={chartBarsRef} className="space-y-3">
          {baziResult.fiveElements.map((el, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 text-xs">
              <span className="w-14 sm:w-16 font-medium text-[#171717] shrink-0 text-left">
                {isEn ? el.element : el.elementZh} ({el.count})
              </span>
              <div className="flex-1 h-3 bg-[#F5F5F6] border border-[#E4E4E7] rounded-sm overflow-hidden p-0.5">
                <div
                  className="wuxing-bar h-full rounded-sm transition-all"
                  style={{
                    width: `${el.percentage}%`,
                    backgroundColor: ELEMENT_COLORS[el.element] || '#059669'
                  }}
                />
              </div>
              <span className="w-10 text-right font-mono text-[12px] text-[#52525B] shrink-0">
                {el.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI 命理全息蓝图报告 */}
      <div className="w-full rounded-sm bg-white border border-[#E4E4E7] p-5 sm:p-6 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="inline-block px-2 py-0.5 rounded-sm text-[11px] font-medium bg-[#F5F5F6] text-[#52525B] border border-[#E4E4E7] uppercase tracking-wider">
              AI Analysis
            </span>
            <h3 className="font-serif text-[18px] sm:text-[20px] font-normal text-[#171717] mt-1.5">
              {isEn ? 'AI BaZi Holographic Insight' : 'AI 命理全息洞察报告'}
            </h3>
          </div>

          <button
            onClick={handleGenerateAiReport}
            disabled={isGeneratingAi}
            className="min-h-[40px] px-5 py-2 rounded-sm bg-[#171717] hover:bg-[#333333] text-white text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>
              {isEn
                ? (isGeneratingAi ? 'Analyzing BaZi Stems & Branches...' : 'Generate Full AI Reading')
                : (isGeneratingAi ? 'AI 正在推演干支生克...' : '生成专属 AI 全息解读')}
            </span>
          </button>
        </div>

        {aiReport ? (
          <div className="border-t border-[#E4E4E7] pt-6 animate-in fade-in">
            <MarkdownView
              content={aiReport}
              className="text-[13px] sm:text-[14px] leading-relaxed text-[#171717]"
            />
          </div>
        ) : (
          <div className="py-8 text-center text-[13px] text-[#52525B] border-t border-[#E4E4E7]">
            {isEn
              ? 'Click the button above to generate AI insights covering career trajectory, wealth affinity, romance harmony, and constitutional balance.'
              : '点击上方按钮，让 AI 依据你八字的十神与五行原局，生成事业、财富、姻缘与开运指导。'}
          </div>
        )}
      </div>
    </div>
  );
}