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
    type: 'best-friends',
    titleZh: '闺蜜八字合盘｜深层共鸣与长久陪伴',
    titleEn: 'BaZi Best Friends Synastry',
    descZh: '探索挚友闺蜜之间的灵魂共振、情绪支持与长久相处之道。',
    descEn: 'Explore deep emotional resonance and loyalty between best friends.'
  });
}

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function BaziBestFriendsPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <RelationshipSynastryWidget initialType="best-friends" lang={lang} />
    </div>
  );
}
