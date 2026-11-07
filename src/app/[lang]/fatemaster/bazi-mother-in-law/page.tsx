import React from 'react';
import { RelationshipSynastryWidget } from '@/components/fatemaster/RelationshipSynastryWidget';

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
