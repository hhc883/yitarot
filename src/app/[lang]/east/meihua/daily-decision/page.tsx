import React, { Suspense } from 'react';
import { MeihuaDecisionWidget } from '@/components/east/MeihuaDecisionWidget';

import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';
  return buildLocalizedMetadata({
    lang,
    routePath: '/east/meihua',
    title: isEn ? 'Plum Blossom I Ching Decision Oracle' : '梅花易数决策起卦｜体用生克推演',
    description: isEn ? 'Spontaneous Plum Blossom I Ching oracle for daily decisions.' : '依据先天心易神数与体用生克推演每日决策。'
  });
}

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
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
