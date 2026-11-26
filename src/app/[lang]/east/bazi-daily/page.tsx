import Link from 'next/link';
import type { Metadata } from 'next';
import { BaziDailyWidget } from '@/components/east/BaziDailyWidget';
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
    routePath: '/east/bazi-daily',
    title: isEn
      ? 'Daily BaZi Reading - Today’s Pillars & Twelve Two-Hour Periods'
      : '每日八字运势｜今日流日干支宜忌与十二时辰吉凶',
    description: isEn
      ? 'Use your birth date and hour to inspect today’s BaZi daily pillar interaction, favorable activities, and twelve two-hour periods.'
      : '结合个人生辰八字与今日流日干支，查看今日五行生克宜忌与十二时辰能量起伏。',
    keywords: isEn
      ? ['Daily BaZi', 'Chinese daily fortune', 'Twelve hours BaZi']
      : ['每日八字', '今日八字运势', '流日干支', '十二时辰吉凶']
  });
}

export default async function BaziDailyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const structuredData = [
    buildBreadcrumbJsonLd(lang, [
      { name: isEn ? 'I Ching & BaZi' : '东方专厅', path: '/east' },
      { name: isEn ? 'Daily BaZi' : '每日八字', path: '/east/bazi-daily' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/east/bazi-daily',
      name: isEn ? 'Daily BaZi Reading' : 'YiTatro 每日八字',
      description: isEn
        ? 'Daily BaZi reading and twelve two-hour periods.'
        : '每日流日八字与十二时辰推演工具。'
    })
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 text-neutral-900 sm:px-6 sm:py-12 lg:py-16">
      <JsonLd data={structuredData} />
      <Link
        href={`/${lang}/east`}
        className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
      >
        <span aria-hidden="true">←</span>
        {isEn ? 'Back to I Ching & BaZi' : '返回东方专厅'}
      </Link>
      <div className="mb-8 mt-3 max-w-2xl sm:mb-10">
        <h1 className="font-serif text-[30px] font-semibold leading-tight tracking-tight sm:text-[40px]">
          {isEn ? 'Daily BaZi' : '每日八字'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          {isEn
            ? 'Use your birth date and hour to explore a daily BaZi reading and its twelve time periods.'
            : '用出生日期和小时，查看今日八字与十二时辰的解读。'}
        </p>
      </div>
      <BaziDailyWidget lang={lang} />
    </div>
  );
}
