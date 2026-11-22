'use client';

import React, { useState } from 'react';
import { calculateZiwei, ZiweiChartResult, ZiweiPalace, STAR_NAMES_EN } from '@/lib/metaphysics/ziwei';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const BRANCH_EN_MAP: Record<string, string> = {
  '子': 'Zi (Rat)',
  '丑': 'Chou (Ox)',
  '寅': 'Yin (Tiger)',
  '卯': 'Mao (Rabbit)',
  '辰': 'Chen (Dragon)',
  '巳': 'Si (Snake)',
  '午': 'Wu (Horse)',
  '未': 'Wei (Goat)',
  '申': 'Shen (Monkey)',
  '酉': 'You (Rooster)',
  '戌': 'Xu (Dog)',
  '亥': 'Hai (Pig)'
};

export function ZiweiChartWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const [year, setYear] = useState(1996);
  const [month, setMonth] = useState(8);
  const [day, setDay] = useState(18);
  const [hour, setHour] = useState(12);

  const [chart, setChart] = useState<ZiweiChartResult>(() =>
    calculateZiwei(1996, 8, 18, 12)
  );

  const [activePalaceIndex, setActivePalaceIndex] = useState<number>(
    () => chart.palaces.find(p => p.isLifePalace)?.index ?? 0
  );

  const [mobileView, setMobileView] = useState<'cards' | 'grid'>('cards');

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateZiwei(year, month, day, hour);
    setChart(res);
    const lifeIdx = res.palaces.find(p => p.isLifePalace)?.index ?? 0;
    setActivePalaceIndex(lifeIdx);
  };

  const selectedPalace: ZiweiPalace =
    chart.palaces.find(p => p.index === activePalaceIndex) || chart.palaces[0];

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

  const getTransformationBadge = (transformation?: string) => {
    if (!transformation) return '';
    const t = transformation.replace('化', '');
    if (t === '禄' || t === 'Lu') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (t === '权' || t === 'Quan') {
      return 'bg-red-50 text-red-700 border-red-200';
    }
    if (t === '科' || t === 'Ke') {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (t === '忌' || t === 'Ji') {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    return 'bg-zinc-100 text-zinc-800 border-zinc-200';
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* 生辰调参框 */}
      <div className="w-full rounded-sm bg-white border border-[#E4E4E7] p-5 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-serif text-[16px] sm:text-[17px] font-normal text-[#171717]">
            {isEn ? 'Birth Timing' : '生辰历法'}
          </h2>
          <span className="text-[12px] text-[#52525B]">
            {isEn
              ? `Solar Date: ${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} · ${chart.bureau.nameEn}`
              : `农历：${chart.lunarDate.yearGanZhi}年 ${chart.lunarDate.monthZh}${chart.lunarDate.dayZh} ${chart.lunarDate.hourBranch} · 【${chart.bureau.nameZh}】`}
          </span>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Year' : '公历年'}
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
              {isEn ? 'Hour (0-23)' : '时辰（0-23点）'}
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
          <div className="flex items-end col-span-2 sm:col-span-1">
            <button
              type="submit"
              className="w-full min-h-[40px] rounded-sm bg-[#171717] hover:bg-[#333333] text-white text-[13px] font-medium tracking-wide transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            >
              {isEn ? 'Recalculate' : '开始排盘'}
            </button>
          </div>
        </form>
      </div>

      {/* 紫微斗数十二宫盘面 */}
      <div className="w-full mb-8">
        {/* 桌面端/平板端 4x4 方形大盘面 (带横向局部包含，防止小视口溢出) */}
        <div className="hidden md:block overflow-x-auto pb-2">
          <div className="min-w-[680px] grid grid-cols-4 grid-rows-4 gap-2.5 p-3 rounded-sm bg-[#FAFAFA] border border-[#E4E4E7]">
            {/* 中间 2x2 天心盘面 */}
            <div className="col-start-2 col-span-2 row-start-2 row-span-2 rounded-sm bg-white border border-[#E4E4E7] p-5 flex flex-col justify-between text-center">
              <div>
                <span className="text-[11px] font-medium tracking-[0.2em] text-[#52525B] uppercase block mb-1">
                  Z I W E I · D O U S H U
                </span>
                <h3 className="font-serif text-[18px] sm:text-[20px] font-normal text-[#171717]">
                  {isEn ? 'Twelve Palaces Chart' : '天盘十二宫全息图'}
                </h3>
                <p className="text-[12px] text-[#52525B] mt-1">
                  {isEn
                    ? `${chart.bureau.nameEn} · Life Palace [${BRANCH_EN_MAP[chart.lifePalaceBranch] || chart.lifePalaceBranch}] · Body Palace [${BRANCH_EN_MAP[chart.bodyPalaceBranch] || chart.bodyPalaceBranch}]`
                    : `五行局：${chart.bureau.nameZh} · 命宫坐【${chart.lifePalaceBranch}】 · 身宫坐【${chart.bodyPalaceBranch}】`}
                </p>
              </div>

              <div className="p-3 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[12px] text-left">
                <span className="font-medium text-[#171717] block mb-0.5">
                  {isEn ? `Life Star: ${chart.dayMasterStarEn}` : `命宫主星：${chart.dayMasterStar}`}
                </span>
                <p className="text-[11px] text-[#52525B] leading-relaxed line-clamp-3">
                  {isEn ? chart.overallProfileEn.personality : chart.overallProfileZh.personality}
                </p>
              </div>

              <div className="flex justify-around items-center pt-2 border-t border-[#E4E4E7] text-[11px] text-[#52525B]">
                {isEn ? (
                  <>
                    <span className="flex items-center gap-1">
                      <span className="px-1 py-0.5 rounded-xs text-[9px] font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">Lu</span>
                      <span>{chart.fourTransformationsEn.lu}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="px-1 py-0.5 rounded-xs text-[9px] font-medium border bg-red-50 text-red-700 border-red-200">Quan</span>
                      <span>{chart.fourTransformationsEn.quan}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="px-1 py-0.5 rounded-xs text-[9px] font-medium border bg-blue-50 text-blue-700 border-blue-200">Ke</span>
                      <span>{chart.fourTransformationsEn.ke}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="px-1 py-0.5 rounded-xs text-[9px] font-medium border bg-amber-50 text-amber-800 border-amber-200">Ji</span>
                      <span>{chart.fourTransformationsEn.ji}</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1">
                      <span className="px-1 py-0.5 rounded-xs text-[9px] font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">禄</span>
                      <span>{chart.fourTransformations.lu}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="px-1 py-0.5 rounded-xs text-[9px] font-medium border bg-red-50 text-red-700 border-red-200">权</span>
                      <span>{chart.fourTransformations.quan}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="px-1 py-0.5 rounded-xs text-[9px] font-medium border bg-blue-50 text-blue-700 border-blue-200">科</span>
                      <span>{chart.fourTransformations.ke}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="px-1 py-0.5 rounded-xs text-[9px] font-medium border bg-amber-50 text-amber-800 border-amber-200">忌</span>
                      <span>{chart.fourTransformations.ji}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* 周边 12 个宫位 */}
            {chart.palaces.map(palace => {
              const pos = gridPositions[palace.index];
              const isSelected = palace.index === activePalaceIndex;
              return (
                <button
                  key={palace.index}
                  type="button"
                  onClick={() => setActivePalaceIndex(palace.index)}
                  style={{
                    gridColumnStart: pos.col,
                    gridRowStart: pos.row
                  }}
                  className={`p-3 rounded-sm border text-left cursor-pointer transition-colors flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                    isSelected
                      ? 'bg-white border-[#171717] ring-1 ring-[#171717]'
                      : palace.isLifePalace
                      ? 'bg-white border-[#171717]/40 hover:border-[#171717]'
                      : 'bg-white border-[#E4E4E7] hover:border-[#A1A1AA]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[12px] font-serif font-semibold text-[#171717]">
                          {isEn ? palace.nameEn : palace.name}
                        </span>
                        {palace.isLifePalace && (
                          <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#171717] text-white font-medium">
                            {isEn ? 'Life' : '命'}
                          </span>
                        )}
                        {palace.isBodyPalace && !palace.isLifePalace && (
                          <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#F5F5F6] text-[#52525B] border border-[#E4E4E7] font-medium">
                            {isEn ? 'Body' : '身'}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#52525B] font-mono">
                        {palace.stem}{palace.branch}
                      </span>
                    </div>

                    {/* 主星群 */}
                    <div className="space-y-0.5 my-1 min-h-[38px]">
                      {palace.majorStars.map((st, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between text-[11px]">
                          <span className="font-medium text-[#171717]">
                            {isEn ? (st.nameEn || st.name) : st.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-[#71717A]">
                              {isEn ? (st.brightnessEn || st.brightness) : st.brightness}
                            </span>
                            {st.transformation && (
                              <span
                                className={`px-1 py-0.2 rounded-xs text-[9px] font-medium border ${getTransformationBadge(
                                  st.transformation
                                )}`}
                              >
                                {isEn ? (st.transformationEn || st.transformation) : st.transformation}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {palace.majorStars.length === 0 && (
                        <span className="text-[10px] text-[#A1A1AA] italic font-serif">
                          {isEn ? 'Opposite Star' : '对宫借星'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-[#E4E4E7] flex justify-between items-center text-[10px] text-[#52525B]">
                    <span>{isEn ? `Age ${palace.decadalRange}` : `${palace.decadalRange} 岁`}</span>
                    <span className="text-[9px] text-[#71717A]">
                      {isEn
                        ? (palace.isLifePalace ? 'Life' : palace.isBodyPalace ? 'Body' : '')
                        : (palace.isLifePalace ? '本命' : palace.isBodyPalace ? '身宫' : '')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 移动端十二宫视图与控制 */}
        <div className="md:hidden space-y-4">
          {/* 移动端天心简况卡片 */}
          <div className="p-4 rounded-sm bg-white border border-[#E4E4E7] text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium tracking-[0.15em] text-[#52525B] uppercase">
                {isEn ? 'Center Hologram' : '天盘核心'}
              </span>
              <span className="text-[11px] text-[#52525B]">
                {isEn ? chart.bureau.nameEn : chart.bureau.nameZh}
              </span>
            </div>
            <div className="text-[13px] font-medium text-[#171717] mb-1">
              {isEn
                ? `Life Palace [${BRANCH_EN_MAP[chart.lifePalaceBranch] || chart.lifePalaceBranch}] · Body Palace [${BRANCH_EN_MAP[chart.bodyPalaceBranch] || chart.bodyPalaceBranch}] · Star: ${chart.dayMasterStarEn}`
                : `命宫【${chart.lifePalaceBranch}】 · 身宫【${chart.bodyPalaceBranch}】 · 主星：${chart.dayMasterStar}`}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E4E4E7] text-[10px]">
              <span className="flex items-center gap-1">
                <span className="px-1 py-0.2 rounded-xs border bg-emerald-50 text-emerald-700 border-emerald-200">
                  {isEn ? 'Lu' : '禄'}
                </span>
                <span>{isEn ? (STAR_NAMES_EN[chart.fourTransformations.lu] || chart.fourTransformations.lu) : chart.fourTransformations.lu}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="px-1 py-0.2 rounded-xs border bg-red-50 text-red-700 border-red-200">
                  {isEn ? 'Quan' : '权'}
                </span>
                <span>{isEn ? (STAR_NAMES_EN[chart.fourTransformations.quan] || chart.fourTransformations.quan) : chart.fourTransformations.quan}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="px-1 py-0.2 rounded-xs border bg-blue-50 text-blue-700 border-blue-200">
                  {isEn ? 'Ke' : '科'}
                </span>
                <span>{isEn ? (STAR_NAMES_EN[chart.fourTransformations.ke] || chart.fourTransformations.ke) : chart.fourTransformations.ke}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="px-1 py-0.2 rounded-xs border bg-amber-50 text-amber-800 border-amber-200">
                  {isEn ? 'Ji' : '忌'}
                </span>
                <span>{isEn ? (STAR_NAMES_EN[chart.fourTransformations.ji] || chart.fourTransformations.ji) : chart.fourTransformations.ji}</span>
              </span>
            </div>
          </div>

          {/* 移动端视图切换控件 */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#52525B]">
              {isEn ? 'Palaces Navigation' : '十二宫位切换'}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setMobileView('cards')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-sm border transition-colors cursor-pointer ${
                  mobileView === 'cards'
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-[#F5F5F6] text-[#52525B] border-[#E4E4E7]'
                }`}
              >
                {isEn ? 'Cards' : '卡片列表'}
              </button>
              <button
                type="button"
                onClick={() => setMobileView('grid')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-sm border transition-colors cursor-pointer ${
                  mobileView === 'grid'
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-[#F5F5F6] text-[#52525B] border-[#E4E4E7]'
                }`}
              >
                {isEn ? '4x4 Grid' : '全盘方阵'}
              </button>
            </div>
          </div>

          {mobileView === 'cards' ? (
            /* 移动端卡片列表 */
            <div className="grid grid-cols-2 gap-2">
              {chart.palaces.map(palace => {
                const isSelected = palace.index === activePalaceIndex;
                return (
                  <button
                    key={palace.index}
                    type="button"
                    onClick={() => setActivePalaceIndex(palace.index)}
                    className={`p-3 rounded-sm border text-left cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-white border-[#171717] ring-1 ring-[#171717]'
                        : palace.isLifePalace
                        ? 'bg-white border-[#171717]/40'
                        : 'bg-white border-[#E4E4E7]'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[12px] font-medium mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[#171717] font-serif">
                          {isEn ? palace.nameEn : palace.name}
                        </span>
                        {palace.isLifePalace && (
                          <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#171717] text-white font-medium">
                            {isEn ? 'Life' : '命'}
                          </span>
                        )}
                        {palace.isBodyPalace && !palace.isLifePalace && (
                          <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#F5F5F6] text-[#52525B] border border-[#E4E4E7] font-medium">
                            {isEn ? 'Body' : '身'}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#52525B] font-mono">
                        {palace.stem}{palace.branch}
                      </span>
                    </div>

                    <div className="my-1 text-[11px] min-h-[32px] space-y-0.5">
                      {palace.majorStars.length > 0 ? (
                        palace.majorStars.map((s, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-[#171717] font-medium">
                              {isEn ? (s.nameEn || s.name) : s.name}
                            </span>
                            {s.transformation && (
                              <span
                                className={`px-1 rounded-xs text-[9px] border ${getTransformationBadge(
                                  s.transformation
                                )}`}
                              >
                                {isEn ? (s.transformationEn || s.transformation) : s.transformation}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <span className="text-[10px] text-[#A1A1AA] italic">
                          {isEn ? 'Opposite Star' : '对宫借星'}
                        </span>
                      )}
                    </div>

                    <div className="pt-1 border-t border-[#E4E4E7] flex justify-between items-center text-[10px] text-[#52525B]">
                      <span>{isEn ? `Age ${palace.decadalRange}` : `${palace.decadalRange} 岁`}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* 移动端横向滑动 4x4 方阵包含器 */
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[620px] grid grid-cols-4 grid-rows-4 gap-2 p-2.5 rounded-sm bg-[#FAFAFA] border border-[#E4E4E7]">
                {/* 移动端 4x4 盘面中的中心格 */}
                <div className="col-start-2 col-span-2 row-start-2 row-span-2 rounded-sm bg-white border border-[#E4E4E7] p-3 flex flex-col justify-between text-center">
                  <div>
                    <span className="text-[10px] font-medium text-[#52525B] uppercase block">
                      Z I W E I
                    </span>
                    <h3 className="font-serif text-[15px] font-normal text-[#171717]">
                      {isEn ? 'Twelve Palaces' : '天盘十二宫'}
                    </h3>
                    <p className="text-[11px] text-[#52525B] mt-0.5">
                      {isEn
                        ? `${chart.bureau.nameEn} · Life [${BRANCH_EN_MAP[chart.lifePalaceBranch] || chart.lifePalaceBranch}] Body [${BRANCH_EN_MAP[chart.bodyPalaceBranch] || chart.bodyPalaceBranch}]`
                        : `${chart.bureau.nameZh} · 命【${chart.lifePalaceBranch}】 身【${chart.bodyPalaceBranch}】`}
                    </p>
                  </div>
                  <div className="p-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[11px] text-left">
                    <span className="font-medium text-[#171717] block">
                      {isEn ? `Star: ${chart.dayMasterStarEn}` : `主星：${chart.dayMasterStar}`}
                    </span>
                  </div>
                </div>

                {chart.palaces.map(palace => {
                  const pos = gridPositions[palace.index];
                  const isSelected = palace.index === activePalaceIndex;
                  return (
                    <button
                      key={palace.index}
                      type="button"
                      onClick={() => setActivePalaceIndex(palace.index)}
                      style={{
                        gridColumnStart: pos.col,
                        gridRowStart: pos.row
                      }}
                      className={`p-2 rounded-sm border text-left cursor-pointer transition-colors flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-[#171717] ring-1 ring-[#171717]'
                          : palace.isLifePalace
                          ? 'bg-white border-[#171717]/40'
                          : 'bg-white border-[#E4E4E7]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-serif font-semibold text-[#171717]">
                            {isEn ? palace.nameEn : palace.name}
                          </span>
                          <span className="text-[9px] text-[#52525B] font-mono">
                            {palace.stem}{palace.branch}
                          </span>
                        </div>
                        <div className="space-y-0.5 my-1 min-h-[30px] text-[10px]">
                          {palace.majorStars.map((st, sIdx) => (
                            <div key={sIdx} className="flex items-center justify-between">
                              <span className="font-medium text-[#171717]">
                                {isEn ? (st.nameEn || st.name) : st.name}
                              </span>
                              {st.transformation && (
                                <span
                                  className={`px-1 rounded-xs text-[8px] border ${getTransformationBadge(
                                    st.transformation
                                  )}`}
                                >
                                  {isEn ? (st.transformationEn || st.transformation) : st.transformation}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-1 border-t border-[#E4E4E7] text-[9px] text-[#52525B]">
                        {palace.decadalRange} 岁
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 选中宫位深层推演报告 */}
      <div className="w-full rounded-sm bg-white border border-[#E4E4E7] p-5 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-4 border-b border-[#E4E4E7] pb-3 flex-wrap gap-2">
          <div>
            <span className="text-[11px] font-medium tracking-[0.15em] text-[#52525B] uppercase block">
              {isEn ? 'Palace Deep Analysis' : '当前宫位解析'}
            </span>
            <h3 className="font-serif text-[18px] sm:text-[20px] font-normal text-[#171717] mt-0.5">
              {isEn
                ? `【${selectedPalace.nameEn}】 · ${BRANCH_EN_MAP[selectedPalace.branch] || selectedPalace.branch} Palace`
                : `【${selectedPalace.name}】 · ${selectedPalace.stem}${selectedPalace.branch}宫`}
            </h3>
          </div>
          <span className="text-[12px] font-medium text-[#171717] bg-[#F5F5F6] px-2.5 py-1 rounded-sm border border-[#E4E4E7]">
            {isEn ? `Decadal Range: Age ${selectedPalace.decadalRange}` : `大限运势：${selectedPalace.decadalRange} 岁`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="p-3.5 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7]">
            <span className="text-[11px] font-medium text-[#52525B] block mb-1">
              {isEn ? 'Major Stars' : '主星坐镇'}
            </span>
            <span className="font-serif font-medium text-[13px] sm:text-[14px] text-[#171717]">
              {isEn
                ? (selectedPalace.majorStars.map(s => `${s.nameEn || s.name} (${s.brightnessEn || 'Flourishing'})`).join(', ') || 'Opposite Celestial Energy')
                : (selectedPalace.majorStars.map(s => `${s.name}(${s.brightness || '旺'})`).join('、') || '对宫天马借气')}
            </span>
          </div>

          <div className="p-3.5 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7]">
            <span className="text-[11px] font-medium text-[#52525B] block mb-1">
              {isEn ? 'Four Transformations' : '四化引动'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              {selectedPalace.transformations.length > 0 ? (
                selectedPalace.transformations.map((t, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded-xs text-[11px] font-medium border ${getTransformationBadge(
                      t
                    )}`}
                  >
                    {isEn ? (selectedPalace.transformationsEn[idx] || t) : t}
                  </span>
                ))
              ) : (
                <span className="text-[12px] text-[#71717A]">
                  {isEn ? 'None in this palace' : '无本宫生年四化'}
                </span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7]">
            <span className="text-[11px] font-medium text-[#52525B] block mb-1">
              {isEn ? 'Minor Lucky Stars' : '辅耀吉煞'}
            </span>
            <span className="font-serif font-medium text-[13px] sm:text-[14px] text-[#171717]">
              {isEn
                ? (selectedPalace.minorStars.map(m => m.nameEn || m.name).join(', ') || 'None')
                : (selectedPalace.minorStars.map(m => m.name).join('、') || '本宫无辅星')}
            </span>
          </div>
        </div>

        <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#52525B] bg-[#FAFAFA] p-4 rounded-sm border border-[#E4E4E7]">
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

        <div className="pt-4 mt-5 border-t border-[#E4E4E7] flex justify-end">
          <Link
            href={`/${lang}/east/ziwei-marriage`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#171717] hover:text-[#52525B] transition-colors"
          >
            <span>{isEn ? 'Compare two charts? Open Ziwei Marriage Synastry' : '想看两人紫微命盘合婚？进入【紫微合婚专厅】'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
