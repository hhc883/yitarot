import React from 'react';
import type { Metadata } from 'next';
import { ZiweiChartWidget } from '@/components/east/ZiweiChartWidget';
import { buildPageAlternates } from '@/lib/seo/metadata';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: buildPageAlternates(lang, '/east/ziwei'),
  };
}

export default async function ZiweiPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 md:py-16 text-[#171717]">
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

      <ZiweiChartWidget lang={lang} />
    </div>
  );
}
