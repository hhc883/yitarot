import React from 'react';
import { CoinTossGsap } from '@/components/fatemaster/CoinTossGsap';
import { Sparkles } from 'lucide-react';

export default function FateMasterLiuYaoPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 sm:py-16">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 周易六爻神谕
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#111111]">
          乾隆通宝 3D 铜钱起卦 · 周易六十四卦
        </h1>
        <p className="text-xs sm:text-sm text-[#736B5E] mt-2 max-w-lg mx-auto">
          铜钱六掷，自下而上筑就卦爻。感应初爻至上爻之变动，由 AI 依据卦爻辞给出客观长远的行动策略。
        </p>
      </div>

      <CoinTossGsap />
    </div>
  );
}
