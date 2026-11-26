import React from 'react';
import type { Metadata } from 'next';
import { CardsEncyclopediaClient } from '@/components/tarot/CardsEncyclopediaClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd, buildLocalizedMetadata, SITE_URL } from '@/lib/seo/metadata';

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
    routePath: '/cards',
    title: isEn
      ? '78 Tarot Card Meanings Encyclopedia - Upright, Reversed & Symbolism'
      : '78 张塔罗牌义百科大全｜正逆位详解·爱情与事业指引',
    description: isEn
      ? 'Complete Rider-Waite tarot encyclopedia covering 22 Major Arcana and 56 Minor Arcana. Explore upright and reversed meanings, love, career, and archetypes.'
      : '涵盖 22 张大阿卡纳与 56 张小阿卡纳的完整韦特塔罗牌义库：正位、逆位含义、爱情事业启示与心理学原型象征全解。',
    keywords: isEn
      ? [
          '78 tarot card meanings',
          'Rider-Waite tarot',
          'Major Arcana meanings',
          'Minor Arcana meanings',
          'Tarot encyclopedia'
        ]
      : ['78张塔罗牌义', '韦特塔罗牌义大全', '大阿卡纳', '小阿卡纳', '正逆位牌义', '塔罗百科']
  });
}

export default async function CardsEncyclopediaPage({
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
      { name: isEn ? '78 Card Meanings' : '78 牌义大全', path: '/cards' }
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: isEn ? 'Tarot Card Encyclopedia' : '塔罗牌义百科大全',
      description: isEn
        ? '78 Rider-Waite tarot cards with upright, reversed, love, career, and symbolism interpretations.'
        : '78 张经典韦特塔罗牌义全解，包含正逆位、爱情、事业与原型象征。',
      url: `${SITE_URL}/${lang}/cards`
    }
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <CardsEncyclopediaClient lang={lang} />
    </>
  );
}
