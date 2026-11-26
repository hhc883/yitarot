import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { WeeklyTarotWidget } from '@/components/tarot/WeeklyTarotWidget';
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
    routePath: '/fortune/weekly',
    title: isEn
      ? 'Weekly Tarot Spread - 5-Card Outlook for Work, Love & Finances'
      : '每周塔罗运势｜五张牌梳理本周主题·事业·关系与财务方向',
    description: isEn
      ? 'Draw five tarot cards to reflect on the week ahead across overall theme, work, relationships, finances, and your next actionable step.'
      : '抽取五张塔罗牌，全面梳理未来一周的核心主题、工作节奏、人际关系、财务能量与可执行行动方向。',
    keywords: isEn
      ? ['Weekly tarot', 'Weekly horoscope tarot', '5 card tarot spread']
      : ['每周塔罗', '本周运势塔罗', '周运占卜', '五张牌阵']
  });
}

export default async function WeeklyFortunePage({
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
      { name: isEn ? 'Weekly Tarot' : '每周塔罗', path: '/fortune/weekly' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/fortune/weekly',
      name: isEn ? 'Weekly Tarot Spread' : 'YiTatro 每周塔罗',
      description: isEn
        ? 'Five-card weekly tarot outlook.'
        : '五张牌每周运势与行动规划牌阵。'
    })
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 text-neutral-900 sm:px-6 sm:py-12 lg:py-16">
      <JsonLd data={structuredData} />
      <Link
        href={`/${lang}/west`}
        className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
      >
        <span aria-hidden="true">←</span>
        {isEn ? 'Back to Tarot' : '返回塔罗专厅'}
      </Link>
      <div className="mb-8 mt-3 max-w-2xl sm:mb-10">
        <h1 className="font-serif text-[30px] font-semibold leading-tight tracking-tight sm:text-[40px]">
          {isEn ? 'Weekly Tarot' : '每周塔罗'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          {isEn
            ? 'Explore five cards for the week ahead, from work and relationships to the next step you can take.'
            : '用五张牌梳理接下来一周的整体主题、工作、关系、财务和行动方向。'}
        </p>
      </div>
      <Suspense
        fallback={
          <p role="status" className="border-t border-neutral-200 py-6 text-neutral-600">
            {isEn ? 'Loading the spread…' : '正在载入牌阵…'}
          </p>
        }
      >
        <WeeklyTarotWidget lang={lang} />
      </Suspense>
    </div>
  );
}
