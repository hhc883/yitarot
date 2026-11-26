import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { FreeDrawConsole } from '@/components/tarot/FreeDrawConsole';
import { buildBilingualMetadata } from '@/lib/seo/metadata';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return buildBilingualMetadata({
    lang,
    path: '/draw',
    zh: {
      title: '自由抽牌｜1–6 张塔罗自选占卜',
      description: '自由设定抽取 1 至 6 张经典韦特塔罗牌，沉淀当下思绪，映照深层潜意识。',
      keywords: ['自由抽牌', '自选塔罗牌', '1到6张抽牌', '在线塔罗抽取', '潜意识直觉选牌', 'YiTatro 抽牌'],
    },
    en: {
      title: 'Random Tarot Card Generator - Free Online Tarot Deck (1–6 Cards)',
      description: 'Draw 1 to 6 random tarot cards for free from the 78-card online Rider-Waite tarot deck with upright and reversed card meanings.',
      keywords: ['Random tarot card generator', 'Random tarot card', 'Online tarot deck', 'Free tarot draw', '1-6 card spread', 'YiTatro Draw'],
    },
  });
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
  const isEn = lang === 'en';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 md:py-16 text-[#171717]">
      <header className="w-full text-center mb-6">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#171717] tracking-tight">
          {isEn ? 'Random Tarot Card Generator' : '自由抽牌'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#52525B] mt-1.5 max-w-md mx-auto">
          {isEn
            ? 'Free online tarot deck draw. Pick 1 to 6 random tarot cards to explore upright and reversed meanings.'
            : '无需固定牌阵束缚。自由设定抽取 1 至 6 张卡牌，探寻当下潜意识的真实镜像。'}
        </p>
      </header>
      <Suspense
        fallback={
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center animate-pulse">
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
