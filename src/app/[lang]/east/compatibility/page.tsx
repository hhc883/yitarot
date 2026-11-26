import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ZodiacCompatibilityWidget } from '@/components/east/ZodiacCompatibilityWidget';
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
    routePath: '/east/compatibility',
    title: isEn
      ? 'Chinese Zodiac Compatibility - 144 Branch & Five Elements Matrix'
      : '生肖干支合盘｜144 组地支六合·三合·相冲相刑配对分析',
    description: isEn
      ? 'Explore all 144 Chinese zodiac pairwise combinations with Earthly Branch harmonies, clashes, Five Elements balance, and relationship guidance.'
      : '涵盖 144 组十二生肖干支配对，精准推演地支六合、三合、六冲、相刑、相害与五行纳音生克，洞察情感与合作默契。',
    keywords: isEn
      ? ['Chinese zodiac compatibility', '144 zodiac pairs', 'Earthly branch harmony']
      : ['生肖配对', '生肖合盘', '属相合不合', '地支六合六冲']
  });
}

export default async function EastCompatibilityPage({
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
      { name: isEn ? 'Zodiac Compatibility' : '生肖合盘', path: '/east/compatibility' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/east/compatibility',
      name: isEn ? 'Chinese Zodiac Compatibility' : 'YiTatro 生肖干支合盘',
      description: isEn
        ? '144 pairwise Chinese zodiac compatibility analyzer.'
        : '144 组生肖干支五行配对分析工具。'
    })
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 sm:py-16">
      <JsonLd data={structuredData} />
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-zinc-500 animate-pulse">
            {isEn ? 'Loading zodiac compatibility...' : '正在载入生肖配对...'}
          </div>
        }
      >
        <ZodiacCompatibilityWidget lang={lang} />
      </Suspense>
    </div>
  );
}
