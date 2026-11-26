'use client';

import React, { useState } from 'react';
import {
  RelationshipType,
  RELATIONSHIP_CONFIGS,
  analyzeRelationship,
  RelationshipAnalysisResult
} from '@/lib/metaphysics/relationship';

interface RelationshipSynastryWidgetProps {
  initialType?: RelationshipType;
  lang?: string;
  isHub?: boolean;
}

export function RelationshipSynastryWidget({
  initialType = 'marriage',
  lang = 'zh',
  isHub = false
}: RelationshipSynastryWidgetProps) {
  const isEn = lang === 'en';
  const [currentType, setCurrentType] = useState<RelationshipType>(initialType);

  const initialCfg = RELATIONSHIP_CONFIGS[initialType];
  const initialNameA = isEn ? initialCfg.roleAEn : initialCfg.roleAZh;
  const initialNameB = isEn ? initialCfg.roleBEn : initialCfg.roleBZh;

  // 一方信息
  const [nameA, setNameA] = useState(initialNameA);
  const [yearA, setYearA] = useState(1994);
  const [monthA, setMonthA] = useState(5);
  const [dayA, setDayA] = useState(12);
  const [hourA, setHourA] = useState(10);

  // 另一方信息
  const [nameB, setNameB] = useState(initialNameB);
  const [yearB, setYearB] = useState(1996);
  const [monthB, setMonthB] = useState(8);
  const [dayB, setDayB] = useState(18);
  const [hourB, setHourB] = useState(14);

  const [result, setResult] = useState<RelationshipAnalysisResult>(() =>
    analyzeRelationship(
      initialType,
      initialNameA,
      { year: 1994, month: 5, day: 12, hour: 10 },
      initialNameB,
      { year: 1996, month: 8, day: 18, hour: 14 }
    )
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = analyzeRelationship(
      currentType,
      nameA,
      { year: yearA, month: monthA, day: dayA, hour: hourA },
      nameB,
      { year: yearB, month: monthB, day: dayB, hour: hourB }
    );
    setResult(res);
  };

  const handleTypeChange = (newType: RelationshipType) => {
    setCurrentType(newType);
    const cfg = RELATIONSHIP_CONFIGS[newType];
    const nA = isEn ? cfg.roleAEn : cfg.roleAZh;
    const nB = isEn ? cfg.roleBEn : cfg.roleBZh;
    setNameA(nA);
    setNameB(nB);
    const res = analyzeRelationship(
      newType,
      nA,
      { year: yearA, month: monthA, day: dayA, hour: hourA },
      nB,
      { year: yearB, month: monthB, day: dayB, hour: hourB }
    );
    setResult(res);
  };

  const typesList = Object.keys(RELATIONSHIP_CONFIGS) as RelationshipType[];
  const cfg = RELATIONSHIP_CONFIGS[currentType];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-[#171717]">
      {/* 标题 */}
      <div className="w-full text-center mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#171717] tracking-tight">
          {isHub
            ? isEn
              ? 'Relationship Compatibility'
              : '关系合盘'
            : isEn
            ? cfg.titleEn
            : cfg.titleZh}
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-2 max-w-xl mx-auto leading-relaxed">
          {isHub
            ? isEn
              ? 'Choose a relationship type and enter both birth dates and times.'
              : '选择关系类型，输入两人的出生日期和时辰。'
            : isEn
            ? cfg.summaryEn
            : cfg.summaryZh}
        </p>
      </div>

      {/* 9 种关系类型分段切换器 (YiTatro 极简黑白) */}
      <div className="w-full flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8">
        {typesList.map(t => {
          const itemCfg = RELATIONSHIP_CONFIGS[t];
          const isActive = currentType === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              aria-pressed={isActive}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 ${
                isActive
                  ? 'bg-[#171717] text-[#FFFFFF]'
                  : 'bg-[#FFFFFF] text-[#52525B] hover:text-[#171717] hover:bg-[#F4F4F5] border border-[#E5E5E5]'
              }`}
            >
              {isEn ? itemCfg.titleEn : itemCfg.titleZh}
            </button>
          );
        })}
      </div>

      {/* 双方生辰双栏输入卡片 */}
      <form onSubmit={handleCalculate} className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* 一方 (Person A) */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] p-5 shadow-none">
          <div className="flex items-center justify-between mb-4 border-b border-[#E5E5E5] pb-3">
            <div className="flex flex-col gap-1 w-full max-w-[200px]">
              <label htmlFor="name-a-input" className="text-[11px] font-medium text-[#737373]">
                {isEn ? 'Person A' : '第一方'}
              </label>
              <input
                id="name-a-input"
                type="text"
                value={nameA}
                onChange={e => setNameA(e.target.value)}
                className="text-sm font-medium text-[#171717] bg-transparent border-b border-[#D4D4D8] hover:border-[#171717] focus:border-[#171717] focus:outline-none py-0.5"
              />
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] text-[#737373] block">
                {isEn ? 'Day Master' : '日主'}
              </span>
              <span className="text-xs font-medium text-[#171717]">
                {isEn ? result.personA.bazi.dayMaster.nameEn : result.personA.bazi.dayMaster.nameZh}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label htmlFor="year-a" className="block text-[11px] text-[#737373] mb-1">
                {isEn ? 'Year' : '出生年'}
              </label>
              <input
                id="year-a"
                type="number"
                value={yearA}
                onChange={e => setYearA(Number(e.target.value))}
                min={1920}
                max={2035}
                className="w-full px-2.5 py-2 min-h-[38px] rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-xs text-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="month-a" className="block text-[11px] text-[#737373] mb-1">
                {isEn ? 'Month' : '月'}
              </label>
              <input
                id="month-a"
                type="number"
                value={monthA}
                onChange={e => setMonthA(Number(e.target.value))}
                min={1}
                max={12}
                className="w-full px-2.5 py-2 min-h-[38px] rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-xs text-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="day-a" className="block text-[11px] text-[#737373] mb-1">
                {isEn ? 'Day' : '日'}
              </label>
              <input
                id="day-a"
                type="number"
                value={dayA}
                onChange={e => setDayA(Number(e.target.value))}
                min={1}
                max={31}
                className="w-full px-2.5 py-2 min-h-[38px] rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-xs text-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="hour-a" className="block text-[11px] text-[#737373] mb-1">
                {isEn ? 'Hour (0-23)' : '时辰 (点)'}
              </label>
              <input
                id="hour-a"
                type="number"
                value={hourA}
                onChange={e => setHourA(Number(e.target.value))}
                min={0}
                max={23}
                className="w-full px-2.5 py-2 min-h-[38px] rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-xs text-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 另一方 (Person B) */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] p-5 shadow-none">
          <div className="flex items-center justify-between mb-4 border-b border-[#E5E5E5] pb-3">
            <div className="flex flex-col gap-1 w-full max-w-[200px]">
              <label htmlFor="name-b-input" className="text-[11px] font-medium text-[#737373]">
                {isEn ? 'Person B' : '第二方'}
              </label>
              <input
                id="name-b-input"
                type="text"
                value={nameB}
                onChange={e => setNameB(e.target.value)}
                className="text-sm font-medium text-[#171717] bg-transparent border-b border-[#D4D4D8] hover:border-[#171717] focus:border-[#171717] focus:outline-none py-0.5"
              />
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] text-[#737373] block">
                {isEn ? 'Day Master' : '日主'}
              </span>
              <span className="text-xs font-medium text-[#171717]">
                {isEn ? result.personB.bazi.dayMaster.nameEn : result.personB.bazi.dayMaster.nameZh}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label htmlFor="year-b" className="block text-[11px] text-[#737373] mb-1">
                {isEn ? 'Year' : '出生年'}
              </label>
              <input
                id="year-b"
                type="number"
                value={yearB}
                onChange={e => setYearB(Number(e.target.value))}
                min={1920}
                max={2035}
                className="w-full px-2.5 py-2 min-h-[38px] rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-xs text-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="month-b" className="block text-[11px] text-[#737373] mb-1">
                {isEn ? 'Month' : '月'}
              </label>
              <input
                id="month-b"
                type="number"
                value={monthB}
                onChange={e => setMonthB(Number(e.target.value))}
                min={1}
                max={12}
                className="w-full px-2.5 py-2 min-h-[38px] rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-xs text-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="day-b" className="block text-[11px] text-[#737373] mb-1">
                {isEn ? 'Day' : '日'}
              </label>
              <input
                id="day-b"
                type="number"
                value={dayB}
                onChange={e => setDayB(Number(e.target.value))}
                min={1}
                max={31}
                className="w-full px-2.5 py-2 min-h-[38px] rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-xs text-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="hour-b" className="block text-[11px] text-[#737373] mb-1">
                {isEn ? 'Hour (0-23)' : '时辰 (点)'}
              </label>
              <input
                id="hour-b"
                type="number"
                value={hourB}
                onChange={e => setHourB(Number(e.target.value))}
                min={0}
                max={23}
                className="w-full px-2.5 py-2 min-h-[38px] rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-xs text-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 单一黑色主操作 */}
        <div className="md:col-span-2 flex justify-center pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 rounded-xl bg-[#171717] hover:bg-black text-[#FFFFFF] text-xs sm:text-sm font-medium tracking-wide transition-colors cursor-pointer shadow-none focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2"
          >
            {isEn ? 'Calculate Synastry Analysis' : '开始推演合盘'}
          </button>
        </div>
      </form>

      {/* 双方命盘事实与匹配摘要 */}
      <div className="w-full rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] p-5 sm:p-6 shadow-none mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E5E5E5] pb-4 mb-5">
          <div>
            <span className="text-[11px] font-medium text-[#737373] block uppercase tracking-wider">
              {isEn ? 'Chart Facts & Matched Rules' : '双方命盘事实与规则匹配'}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#171717] mt-1">
              {isEn ? `${cfg.titleEn} · Pair Comparison` : `${cfg.titleZh} · 干支对照`}
            </h2>
            <p className="text-xs sm:text-sm text-[#52525B] mt-1.5 leading-relaxed">
              {isEn
                ? `Checked Day Stem Five Combinations, Year Branch Six Harmonies/Clashes, and Day Branch Six Harmonies/Clashes: ${result.interactions.length} rule match(es) found.`
                : `已核对双方日干五合、年支六合/六冲及日支六合/六冲：共匹配 ${result.interactions.length} 项。`}
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-[11px] font-medium text-[#737373] block uppercase tracking-wider">
              {isEn ? 'Selected Context' : '当前关系主题'}
            </span>
            <p className="text-xs font-medium text-[#171717] mt-1">
              {isEn ? cfg.focusEn : cfg.focusZh}
            </p>
          </div>
        </div>

        {/* 双方四柱与对比位置事实 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[result.personA, result.personB].map((person, pIdx) => {
            const p = person.bazi.pillars;
            return (
              <div key={pIdx} className="p-3.5 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#171717]">{person.name}</span>
                  <span className="text-[11px] text-[#737373]">
                    {isEn ? `Day Master: ${person.bazi.dayMaster.stem}` : `日主：${person.bazi.dayMaster.stem}`}
                  </span>
                </div>
                <p className="font-mono text-[#171717]" lang="zh">
                  {`${p.year.gan}${p.year.zhi} · ${p.month.gan}${p.month.zhi} · ${p.day.gan}${p.day.zhi} · ${p.hour.gan}${p.hour.zhi}`}
                </p>
                <p className="text-[11px] text-[#52525B]">
                  {isEn
                    ? `Year Branch: ${p.year.zhi} · Day Stem: ${p.day.gan} · Day Branch: ${p.day.zhi}`
                    : `年支：${p.year.zhi} · 日干：${p.day.gan} · 日支：${p.day.zhi}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 干支合冲匹配明细与五行表层计数 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 sm:mb-8">
        {/* 日干五合、年支/日支六合与六冲 */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] p-5 shadow-none flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-[#E5E5E5] pb-2">
            <h3 className="text-xs font-semibold text-[#171717]">
              {isEn ? 'Matched Stem & Branch Pairs' : '干支五合 / 六合 / 六冲匹配'}
            </h3>
            <span className="text-[10px] text-[#737373] bg-[#F4F4F5] px-1.5 py-0.5 rounded">
              {isEn ? 'Day Stem · Year/Day Branch' : '日干 · 年支 / 日支'}
            </span>
          </div>
          <div className="space-y-2.5 grow">
            {result.interactions.length > 0 ? (
              result.interactions.map((it, idx) => {
                const pA = result.personA.bazi.pillars;
                const pB = result.personB.bazi.pillars;
                const isDayStem = it.category === 'heavenly_combination';
                const isYearBranch = it.pillarPair === '年支属相';
                const pairChars = isDayStem
                  ? `${pA.day.gan} + ${pB.day.gan}`
                  : isYearBranch
                  ? `${pA.year.zhi} + ${pB.year.zhi}`
                  : `${pA.day.zhi} + ${pB.day.zhi}`;
                const positionLabel = isDayStem
                  ? (isEn ? 'Day Stem (Five Combination)' : '日干位置 · 天干五合')
                  : isYearBranch
                  ? (isEn
                      ? `Year Branch (${it.category === 'clash' ? 'Six Clash' : 'Six Harmonies'})`
                      : `年支位置 · ${it.category === 'clash' ? '地支六冲' : '地支六合'}`)
                  : (isEn
                      ? `Day Branch (${it.category === 'clash' ? 'Six Clash' : 'Six Harmonies'})`
                      : `日支位置 · ${it.category === 'clash' ? '地支六冲' : '地支六合'}`);

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-semibold text-[#171717]">{positionLabel}</span>
                      <span className="text-[11px] text-[#171717] font-mono">{pairChars}</span>
                    </div>
                    {isDayStem ? (
                      <p className="text-[11px] leading-relaxed text-[#52525B]">
                        {isEn
                          ? `Day Stems ${pA.day.gan} and ${pB.day.gan} form a Five Combination pair. Matching two Day Stems alone does not prove transformation (合化), which requires seasonal and full-chart conditions.`
                          : `双方日干 ${pA.day.gan} 与 ${pB.day.gan} 构成天干五合配对。仅凭两日干相合本身不足以证明「合化」，是否成化须视月令与全盘条件而定。`}
                      </p>
                    ) : (
                      <p className="text-[11px] leading-relaxed text-[#52525B]">
                        {isEn ? 'Source: ' : '典籍出处：'}
                        <a
                          href="https://zh.wikisource.org/zh-hant/%E4%B8%89%E5%91%BD%E9%80%9A%E6%9C%83/%E5%8D%B7%E4%BA%8C"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 text-[#171717]"
                        >
                          {it.category === 'clash'
                            ? isEn
                              ? 'Sanming Tonghui Vol. 2 · §論衝擊'
                              : '《三命通會》卷二 · §論衝擊'
                            : isEn
                            ? 'Sanming Tonghui Vol. 2 · §論支元六合'
                            : '《三命通會》卷二 · §論支元六合'}
                        </a>
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="h-full flex items-center justify-center py-6 px-3 text-xs text-[#52525B] text-center leading-relaxed">
                {isEn
                  ? `No Day Stem Five Combination (${result.personA.bazi.dayMaster.stem}/${result.personB.bazi.dayMaster.stem}), Year Branch Six Harmony/Clash (${result.personA.bazi.pillars.year.zhi}/${result.personB.bazi.pillars.year.zhi}), or Day Branch Six Harmony/Clash (${result.personA.bazi.pillars.day.zhi}/${result.personB.bazi.pillars.day.zhi}) matched. Month/Hour branches, Three Harmonies, Penalties, and Harms are not evaluated here.`
                  : `双方在日干五合（${result.personA.bazi.dayMaster.stem}/${result.personB.bazi.dayMaster.stem}）、年支六合/六冲（${result.personA.bazi.pillars.year.zhi}/${result.personB.bazi.pillars.year.zhi}）与日支六合/六冲（${result.personA.bazi.pillars.day.zhi}/${result.personB.bazi.pillars.day.zhi}）中均无匹配项；月时支、三合与刑害未纳入本表检测。`}
              </div>
            )}
          </div>
        </div>

        {/* 五行表层计数（不做喜用神判定） */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] p-5 shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#E5E5E5] pb-2">
              <h3 className="text-xs font-semibold text-[#171717]">
                {isEn ? 'Surface Five-Element Counts' : '原局天干地支五行表层计数'}
              </h3>
              <span className="text-[10px] text-[#737373] bg-[#F4F4F5] px-1.5 py-0.5 rounded">
                {isEn ? 'Counts Only (No YongShen)' : '仅统计数量 · 不定喜用'}
              </span>
            </div>
            <div className="space-y-3 text-xs">
              {[result.personA, result.personB].map((person, pIdx) => (
                <div key={pIdx} className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5]">
                  <span className="text-[11px] font-medium text-[#171717] block mb-2">
                    {person.name}
                  </span>
                  <dl className="grid grid-cols-5 gap-1.5 text-center">
                    {person.bazi.fiveElements.map((el) => (
                      <div key={el.element} className="rounded border border-[#E5E5E5] bg-white py-1.5 px-1">
                        <dt className="text-[10px] text-[#737373]">{isEn ? el.element : el.elementZh}</dt>
                        <dd className="mt-0.5 font-medium tabular-nums text-[#171717]">{el.count}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}

              <p className="text-[11px] text-[#52525B] leading-relaxed pt-1">
                {isEn
                  ? result.personA.bazi.surfaceElementsNoteEn
                  : result.personA.bazi.surfaceElementsNoteZh}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 来源与推断边界说明 */}
      <div className="w-full rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] p-5 shadow-none text-xs text-[#52525B] space-y-2 leading-relaxed">
        <h3 className="text-xs font-semibold text-[#171717]">
          {isEn ? 'Sources & Scope Limitations' : '典籍来源与推断边界'}
        </h3>
        <p>
          {isEn
            ? 'Chart pillars and surface element counts use lunar-typescript (EightChar sect 2). Sanming Tonghui Vol. 2 explains Six Harmonies (§論支元六合), Six Clashes (§論衝擊), and stem pairs and transformation (§論十干合, §論十干化氣). This tool checks stem pairs only.'
            : '四柱和五行表层计数由 lunar-typescript（EightChar sect 2）计算。地支六合、六冲见《三命通會》卷二〈論支元六合〉及〈論衝擊〉，天干配对与合化条件见〈論十干合〉与〈論十干化氣〉。本工具只核对日干配对。'}
          {' '}
          <a href="https://zh.wikisource.org/zh-hant/%E4%B8%89%E5%91%BD%E9%80%9A%E6%9C%83/%E5%8D%B7%E4%BA%8C" className="underline underline-offset-2">
            {isEn ? 'Read Vol. 2' : '查看卷二原文'}
          </a>
        </p>
        <p>
          {isEn
            ? 'Insufficient-source exclusions: No compatibility scores, relationship verdicts, favorable-element (YongShen) claims from lacking elements, or statements about either person’s thoughts, feelings, or future outcomes are generated.'
            : '依据不足项说明：本页不生成契合度评分、合盘吉凶定论、依表面缺行推定的「喜用补给」，亦不推断双方的心理想法、意愿或未来现实结果。'}
        </p>
      </div>
    </div>
  );
}
