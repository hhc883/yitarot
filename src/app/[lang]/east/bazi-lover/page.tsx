import React from 'react';
import { RelationshipSynastryWidget } from '@/components/east/RelationshipSynastryWidget';

import type { Metadata } from 'next';
import { buildRelationshipAliasMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  return buildRelationshipAliasMetadata({
    lang,
    type: 'lover',
    titleZh: '恋爱八字合盘｜情感共振与相处走势',
    titleEn: 'BaZi Romantic & Lover Synastry',
    descZh: '解析恋人之间的五行互补、情感吸引与冲突化解之道。',
    descEn: 'Explore romantic resonance, emotional attraction, and harmony in BaZi.'
  });
}

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function BaziLoverPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <RelationshipSynastryWidget initialType="lover" lang={lang} />
    </div>
  );
}
