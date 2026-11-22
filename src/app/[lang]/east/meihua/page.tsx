import React, { Suspense } from 'react';
import { MeihuaDecisionWidget } from '@/components/east/MeihuaDecisionWidget';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

function MeihuaContent({ lang }: { lang: string }) {
  return <MeihuaDecisionWidget lang={lang} />;
}

export default async function MeihuaPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-zinc-500 animate-pulse">
            {lang === 'en' ? 'Synchronizing divination state...' : '正在排定卦象气场...'}
          </div>
        }
      >
        <MeihuaContent lang={lang} />
      </Suspense>
    </div>
  );
}
