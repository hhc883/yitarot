import React from 'react';
import type { Metadata } from 'next';
import { RelationshipSynastryWidget } from '@/components/east/RelationshipSynastryWidget';
import { buildPageAlternates } from '@/lib/seo/metadata';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: buildPageAlternates(lang, '/east/relationship/mother-in-law'),
  };
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
