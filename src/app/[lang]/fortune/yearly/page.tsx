import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { YearlyTarotWidget } from '@/components/tarot/YearlyTarotWidget';
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
    routePath: '/fortune/yearly',
    title: isEn
      ? 'Yearly Tarot Forecast - 12-Month Wheel of the Year Spread'
      : '年度塔罗运势｜十二宫年轮牌阵·全年趋势与转折洞察',
    description: isEn
      ? 'Cast the 12-month Wheel of the Year tarot spread to preview themes, milestones, and turning points across the entire year.'
      : '排出十二个月年轮塔罗牌阵，宏观洞察全年各月能量起伏、关键转折节点与年度主轴课题。',
    keywords: isEn
      ? ['Yearly tarot spread', 'Wheel of the year tarot', '12 month tarot']
      : ['年度塔罗', '全年运势塔罗', '十二月年轮牌阵']
  });
}

export default async function YearlyFortunePage({
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
      { name: isEn ? 'Yearly Tarot' : '年度塔罗', path: '/fortune/yearly' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/fortune/yearly',
      name: isEn ? 'Yearly Tarot Forecast' : 'YiTatro 年度塔罗',
      description: isEn ? '12-month Wheel of the Year tarot forecast.' : '十二月年轮年度塔罗牌阵工具。'
    })
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <JsonLd data={structuredData} />
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#52525B] animate-pulse">
            {isEn ? 'Loading Yearly Tarot Outlook...' : '加载年运推演...'}
          </div>
        }
      >
        <YearlyTarotWidget lang={lang} />
      </Suspense>
    </div>
  );
}
