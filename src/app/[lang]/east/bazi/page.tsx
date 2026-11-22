import React from 'react';
import { BaziChartGsap } from '@/components/east/BaziChartGsap';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function EastBaziPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 md:py-16 text-[#171717]">
      <div className="text-center mb-8 sm:mb-10">
        <span className="text-[12px] font-medium tracking-[0.2em] text-[#52525B] uppercase block mb-2">
          {isEn ? 'Eastern Metaphysics' : '东方数术'}
        </span>
        <h1 className="font-serif text-[28px] sm:text-[36px] md:text-[40px] font-normal leading-tight tracking-tight text-[#171717]">
          {isEn ? 'BaZi Birth Chart' : '八字排盘'}
        </h1>
        <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-[#52525B] max-w-xl mx-auto">
          {isEn
            ? 'Calculated precisely by Chinese astronomical calendar and solar terms. Analyzes Heavenly Stems, Earthly Branches, Ten Gods, and Day Master essence.'
            : '严格依据农历与二十四节气换月柱，推演天干地支、十神生克、五行能量及日主元神特质。'}
        </p>
      </div>

      <BaziChartGsap lang={lang} />
    </div>
  );
}
