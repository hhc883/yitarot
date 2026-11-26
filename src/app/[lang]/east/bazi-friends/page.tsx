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
    type: 'friends',
    titleZh: '朋友八字合盘｜挚友默契与同行能量',
    titleEn: 'BaZi Friendship Compatibility',
    descZh: '从日主五行与地支关系洞察朋友之间的信任基础与相处之道。',
    descEn: 'Understand friendship dynamics and mutual support through BaZi.'
  });
}

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function BaziFriendsPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <RelationshipSynastryWidget initialType="friends" lang={lang} />
    </div>
  );
}
