import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ZodiacCompatibilityWidget } from '@/components/east/ZodiacCompatibilityWidget';
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
    alternates: buildPageAlternates(lang, '/east/compatibility'),
  };
}

export default async function EastCompatibilityPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 sm:py-16">
      <Suspense fallback={<div className="py-20 text-center text-xs text-zinc-500 animate-pulse">{lang === 'en' ? 'Loading zodiac compatibility...' : '正在载入生肖配对...'}</div>}>
        <ZodiacCompatibilityWidget lang={lang} />
      </Suspense>
    </div>
  );
}
