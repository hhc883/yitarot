import React, { Suspense } from 'react';
import { FreeDrawConsole } from '@/components/tarot/FreeDrawConsole';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function DrawPage({
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
            加载牌库中...
          </div>
        }
      >
        <FreeDrawConsole lang={lang} />
      </Suspense>
    </div>
  );
}
