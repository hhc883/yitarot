import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { MeihuaDecisionWidget } from '@/components/east/MeihuaDecisionWidget';
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
    routePath: '/east/meihua',
    title: isEn
      ? 'Plum Blossom I Ching (Meihua Yishu) - Spontaneous Decision Oracle'
      : '梅花易数起卦｜先天心易神数·体用生克·邵雍经典卦案对照',
    description: isEn
      ? 'Cast a spontaneous Plum Blossom I Ching (Meihua Yishu) hexagram by time or numbers, analyzing Ti-Yong five-element dynamics and classical Shao Yong cases.'
      : '依据《梅花易数》先天心易法式起卦，支持时间起卦与报数起卦，精准推演体用生克、互卦变卦，并自动对照邵康节宗师经典卦案。',
    keywords: isEn
      ? ['Meihua Yishu', 'Plum Blossom I Ching', 'Shao Yong divination', 'Ti Yong hexagram']
      : ['梅花易数', '梅花易数起卦', '先天八卦', '体用生克', '邵雍卦例']
  });
}

function MeihuaContent({ lang }: { lang: string }) {
  return <MeihuaDecisionWidget lang={lang} />;
}

export default async function MeihuaPage({
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
      { name: isEn ? 'Plum Blossom I Ching' : '梅花易数', path: '/east/meihua' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/east/meihua',
      name: isEn ? 'Meihua Yishu Plum Blossom Oracle' : 'YiTatro 梅花易数决策起卦',
      description: isEn
        ? 'Spontaneous Plum Blossom I Ching oracle based on Shao Yong classical methods.'
        : '基于《梅花易数》体用生克的在线起卦与决策工具。'
    })
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <JsonLd data={structuredData} />
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-zinc-500 animate-pulse">
            {isEn ? 'Synchronizing divination state...' : '正在排定卦象气场...'}
          </div>
        }
      >
        <MeihuaContent lang={lang} />
      </Suspense>
    </div>
  );
}
