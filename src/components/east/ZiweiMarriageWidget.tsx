'use client';

import React, { useState } from 'react';
import {
  analyzeZiweiMarriage,
  BRANCH_NAMES_EN,
  calculateZiwei,
  ZiweiGender,
  ZiweiMarriagePalaceSnapshot,
  ZiweiMarriagePartnerSnapshot,
  ZiweiMarriageResult
} from '@/lib/metaphysics/ziwei';

function parseStrictInt(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^-?\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

export function ZiweiMarriageWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';

  const defaultNameA = isEn ? 'Partner A' : '甲方';
  const defaultNameB = isEn ? 'Partner B' : '乙方';

  const [nameA, setNameA] = useState(defaultNameA);
  const [genderA, setGenderA] = useState<ZiweiGender>('male');
  const [yearA, setYearA] = useState('1994');
  const [monthA, setMonthA] = useState('5');
  const [dayA, setDayA] = useState('12');
  const [hourA, setHourA] = useState('10');

  const [nameB, setNameB] = useState(defaultNameB);
  const [genderB, setGenderB] = useState<ZiweiGender>('female');
  const [yearB, setYearB] = useState('1996');
  const [monthB, setMonthB] = useState('8');
  const [dayB, setDayB] = useState('18');
  const [hourB, setHourB] = useState('14');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [marriage, setMarriage] = useState<ZiweiMarriageResult>(() => {
    const cA = calculateZiwei(1994, 5, 12, 10, 'male');
    const cB = calculateZiwei(1996, 8, 18, 14, 'female');
    return analyzeZiweiMarriage(cA, cB, defaultNameA, defaultNameB);
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const yA = parseStrictInt(yearA);
    const mA = parseStrictInt(monthA);
    const dA = parseStrictInt(dayA);
    const hA = parseStrictInt(hourA);
    const yB = parseStrictInt(yearB);
    const mB = parseStrictInt(monthB);
    const dB = parseStrictInt(dayB);
    const hB = parseStrictInt(hourB);

    if (
      yA === null || mA === null || dA === null || hA === null ||
      yB === null || mB === null || dB === null || hB === null
    ) {
      setErrorMessage(
        isEn
          ? 'Please enter complete integer values for both partners’ year, month, day, and hour (0–23).'
          : '请完整填写双方公历年、月、日与时辰（0–23 整数）。'
      );
      return;
    }

    try {
      const cA = calculateZiwei(yA, mA, dA, hA, genderA);
      const cB = calculateZiwei(yB, mB, dB, hB, genderB);
      const res = analyzeZiweiMarriage(cA, cB, nameA.trim() || defaultNameA, nameB.trim() || defaultNameB);
      setMarriage(res);
      setErrorMessage(null);
    } catch {
      setErrorMessage(
        isEn
          ? 'Please enter valid Gregorian dates (1920–2035) and hours (0–23) for both partners.'
          : '请为双方输入 1920–2035 年间有效的公历日期及 0–23 时辰。'
      );
    }
  };

  const renderPalaceCard = (palace: ZiweiMarriagePalaceSnapshot) => (
    <div className="p-3.5 rounded-xl bg-[#F5F5F6] border border-[#E4E4E7] space-y-2">
      <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-1.5">
        <span className="font-serif font-bold text-xs text-[#171717]">
          {isEn ? palace.nameEn : palace.nameZh}
        </span>
        <span className="font-mono text-[11px] text-[#52525B]">
          {palace.stem}{palace.branch}
          {isEn ? ` (${BRANCH_NAMES_EN[palace.branch] || palace.branch})` : '宫'}
        </span>
      </div>

      <div className="text-xs text-[#171717]">
        <span className="text-[11px] text-[#52525B] block mb-0.5">
          {isEn ? 'Major Stars' : '本宫主星'}
        </span>
        {palace.majorStars.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {palace.majorStars.map((s, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[#E4E4E7] text-xs font-medium text-[#171717]"
              >
                <span>{isEn ? (s.nameEn || s.name) : s.name}</span>
                {s.transformation && (
                  <span className="text-[10px] px-1 rounded bg-[#171717] text-white">
                    {isEn ? (s.transformationEn || s.transformation) : `化${s.transformation}`}
                  </span>
                )}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#52525B] italic">
            {isEn
              ? `Empty Palace (no major stars; opposite ${BRANCH_NAMES_EN[palace.oppositeBranch] || palace.oppositeBranch}: ${palace.oppositeMajorStarNamesEn.join(', ') || 'Empty'})`
              : `空宫（无主星；对宫${palace.oppositeBranch}有：${palace.oppositeMajorStarNames.join('、') || '亦无主星'}）`}
          </p>
        )}
      </div>

      <div className="text-xs text-[#52525B]">
        <span className="text-[11px] text-[#52525B] block mb-0.5">
          {isEn ? 'Auxiliary Stars' : '本宫辅星'}
        </span>
        {palace.minorStars.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {palace.minorStars.map((m, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[#E4E4E7] text-[11px] text-[#171717]"
              >
                <span>{isEn ? (m.nameEn || m.name) : m.name}</span>
                {m.transformation && (
                  <span className="text-[10px] px-1 rounded bg-[#171717] text-white">
                    {isEn ? (m.transformationEn || m.transformation) : `化${m.transformation}`}
                  </span>
                )}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-[#71717A]">
            {isEn ? 'None in this palace' : '本宫无辅星'}
          </span>
        )}
      </div>
    </div>
  );

  const renderPartnerColumn = (partner: ZiweiMarriagePartnerSnapshot) => (
    <article className="rounded-2xl bg-white border border-[#E4E4E7] p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3 flex-wrap gap-2">
        <div>
          <h2 className="font-serif font-bold text-base text-[#171717]">{partner.name}</h2>
          <p className="text-[11px] text-[#52525B] mt-0.5">
            {isEn
              ? `${partner.yearGanZhi} Year · ${partner.bureau.nameEn} · ${partner.decadalDirectionEn}`
              : `${partner.yearGanZhi}年 · ${partner.bureau.nameZh} · ${partner.decadalDirectionZh}`}
          </p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F5F5F6] border border-[#E4E4E7] text-[#171717]">
          {isEn ? (partner.gender === 'male' ? 'Male' : 'Female') : (partner.gender === 'male' ? '男' : '女')}
        </span>
      </div>

      <div className="space-y-3">
        {renderPalaceCard(partner.lifePalace)}
        {renderPalaceCard(partner.spousePalace)}
      </div>

      <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7]">
        <span className="font-serif font-bold text-xs text-[#171717] block mb-2">
          {isEn ? 'Natal Four Transformations & Landing Palaces' : '生年四化及落宫'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
          {partner.fourTransformations.map(tr => (
            <div
              key={tr.key}
              className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white border border-[#E4E4E7]"
            >
              <span className="font-medium text-[#171717]">
                {isEn ? `${tr.labelEn} · ${tr.starEn}` : `${tr.labelZh} · ${tr.starZh}`}
              </span>
              <span className="font-mono text-[11px] text-[#52525B]">
                {isEn ? `${tr.palaceNameEn} (${tr.palaceStem}${tr.palaceBranch})` : `${tr.palaceNameZh} (${tr.palaceStem}${tr.palaceBranch})`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );

  const factualNotes = isEn ? marriage.factualNotesEn : marriage.factualNotesZh;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* 标题 */}
      <div className="w-full text-center mb-6">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#171717] tracking-tight">
          {isEn ? 'Ziwei Chart Comparison' : '紫微合盘对照'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#52525B] mt-1.5 max-w-xl mx-auto">
          {isEn
            ? 'Side-by-side natal Life Palaces, Spouses Palaces, and actual Natal Four Transformations landing positions.'
            : '客观并列双方实际命宫、夫妻宫（含空宫实况）与各自生年四化落宫。'}
        </p>
      </div>

      {/* 双方生辰与性别调参 */}
      <form onSubmit={handleCalculate} className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="rounded-2xl bg-white border border-[#E4E4E7] p-5 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-3 border-b border-[#E4E4E7] pb-2">
            <input
              type="text"
              aria-label={isEn ? 'Partner A Name' : '甲方称呼'}
              value={nameA}
              onChange={e => setNameA(e.target.value)}
              className="text-xs font-serif font-bold text-[#171717] bg-transparent border-b border-transparent focus:border-[#171717] focus:outline-hidden"
            />
            <select
              aria-label={isEn ? 'Partner A Gender' : '甲方性别'}
              value={genderA}
              onChange={e => setGenderA(e.target.value === 'female' ? 'female' : 'male')}
              className="px-2 py-1 rounded bg-[#F5F5F6] border border-[#E4E4E7] text-[11px] text-[#171717]"
            >
              <option value="male">{isEn ? 'Male' : '男（乾造）'}</option>
              <option value="female">{isEn ? 'Female' : '女（坤造）'}</option>
            </select>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs font-serif">
            <div>
              <label className="block text-[11px] text-[#52525B] mb-1">{isEn ? 'Year' : '公历年'}</label>
              <input
                type="number"
                value={yearA}
                onChange={e => {
                  setYearA(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                min={1920}
                max={2035}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#F5F5F6] border border-[#E4E4E7] text-xs text-[#171717]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#52525B] mb-1">{isEn ? 'Month' : '月'}</label>
              <input
                type="number"
                value={monthA}
                onChange={e => {
                  setMonthA(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                min={1}
                max={12}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#F5F5F6] border border-[#E4E4E7] text-xs text-[#171717]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#52525B] mb-1">{isEn ? 'Day' : '日'}</label>
              <input
                type="number"
                value={dayA}
                onChange={e => {
                  setDayA(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                min={1}
                max={31}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#F5F5F6] border border-[#E4E4E7] text-xs text-[#171717]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#52525B] mb-1">{isEn ? 'Hour (0-23)' : '时 (点)'}</label>
              <input
                type="number"
                value={hourA}
                onChange={e => {
                  setHourA(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                min={0}
                max={23}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#F5F5F6] border border-[#E4E4E7] text-xs text-[#171717]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-[#E4E4E7] p-5 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-3 border-b border-[#E4E4E7] pb-2">
            <input
              type="text"
              aria-label={isEn ? 'Partner B Name' : '乙方称呼'}
              value={nameB}
              onChange={e => setNameB(e.target.value)}
              className="text-xs font-serif font-bold text-[#171717] bg-transparent border-b border-transparent focus:border-[#171717] focus:outline-hidden"
            />
            <select
              aria-label={isEn ? 'Partner B Gender' : '乙方性别'}
              value={genderB}
              onChange={e => {
                setGenderB(e.target.value === 'female' ? 'female' : 'male');
                if (errorMessage) setErrorMessage(null);
              }}
              className="px-2 py-1 rounded bg-[#F5F5F6] border border-[#E4E4E7] text-[11px] text-[#171717]"
            >
              <option value="male">{isEn ? 'Male' : '男（乾造）'}</option>
              <option value="female">{isEn ? 'Female' : '女（坤造）'}</option>
            </select>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs font-serif">
            <div>
              <label className="block text-[11px] text-[#52525B] mb-1">{isEn ? 'Year' : '公历年'}</label>
              <input
                type="number"
                value={yearB}
                onChange={e => {
                  setYearB(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                min={1920}
                max={2035}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#F5F5F6] border border-[#E4E4E7] text-xs text-[#171717]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#52525B] mb-1">{isEn ? 'Month' : '月'}</label>
              <input
                type="number"
                value={monthB}
                onChange={e => {
                  setMonthB(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                min={1}
                max={12}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#F5F5F6] border border-[#E4E4E7] text-xs text-[#171717]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#52525B] mb-1">{isEn ? 'Day' : '日'}</label>
              <input
                type="number"
                value={dayB}
                onChange={e => {
                  setDayB(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                min={1}
                max={31}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#F5F5F6] border border-[#E4E4E7] text-xs text-[#171717]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#52525B] mb-1">{isEn ? 'Hour (0-23)' : '时 (点)'}</label>
              <input
                type="number"
                value={hourB}
                onChange={e => {
                  setHourB(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                min={0}
                max={23}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#F5F5F6] border border-[#E4E4E7] text-xs text-[#171717]"
              />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="md:col-span-2 p-3 rounded-xl border border-[#D4D4D8] bg-[#F5F5F6] text-xs text-[#171717] text-center"
          >
            {errorMessage}
          </div>
        )}

        <div className="md:col-span-2 flex justify-center">
          <button
            type="submit"
            className="px-8 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333333] text-white text-xs font-serif tracking-wider transition-all cursor-pointer shadow-xs"
          >
            {isEn ? 'Compare Two Ziwei Charts' : '对照双方紫微命盘'}
          </button>
        </div>
      </form>

      {/* 双方实盘并列对照：命宫、夫妻宫、生年四化及落宫 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {renderPartnerColumn(marriage.partnerA)}
        {renderPartnerColumn(marriage.partnerB)}
      </div>

      {/* 客观盘面摘要与口径边界 */}
      <div className="w-full rounded-2xl bg-white border border-[#E4E4E7] p-5 shadow-2xs space-y-4">
        <div>
          <h3 className="font-serif font-bold text-sm text-[#171717] mb-2">
            {isEn ? 'Chart Facts Summary' : '盘面实况对照'}
          </h3>
          <ul className="space-y-1.5 text-xs font-serif text-[#52525B] leading-relaxed">
            {factualNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#171717]">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <details className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-4 py-3 text-xs text-[#52525B]">
          <summary className="cursor-pointer font-medium text-[#171717] select-none">
            {isEn ? 'Methodology & Unsupported Schools Boundary' : '合盘口径与不支持流派说明'}
          </summary>
          <p className="mt-2.5 pt-2.5 border-t border-[#E4E4E7] leading-relaxed">
            {isEn ? marriage.schoolBoundaryEn : marriage.schoolBoundaryZh}
          </p>
        </details>
      </div>
    </div>
  );
}
