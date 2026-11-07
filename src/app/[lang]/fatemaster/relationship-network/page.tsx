import React from 'react';
import { RelationshipNetworkWidget } from '@/components/fatemaster/RelationshipNetworkWidget';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function RelationshipNetworkPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <RelationshipNetworkWidget lang={lang} />
    </div>
  );
}
