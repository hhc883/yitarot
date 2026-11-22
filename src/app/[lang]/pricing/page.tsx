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
          <p className="mt-6 max-w-[56ch] text-[15px] leading-[1.7] text-soft">
            {lang === 'en'
              ? '10 points per deep AI reading, 2 points per follow-up inquiry. Seamless checkout via Stripe, Visa, Mastercard, WeChat Pay, and Alipay. Points never expire.'
              : '每次 AI 完整解卦推演消耗 10 积分，追问仅需 2 积分。双轨通道支持微信支付、支付宝扫码与海外 Stripe / 国际信用卡，积分长期有效。'}
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
