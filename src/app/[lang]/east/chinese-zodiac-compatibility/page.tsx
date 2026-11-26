import React, { Suspense } from 'react';
import { ZodiacCompatibilityWidget } from '@/components/east/ZodiacCompatibilityWidget';

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
    routePath: '/east/compatibility',
    title: isEn ? 'Chinese Zodiac Compatibility' : '生肖干支合盘｜144 组配对分析',
    description: isEn ? '144 Chinese zodiac pairwise combinations and Five Elements synastry.' : '144 组十二生肖干支六合六冲与五行纳音配对分析。'
  });
}

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function ChineseZodiacCompatibilityPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 sm:py-16">
      <Suspense fallback={<div className="py-20 text-center text-xs text-[#736B5E] animate-pulse">正在载入生肖配对...</div>}>
        <ZodiacCompatibilityWidget lang={lang} />
      </Suspense>
    </div>
  );
}
