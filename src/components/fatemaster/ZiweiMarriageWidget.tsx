'use client';

import React, { useState } from 'react';
import { calculateZiwei, analyzeZiweiMarriage, ZiweiMarriageResult } from '@/lib/metaphysics/ziwei';

export function ZiweiMarriageWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';

  const defaultNameA = isEn ? 'Partner A (Male)' : '乾造 / 男方';
  const defaultNameB = isEn ? 'Partner B (Female)' : '坤造 / 女方';

  const [nameA, setNameA] = useState(defaultNameA);
  const [yearA, setYearA] = useState(1994);
  const [monthA, setMonthA] = useState(5);
  const [dayA, setDayA] = useState(12);
  const [hourA, setHourA] = useState(10);

  const [nameB, setNameB] = useState(defaultNameB);
  const [yearB, setYearB] = useState(1996);
  const [monthB, setMonthB] = useState(8);
  const [dayB, setDayB] = useState(18);
  const [hourB, setHourB] = useState(14);

  const [marriage, setMarriage] = useState<ZiweiMarriageResult>(() => {
    const cA = calculateZiwei(1994, 5, 12, 10);
    const cB = calculateZiwei(1996, 8, 18, 14);
    return analyzeZiweiMarriage(cA, cB, defaultNameA, defaultNameB);
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const cA = calculateZiwei(yearA, monthA, dayA, hourA);
    const cB = calculateZiwei(yearB, monthB, dayB, hourB);
    const res = analyzeZiweiMarriage(cA, cB, nameA, nameB);
    setMarriage(res);
  };

  const strengthsList = (isEn && marriage.strengthsEn) ? marriage.strengthsEn : marriage.strengths;
  const challengesList = (isEn && marriage.challengesEn) ? marriage.challengesEn : marriage.challenges;
  const guidanceList = (isEn && marriage.harmonyGuidanceEn) ? marriage.harmonyGuidanceEn : marriage.harmonyGuidance;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* 标题 */}
      <div className="w-full text-center mb-6">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {isEn ? 'Ziwei Marriage Synastry' : '紫微合婚'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-1.5 max-w-lg mx-auto">
          {isEn
            ? 'Mutual reflection of Life Palaces · Spouses Palace resonance · Natal Transformations · Astrological Synastry'
            : '双方命宫主星互映 · 夫妻宫气象交辉 · 生年四化引动 · 三世情缘合盘'}
        </p>
      </div>

      {/* 双方生辰调参 */}
      <form onSubmit={handleCalculate} className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#111111]/6 pb-2">
            <input
              type="text"
              value={nameA}
              onChange={e => setNameA(e.target.value)}
              className="text-xs font-serif font-bold text-[#111111] bg-transparent border-b border-transparent focus:border-[#111111] focus:outline-hidden"
            />
            <span className="text-[11px] font-serif text-[#8C6D23]">
              {isEn ? `Seated Star [${marriage.chartA.dayMasterStar}]` : `命坐【${marriage.chartA.dayMasterStar}】`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs font-serif">
            <div>
              <label className="block text-[11px] text-[#736B5E] mb-1">{isEn ? 'Year' : '公历年'}</label>
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
              <label className="block text-[11px] text-[#736B5E] mb-1">{isEn ? 'Month' : '月'}</label>
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
              <label className="block text-[11px] text-[#736B5E] mb-1">{isEn ? 'Day' : '日'}</label>
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
              <label className="block text-[11px] text-[#736B5E] mb-1">{isEn ? 'Hour (0-23)' : '时 (点)'}</label>
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

        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#111111]/6 pb-2">
            <input
              type="text"
              value={nameB}
              onChange={e => setNameB(e.target.value)}
              className="text-xs font-serif font-bold text-[#111111] bg-transparent border-b border-transparent focus:border-[#111111] focus:outline-hidden"
            />
            <span className="text-[11px] font-serif text-[#8C6D23]">
              {isEn ? `Seated Star [${marriage.chartB.dayMasterStar}]` : `命坐【${marriage.chartB.dayMasterStar}】`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs font-serif">
            <div>
              <label className="block text-[11px] text-[#736B5E] mb-1">{isEn ? 'Year' : '公历年'}</label>
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
              <label className="block text-[11px] text-[#736B5E] mb-1">{isEn ? 'Month' : '月'}</label>
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
              <label className="block text-[11px] text-[#736B5E] mb-1">{isEn ? 'Day' : '日'}</label>
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
              <label className="block text-[11px] text-[#736B5E] mb-1">{isEn ? 'Hour (0-23)' : '时 (点)'}</label>
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
            {isEn ? 'Calculate Ziwei Marriage Synastry' : '开始紫微合婚测算'}
          </button>
        </div>
      </form>

      {/* 合婚总评 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#111111]/6 pb-4 mb-5">
          <div>
            <span className="text-[11px] font-serif text-[#736B5E] block">
              {isEn ? 'Ziwei Marriage Verdict' : '紫微合婚定语'}
            </span>
            <h3 className="font-serif font-black text-2xl text-[#111111] mt-0.5">
              {isEn ? marriage.verdictEn : marriage.verdictZh}
            </h3>
            <p className="text-xs font-serif text-[#524B40] mt-1">
              {isEn ? marriage.palaceSynastry.lifePalaceResonanceEn : marriage.palaceSynastry.lifePalaceResonanceZh}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[11px] font-serif text-[#736B5E] block">
              {isEn ? 'Overall Synastry Score' : '综合契合度'}
            </span>
            <div className="font-serif font-black text-4xl text-[#8C6D23]">
              {marriage.overallScore} <span className="text-xs text-[#736B5E] font-normal">{isEn ? 'pts' : '分'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif text-[#524B40]">
          <div className="p-3.5 rounded-xl bg-[#FAF6ED] border border-[#111111]/5">
            <span className="font-bold text-[#111111] block mb-1">
              {isEn ? 'Spouses Palace Star Resonance' : '夫妻宫星照共振'}
            </span>
            <p className="leading-relaxed">
              {isEn ? marriage.palaceSynastry.spousePalaceResonanceEn : marriage.palaceSynastry.spousePalaceResonanceZh}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF6ED] border border-[#111111]/5">
            <span className="font-bold text-[#111111] block mb-1">
              {isEn ? 'Natal Transformations Echo' : '生年四化回响'}
            </span>
            <p className="leading-relaxed">
              {isEn ? marriage.palaceSynastry.fourTransformationsEchoEn : marriage.palaceSynastry.fourTransformationsEchoZh}
            </p>
          </div>
        </div>
      </div>

      {/* 优势与磨合锦囊 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <span className="text-[11px] font-serif font-bold text-emerald-800 block mb-2">
            {isEn ? 'Auspicious Strengths' : '天赐良缘优势'}
          </span>
          <ul className="space-y-1.5 text-xs font-serif text-[#524B40]">
            {strengthsList.map((s, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-700">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <span className="text-[11px] font-serif font-bold text-amber-800 block mb-2">
            {isEn ? 'Potential Growth & Friction' : '星耀潜在磨合'}
          </span>
          <ul className="space-y-1.5 text-xs font-serif text-[#524B40]">
            {challengesList.map((c, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-700">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <span className="text-[11px] font-serif font-bold text-[#8C6D23] block mb-2">
            {isEn ? 'Harmonious Guidance' : '夫妻调和锦囊'}
          </span>
          <ul className="space-y-1.5 text-xs font-serif text-[#524B40]">
            {guidanceList.map((g, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#8C6D23]">•</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
