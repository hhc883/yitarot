'use client';

import React, { useState } from 'react';
import { calculateZiwei, ZiweiChartResult, ZiweiPalace } from '@/lib/metaphysics/ziwei';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function ZiweiChartWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const [year, setYear] = useState(1996);
  const [month, setMonth] = useState(8);
  const [day, setDay] = useState(18);
  const [hour, setHour] = useState(12);

  const [chart, setChart] = useState<ZiweiChartResult>(() =>
    calculateZiwei(1996, 8, 18, 12)
  );

  const [activePalaceIndex, setActivePalaceIndex] = useState<number>(chart.palaces.find(p => p.isLifePalace)?.index ?? 0);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateZiwei(year, month, day, hour);
    setChart(res);
    const lifeIdx = res.palaces.find(p => p.isLifePalace)?.index ?? 0;
    setActivePalaceIndex(lifeIdx);
  };

  const selectedPalace = chart.palaces.find(p => p.index === activePalaceIndex) || chart.palaces[0];

  // 12 宫在 4x4 盘面中的经典分布 (围绕周边 12 格排布)
  const gridPositions: Record<number, { col: number; row: number }> = {
    5: { col: 1, row: 1 }, // 巳
    6: { col: 2, row: 1 }, // 午
    7: { col: 3, row: 1 }, // 未
    8: { col: 4, row: 1 }, // 申
    9: { col: 4, row: 2 }, // 酉
    10: { col: 4, row: 3 }, // 戌
    11: { col: 4, row: 4 }, // 亥
    0: { col: 3, row: 4 }, // 子
    1: { col: 2, row: 4 }, // 丑
    2: { col: 1, row: 4 }, // 寅
    3: { col: 1, row: 3 }, // 卯
    4: { col: 1, row: 2 }  // 辰
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* 标题 */}
      <div className="w-full text-center mb-6">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {isEn ? 'AI Ziwei Doushu Chart' : 'AI 紫微斗数排盘'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-1.5 max-w-lg mx-auto">
          {isEn
            ? '12 Palaces · Life & Body Alignment · 14 Major Stars · Natal Transformations'
            : '十二宫位星耀分布 · 命身双宫定位 · 十四主星庙旺 · 生年四化飞星'}
        </p>
      </div>

      {/* 生辰调参框 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs mb-8">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className="text-xs font-serif font-bold text-[#111111]">
            {isEn ? 'Birth Timing' : '生辰历法'}
          </span>
          <span className="text-[11px] font-serif text-[#736B5E]">
            {isEn
              ? `Lunar: ${chart.lunarDate.yearGanZhi} Year · ${chart.bureau.nameEn}`
              : `农历：${chart.lunarDate.yearGanZhi}年 ${chart.lunarDate.monthZh}${chart.lunarDate.dayZh} ${chart.lunarDate.hourBranch} · 【${chart.bureau.nameZh}】`}
          </span>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-serif text-[#736B5E] mb-1">
              {isEn ? 'Year' : '公历年'}
            </label>
            <input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              min={1920}
              max={2035}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-serif text-[#736B5E] mb-1">
              {isEn ? 'Month' : '月'}
            </label>
            <input
              type="number"
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              min={1}
              max={12}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-serif text-[#736B5E] mb-1">
              {isEn ? 'Day' : '日'}
            </label>
            <input
              type="number"
              value={day}
              onChange={e => setDay(Number(e.target.value))}
              min={1}
              max={31}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-serif text-[#736B5E] mb-1">
              {isEn ? 'Birth Hour (0-23)' : '出生时辰 (点)'}
            </label>
            <input
              type="number"
              value={hour}
              onChange={e => setHour(Number(e.target.value))}
              min={0}
              max={23}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
            />
          </div>
          <div className="flex items-end col-span-2 sm:col-span-1">
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-serif tracking-wider transition-colors cursor-pointer"
            >
              {isEn ? 'Recalculate Chart' : '重新排盘'}
            </button>
          </div>
        </form>
      </div>

      {/* 紫微斗数十二宫方形大盘面 (桌面端 4x4 完整九宫格网，移动端自适应网格) */}
      <div className="w-full mb-8">
        <div className="hidden md:grid grid-cols-4 grid-rows-4 gap-2.5 p-3 rounded-2xl bg-[#F7F3EF] border border-[#111111]/10 shadow-2xs">
          {/* 中间 2x2 天心盘面 */}
          <div className="col-start-2 col-span-2 row-start-2 row-span-2 rounded-xl bg-[#FFFDF9] border border-[#111111]/8 p-5 flex flex-col justify-between text-center">
            <div>
              <span className="text-[11px] font-serif tracking-widest text-[#8C6D23] uppercase block mb-1">
                Z I W E I · D O U S H U
              </span>
              <h3 className="font-serif font-black text-xl text-[#111111]">
                {isEn ? 'Twelve Palaces Hologram' : '天盘十二宫全息图'}
              </h3>
              <p className="text-xs font-serif text-[#736B5E] mt-1">
                {isEn
                  ? `${chart.bureau.nameEn} · Life Palace [${chart.lifePalaceBranch}] · Body Palace [${chart.bodyPalaceBranch}]`
                  : `五行局：${chart.bureau.nameZh} · 命宫坐【${chart.lifePalaceBranch}】 · 身宫坐【${chart.bodyPalaceBranch}】`}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF6ED] border border-[#111111]/6 text-xs font-serif text-left">
              <span className="font-bold text-[#111111] block mb-0.5">
                {isEn ? `Life Star: ${chart.dayMasterStarEn}` : `命宫主星：${chart.dayMasterStar}`}
              </span>
              <p className="text-[11px] text-[#524B40] leading-relaxed line-clamp-3">
                {isEn ? chart.overallProfileEn.personality : chart.overallProfileZh.personality}
              </p>
            </div>

            <div className="flex justify-around items-center pt-2 border-t border-[#111111]/6 text-[10px] font-serif text-[#736B5E]">
              {isEn ? (
                <>
                  <span>Lu · {chart.fourTransformationsEn.lu}</span>
                  <span>Quan · {chart.fourTransformationsEn.quan}</span>
                  <span>Ke · {chart.fourTransformationsEn.ke}</span>
                  <span>Ji · {chart.fourTransformationsEn.ji}</span>
                </>
              ) : (
                <>
                  <span>禄 · {chart.fourTransformations.lu}</span>
                  <span>权 · {chart.fourTransformations.quan}</span>
                  <span>科 · {chart.fourTransformations.ke}</span>
                  <span>忌 · {chart.fourTransformations.ji}</span>
                </>
              )}
            </div>
          </div>

          {/* 周边 12 个宫位 */}
          {chart.palaces.map(palace => {
            const pos = gridPositions[palace.index];
            const isSelected = palace.index === activePalaceIndex;
            return (
              <div
                key={palace.index}
                onClick={() => setActivePalaceIndex(palace.index)}
                style={{
                  gridColumnStart: pos.col,
                  gridRowStart: pos.row
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FFFDF9] border-[#8C6D23] ring-2 ring-[#8C6D23]/30 shadow-md'
                    : palace.isLifePalace
                    ? 'bg-[#FFFDF9] border-[#111111]/30 shadow-xs'
                    : 'bg-[#FFFDF9]/90 border-[#111111]/8 hover:border-[#111111]/25'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-serif font-black ${
                      palace.isLifePalace ? 'text-[#8C6D23]' : 'text-[#111111]'
                    }`}>
                      {isEn ? palace.nameEn : palace.name}
                    </span>
                    <span className="text-[10px] font-serif text-[#736B5E]">
                      {palace.stem}{palace.branch}
                    </span>
                  </div>

                  {/* 主星群 */}
                  <div className="space-y-0.5 my-1 min-h-[38px]">
                    {palace.majorStars.map((st, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between text-xs font-serif">
                        <span className="font-bold text-[#111111]">
                          {isEn ? (st.nameEn || st.name) : st.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-[#736B5E]">
                            {isEn ? (st.brightnessEn || st.brightness) : st.brightness}
                          </span>
                          {st.transformation && (
                            <span className="px-1 rounded-sm text-[9px] font-bold bg-[#8C6D23] text-[#FFFDF9]">
                              {isEn ? (st.transformationEn || st.transformation) : st.transformation}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {palace.majorStars.length === 0 && (
                      <span className="text-[10px] text-[#736B5E]/60 italic font-serif">
                        {isEn ? 'Opposite Star' : '对宫借星'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-1.5 border-t border-[#111111]/6 flex justify-between items-center text-[9px] text-[#736B5E] font-serif">
                  <span>{isEn ? `Age ${palace.decadalRange}` : `${palace.decadalRange} 岁`}</span>
                  <span>
                    {isEn
                      ? (palace.isLifePalace ? 'Life' : palace.isBodyPalace ? 'Body' : '')
                      : (palace.isLifePalace ? '本命' : palace.isBodyPalace ? '身宫' : '')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 移动端 12 宫纵向卡片列表 */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {chart.palaces.map(palace => (
            <div
              key={palace.index}
              onClick={() => setActivePalaceIndex(palace.index)}
              className={`p-3 rounded-xl border cursor-pointer ${
                palace.index === activePalaceIndex
                  ? 'bg-[#FFFDF9] border-[#8C6D23] ring-1 ring-[#8C6D23]'
                  : 'bg-[#FFFDF9] border-[#111111]/8'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-serif font-bold">
                <span>{isEn ? palace.nameEn : palace.name}</span>
                <span className="text-[10px] text-[#736B5E]">{palace.stem}{palace.branch}</span>
              </div>
              <div className="my-1 text-xs font-serif font-semibold text-[#8C6D23]">
                {palace.majorStars.map(s => (isEn ? s.nameEn : s.name)).join(' ') || (isEn ? 'Opposite Star' : '借星')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 选中宫位深层推演报告 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs mb-8">
        <div className="flex items-center justify-between mb-4 border-b border-[#111111]/6 pb-3">
          <div>
            <span className="text-[11px] font-serif text-[#736B5E]">
              {isEn ? 'Palace Deep Analysis' : '当前宫位解析'}
            </span>
            <h3 className="font-serif font-black text-xl text-[#111111] mt-0.5">
              {isEn
                ? `【${selectedPalace.nameEn}】 · Branch ${selectedPalace.stem}${selectedPalace.branch}`
                : `【${selectedPalace.name}】 · ${selectedPalace.stem}${selectedPalace.branch}宫`}
            </h3>
          </div>
          <span className="text-xs font-serif text-[#8C6D23]">
            {isEn ? `Decadal Range: Age ${selectedPalace.decadalRange}` : `大限运势：${selectedPalace.decadalRange} 岁`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="p-3.5 rounded-xl bg-[#FAF6ED] border border-[#111111]/5">
            <span className="text-[11px] font-serif text-[#736B5E] block mb-1">
              {isEn ? 'Major Stars' : '主星坐镇'}
            </span>
            <span className="font-serif font-bold text-sm text-[#111111]">
              {isEn
                ? (selectedPalace.majorStars.map(s => `${s.nameEn || s.name} (${s.brightnessEn || 'Flourishing'})`).join(', ') || 'Opposite Celestial Energy')
                : (selectedPalace.majorStars.map(s => `${s.name}(${s.brightness || '旺'})`).join('、') || '对宫天马借气')}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF6ED] border border-[#111111]/5">
            <span className="text-[11px] font-serif text-[#736B5E] block mb-1">
              {isEn ? 'Four Transformations' : '四化引动'}
            </span>
            <span className="font-serif font-bold text-sm text-[#8C6D23]">
              {isEn
                ? (selectedPalace.transformationsEn.join(', ') || 'None in this palace')
                : (selectedPalace.transformations.join('、') || '无本宫生年四化')}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF6ED] border border-[#111111]/5">
            <span className="text-[11px] font-serif text-[#736B5E] block mb-1">
              {isEn ? 'Minor Lucky Stars' : '辅耀辅弼'}
            </span>
            <span className="font-serif font-bold text-sm text-[#524B40]">
              {isEn
                ? selectedPalace.minorStars.map(m => m.nameEn || m.name).join(', ')
                : selectedPalace.minorStars.map(m => m.name).join('、')}
            </span>
          </div>
        </div>

        <p className="text-xs font-serif text-[#524B40] leading-relaxed">
          {isEn
            ? (selectedPalace.name === '命宫'
                ? chart.overallProfileEn.personality
                : selectedPalace.name === '官禄宫'
                ? chart.overallProfileEn.career
                : selectedPalace.name === '财帛宫'
                ? chart.overallProfileEn.wealth
                : selectedPalace.name === '夫妻宫'
                ? chart.overallProfileEn.marriage
                : `${selectedPalace.nameEn} holds harmonious celestial alignment. The ruling stars offer steady support and disciplined guidance.`)
            : (selectedPalace.name === '命宫'
                ? chart.overallProfileZh.personality
                : selectedPalace.name === '官禄宫'
                ? chart.overallProfileZh.career
                : selectedPalace.name === '财帛宫'
                ? chart.overallProfileZh.wealth
                : selectedPalace.name === '夫妻宫'
                ? chart.overallProfileZh.marriage
                : `${selectedPalace.name}气象和泰，主星拱照，遇事有规有矩，循道而行即为上吉。`)}
        </p>

        <div className="pt-4 mt-5 border-t border-[#111111]/6 flex justify-end">
          <Link
            href={`/${lang}/fatemaster/ziwei-marriage`}
            className="flex items-center gap-1.5 text-xs font-serif text-[#111111] hover:text-[#8C6D23] transition-colors"
          >
            <span>{isEn ? 'Compare two charts? Open Ziwei Marriage Synastry' : '想看两人紫微命盘合婚？进入【紫微合婚专厅】'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}