'use client';

import React, { useState } from 'react';
import { calculateZiwei, ZiweiChartResult, ZiweiPalace, STAR_NAMES_EN } from '@/lib/metaphysics/ziwei';
import { ELEMENT_COLORS, STEMS_MAP, BRANCHES_MAP } from '@/lib/metaphysics/bazi';
import { DateTimePickerPopover } from './DateTimePickerPopover';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EastAiReadingPanel } from './EastAiReadingPanel';

export function ZiweiChartWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(11);
  const [day, setDay] = useState(27);
  const [hour, setHour] = useState(23);
  const [minute, setMinute] = useState(8);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const [chart, setChart] = useState<ZiweiChartResult>(() =>
    calculateZiwei(2026, 11, 27, 23, 8, { gender: 'male' })
  );

  const [activePalaceIndex, setActivePalaceIndex] = useState<number>(
    () => chart.palaces.find((p) => p.isLifePalace)?.index ?? 11
  );
  const [horoscopeTab, setHoroscopeTab] = useState<'natal' | 'decadal' | 'yearly' | 'monthly' | 'daily' | 'hourly'>('natal');
  const [selectedDecadalIdx, setSelectedDecadalIdx] = useState<number>(
    () => chart.palaces.find((p) => p.isLifePalace)?.index ?? 11
  );

  const runCalculate = (y: number, m: number, d: number, h: number, min: number, g: 'male' | 'female') => {
    const res = calculateZiwei(y, m, d, h, min, { gender: g });
    setChart(res);
    const lifeIdx = res.palaces.find((p) => p.isLifePalace)?.index ?? 11;
    setActivePalaceIndex(lifeIdx);
    setSelectedDecadalIdx(lifeIdx);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    runCalculate(year, month, day, hour, minute, gender);
  };

  const selectedPalace: ZiweiPalace =
    chart.palaces.find((p) => p.index === activePalaceIndex) || chart.palaces[0];

  // 三方四正索引：本宫、对宫(+6)、三合(+4, +8)
  const triadIndices = new Set([
    activePalaceIndex,
    (activePalaceIndex + 6) % 12,
    (activePalaceIndex + 4) % 12,
    (activePalaceIndex + 8) % 12,
  ]);

  // 12 宫在 4x4 盘面中的经典分布
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
    4: { col: 1, row: 2 }, // 辰
  };

  // 中宫内框边缘锚点（百分比 0..100，用于绘制三方四正飞线）
  const innerAnchors: Record<number, [number, number]> = {
    5: [0, 0],     // 巳
    6: [25, 0],    // 午
    7: [75, 0],    // 未
    8: [100, 0],   // 申
    9: [100, 25],  // 酉
    10: [100, 75], // 戌
    11: [100, 100],// 亥
    0: [75, 100],  // 子
    1: [25, 100],  // 丑
    2: [0, 100],   // 寅
    3: [0, 75],    // 卯
    4: [0, 25],    // 辰
  };

  const BRANCHES_12 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const birthYearZhiIdx = Math.max(0, BRANCHES_12.indexOf(chart.lunarDate.yearGanZhi[1] ?? '子'));
  const getYearlyAges = (branchIdx: number) => {
    const first = ((branchIdx - birthYearZhiIdx + 12) % 12) + 1;
    return [first, first + 12, first + 24, first + 36, first + 48].join(',');
  };

  const activeLayer = horoscopeTab !== 'natal' ? chart.horoscope?.[horoscopeTab] : undefined;
  const activeMutagenMap: Record<string, string> = {};
  if (activeLayer?.mutagen) {
    const labels = ['禄', '权', '科', '忌'];
    activeLayer.mutagen.forEach((starName, i) => {
      if (starName && labels[i]) activeMutagenMap[starName] = labels[i];
    });
  }

  const getSiHuaBadgeClass = (t?: string) => {
    if (!t) return '';
    if (t === '禄') return 'bg-emerald-600 text-white';
    if (t === '权') return 'bg-red-600 text-white';
    if (t === '科') return 'bg-blue-600 text-white';
    if (t === '忌') return 'bg-amber-600 text-white';
    return 'bg-zinc-700 text-white';
  };

  // 按大限起始岁数排序的 12 步大限
  const decadalList = [...chart.palaces].sort((a, b) => (a.decadalStart ?? 0) - (b.decadalStart ?? 0));

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* 生辰调参框（现代农历日历 + 性别 + 键盘输入） */}
      <div className="w-full rounded-xl bg-white border border-zinc-200 p-4 sm:p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="font-serif text-base font-medium text-zinc-900">
            {isEn ? 'Birth Timing & Gender' : '生辰历法与性别'}
          </h2>
          <span className="text-xs text-zinc-600">
            {chart.lunarDate.fullText} · {chart.genderLabel} · 【{chart.bureau.nameZh}】
          </span>
        </div>

        <form onSubmit={handleCalculate} className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <DateTimePickerPopover
              year={year}
              month={month}
              day={day}
              hour={hour}
              isEn={isEn}
              onChange={(y, m, d, h) => {
                setYear(y);
                setMonth(m);
                setDay(d);
                setHour(h);
                setMinute(0);
                runCalculate(y, m, d, h, 0, gender);
              }}
            />
            <div className="flex rounded-sm border border-zinc-200 bg-zinc-50 p-0.5 text-xs">
              {([
                ['male', isEn ? 'Male' : '男'],
                ['female', isEn ? 'Female' : '女'],
              ] as const).map(([g, label]) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGender(g);
                    runCalculate(year, month, day, hour, minute, g);
                  }}
                  className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                    gender === g ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-sm bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium cursor-pointer"
          >
            {isEn ? 'Calculate Chart' : '排紫微盘'}
          </button>
        </form>
      </div>

      {/* 4×4 紫微命盘（对齐易瑞笔记 / iztro 结构，保留 yitarot 黑白框 + 语义色） */}
      <div className="w-full overflow-x-auto mb-6">
        <div className="min-w-[680px] grid grid-cols-4 grid-rows-4 gap-1 bg-zinc-200 p-1 rounded-xl border border-zinc-200">
          {chart.palaces.map((palace) => {
            const pos = gridPositions[palace.index];
            const isSelected = palace.index === activePalaceIndex;
            const isTriad = triadIndices.has(palace.index);
            const agesPreview = (palace.ages ?? []).slice(0, 5).join(',');

            return (
              <button
                key={palace.index}
                type="button"
                onClick={() => setActivePalaceIndex(palace.index)}
                style={{ gridColumn: pos.col, gridRow: pos.row }}
                className={`min-h-[156px] p-2 text-left flex flex-col justify-between transition-colors cursor-pointer bg-white ${
                  isSelected
                    ? 'ring-2 ring-inset ring-zinc-900 bg-zinc-50'
                    : isTriad
                      ? 'bg-zinc-50/70 hover:bg-zinc-100/70'
                      : 'hover:bg-zinc-50'
                }`}
              >
                {/* 顶部：星曜竖排/紧凑流（主星 + 辅星 + 杂曜）+ 来因/身宫标 */}
                <div className="flex items-start justify-between gap-1">
                  <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 leading-tight">
                    {palace.majorStars.map((s) => (
                      <div key={s.name} className="inline-flex items-center gap-0.5">
                        <span className="text-[12px] font-serif font-semibold text-red-700">{s.name}</span>
                        {s.brightness && <span className="text-[9px] text-zinc-400">{s.brightness}</span>}
                        {s.transformation && (
                          <span className={`text-[9px] px-0.5 rounded-xs leading-tight ${getSiHuaBadgeClass(s.transformation)}`}>
                            {s.transformation}
                          </span>
                        )}
                      </div>
                    ))}
                    {palace.minorStars.map((s) => (
                      <div key={s.name} className="inline-flex items-center gap-0.5">
                        <span className="text-[11px] font-medium text-blue-700">{s.name}</span>
                        {s.brightness && <span className="text-[9px] text-zinc-400">{s.brightness}</span>}
                        {s.transformation && (
                          <span className={`text-[9px] px-0.5 rounded-xs leading-tight ${getSiHuaBadgeClass(s.transformation)}`}>
                            {s.transformation}
                          </span>
                        )}
                      </div>
                    ))}
                    {(palace.adjectiveStars ?? []).map((s) => (
                      <span key={s.name} className="text-[10px] text-zinc-500">
                        {s.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    {palace.isBodyPalace && (
                      <span className="text-[9px] px-1 rounded-xs border border-red-400 text-red-600 leading-tight">身宫</span>
                    )}
                    {palace.isOriginalPalace && (
                      <span className="text-[9px] px-1 rounded-xs border border-red-400 text-red-600 leading-tight">来因</span>
                    )}
                  </div>
                </div>

                {/* 中部：流年 + 小限岁数 */}
                <div className="my-1 space-y-0.5 text-[10px] text-zinc-400 tabular-nums">
                  <div className="truncate">流年: {getYearlyAges(palace.index)}</div>
                  <div className="truncate">小限: {agesPreview}</div>
                </div>

                {/* 底部：十二神 + 大限 + 宫名 + 干支 */}
                <div className="flex items-end justify-between gap-1 pt-1 border-t border-zinc-100">
                  <div className="text-[10px] leading-tight text-zinc-500">
                    <div className="text-teal-700">{palace.boshi12}</div>
                    <div>{palace.jiangqian12}</div>
                    <div>{palace.suiqian12}</div>
                  </div>
                  <div className="text-center leading-tight">
                    <div className="text-[10px] text-zinc-500 tabular-nums">
                      {palace.decadalStart}~{palace.decadalEnd}
                    </div>
                    <div className="text-[11px] font-semibold text-zinc-900">
                      命之<span className="text-red-700">{palace.name.replace('宫', '')}</span>
                    </div>
                  </div>
                  <div className="text-right leading-tight">
                    <div className="text-[9px] text-zinc-400">{palace.changsheng12}</div>
                    <div className="font-serif text-sm font-semibold text-zinc-900">
                      {palace.stem}
                      {palace.branch}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {/* 中宫区域（占据中间 2×2，含三方四正虚线飞线） */}
          <div className="relative col-start-2 col-end-4 row-start-2 row-end-4 bg-white p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden">
            {/* 三方四正飞线 SVG */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
            >
              {[
                (activePalaceIndex + 6) % 12,
                (activePalaceIndex + 4) % 12,
                (activePalaceIndex + 8) % 12,
              ].map((targetIdx) => {
                const [x1, y1] = innerAnchors[activePalaceIndex] ?? [50, 50];
                const [x2, y2] = innerAnchors[targetIdx] ?? [50, 50];
                return (
                  <line
                    key={targetIdx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#52525B"
                    strokeWidth="0.7"
                    strokeDasharray="2.5 2"
                  />
                );
              })}
              {/* 对宫三合连线 */}
              <line
                x1={innerAnchors[(activePalaceIndex + 4) % 12]?.[0] ?? 50}
                y1={innerAnchors[(activePalaceIndex + 4) % 12]?.[1] ?? 50}
                x2={innerAnchors[(activePalaceIndex + 8) % 12]?.[0] ?? 50}
                y2={innerAnchors[(activePalaceIndex + 8) % 12]?.[1] ?? 50}
                stroke="#A1A1AA"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
            </svg>

            <div className="relative z-10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5">
                <span className="font-serif text-sm font-semibold text-zinc-900">紫微命盘</span>
                <span className="font-mono text-[11px] text-zinc-500 tabular-nums">
                  {chart.solarDate.year}-{String(chart.solarDate.month).padStart(2, '0')}-{String(chart.solarDate.day).padStart(2, '0')}{' '}
                  {String(chart.solarDate.hour).padStart(2, '0')}:{String(chart.solarDate.minute ?? 0).padStart(2, '0')}
                </span>
              </div>
              <div className="text-[11px] text-zinc-600">{chart.lunarDate.fullText}</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] pt-1">
                <div>性别：<strong className="text-zinc-900 font-medium">{chart.genderLabel}</strong></div>
                <div>五行：<strong className="text-zinc-900 font-medium">{chart.bureau.nameZh}</strong></div>
                <div>命宫：<strong className="text-zinc-900 font-medium">{chart.lifePalaceBranch}</strong></div>
                <div>命主：<strong className="text-zinc-900 font-medium">{chart.soul}</strong></div>
                <div>身宫：<strong className="text-zinc-900 font-medium">{chart.bodyPalaceBranch}</strong></div>
                <div>身主：<strong className="text-zinc-900 font-medium">{chart.body}</strong></div>
              </div>
            </div>

            {/* 中宫四柱八字 + 大运条 */}
            {chart.bazi && (
              <div className="relative z-10 space-y-1.5 border-y border-zinc-100 py-1.5 my-1">
                <div className="grid grid-cols-4 gap-1 text-center">
                  {[chart.bazi.pillars.year, chart.bazi.pillars.month, chart.bazi.pillars.day, chart.bazi.pillars.hour].map((p, i) => (
                    <div key={i}>
                      <div className="font-serif text-base font-semibold leading-tight" style={{ color: ELEMENT_COLORS[p.ganInfo.element] }}>{p.gan}</div>
                      <div className="font-serif text-base font-semibold leading-tight" style={{ color: ELEMENT_COLORS[p.zhiInfo.element] }}>{p.zhi}</div>
                    </div>
                  ))}
                </div>
                {chart.bazi.yun?.daYun && (
                  <div className="grid grid-cols-8 gap-0.5 text-center pt-1 border-t border-zinc-100/70">
                    {chart.bazi.yun.daYun.filter((d) => !d.isXiaoYun).slice(0, 8).map((dy) => (
                      <div key={dy.index} className="leading-tight">
                        <div className="text-[8px] text-zinc-400">{dy.startYear}</div>
                        <div className="text-[8px] text-zinc-400">{dy.startAge}岁</div>
                        <div className="font-serif text-[11px] font-medium" style={{ color: ELEMENT_COLORS[STEMS_MAP[dy.ganZhi[0]]?.element ?? 'Earth'] }}>{dy.ganZhi[0]}</div>
                        <div className="font-serif text-[11px] font-medium" style={{ color: ELEMENT_COLORS[BRANCHES_MAP[dy.ganZhi[1]]?.element ?? 'Earth'] }}>{dy.ganZhi[1]}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* [本] [限] [年] [月] [日] [时] 层级切换 */}
            <div className="relative z-10 space-y-1.5">
              <div className="grid grid-cols-6 gap-1 text-[11px]">
                {([
                  ['natal', '本'],
                  ['decadal', '限'],
                  ['yearly', '年'],
                  ['monthly', '月'],
                  ['daily', '日'],
                  ['hourly', '时'],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setHoroscopeTab(key)}
                    className={`rounded py-1 font-medium border cursor-pointer ${
                      horoscopeTab === key
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {horoscopeTab !== 'natal' && chart.horoscope && (
                <div className="text-[11px] text-zinc-600 text-center">
                  {chart.horoscope[horoscopeTab].name}（{chart.horoscope[horoscopeTab].heavenlyStem}
                  {chart.horoscope[horoscopeTab].earthlyBranch}）· 四化：
                  {chart.horoscope[horoscopeTab].mutagen.join(' ')}
                </div>
              )}
              <div className="text-[10px] text-zinc-400 text-center">
                已选中：{selectedPalace.name}（三方四正已高亮）
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部大限横向切换条（含起限前童限） */}
      <div className="w-full rounded-xl bg-white border border-zinc-200 p-3 mb-6 overflow-x-auto">
        <div className="flex items-stretch gap-1.5 min-w-max">
          <div className="w-8 shrink-0 flex items-center justify-center text-xs text-zinc-500 leading-tight text-center">大<br />限</div>
          <div className="min-w-14 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-center flex flex-col justify-center">
            <div className="text-[10px] text-zinc-400">起限前</div>
            <div className="font-serif text-sm font-semibold text-zinc-800 leading-tight mt-0.5">童<br />限</div>
          </div>
          {decadalList.map((p) => {
            const active = selectedDecadalIdx === p.index;
            const gEl = STEMS_MAP[p.stem]?.element ?? 'Earth';
            const zEl = BRANCHES_MAP[p.branch]?.element ?? 'Earth';
            return (
              <button
                key={p.index}
                type="button"
                onClick={() => {
                  setSelectedDecadalIdx(p.index);
                  setActivePalaceIndex(p.index);
                }}
                className={`min-w-14 rounded-md border px-2 py-1.5 text-center transition-colors cursor-pointer ${
                  active ? 'border-zinc-900 bg-zinc-100' : 'border-zinc-200 bg-white hover:border-zinc-400'
                }`}
              >
                <div className="text-[10px] text-zinc-500 tabular-nums">{p.decadalStart}/{p.decadalEnd}</div>
                <div className="font-serif text-sm font-semibold leading-tight mt-0.5" style={{ color: ELEMENT_COLORS[gEl] }}>{p.stem}</div>
                <div className="font-serif text-sm font-semibold leading-tight" style={{ color: ELEMENT_COLORS[zEl] }}>{p.branch}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 选中宫位详情 + 合婚入口 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-5 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <span className="font-serif text-base font-semibold text-zinc-900">
              {selectedPalace.name}（{selectedPalace.stem}{selectedPalace.branch}）
            </span>
            <span className="text-zinc-500">大限 {selectedPalace.decadalRange} 岁</span>
          </div>
          <p className="text-zinc-700 leading-relaxed">{selectedPalace.summaryZh}</p>
          <div className="text-zinc-500">
            主星：{selectedPalace.majorStars.map((s) => `${s.name}(${s.brightness || '平'}${s.transformation || ''})`).join('、') || '空宫'}
          </div>
          <div className="text-zinc-500">
            辅煞：{selectedPalace.minorStars.map((s) => `${s.name}${s.brightness ? `(${s.brightness})` : ''}`).join('、') || '无'}
          </div>
        </div>

        <div className="rounded-xl bg-white border border-zinc-200 p-4 sm:p-5 flex flex-col justify-between gap-3">
          <div>
            <h3 className="font-serif text-base font-semibold text-zinc-900">
              {isEn ? 'Birth Chart Overview' : '命局总览与合婚'}
            </h3>
            <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed">{chart.overallProfileZh.personality}</p>
          </div>
          <Link
            href={`/${lang}/east/ziwei-marriage`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-900 hover:underline"
          >
            <span>{isEn ? 'Compare in ZiWei Marriage Synastry' : '前往紫微双人合婚'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="w-full mb-6">
        <EastAiReadingPanel
          kind="ziwei"
          titleZh="让 AI 深度解盘"
          titleEn="AI Deep Reading"
          chartSummary={[
            `农历：${chart.lunarDate.fullText}（${chart.genderLabel}），五行局：${chart.bureau.nameZh}`,
            `命宫：${chart.lifePalaceBranch}，身宫：${chart.bodyPalaceBranch}，命主：${chart.soul}，身主：${chart.body}`,
            `生年四化：禄(${chart.fourTransformations.lu}) 权(${chart.fourTransformations.quan}) 科(${chart.fourTransformations.ke}) 忌(${chart.fourTransformations.ji})`,
            `十二宫星曜：${chart.palaces
              .map((p) => `${p.name}(${p.stem}${p.branch}):${p.majorStars.map((s) => `${s.name}${s.brightness || ''}${s.transformation ? `化${s.transformation}` : ''}`).join('/') || '空宫'}`)
              .join('；')}`,
          ].join('\n')}
          localFallback={chart.overallProfileZh.personality}
          spendType="bazi"
          lang={lang}
          resetKey={`${chart.lunarDate.fullText}-${chart.genderLabel}-${chart.bureau.nameZh}-${chart.lifePalaceBranch}`}
        />
      </div>
    </div>
  );
}
