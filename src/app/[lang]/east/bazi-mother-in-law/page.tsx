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
    type: 'mother-in-law',
    titleZh: '婆媳八字合盘｜家庭边界与相处化解',
    titleEn: 'BaZi Mother-in-Law & Daughter-in-Law Synastry',
    descZh: '剖析婆媳之间的五行气场碰撞点，提供务实温和的边界与沟通建议。',
    descEn: 'Navigate mother-in-law dynamics and household boundaries with BaZi.'
  });
}

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function BaziMotherInLawPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <RelationshipSynastryWidget initialType="mother-in-law" lang={lang} />
    </div>
  );
}
