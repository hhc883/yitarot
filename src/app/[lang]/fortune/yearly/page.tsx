import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { YearlyTarotWidget } from '@/components/tarot/YearlyTarotWidget';
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
    alternates: buildPageAlternates(lang, '/fortune/yearly'),
  };
}

export default async function YearlyFortunePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#52525B] animate-pulse">
            {lang === 'en' ? 'Loading Yearly Tarot Outlook...' : '加载年运推演...'}
          </div>
        }
      >
        <YearlyTarotWidget lang={lang} />
      </Suspense>
    </div>
  );
}
