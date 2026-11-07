import React, { Suspense } from 'react';
import { ReadingConsole } from '@/components/tarot/ReadingConsole';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function ReadingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#736B5E] animate-pulse">
            {lang === 'en' ? 'Loading oracle...' : '正在载入神谕牌阵...'}
          </div>
        }
      >
        <ReadingConsole defaultCategory="love" lang={lang} />
      </Suspense>
    </div>
  );
}
