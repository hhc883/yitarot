import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ZiweiMarriageWidget } from '@/components/east/ZiweiMarriageWidget';
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
    routePath: '/east/ziwei-marriage',
    title: isEn
      ? 'Ziwei Dou Shu Marriage & Spouse Palace Synastry'
      : '紫微斗数合婚｜夫妻宫星曜匹配与婚姻走势分析',
    description: isEn
      ? 'Analyze Ziwei Dou Shu Spouse Palace stars and mutual resonance for marriage compatibility and long-term partnership.'
      : '深度剖析双方紫微斗数夫妻宫主星、四化飞星与相处模式，洞察婚姻契合度与长久经营之道。',
    keywords: isEn
      ? ['Ziwei marriage', 'Spouse palace synastry', 'Ziwei compatibility']
      : ['紫微合婚', '紫微斗数夫妻宫', '婚姻合盘']
  });
}

export default async function ZiweiMarriagePage({
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
      { name: isEn ? 'Ziwei Marriage' : '紫微合婚', path: '/east/ziwei-marriage' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/east/ziwei-marriage',
      name: isEn ? 'Ziwei Marriage Synastry' : 'YiTatro 紫微斗数合婚',
      description: isEn ? 'Ziwei Dou Shu marriage compatibility.' : '紫微斗数夫妻宫合婚分析工具。'
    })
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <JsonLd data={structuredData} />
      <Suspense
        fallback={
          <div className="py-12 text-center text-sm text-[#71717A]">
            {isEn ? 'Loading Ziwei marriage synastry...' : '正在加载紫微合婚...'}
          </div>
        }
      >
        <ZiweiMarriageWidget lang={lang} />
      </Suspense>
    </div>
  );
}
