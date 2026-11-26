import React from 'react';
import { BaziChartGsap } from '@/components/east/BaziChartGsap';

import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo/metadata';

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
    title: isEn ? 'BaZi Birth Chart Calculator' : '四柱八字排盘｜精准节气换柱与五行分析',
    description: isEn ? 'Calculate your Four Pillars of Destiny (BaZi) birth chart.' : '依据农历与二十四节气精准排定四柱八字命盘。'
  });
}

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function BaziCalculatePage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <BaziChartGsap lang={lang} />
    </div>
  );
}