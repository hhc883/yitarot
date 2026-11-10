import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Layers, Sunrise, Heart, MoonStar } from 'lucide-react';
import { CONTAINER } from '@/components/site/constants';
import { FeatureCard } from '@/components/site/FeatureCard';
import { ScrollReveal } from '@/components/site/ScrollReveal';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function WestLandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const cards = [
    {
      href: `/${lang}/reading`,
      icon: Layers,
      titleEn: 'Tarot Reading',
      titleZh: '塔罗占卜',
      desc: 'Personalized readings drawn from classic Rider-Waite symbolism, tailored by AI.',
      action: isEn ? 'Start reading' : '开始占卜'
    },
    {
      href: `/${lang}/fortune/daily`,
      icon: Sunrise,
      titleEn: 'Daily Card',
      titleZh: '每日一牌',
      desc: 'Draw one card for guidance and clarity each day.',
      action: isEn ? 'See today' : '查看今日'
    },
    {
      href: `/${lang}/love`,
      icon: Heart,
      titleEn: 'Love & Career Spreads',
      titleZh: '爱与事业牌阵',
      desc: 'Explore relationships and career paths with multi-card spreads.',
      action: isEn ? 'Open spread' : '进入牌阵'
    },
    {
      href: `/${lang}/love`,
      icon: MoonStar,
      titleEn: 'Zodiac Compatibility',
      titleZh: '星座合盘',
      desc: 'Compare Sun, Moon, and Rising signs for harmony insights.',
      action: isEn ? 'Compare' : '开始合盘'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero：太阳 The Sun 居中 */}
      <section className="w-full">
        <div className={`${CONTAINER} pb-16 pt-24 text-center sm:pt-32 lg:pb-24 lg:pt-[160px]`}>
          <div className="mkt-rise flex flex-col items-center">
            <div className="relative aspect-[2/3] w-[152px] rounded-[14px] border border-line bg-white p-[6px] shadow-[0_28px_60px_-40px_rgba(10,10,10,0.5)] sm:w-[200px]">
              <div className="relative h-full w-full overflow-hidden rounded-[9px] bg-[#FAF6ED]">
                <Image
                  src="/cards/major-arcana/the-sun.webp"
                  alt="The Sun — Rider-Waite tarot card"
                  fill
                  sizes="(max-width: 640px) 148px, 184px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <h1 className="mt-10 font-serif text-[clamp(32px,5vw,64px)] font-normal leading-[1.08] tracking-[-0.015em] text-ink">
              {isEn ? 'Western Tarot' : '西方塔罗'}
              <span className="mt-4 block font-display text-[11px] font-normal tracking-[0.32em] text-whisper sm:text-[12px]">
                {isEn ? '西方塔罗' : 'WESTERN TAROT'}
              </span>
            </h1>

            <p className="mt-8 max-w-[48ch] text-[15px] leading-[1.7] text-soft">
              Ask a question, draw cards, get a clear AI reading.
            </p>

            <Link
              href={`/${lang}/reading`}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[13.5px] text-white transition-opacity hover:opacity-80"
            >
              <span>{isEn ? 'Start a Free Reading' : '开始占卜 Start'}</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 张功能卡 */}
      <section className="w-full">
        <div className={`${CONTAINER} pb-20 pt-12 lg:pb-[120px] lg:pt-16`}>
          <div className="border-t border-line pt-12 lg:pt-16">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {cards.map((card) => (
                <ScrollReveal key={card.titleEn} className="h-full">
                  <FeatureCard
                    href={card.href}
                    icon={card.icon}
                    titleEn={card.titleEn}
                    titleZh={card.titleZh}
                    desc={card.desc}
                    action={card.action}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
