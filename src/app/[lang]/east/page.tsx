import React from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Orbit, Coins, Flower2, Heart, Sun } from 'lucide-react';
import { CONTAINER } from '@/components/site/constants';
import { TaijiMark } from '@/components/site/TaijiMark';
import { FeatureCard } from '@/components/site/FeatureCard';
import { ScrollReveal } from '@/components/site/ScrollReveal';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function EastLandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const cards = [
    {
      href: `/${lang}/fatemaster/bazi`,
      icon: CalendarDays,
      titleEn: 'BaZi Birth Chart',
      titleZh: '八字命盘',
      desc: 'Four Pillars of Destiny based on birth year, month, day, hour',
      action: isEn ? 'Start chart' : '开始排盘'
    },
    {
      href: `/${lang}/fatemaster/ziwei`,
      icon: Orbit,
      titleEn: 'ZiWei Astrology',
      titleZh: '紫微斗数',
      desc: 'Star chart analysis of personality and life path',
      action: isEn ? 'Start chart' : '开始排盘'
    },
    {
      href: `/${lang}/fatemaster/liuyao`,
      icon: Coins,
      titleEn: 'Liu Yao Divination',
      titleZh: '六爻占卜',
      desc: 'Coin hexagram divination for yes/no guidance',
      action: isEn ? 'Cast coins' : '进入占卜'
    },
    {
      href: `/${lang}/fatemaster/meihua`,
      icon: Flower2,
      titleEn: 'Meihua Plum Blossom',
      titleZh: '梅花易数',
      desc: 'Time-based divination for quick answers',
      action: isEn ? 'Cast coins' : '进入占卜'
    },
    {
      href: `/${lang}/fatemaster/compatibility`,
      icon: Heart,
      titleEn: 'Compatibility',
      titleZh: '合婚配对',
      desc: 'Relationship harmony between two birth charts',
      action: isEn ? 'Compare' : '开始合盘'
    },
    {
      href: `/${lang}/fatemaster/bazi-daily`,
      icon: Sun,
      titleEn: 'Daily Fortune',
      titleZh: '每日运势',
      desc: "Today's luck, advice, and daily energies",
      action: isEn ? 'See today' : '查看今日'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="w-full">
        <div className={`${CONTAINER} pb-16 pt-24 sm:pt-32 lg:pb-24 lg:pt-[168px]`}>
          <div className="mkt-rise">
            <TaijiMark size={26} />

            <h1 className="mt-7 font-serif text-[clamp(32px,5vw,64px)] font-normal leading-[1.08] tracking-[-0.015em] text-ink">
              {isEn ? 'Eastern Wisdom' : '东方数术'}
              <span className="mt-4 block font-display text-[11px] font-normal tracking-[0.32em] text-whisper sm:text-[12px]">
                {isEn ? '东方数术' : 'EASTERN WISDOM'}
              </span>
            </h1>

            <p className="mt-8 max-w-[52ch] text-[15px] leading-[1.7] text-soft">
              Birth-chart and divination from China, based on your birth time.
            </p>

            <Link
              href={`/${lang}/fatemaster/bazi`}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[13.5px] text-white transition-opacity hover:opacity-80"
            >
              <span>{isEn ? 'Start a chart' : '开始排盘 Start'}</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6 张功能卡：3 列网格，留足留白，方便以后加新功能 */}
      <section className="w-full">
        <div className={`${CONTAINER} pb-20 pt-12 lg:pb-[120px] lg:pt-16`}>
          <div className="border-t border-line pt-12 lg:pt-16">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <ScrollReveal key={card.href} className="h-full">
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
