import React from 'react';
import type { Metadata } from 'next';
import { CONTAINER } from '@/components/site/constants';
import { PricingCards } from '@/components/site/PricingCards';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd, buildLocalizedMetadata } from '@/lib/seo/metadata';

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
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return buildLocalizedMetadata({
    lang,
    routePath: '/pricing',
    title: isEn
      ? 'Points & Membership Plans - Deep AI Readings'
      : '积分与会员方案｜AI 深度占卜与多轮追问权益',
    description: isEn
      ? 'Purchase YiTatro points or redeem an official code for deep AI hexagram, BaZi, and tarot readings with multi-turn follow-up.'
      : '查看 YiTatro 积分套餐与兑换方式，解锁 AI 深度六爻解卦、八字详批、塔罗牌阵追问与视觉识卦权益。',
    keywords: isEn
      ? ['YiTatro pricing', 'Tarot points', 'AI divination membership']
      : ['YiTatro 价格', '积分购买', '会员方案', 'AI占卜积分']
  });
}

export default async function PricingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const breadcrumb = buildBreadcrumbJsonLd(lang, [
    { name: isEn ? 'Pricing' : '会员与积分', path: '/pricing' }
  ]);

  return (
    <div className="w-full">
      <JsonLd data={breadcrumb} />
      <section className={`${CONTAINER} pb-16 pt-16 sm:pt-24 lg:pb-24 lg:pt-[136px]`}>
        <div className="mkt-rise">
          <p className="font-display text-[11px] tracking-[0.32em] text-whisper sm:text-[12px]">
            POINTS
          </p>
          <h1 className="mt-4 font-serif text-[clamp(30px,4vw,52px)] font-normal leading-[1.1] tracking-[-0.01em] text-ink">
            {isEn ? 'Buy points' : '购买积分'}
          </h1>
          <p className="mt-6 max-w-[56ch] text-[15px] leading-[1.7] text-soft">
            {isEn
              ? 'Choose a payment region to see its currency and checkout options. You can also redeem an official code.'
              : '选择支付地区，查看对应币种与结算方式。已有官方兑换码也可直接兑换。'}
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
