import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ZiweiChartWidget } from '@/components/east/ZiweiChartWidget';
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
    routePath: '/east/ziwei',
    title: isEn
      ? 'Ziwei Dou Shu Natal Chart - 12 Palaces & 14 Major Stars'
      : '紫微斗数排盘｜十二命宫·十四主星·生年四化在线测算',
    description: isEn
      ? 'Generate your traditional Ziwei Dou Shu star chart from your birth date and hour, mapping all 12 life palaces and 14 major stars.'
      : '输入出生日期与时辰，排出传统紫微斗数十二宫命盘，查看命宫、财帛、官禄、夫妻等十二宫主星与四化星曜格局。',
    keywords: isEn
      ? ['Ziwei Dou Shu', 'Purple Star Astrology', '12 Palaces', 'Chinese birth chart']
      : ['紫微斗数', '紫微斗数排盘', '十二命宫', '十四主星', '生年四化']
  });
}

export default async function ZiweiPage({
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
      { name: isEn ? 'Ziwei Dou Shu' : '紫微斗数', path: '/east/ziwei' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/east/ziwei',
      name: isEn ? 'Ziwei Dou Shu Natal Chart' : 'YiTatro 紫微斗数排盘',
      description: isEn
        ? 'Traditional Ziwei Dou Shu natal star chart mapping 12 palaces.'
        : '传统紫微斗数十二宫与主星在线排盘工具。'
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
          {isEn ? 'Ziwei Dou Shu Natal Chart' : '紫微斗数排盘'}
        </h1>
        <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-[#52525B] max-w-xl mx-auto">
          {isEn
            ? 'Enter your birth date and hour to explore your chart and its twelve palaces.'
            : '输入出生日期和小时，查看命盘和十二宫解读。'}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-12 text-center text-sm text-[#71717A]">
            {isEn ? 'Loading Ziwei chart...' : '正在加载紫微斗数排盘...'}
          </div>
        }
      >
        <ZiweiChartWidget lang={lang} />
      </Suspense>
    </div>
  );
}
