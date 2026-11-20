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
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center animate-pulse">
            <div className="w-full text-center mb-6">
              <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
                {lang === 'en' ? 'Free Tarot Draw' : '自由抽牌'}
              </h1>
              <p className="text-xs sm:text-sm font-serif text-[#52525B] mt-1.5 max-w-md mx-auto">
                {lang === 'en'
                  ? 'Select 1 to 6 cards to mirror your present subconscious state.'
                  : '自由设定抽取 1 至 6 张卡牌，探寻当下潜意识的真实镜像。'}
              </p>
            </div>
            <div className="w-full rounded-xl bg-white border border-[#111111]/10 p-4 mb-8 h-16" />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10 justify-items-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-full max-w-[260px] min-h-[440px] p-4 rounded-xl bg-[#FFFDF9] border border-[#111111]/10 flex flex-col items-center justify-between" />
              ))}
            </div>
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
