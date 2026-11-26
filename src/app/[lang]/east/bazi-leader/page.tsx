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
    type: 'leader',
    titleZh: '上下级职场八字合盘｜合作沟通与协同',
    titleEn: 'BaZi Workplace & Leadership Synastry',
    descZh: '分析上下级、导师与下属之间的五行气场适配与沟通节奏。',
    descEn: 'Analyze workplace collaboration and leadership alignment with BaZi.'
  });
}

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function BaziLeaderPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <RelationshipSynastryWidget initialType="leader" lang={lang} />
    </div>
  );
}
