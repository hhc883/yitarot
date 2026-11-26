import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { DailyTarotWidget } from '@/components/tarot/DailyTarotWidget';
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
    path: '/fortune/daily',
    zh: {
      title: '每日一牌｜今日塔罗运势与静心指引',
      description: '每日抽取专属塔罗原型卡牌，查看今日正逆位牌义、顺势建议与暮色静心提问。',
      keywords: ['每日一牌', '每日塔罗', '今日塔罗运势', '晨间神谕', 'YiTatro'],
    },
    en: {
      title: 'Daily Tarot Card - Today’s Free Tarot Reading',
      description: 'Reveal your daily tarot card for today with upright or reversed meaning, practical guidance, and a mindful reflection prompt.',
      keywords: ['Daily tarot card', 'Daily tarot reading', 'Card of the day', 'Free daily tarot', 'Today tarot card', 'YiTatro'],
    },
  });
}

export default async function DailyFortunePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <Suspense
        fallback={
          <div className="w-full max-w-3xl mx-auto px-2 sm:px-0">
            <header className="text-center mb-8">
              <span className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">
                {isEn ? 'DAILY TAROT' : '今日灵感'}
              </span>
              <h1 className="font-serif font-black text-2xl sm:text-3xl text-black tracking-tight">
                {isEn ? 'Daily Tarot Card' : '每日塔罗运势'}
              </h1>
              <p className="text-xs sm:text-sm font-serif text-neutral-600 mt-2 max-w-md mx-auto">
                {isEn
                  ? 'Draw your morning archetype card to attune to the energetic flow of today.'
                  : '清晨抽取专属原型卡牌，倾听当下心智的能量流动与行动指引。'}
              </p>
            </header>
            <div className="py-12 text-center text-xs font-serif text-neutral-500">
              {isEn ? 'Loading daily draw...' : '加载今日牌阵...'}
            </div>
          </div>
        }
      >
        <DailyTarotWidget lang={lang} />
      </Suspense>
    </div>
  );
}
