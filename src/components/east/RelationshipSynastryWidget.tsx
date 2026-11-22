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

      {/* 合盘总评与综合分 */}
      <div className="w-full rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] p-5 sm:p-6 shadow-none mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4 mb-5">
          <div>
            <span className="text-[11px] font-medium text-[#737373] block uppercase tracking-wider">
              {isEn ? 'Synastry Verdict' : '合盘定论'}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#171717] mt-1">
              {isEn ? result.verdictEn : result.verdictZh}
            </h2>
            <p className="text-xs sm:text-sm text-[#52525B] mt-1.5 leading-relaxed">
              {isEn
                ? `When the two charts interact, they reveal ${result.interactions.filter(i => i.isPositive).length} harmonious combinations and ${result.interactions.filter(i => !i.isPositive).length} points of dynamic tension, oriented around [${result.verdictEn}].`
                : result.insights.coreDynamicZh}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[11px] font-medium text-[#737373] block uppercase tracking-wider">
              {isEn ? 'Compatibility Score' : '契合度评分'}
            </span>
            <div className="font-serif text-3xl sm:text-4xl font-normal text-[#171717] mt-0.5">
              {result.scores.overall} <span className="text-xs text-[#737373] font-normal">/ 100</span>
            </div>
          </div>
        </div>

        {/* 5 维度平衡 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-center">
            <span className="text-[11px] text-[#737373] block mb-1">{isEn ? 'Chemistry' : '默契共鸣'}</span>
            <span className="text-sm font-semibold text-[#171717]">{result.scores.chemistry}{isEn ? ' pts' : '分'}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-center">
            <span className="text-[11px] text-[#737373] block mb-1">{isEn ? 'Stability' : '稳固长久'}</span>
            <span className="text-sm font-semibold text-[#171717]">{result.scores.stability}{isEn ? ' pts' : '分'}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-center">
            <span className="text-[11px] text-[#737373] block mb-1">{isEn ? 'Growth' : '互助赋能'}</span>
            <span className="text-sm font-semibold text-[#171717]">{result.scores.growth}{isEn ? ' pts' : '分'}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-center">
            <span className="text-[11px] text-[#737373] block mb-1">{isEn ? 'Communication' : '沟通包容'}</span>
            <span className="text-sm font-semibold text-[#171717]">{result.scores.communication}{isEn ? ' pts' : '分'}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-[#737373] block mb-1">{isEn ? 'Resolution' : '化解能力'}</span>
            <span className="text-sm font-semibold text-[#171717]">{result.scores.resolution}{isEn ? ' pts' : '分'}</span>
          </div>
        </div>
      </div>

      {/* 干支冲合互动明细与五行 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 sm:mb-8">
        {/* 天干地支相合与相冲 */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] p-5 shadow-none flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-[#E5E5E5] pb-2">
            <h3 className="text-xs font-semibold text-[#171717]">
              {isEn ? 'Stems & Branches Field' : '干支冲合气场'}
            </h3>
            {isEn && (
              <span className="text-[10px] text-[#737373] bg-[#F4F4F5] px-1.5 py-0.5 rounded">
                Traditional Terms
              </span>
            )}
          </div>
          <div className="space-y-2.5 grow">
            {result.interactions.length > 0 ? (
              result.interactions.map((it, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] text-xs"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-[#171717]">{it.label}</span>
                    <span className="text-[11px] text-[#737373] font-mono">{it.pillarPair}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#52525B]">{it.descZh}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center py-6 text-xs text-[#737373] text-center">
                {isEn ? 'No acute clashes or penalties detected between the charts. The field is tranquil.' : '双方原局干支无剧烈刑冲合害，气场平静自如。'}
              </div>
            )}
          </div>
        </div>

        {/* 五行互补调候 */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] p-5 shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#E5E5E5] pb-2">
              <h3 className="text-xs font-semibold text-[#171717]">
                {isEn ? 'Five Elements Harmony' : '五行互补调候'}
              </h3>
              {isEn && (
                <span className="text-[10px] text-[#737373] bg-[#F4F4F5] px-1.5 py-0.5 rounded">
                  Natal Chart Balance
                </span>
              )}
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5]">
                <span className="text-[11px] text-[#737373] block mb-0.5">
                  {isEn ? `${result.personA.name} Elemental Support` : `${result.personA.name} 喜用补给`}
                </span>
                <p className="text-xs text-[#171717]">
                  {isEn
                    ? `Chart favors [${result.wuxingAnalysis.personAPreferred}], harmonized by ${result.personB.name}'s natal distribution.`
                    : `命局偏好【${result.wuxingAnalysis.personAPreferred}】，${result.personB.name} 的能量分布在此起到关键调和。`}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5]">
                <span className="text-[11px] text-[#737373] block mb-0.5">
                  {isEn ? `${result.personB.name} Elemental Support` : `${result.personB.name} 喜用补给`}
                </span>
                <p className="text-xs text-[#171717]">
                  {isEn
                    ? `Chart favors [${result.wuxingAnalysis.personBPreferred}], establishing a reciprocal elemental flow.`
                    : `命局偏好【${result.wuxingAnalysis.personBPreferred}】，双方交互能促发良性五行循环。`}
                </p>
              </div>

              <p className="text-xs text-[#52525B] leading-relaxed pt-1">
                {result.wuxingAnalysis.complementarityDescZh}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 锦囊与相处法则 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] p-5 shadow-none">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#E5E5E5]">
            <span className="text-xs font-semibold text-[#171717]">
              {isEn ? 'Harmonious Strengths' : '优势基石'}
            </span>
            {isEn && (
              <span className="text-[10px] text-[#737373] bg-[#F4F4F5] px-1 py-0.5 rounded">
                CN Guidance
              </span>
            )}
          </div>
          <ul className="space-y-2 text-xs text-[#52525B]">
            {result.insights.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#171717] font-bold">•</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] p-5 shadow-none">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#E5E5E5]">
            <span className="text-xs font-semibold text-[#171717]">
              {isEn ? 'Potential Growth Points' : '潜在磨合点'}
            </span>
            {isEn && (
              <span className="text-[10px] text-[#737373] bg-[#F4F4F5] px-1 py-0.5 rounded">
                CN Guidance
              </span>
            )}
          </div>
          <ul className="space-y-2 text-xs text-[#52525B]">
            {result.insights.potentialFrictions.map((f, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#737373] font-bold">•</span>
                <span className="leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] p-5 shadow-none">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#E5E5E5]">
            <span className="text-xs font-semibold text-[#171717]">
              {isEn ? 'Golden Relational Wisdom' : '相处黄金法则'}
            </span>
            {isEn && (
              <span className="text-[10px] text-[#737373] bg-[#F4F4F5] px-1 py-0.5 rounded">
                CN Guidance
              </span>
            )}
          </div>
          <ul className="space-y-2 text-xs text-[#52525B]">
            {result.insights.goldenAdvice.map((a, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#171717] font-bold">•</span>
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
