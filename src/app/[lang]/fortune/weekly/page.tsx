import React, { Suspense } from 'react';
import { WeeklyTarotWidget } from '@/components/tarot/WeeklyTarotWidget';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function WeeklyFortunePage({
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
          <div className="py-20 text-center text-xs font-serif text-[#736B5E] animate-pulse">
            加载周运推演...
          </div>
        }
      >
        <WeeklyTarotWidget lang={lang} />
      </Suspense>
    </div>
  );
}
