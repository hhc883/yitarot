'use client';

import React, { useState } from 'react';
import { ZODIAC_SIGNS, getZodiacCompatibility } from '@/lib/metaphysics/compatibility';

export function ZodiacCompatibilityWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const [signAId, setSignAId] = useState<string>('dragon');
  const [signBId, setSignBId] = useState<string>('rooster');

  const result = getZodiacCompatibility(signAId, signBId);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111]">
          {isEn ? 'Chinese Zodiac Compatibility' : '十二生肖配对'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-1.5 max-w-lg mx-auto">
          {isEn
            ? 'Calculates Six Harmonies, Three Triads, and Clashes to evaluate emotional resonance, mutual trust, and relational dynamics.'
            : '推演天作六合、三合生财与相冲磨砺，评估两人的性格共振、信任指数与相处契约。'}
        </p>
      </div>

      {/* 选择两人生肖 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
          <div>
            <label className="block text-xs font-serif font-bold text-[#111111] mb-2">
              {isEn ? 'First Zodiac' : '一方生肖'}
            </label>
            <select
              value={signAId}
              onChange={e => setSignAId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-xs sm:text-sm text-[#111111]"
            >
              {ZODIAC_SIGNS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {isEn ? `${s.nameEn} (${s.element})` : `${s.nameZh}（五行属${s.elementZh}）`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-serif font-bold text-[#111111] mb-2">
              {isEn ? 'Second Zodiac' : '另一方生肖'}
            </label>
            <select
              value={signBId}
              onChange={e => setSignBId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-xs sm:text-sm text-[#111111]"
            >
              {ZODIAC_SIGNS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {isEn ? `${s.nameEn} (${s.element})` : `${s.nameZh}（五行属${s.elementZh}）`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 结果呈现 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#111111]/6 pb-4 mb-5">
          <div>
            <span className="text-[11px] font-serif text-[#736B5E] block">
              {isEn ? 'Compatibility Verdict' : '配对定语'}
            </span>
            <h3 className="font-serif font-black text-2xl text-[#111111] mt-0.5">
              {isEn ? result.verdictEn : result.verdictZh}
            </h3>
            <p className="text-xs font-serif text-[#524B40] mt-1">
              {isEn ? result.dynamicEn : result.dynamicZh}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-serif text-[#736B5E] block">
              {isEn ? 'Overall Score' : '综合契合度'}
            </span>
            <div className="font-serif font-black text-4xl text-[#8C6D23]">
              {result.overallScore} <span className="text-xs text-[#736B5E] font-normal">{isEn ? 'pts' : '/ 100'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#FAF6ED] text-center border border-[#111111]/5">
            <span className="text-[11px] font-serif text-[#736B5E] block mb-1">
              {isEn ? 'Romance' : '恋爱指数'}
            </span>
            <span className="text-sm font-serif font-bold text-[#111111]">
              {result.romanceScore} {isEn ? 'pts' : '分'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF6ED] text-center border border-[#111111]/5">
            <span className="text-[11px] font-serif text-[#736B5E] block mb-1">
              {isEn ? 'Friendship' : '友谊指数'}
            </span>
            <span className="text-sm font-serif font-bold text-[#111111]">
              {result.friendshipScore} {isEn ? 'pts' : '分'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF6ED] text-center border border-[#111111]/5">
            <span className="text-[11px] font-serif text-[#736B5E] block mb-1">
              {isEn ? 'Career Synergy' : '事业指数'}
            </span>
            <span className="text-sm font-serif font-bold text-[#111111]">
              {result.workScore} {isEn ? 'pts' : '分'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}