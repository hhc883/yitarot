import React from 'react';
import { BaziChartGsap } from '@/components/fatemaster/BaziChartGsap';
import { Compass, Sparkles } from 'lucide-react';

export default function FateMasterBaziPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 sm:py-16">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE59A]/40 text-[#8C6D23] border border-[#E8CF86]/50 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" /> 四柱八字排盘
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#111111]">
          四柱八字 · 天赋原局与五行全息图谱
        </h1>
        <p className="text-xs sm:text-sm text-[#736B5E] mt-2 max-w-lg mx-auto">
          严格依据农历/公历二十四节气换月柱，推演天干地支、十神生克、五行能量雷达及日主元神特质。
        </p>
      </div>

      <BaziChartGsap />
    </div>
  );
}
