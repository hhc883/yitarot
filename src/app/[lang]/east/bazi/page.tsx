import React from 'react';
import type { Metadata } from 'next';
import { BaziChartGsap } from '@/components/east/BaziChartGsap';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildBreadcrumbJsonLd,
  buildLocalizedMetadata,
  buildWebAppJsonLd
} from '@/lib/seo/metadata';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return buildLocalizedMetadata({
    lang,
    routePath: '/east/bazi',
    title: isEn
      ? 'BaZi Birth Chart Calculator - Four Pillars of Destiny & Five Elements'
      : '四柱八字排盘｜精准节气换柱·十神生克·五行日主分析',
    description: isEn
      ? 'Calculate your Four Pillars of Destiny (BaZi) birth chart using Chinese astronomical solar terms. Analyze Heavenly Stems, Earthly Branches, Ten Gods, and Day Master.'
      : '严格依据农历与二十四节气交节时刻排盘，自动推算年柱、月柱、日柱、时柱、十神关系、五行能量分布与日主元神强弱。',
    keywords: isEn
      ? ['BaZi calculator', 'Four Pillars of Destiny', 'Chinese astrology chart', 'Five Elements', 'Ten Gods']
      : ['八字排盘', '四柱八字', '生辰八字算命', '十神分析', '五行喜用神', '节气换柱']
  });
}

export default async function EastBaziPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const structuredData = [
    buildBreadcrumbJsonLd(lang, [
      { name: isEn ? 'I Ching & BaZi' : '东方专厅', path: '/east' },
      { name: isEn ? 'BaZi Birth Chart' : '八字排盘', path: '/east/bazi' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/east/bazi',
      name: isEn ? 'BaZi Birth Chart Calculator' : 'YiTatro 四柱八字排盘',
      description: isEn
        ? 'Astronomical Four Pillars of Destiny (BaZi) calculator with Ten Gods and Five Elements.'
        : '精准节气换柱的四柱八字在线排盘与五行十神分析工具。'
    })
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 md:py-16 text-[#171717]">
      <JsonLd data={structuredData} />
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
