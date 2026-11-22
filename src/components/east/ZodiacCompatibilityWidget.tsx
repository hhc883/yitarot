'use client';

import React, { useState } from 'react';
import { ZODIAC_SIGNS, getZodiacCompatibility } from '@/lib/metaphysics/compatibility';

export function ZodiacCompatibilityWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const [signAId, setSignAId] = useState<string>('dragon');
  const [signBId, setSignBId] = useState<string>('rooster');

  const result = getZodiacCompatibility(signAId, signBId);

  // Quick swap for mobile thumb-friendly workflow
  const handleSwap = () => {
    setSignAId(signBId);
    setSignBId(signAId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-zinc-900">
      {/* Short localized H1 and concrete intro */}
      <header className="w-full text-center mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-zinc-900">
          {isEn ? 'Zodiac Compatibility' : '生肖配对'}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
          {isEn
            ? 'Compare two Chinese zodiac signs by Six Harmonies, Triads, and Clashes to evaluate temperament, resonance, and partnership balance.'
            : '推演生肖六合、三合与相冲格局，测算性格默契、相处摩擦点与合盘契合度。'}
        </p>
      </header>

      {/* Input setup card: thumb-friendly fields and mode selectors */}
      <section
        aria-labelledby="zodiac-select-heading"
        className="w-full rounded-sm bg-white border border-zinc-200 p-5 sm:p-6 mb-8 shadow-xs"
      >
        <h2 id="zodiac-select-heading" className="sr-only">
          {isEn ? 'Select Zodiac Signs' : '选择生肖'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
          <div>
            <label
              htmlFor="first-zodiac-select"
              className="block text-xs font-semibold text-zinc-800 mb-1.5"
            >
              {isEn ? 'First Zodiac' : '一方生肖'}
            </label>
            <select
              id="first-zodiac-select"
              value={signAId}
              onChange={e => setSignAId(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-sm bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 transition-colors focus:bg-white focus:border-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              {ZODIAC_SIGNS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {isEn ? `${s.nameEn} (${s.element})` : `${s.nameZh}（五行属${s.elementZh}）`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="second-zodiac-select"
              className="block text-xs font-semibold text-zinc-800 mb-1.5"
            >
              {isEn ? 'Second Zodiac' : '另一方生肖'}
            </label>
            <select
              id="second-zodiac-select"
              value={signBId}
              onChange={e => setSignBId(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-sm bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 transition-colors focus:bg-white focus:border-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              {ZODIAC_SIGNS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {isEn ? `${s.nameEn} (${s.element})` : `${s.nameZh}（五行属${s.elementZh}）`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick pair switcher / primary button */}
        <div className="mt-5 pt-4 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={handleSwap}
            className="inline-flex items-center justify-center min-h-[40px] px-3 py-2 rounded-sm bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-700 transition-colors cursor-pointer border border-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            {isEn ? '⇄ Swap Positions' : '⇄ 对调双方生肖'}
          </button>

          <button
            type="button"
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-sm bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white text-sm font-medium tracking-wide transition-colors cursor-pointer text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            onClick={() => {
              // Ensure accessibility focus jump / confirmation in mobile view
              const resultEl = document.getElementById('zodiac-compatibility-result');
              if (resultEl) {
                resultEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {isEn ? 'View Analysis' : '查看合盘分析'}
          </button>
        </div>
      </section>

      {/* Result showcase */}
      <section
        id="zodiac-compatibility-result"
        aria-labelledby="zodiac-result-heading"
        className="w-full rounded-sm bg-white border border-zinc-200 p-5 sm:p-6 mb-8 shadow-xs"
      >
        <h2 id="zodiac-result-heading" className="sr-only">
          {isEn ? 'Compatibility Result' : '配对结果'}
        </h2>

        {/* Main Verdict & Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 mb-5">
          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 block">
              {isEn ? 'Compatibility Verdict' : '配对定语'}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-zinc-900">
              {isEn ? result.verdictEn : result.verdictZh}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-xl">
              {isEn ? result.dynamicEn : result.dynamicZh}
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 block">
              {isEn ? 'Overall Score' : '综合契合度'}
            </span>
            <div className="font-serif font-semibold text-3xl sm:text-4xl text-zinc-900 mt-0.5">
              {result.overallScore}
              <span className="text-xs text-zinc-500 font-normal ml-1">
                {isEn ? 'pts' : '/ 100'}
              </span>
            </div>
          </div>
        </div>

        {/* Dimension scores: neutral supporting cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-sm bg-zinc-50 border border-zinc-200 text-center">
            <span className="text-[11px] font-medium text-zinc-500 block mb-1">
              {isEn ? 'Romance' : '恋爱指数'}
            </span>
            <span className="text-base sm:text-lg font-serif font-semibold text-zinc-900">
              {result.romanceScore} {isEn ? 'pts' : '分'}
            </span>
          </div>
          <div className="p-3.5 rounded-sm bg-zinc-50 border border-zinc-200 text-center">
            <span className="text-[11px] font-medium text-zinc-500 block mb-1">
              {isEn ? 'Friendship' : '友谊指数'}
            </span>
            <span className="text-base sm:text-lg font-serif font-semibold text-zinc-900">
              {result.friendshipScore} {isEn ? 'pts' : '分'}
            </span>
          </div>
          <div className="p-3.5 rounded-sm bg-zinc-50 border border-zinc-200 text-center">
            <span className="text-[11px] font-medium text-zinc-500 block mb-1">
              {isEn ? 'Career Synergy' : '事业指数'}
            </span>
            <span className="text-base sm:text-lg font-serif font-semibold text-zinc-900">
              {result.workScore} {isEn ? 'pts' : '分'}
            </span>
          </div>
        </div>

        {/* Strengths & Challenges supporting cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-sm bg-zinc-50 border border-zinc-200">
            <h4 className="text-xs font-semibold text-zinc-800 mb-2">
              {isEn ? 'Relationship Strengths' : '默契契合点'}
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600">
              {(isEn ? result.strengthsEn : result.strengthsZh).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-zinc-400 select-none">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-sm bg-zinc-50 border border-zinc-200">
            <h4 className="text-xs font-semibold text-zinc-800 mb-2">
              {isEn ? 'Friction Points & Caution' : '磨砺与注意点'}
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600">
              {(isEn ? result.challengesEn : result.challengesZh).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-zinc-400 select-none">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Harmonization advice */}
        <div className="mt-4 p-4 rounded-sm bg-zinc-50 border border-zinc-200">
          <h4 className="text-xs font-semibold text-zinc-800 mb-1">
            {isEn ? 'Harmonization Advice' : '相处指引'}
          </h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            {isEn ? result.harmonizationTipsEn : result.harmonizationTipsZh}
          </p>
        </div>
      </section>
    </div>
  );
}
