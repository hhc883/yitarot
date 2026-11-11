import React from 'react';
import { CONTAINER } from '@/components/site/constants';
import { PricingCards } from '@/components/site/PricingCards';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function PricingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full">
      <section className={`${CONTAINER} pb-16 pt-16 sm:pt-24 lg:pb-24 lg:pt-[136px]`}>
        <div className="mkt-rise">
          <p className="font-display text-[11px] tracking-[0.32em] text-whisper sm:text-[12px]">
            POINTS
          </p>
          <h1 className="mt-4 font-serif text-[clamp(30px,4vw,52px)] font-normal leading-[1.1] tracking-[-0.01em] text-ink">
            {lang === 'en' ? 'Buy points' : '购买积分'}
          </h1>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.7] text-soft">
            {lang === 'en'
              ? 'Each AI reading costs 10 points. Points never expire while in beta.'
              : '每次 AI 测试消耗 10 积分。测试期间积分长期有效。'}
          </p>
        </div>
      </section>

      <section className="w-full">
        <div className={`${CONTAINER} pb-20 lg:pb-[120px]`}>
          <PricingCards lang={lang} />
        </div>
      </section>
    </div>
  );
}
