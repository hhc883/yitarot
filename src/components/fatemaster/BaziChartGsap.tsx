'use client';

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  calculateBaZi,
  BaZiCalculationResult,
  WuXing,
  ELEMENT_ZH_MAP,
  ELEMENT_COLORS
} from '@/lib/metaphysics/bazi';
import { Sparkles, Calendar, Compass } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export function BaziChartGsap() {
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

  // 生成 AI 命理全息报告（支持 SSE 流式推演）
  const handleGenerateAiReport = async () => {
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
          gender
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

      const report = `### 🌟 原局元神与性格底色
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
      <div className="w-full rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8C6D23]" />
            <h3 className="font-serif font-bold text-base text-[#111111]">
              输入生辰八字（公历）
            </h3>
          </div>
          <span className="text-[11px] text-[#736B5E]">
            农历：{baziResult.lunarString} · 生肖【{baziResult.zodiacSignZh}】
          </span>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] text-[#736B5E] mb-1">出生年份</label>
            <input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              min={1920}
              max={2035}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] ring-1 ring-[#111111]/10 text-xs text-[#111111]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#736B5E] mb-1">月份</label>
            <input
              type="number"
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              min={1}
              max={12}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] ring-1 ring-[#111111]/10 text-xs text-[#111111]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#736B5E] mb-1">日期</label>
            <input
              type="number"
              value={day}
              onChange={e => setDay(Number(e.target.value))}
              min={1}
              max={31}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] ring-1 ring-[#111111]/10 text-xs text-[#111111]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#736B5E] mb-1">出生时辰（0-23点）</label>
            <input
              type="number"
              value={hour}
              onChange={e => setHour(Number(e.target.value))}
              min={0}
              max={23}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] ring-1 ring-[#111111]/10 text-xs text-[#111111]"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#736B5E] mb-1">性别</label>
            <div className="flex gap-1.5 h-8">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  gender === 'male' ? 'bg-[#111111] text-[#FFFDF9]' : 'bg-[#FAF6ED] text-[#736B5E]'
                }`}
              >
                乾造 (男)
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  gender === 'female' ? 'bg-[#111111] text-[#FFFDF9]' : 'bg-[#FAF6ED] text-[#736B5E]'
                }`}
              >
                坤造 (女)
              </button>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-5 pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FFE59A]" />
              <span>立即精准排盘</span>
            </button>
          </div>
        </form>
      </div>

      {/* 四柱八字盘面展示 (GSAP 飞入动效) */}
      <div ref={pillarsRef} className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: '年柱 (根基·祖荫)', p: baziResult.pillars.year },
          { label: '月柱 (提纲·父母)', p: baziResult.pillars.month },
          { label: '日柱 (元神·自身)', p: baziResult.pillars.day, isSelf: true },
          { label: '时柱 (归宿·子女)', p: baziResult.pillars.hour }
        ].map((item, idx) => (
          <div
            key={idx}
            className={`pillar-box p-4 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 text-center shadow-xs flex flex-col justify-between ${
              item.isSelf ? 'ring-2 ring-[#E8CF86] bg-[#FFFDF9]' : ''
            }`}
          >
            <div>
              <span className="text-[11px] font-medium text-[#736B5E] block mb-2">
                {item.label}
              </span>

              {/* 天干 */}
              <div className="text-3xl font-serif font-black text-[#111111] mb-1">
                {item.p.gan}
              </div>
              <span className="text-[10px] text-[#8C6D23] font-serif block mb-2">
                {ELEMENT_ZH_MAP[item.p.ganInfo.element]} · {item.p.ganInfo.archetypeZh}
              </span>

              {/* 地支 */}
              <div className="text-3xl font-serif font-black text-[#111111] mb-1">
                {item.p.zhi}
              </div>
              <span className="text-[10px] text-[#736B5E] block">
                生肖：{item.p.zhiInfo.animalZh}
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-[#111111]/6 text-[10px] text-[#5C5549] font-serif">
              纳音：{item.p.naYin}
            </div>
          </div>
        ))}
      </div>

      {/* 五行能量雷达与平衡进度 (GSAP 动态拉伸) */}
      <div className="w-full rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#8C6D23]" />
            <h4 className="font-serif font-bold text-base text-[#111111]">
              原局五行气场能量分布
            </h4>
          </div>
          <span className="text-xs text-[#736B5E]">总计 100% 相对生克比例</span>
        </div>

        <div ref={chartBarsRef} className="space-y-3">
          {baziResult.fiveElements.map((el, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-serif font-bold text-[#111111]">
                {el.elementZh} ({el.count}个)
              </span>
              <div className="flex-1 h-3.5 bg-[#FAF6ED] rounded-full overflow-hidden p-0.5">
                <div
                  className="wuxing-bar h-full rounded-full transition-all"
                  style={{
                    width: `${el.percentage}%`,
                    backgroundColor: ELEMENT_COLORS[el.element] || '#059669'
                  }}
                />
              </div>
              <span className="w-10 text-right font-medium text-[#736B5E]">
                {el.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI 命理全息蓝图报告 */}
      <div className="w-full rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-6 sm:p-8 shadow-xs text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFE59A]/40 text-[#8C6D23] border border-[#E8CF86]/50">
              FateMaster AI 命理引擎
            </span>
            <h4 className="font-serif font-black text-xl text-[#111111] mt-1">
              AI 命理全息洞察报告
            </h4>
          </div>

          <button
            onClick={handleGenerateAiReport}
            disabled={isGeneratingAi}
            className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE59A]" />
            <span>{isGeneratingAi ? 'AI 正在推演干支生克...' : '生成专属 AI 全息解读'}</span>
          </button>
        </div>

        {aiReport ? (
          <div className="prose prose-stone max-w-none text-[#111111] text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line border-t border-[#111111]/8 pt-6 animate-in fade-in">
            {aiReport}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#736B5E] border-t border-[#111111]/8">
            点击上方按钮，让 AI 依据你八字的十神与五行原局，生成事业、财富、姻缘与开运指导。
          </div>
        )}
      </div>
    </div>
  );
}
