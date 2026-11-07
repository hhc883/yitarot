'use client';

import React, { useState } from 'react';
import {
  RelationshipType,
  RELATIONSHIP_CONFIGS,
  analyzeRelationship,
  RelationshipAnalysisResult
} from '@/lib/metaphysics/relationship';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface RelationshipSynastryWidgetProps {
  initialType?: RelationshipType;
  lang?: string;
}

export function RelationshipSynastryWidget({
  initialType = 'marriage',
  lang = 'zh'
}: RelationshipSynastryWidgetProps) {
  const [currentType, setCurrentType] = useState<RelationshipType>(initialType);

  // 一方信息
  const [nameA, setNameA] = useState('乾造 / 男方');
  const [yearA, setYearA] = useState(1994);
  const [monthA, setMonthA] = useState(5);
  const [dayA, setDayA] = useState(12);
  const [hourA, setHourA] = useState(10);

  // 另一方信息
  const [nameB, setNameB] = useState('坤造 / 女方');
  const [yearB, setYearB] = useState(1996);
  const [monthB, setMonthB] = useState(8);
  const [dayB, setDayB] = useState(18);
  const [hourB, setHourB] = useState(14);

  const [result, setResult] = useState<RelationshipAnalysisResult>(() =>
    analyzeRelationship(
      initialType,
      '乾造 / 男方',
      { year: 1994, month: 5, day: 12, hour: 10 },
      '坤造 / 女方',
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
    const nA = cfg.roleAZh;
    const nB = cfg.roleBZh;
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

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* 标题 */}
      <div className="w-full text-center mb-6">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {lang === 'en' ? result.config.titleEn : result.config.titleZh}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-1.5 max-w-xl mx-auto">
          {result.config.summaryZh}
        </p>
      </div>

      {/* 9 种关系类型分段切换器 (Linear 极简风) */}
      <div className="w-full flex flex-wrap justify-center gap-1.5 mb-8">
        {typesList.map(t => {
          const cfg = RELATIONSHIP_CONFIGS[t];
          const isActive = currentType === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#111111] text-[#FFFDF9] shadow-xs'
                  : 'bg-[#FFFDF9] text-[#736B5E] hover:bg-[#FAF6ED] border border-[#111111]/8'
              }`}
            >
              {lang === 'en' ? cfg.titleEn.split(' ')[0] : cfg.titleZh}
            </button>
          );
        })}
      </div>

      {/* 双方生辰双栏输入卡片 */}
      <form onSubmit={handleCalculate} className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* 一方 (Person A) */}
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#111111]/6 pb-2">
            <input
              type="text"
              value={nameA}
              onChange={e => setNameA(e.target.value)}
              className="text-xs font-serif font-bold text-[#111111] bg-transparent border-b border-transparent hover:border-[#111111]/20 focus:border-[#111111] focus:outline-hidden"
            />
            <span className="text-[11px] font-serif text-[#8C6D23]">
              日主：{result.personA.bazi.dayMaster.nameZh}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs font-serif">
            <div>
              <label className="block text-[11px] text-[#736B5E] mb-1">出生年</label>
              <input
                type="number"
                value={yearA}
                onChange={e => setYearA(Number(e.target.value))}
                min={1920}
                max={2035}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#736B5E] mb-1">月</label>
              <input
                type="number"
                value={monthA}
                onChange={e => setMonthA(Number(e.target.value))}
                min={1}
                max={12}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#736B5E] mb-1">日</label>
              <input
                type="number"
                value={dayA}
                onChange={e => setDayA(Number(e.target.value))}
                min={1}
                max={31}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#736B5E] mb-1">时辰 (点)</label>
              <input
                type="number"
                value={hourA}
                onChange={e => setHourA(Number(e.target.value))}
                min={0}
                max={23}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
              />
            </div>
          </div>
        </div>

        {/* 另一方 (Person B) */}
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#111111]/6 pb-2">
            <input
              type="text"
              value={nameB}
              onChange={e => setNameB(e.target.value)}
              className="text-xs font-serif font-bold text-[#111111] bg-transparent border-b border-transparent hover:border-[#111111]/20 focus:border-[#111111] focus:outline-hidden"
            />
            <span className="text-[11px] font-serif text-[#8C6D23]">
              日主：{result.personB.bazi.dayMaster.nameZh}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs font-serif">
            <div>
              <label className="block text-[11px] text-[#736B5E] mb-1">出生年</label>
              <input
                type="number"
                value={yearB}
                onChange={e => setYearB(Number(e.target.value))}
                min={1920}
                max={2035}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#736B5E] mb-1">月</label>
              <input
                type="number"
                value={monthB}
                onChange={e => setMonthB(Number(e.target.value))}
                min={1}
                max={12}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#736B5E] mb-1">日</label>
              <input
                type="number"
                value={dayB}
                onChange={e => setDayB(Number(e.target.value))}
                min={1}
                max={31}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#736B5E] mb-1">时辰 (点)</label>
              <input
                type="number"
                value={hourB}
                onChange={e => setHourB(Number(e.target.value))}
                min={0}
                max={23}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-center">
          <button
            type="submit"
            className="px-8 py-2.5 rounded-xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-serif tracking-wider transition-all cursor-pointer shadow-xs"
          >
            开始推演合盘
          </button>
        </div>
      </form>

      {/* 合盘总评与综合分 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#111111]/6 pb-4 mb-5">
          <div>
            <span className="text-[11px] font-serif text-[#736B5E] block">合盘定论</span>
            <h3 className="font-serif font-black text-2xl text-[#111111] mt-0.5">
              {result.verdictZh}
            </h3>
            <p className="text-xs font-serif text-[#524B40] mt-1">
              {result.insights.coreDynamicZh}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-serif text-[#736B5E] block">契合度评分</span>
            <div className="font-serif font-black text-4xl text-[#8C6D23]">
              {result.scores.overall} <span className="text-xs text-[#736B5E] font-normal">/ 100</span>
            </div>
          </div>
        </div>

        {/* 5 维度平衡 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#111111]/5 text-center">
            <span className="text-[11px] font-serif text-[#736B5E] block mb-1">默契共鸣</span>
            <span className="text-sm font-serif font-bold text-[#111111]">{result.scores.chemistry}分</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#111111]/5 text-center">
            <span className="text-[11px] font-serif text-[#736B5E] block mb-1">稳固长久</span>
            <span className="text-sm font-serif font-bold text-[#111111]">{result.scores.stability}分</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#111111]/5 text-center">
            <span className="text-[11px] font-serif text-[#736B5E] block mb-1">互助赋能</span>
            <span className="text-sm font-serif font-bold text-[#111111]">{result.scores.growth}分</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#111111]/5 text-center">
            <span className="text-[11px] font-serif text-[#736B5E] block mb-1">沟通包容</span>
            <span className="text-sm font-serif font-bold text-[#111111]">{result.scores.communication}分</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#111111]/5 text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] font-serif text-[#736B5E] block mb-1">化解能力</span>
            <span className="text-sm font-serif font-bold text-[#111111]">{result.scores.resolution}分</span>
          </div>
        </div>
      </div>

      {/* 干支冲合互动明细 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* 天干地支相合与相冲 */}
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <h4 className="text-xs font-serif font-bold text-[#111111] mb-3 border-b border-[#111111]/6 pb-2">
            干支冲合气场
          </h4>
          <div className="space-y-2.5">
            {result.interactions.length > 0 ? (
              result.interactions.map((it, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs font-serif ${
                    it.isPositive
                      ? 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                      : 'bg-amber-50/50 border-amber-100 text-amber-950'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">{it.label}</span>
                    <span className="text-[10px] opacity-75">{it.pillarPair}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">{it.descZh}</p>
                </div>
              ))
            ) : (
              <p className="text-xs font-serif text-[#736B5E] py-4 text-center">
                双方原局干支无剧烈刑冲合害，气场平静自如。
              </p>
            )}
          </div>
        </div>

        {/* 五行互补调候 */}
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-serif font-bold text-[#111111] mb-3 border-b border-[#111111]/6 pb-2">
              五行互补调候
            </h4>
            <div className="space-y-3 text-xs font-serif">
              <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#111111]/5">
                <span className="text-[11px] text-[#736B5E] block mb-0.5">{result.personA.name} 喜用补给</span>
                <p className="text-xs text-[#111111]">
                  命局偏好【{result.wuxingAnalysis.personAPreferred}】，{result.personB.name} 的能量分布在此起到关键调和。
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#111111]/5">
                <span className="text-[11px] text-[#736B5E] block mb-0.5">{result.personB.name} 喜用补给</span>
                <p className="text-xs text-[#111111]">
                  命局偏好【{result.wuxingAnalysis.personBPreferred}】，双方交互能促发良性五行循环。
                </p>
              </div>

              <p className="text-xs text-[#524B40] leading-relaxed mt-2">
                {result.wuxingAnalysis.complementarityDescZh}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 锦囊与相处法则 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <span className="text-[11px] font-serif font-bold text-emerald-800 block mb-2">优势基石</span>
          <ul className="space-y-1.5 text-xs font-serif text-[#524B40]">
            {result.insights.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-700">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <span className="text-[11px] font-serif font-bold text-amber-800 block mb-2">潜在磨合点</span>
          <ul className="space-y-1.5 text-xs font-serif text-[#524B40]">
            {result.insights.potentialFrictions.map((f, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-700">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <span className="text-[11px] font-serif font-bold text-[#8C6D23] block mb-2">相处黄金法则</span>
          <ul className="space-y-1.5 text-xs font-serif text-[#524B40]">
            {result.insights.goldenAdvice.map((a, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#8C6D23]">•</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
