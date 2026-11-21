'use client';

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  calculateBaZi,
  BaZiCalculationResult,
  ELEMENT_ZH_MAP,
  ELEMENT_COLORS
} from '@/lib/metaphysics/bazi';
import { Sparkles, Compass } from 'lucide-react';
import { usePointsGate } from '@/components/site/PointsGateProvider';

gsap.registerPlugin(useGSAP);

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
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const [baziResult, setBaziResult] = useState<BaZiCalculationResult>(() =>
    calculateBaZi(1996, 8, 18, 12, 0)
  );

  const [aiReport, setAiReport] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const pointsGate = usePointsGate();

  // 当输入变化时重新推演八字
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateBaZi(year, month, day, hour, 0);
    setBaziResult(res);
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

  // 生成 AI 命理全息报告：先扣 10 积分（失败弹「积分不足」），再流式推演
  const handleGenerateAiReport = async () => {
    const consumed = await pointsGate.consume('bazi');
    if (!consumed.ok) return;

    setIsGeneratingAi(true);
    setAiReport('');

    try {
      const response = await fetch('/api/fatemaster/bazi', {
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
              ? `Lunar: ${baziResult.lunarString} · Zodiac [${baziResult.zodiacSignEn}]`
              : `农历：${baziResult.lunarString} · 生肖【${baziResult.zodiacSignZh}】`}
          </span>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Year' : '出生年份'}
            </label>
            <input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              min={1920}
              max={2035}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Month' : '月份'}
            </label>
            <input
              type="number"
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              min={1}
              max={12}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Day' : '日期'}
            </label>
            <input
              type="number"
              value={day}
              onChange={e => setDay(Number(e.target.value))}
              min={1}
              max={31}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Hour (0-23)' : '出生时辰（0-23点）'}
            </label>
            <input
              type="number"
              value={hour}
              onChange={e => setHour(Number(e.target.value))}
              min={0}
              max={23}
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

          <div className="col-span-2 sm:col-span-5 pt-2">
            <button
              type="submit"
              className="w-full min-h-[44px] rounded-sm bg-[#171717] hover:bg-[#333333] text-white text-[14px] font-medium tracking-wide transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            >
              <span>{isEn ? 'Calculate BaZi Chart' : '开始排盘'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 四柱八字盘面展示 (GSAP 飞入动效) */}
      <div ref={pillarsRef} className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          {
            label: isEn ? 'Year Pillar · Ancestry' : '年柱 · 祖荫',
            p: baziResult.pillars.year
          },
          {
            label: isEn ? 'Month Pillar · Season' : '月柱 · 提纲',
            p: baziResult.pillars.month
          },
          {
            label: isEn ? 'Day Pillar · Day Master' : '日柱 · 元神',
            p: baziResult.pillars.day,
            isSelf: true
          },
          {
            label: isEn ? 'Hour Pillar · Legacy' : '时柱 · 归宿',
            p: baziResult.pillars.hour
          }
        ].map((item, idx) => (
          <div
            key={idx}
            className={`pillar-box p-3.5 sm:p-4 rounded-sm text-center flex flex-col justify-between transition-colors ${
              item.isSelf
                ? 'border-2 border-[#171717] bg-[#F5F5F6]/40'
                : 'border border-[#E4E4E7] bg-white'
            }`}
          >
            <div>
              <span className="text-[11px] font-medium text-[#52525B] block mb-2">
                {item.label}
              </span>

              {/* 天干 */}
              <div className="text-3xl font-serif font-normal text-[#171717] mb-1">
                {item.p.gan}
              </div>
              <span className="text-[11px] text-[#52525B] font-mono block mb-2">
                {isEn
                  ? `${item.p.ganInfo.element} · ${item.p.ganInfo.archetypeEn}`
                  : `${ELEMENT_ZH_MAP[item.p.ganInfo.element]} · ${item.p.ganInfo.archetypeZh}`}
              </span>

              {/* 地支 */}
              <div className="text-3xl font-serif font-normal text-[#171717] mb-1">
                {item.p.zhi}
              </div>
              <span className="text-[11px] text-[#52525B] block">
                {isEn ? `Zodiac: ${item.p.zhiInfo.animalEn}` : `生肖：${item.p.zhiInfo.animalZh}`}
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-[#E4E4E7] text-[11px] text-[#52525B]">
              {isEn ? `Sound: ${item.p.naYin}` : `纳音：${item.p.naYin}`}
            </div>
          </div>
        ))}
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
          <div className="prose prose-neutral max-w-none text-[#171717] text-[13px] sm:text-[14px] leading-relaxed space-y-4 whitespace-pre-line border-t border-[#E4E4E7] pt-6 animate-in fade-in">
            {aiReport}
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