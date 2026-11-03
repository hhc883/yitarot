'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ZODIAC_SIGNS, getZodiacCompatibility } from '@/lib/metaphysics/compatibility';
import { HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';

export default function FateMasterCompatibilityPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'zh';

  const [signAId, setSignAId] = useState<string>('dragon');
  const [signBId, setSignBId] = useState<string>('rooster');

  const result = getZodiacCompatibility(signAId, signBId);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 sm:py-16">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold mb-3">
          <HeartHandshake className="w-3.5 h-3.5" /> 生肖与五行合盘
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#111111]">
          十二生肖 · 情感婚配与事业合盘
        </h1>
        <p className="text-xs sm:text-sm text-[#736B5E] mt-2 max-w-lg mx-auto">
          推演天作六合、三合生财与相冲磨砺，评估两人的性格共振、信任指数与相处契约。
        </p>
      </div>

      {/* 选择两人生肖 */}
      <div className="w-full rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-6 sm:p-8 shadow-xs mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* 方 A */}
          <div>
            <label className="block text-xs font-bold text-[#111111] mb-2">你的生肖</label>
            <select
              value={signAId}
              onChange={e => setSignAId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#FAF6ED] ring-1 ring-[#111111]/10 text-xs sm:text-sm text-[#111111]"
            >
              {ZODIAC_SIGNS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {s.nameZh}（五行属{s.elementZh}）
                </option>
              ))}
            </select>
          </div>

          {/* 方 B */}
          <div>
            <label className="block text-xs font-bold text-[#111111] mb-2">对方的生肖</label>
            <select
              value={signBId}
              onChange={e => setSignBId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#FAF6ED] ring-1 ring-[#111111]/10 text-xs sm:text-sm text-[#111111]"
            >
              {ZODIAC_SIGNS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {s.nameZh}（五行属{s.elementZh}）
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 合盘得分卡片 */}
      <div className="w-full rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-6 sm:p-10 shadow-xs text-center">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FFE59A]/40 text-[#8C6D23] mb-4">
          {result.verdictZh}
        </div>

        <h3 className="font-serif font-black text-3xl sm:text-4xl text-[#111111] mb-2">
          {result.signA.emoji} {result.signA.nameZh} × {result.signB.emoji} {result.signB.nameZh}
        </h3>

        <div className="flex justify-center items-baseline gap-1 my-4">
          <span className="font-serif font-black text-6xl text-[#8C6D23]">{result.overallScore}</span>
          <span className="text-xs text-[#736B5E]">/ 100 分</span>
        </div>

        {/* 四维雷达分 */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto my-6 text-xs">
          <div className="p-3 rounded-2xl bg-[#FAF6ED] ring-1 ring-[#111111]/5">
            <span className="text-[#736B5E] block mb-1">恋爱吸引</span>
            <span className="font-bold text-base text-[#111111]">{result.romanceScore}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF6ED] ring-1 ring-[#111111]/5">
            <span className="text-[#736B5E] block mb-1">事业协作</span>
            <span className="font-bold text-base text-[#111111]">{result.workScore}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF6ED] ring-1 ring-[#111111]/5">
            <span className="text-[#736B5E] block mb-1">友谊信任</span>
            <span className="font-bold text-base text-[#111111]">{result.friendshipScore}%</span>
          </div>
        </div>

        {/* 详细解读 */}
        <div className="max-w-2xl mx-auto text-left text-xs sm:text-sm text-[#5C5549] leading-relaxed space-y-4 pt-6 border-t border-[#111111]/8">
          <p>
            <strong className="text-[#111111]">【能量交融】：</strong>
            {result.dynamicZh}
          </p>
          <p>
            <strong className="text-[#111111]">【相处建议】：</strong>
            {result.harmonizationTipsZh}
          </p>
        </div>
      </div>
    </div>
  );
}
