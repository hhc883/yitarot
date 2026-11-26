import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { SeasonalSpreadWidget } from '@/components/tarot/SeasonalSpreadWidget';
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
    routePath: '/fortune/seasonal',
    title: isEn
      ? 'Seasonal Solstice Tarot Spread - Quarterly Energy Alignment'
      : '四季节气塔罗牌阵｜春分夏至秋分冬至季度能量指引',
    description: isEn
      ? 'Align with the turning of the seasons through a dedicated equinox and solstice tarot spread for quarterly clarity.'
      : '顺应二分二至节气转折，抽取四季塔罗牌阵，洞察季度重心转移与内在节律调频。',
    keywords: isEn
      ? ['Seasonal tarot spread', 'Solstice tarot', 'Quarterly tarot reading']
      : ['四季塔罗', '季度运势塔罗', '节气牌阵']
  });
}

export default async function SeasonalFortunePage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const structuredData = [
    buildBreadcrumbJsonLd(lang, [
      { name: isEn ? 'Tarot' : '塔罗专厅', path: '/west' },
      { name: isEn ? 'Seasonal Tarot' : '四季塔罗', path: '/fortune/seasonal' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/fortune/seasonal',
      name: isEn ? 'Seasonal Tarot Spread' : 'YiTatro 四季塔罗牌阵',
      description: isEn ? 'Seasonal tarot spread.' : '四季节气季度能量推演牌阵。'
    })
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <JsonLd data={structuredData} />
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#52525B] animate-pulse">
            {isEn ? 'Loading Seasonal Solstice Spread...' : '加载四季牌阵...'}
          </div>
        }
      >
        <SeasonalSpreadWidget lang={lang} />
      </Suspense>
    </div>
  );
}
