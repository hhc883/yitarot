import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { LiuYaoContainer } from '@/components/east/LiuYaoContainer';
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
    routePath: '/east/liuyao',
    title: isEn
      ? 'I Ching Liu Yao Coin Oracle & AI Hexagram Vision Reading'
      : '周易六爻起卦｜铜钱摇卦·动爻变卦·古籍典法 AI 解卦',
    description: isEn
      ? 'Cast three ancient coins six times or upload a hexagram screenshot for AI vision recognition. Grounded in classical I Ching canons Zengshan Buyi and Bushi Quanshu.'
      : '传统乾隆通宝六次掷币起卦，支持 AI 视觉识别排盘截图。深度锚定《增删卜易》《卜筮全书》《京氏易传》古籍通则，给出明确用神推演与应期判断。',
    keywords: isEn
      ? ['I Ching oracle', 'Liu Yao divination', 'Three coin hexagram', 'Hexagram reading', 'Zengshan Buyi']
      : ['周易起卦', '六爻占卜', '在线铜钱摇卦', '增删卜易解卦', '六爻排盘', 'AI识卦']
  });
}

export default async function EastLiuYaoPage({
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
      { name: isEn ? 'Liu Yao Divination' : '周易六爻', path: '/east/liuyao' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/east/liuyao',
      name: isEn ? 'I Ching Liu Yao Coin Oracle' : 'YiTatro 周易六爻起卦与解卦',
      description: isEn
        ? 'Interactive 3D coin toss I Ching Liu Yao divination grounded in classical canons.'
        : '结合 3D 铜钱掷币与古籍典法推理的周易六爻在线起卦系统。'
    })
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-10 pb-16 sm:pt-14 sm:pb-20">
      <JsonLd data={structuredData} />
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-[#171717]">
          {isEn ? 'I Ching Divination & Vision Oracle' : '周易六爻 · 神谕与视觉识卦'}
        </h1>
        <p className="mt-2.5 text-sm sm:text-[15px] leading-relaxed text-[#52525B] max-w-xl mx-auto">
          {isEn
            ? 'Cast three ancient coins or upload a hexagram screenshot to reveal lines, moving pivots, and strategic action counsel.'
            : '静心凝神，掷币六次自下而上筑爻，或上传其他排盘截图让 AI 视觉识卦，感应动爻与卦变转机。'}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#52525B] animate-pulse">
            {isEn ? 'Loading I Ching Sanctuary...' : '正在排定六爻时空象数场...'}
          </div>
        }
      >
        <LiuYaoContainer lang={lang} />
      </Suspense>
    </div>
  );
}
