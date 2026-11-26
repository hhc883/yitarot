import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { MeihuaDecisionWidget } from '@/components/east/MeihuaDecisionWidget';
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
    alternates: buildPageAlternates(lang, '/east/meihua'),
  };
}

function MeihuaContent({ lang }: { lang: string }) {
  return <MeihuaDecisionWidget lang={lang} />;
}

export default async function MeihuaDailyDecisionPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#736B5E] animate-pulse">
            正在感应时空心易气场...
          </div>
        }
      >
        <MeihuaContent lang={lang} />
      </Suspense>
    </div>
  );
}
