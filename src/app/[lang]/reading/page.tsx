import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ReadingConsole } from '@/components/tarot/ReadingConsole';
import { buildBilingualMetadata } from '@/lib/seo/metadata';
import { READING_COST } from '@/lib/points/constants';

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
    path: '/reading',
    zh: {
      title: 'AI 塔罗占卜｜完整牌阵与个性化深度解读',
      description: `输入具体问题并选择塔罗牌阵，登录后消耗 ${READING_COST} 积分获取 AI 个性化塔罗深度解读与心灵指引。`,
      keywords: ['AI塔罗', 'AI塔罗占卜', '塔罗完整解读', '塔罗牌阵', '在线塔罗', 'YiTatro'],
    },
    en: {
      title: 'AI Tarot Reading - Personalized Spread Analysis',
      description: `Ask a question, pick a classic spread, and draw cards for personalized AI tarot analysis. Sign-in required (${READING_COST} points per reading).`,
      keywords: ['AI tarot reading', 'AI tarot', 'Tarot AI', 'Personalized tarot reading', 'Online tarot spread', 'YiTatro'],
    },
  });
}

export default async function ReadingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <header className="text-center mb-8 max-w-2xl mx-auto">
        <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#171717] tracking-tight">
          {isEn ? 'AI Tarot Reading' : '塔罗完整解读'}
        </h1>
        <p className="text-xs sm:text-sm text-[#52525B] mt-2">
          {isEn
            ? `Clarify your question, pick a spread, and draw cards for personalized AI tarot analysis (sign-in required, ${READING_COST} points per reading).`
            : `凝练心中困惑，选定牌阵与视角，抽牌获取 AI 深度解读（需登录，每次消耗 ${READING_COST} 积分）。`}
        </p>
      </header>
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#52525B] animate-pulse">
            {isEn ? 'Loading AI tarot spread...' : '正在载入神谕牌阵...'}
          </div>
        }
      >
        <ReadingConsole defaultCategory="love" lang={lang} />
      </Suspense>
    </div>
  );
}
