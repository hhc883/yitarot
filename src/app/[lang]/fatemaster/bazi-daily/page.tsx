import React, { Suspense } from 'react';
import { BaziDailyWidget } from '@/components/fatemaster/BaziDailyWidget';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

function BaziDailyContent({ lang }: { lang: string }) {
  return <BaziDailyWidget lang={lang} />;
}

export default async function BaziDailyPage({
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
            正在推演今日八字气场...
          </div>
        }
      >
        <BaziDailyContent lang={lang} />
      </Suspense>
    </div>
  );
}
