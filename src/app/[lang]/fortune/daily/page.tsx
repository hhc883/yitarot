import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { DailyTarotWidget } from '@/components/tarot/DailyTarotWidget';
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
    routePath: '/fortune/daily',
    title: isEn
      ? 'Daily Tarot Card - Free Morning Energy & Mindfulness Draw'
      : '每日一牌｜今日塔罗运势·晨间心境指引与行动觉察',
    description: isEn
      ? 'Draw your free daily tarot card each morning for clarity, mindful awareness, and grounded daily guidance.'
      : '每日晨起抽取一张专属今日塔罗牌，洞察今日核心能量原型、潜在提醒与清醒行动建议。',
    keywords: isEn
      ? ['Daily tarot card', 'Free daily tarot', 'Today tarot reading', 'Morning tarot']
      : ['每日一牌', '今日塔罗运势', '每日塔罗占卜', '免费抽塔罗']
  });
}

export default async function DailyFortunePage({
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
      { name: isEn ? 'Daily Card' : '每日一牌', path: '/fortune/daily' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/fortune/daily',
      name: isEn ? 'Daily Tarot Card' : 'YiTatro 每日一牌',
      description: isEn
        ? 'Free daily single-card tarot draw for mindfulness.'
        : '免费每日一牌塔罗晨间能量指引工具。'
    })
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <JsonLd data={structuredData} />
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-neutral-500">
            {isEn ? 'Loading daily draw...' : '加载今日牌阵...'}
          </div>
        }
      >
        <DailyTarotWidget lang={lang} />
      </Suspense>
    </div>
  );
}
