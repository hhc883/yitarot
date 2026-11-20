import React, { Suspense } from 'react';
import { FreeDrawConsole } from '@/components/tarot/FreeDrawConsole';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function DrawPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 md:py-16 text-[#171717]">
      <Suspense
        fallback={
          <div className="py-20 text-center text-[13px] text-[#52525B] animate-pulse">
            {lang === 'en' ? 'Loading deck...' : '加载牌库中...'}
          </div>
        }
      >
        <DrawConsoleContent lang={lang} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function DrawConsoleContent({
  lang,
  searchParams,
}: {
  lang: string;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const countParam = resolvedSearchParams?.count;
  const initialCount = countParam === '1' ? 1 : 3;

  return <FreeDrawConsole key={initialCount} lang={lang} initialCount={initialCount} />;
}
