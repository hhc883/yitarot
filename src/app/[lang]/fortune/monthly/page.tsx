import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { MonthlyTarotWidget } from '@/components/tarot/MonthlyTarotWidget';
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
    routePath: '/fortune/monthly',
    title: isEn
      ? 'Monthly Tarot Forecast - Lunar Cycle & Opportunity Spread'
      : '每月塔罗运势｜月度能量主轴·机遇与挑战牌阵',
    description: isEn
      ? 'Draw a monthly tarot spread to map upcoming opportunities, emotional shifts, and key focus areas for the month ahead.'
      : '通过月度塔罗牌阵梳理本月能量主旋律、事业机遇、感情动向与避坑提醒。',
    keywords: isEn
      ? ['Monthly tarot', 'Monthly forecast tarot', 'Tarot spread']
      : ['每月塔罗', '月度运势占卜', '本月塔罗牌阵']
  });
}

export default async function MonthlyFortunePage({
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
      { name: isEn ? 'Monthly Tarot' : '每月塔罗', path: '/fortune/monthly' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/fortune/monthly',
      name: isEn ? 'Monthly Tarot Forecast' : 'YiTatro 每月塔罗',
      description: isEn ? 'Monthly tarot spread forecast.' : '月度塔罗运势与主轴推演工具。'
    })
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <JsonLd data={structuredData} />
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#52525B] animate-pulse">
            {isEn ? 'Loading Monthly Tarot Projection...' : '加载月运推演...'}
          </div>
        }
      >
        <MonthlyTarotWidget lang={lang} />
      </Suspense>
    </div>
  );
}
