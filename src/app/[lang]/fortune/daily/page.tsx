import React, { Suspense } from 'react';
import { DailyTarotWidget } from '@/components/tarot/DailyTarotWidget';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function DailyFortunePage({
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
          <div className="py-20 text-center text-xs font-serif text-neutral-500">
            {lang === 'en' ? 'Loading daily draw...' : '加载今日牌阵...'}
          </div>
        }
      >
        <DailyTarotWidget lang={lang} />
      </Suspense>
    </div>
  );
}
