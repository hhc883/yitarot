import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { FreeDrawConsole } from '@/components/tarot/FreeDrawConsole';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const isEn = rawLang === 'en';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitarot.net';
  const currentLang = isEn ? 'en' : 'zh';

  return {
    title: isEn ? 'Free Tarot Draw (1–6 Cards)' : '自由抽牌｜1–6 张塔罗自选占卜',
    description: isEn
      ? 'Draw 1 to 6 cards freely from the classic 78 Rider-Waite tarot deck to reflect your present subconscious thoughts.'
      : '自由设定抽取 1 至 6 张经典韦特塔罗牌，沉淀当下思绪，映照深层潜意识。',
    keywords: isEn
      ? ['Free tarot draw', '1-6 card spread', 'Online tarot reading', 'Daily tarot card', 'Intuitive card picker', 'YiTatro Draw']
      : ['自由抽牌', '自选塔罗牌', '1到6张抽牌', '在线塔罗抽取', '潜意识直觉选牌', 'YiTatro 抽牌'],
    alternates: {
      canonical: `${siteUrl}/${currentLang}/draw`,
      languages: {
        zh: `${siteUrl}/zh/draw`,
        en: `${siteUrl}/en/draw`,
        'x-default': `${siteUrl}/zh/draw`
      }
    }
  };
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
              <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#171717] tracking-tight">
                {lang === 'en' ? 'Free Tarot Draw' : '自由抽牌'}
              </h1>
              <p className="text-xs sm:text-sm font-serif text-[#52525B] mt-1.5 max-w-md mx-auto">
                {lang === 'en'
                  ? 'Select 1 to 6 cards to mirror your present subconscious state.'
                  : '自由设定抽取 1 至 6 张卡牌，探寻当下潜意识的真实镜像。'}
              </p>
            </div>
            <div className="w-full rounded-xl bg-white border border-[#E4E4E7] p-4 mb-8 h-16" />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10 justify-items-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-full max-w-[260px] min-h-[440px] p-4 rounded-xl bg-white border border-[#E4E4E7] flex flex-col items-center justify-between" />
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
