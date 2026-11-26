import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ReadingConsole } from '@/components/tarot/ReadingConsole';
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
    routePath: '/reading',
    title: isEn
      ? 'AI Tarot Reading - Structured Spreads & Archetypal Guidance'
      : 'AI 塔罗深度占卜｜经典牌阵推演·潜意识心理原型解读',
    description: isEn
      ? 'Ask a focused question and receive a structured AI tarot reading grounded in classic Rider-Waite symbolism and Jungian psychology.'
      : '带着具体困惑进入深度塔罗占卜，结合经典韦特象征体系、正逆位能量与荣格心理学原型进行结构化推演与追问。',
    keywords: isEn
      ? ['AI tarot reading', 'Online tarot', 'Celtic Cross reading', 'Tarot guidance']
      : ['AI塔罗占卜', '在线塔罗', '塔罗牌阵解读', '韦特塔罗占卜']
  });
}

export default async function ReadingPage({
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
      { name: isEn ? 'AI Tarot Reading' : 'AI 深度占卜', path: '/reading' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/reading',
      name: isEn ? 'YiTatro AI Tarot Reading' : 'YiTatro AI 塔罗深度占卜',
      description: isEn
        ? 'Structured AI tarot reading with classic spreads.'
        : '结合经典韦特牌阵的 AI 塔罗深度占卜系统。'
    })
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <JsonLd data={structuredData} />
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#736B5E] animate-pulse">
            {isEn ? 'Loading oracle...' : '正在载入神谕牌阵...'}
          </div>
        }
      >
        <ReadingConsole defaultCategory="love" lang={lang} />
      </Suspense>
    </div>
  );
}
