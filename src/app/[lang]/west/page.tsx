import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { CONTAINER } from '@/components/site/constants';
import { FeatureCard } from '@/components/site/FeatureCard';
import { ToolCardGridMotion } from '@/components/site/ToolCardGridMotion';
import { ToolIcon } from '@/components/site/ToolIcon';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBilingualMetadata, getSiteUrl } from '@/lib/seo/metadata';
import { READING_COST } from '@/lib/points/constants';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return buildBilingualMetadata({
    lang,
    path: '/west',
    zh: {
      title: '塔罗专厅｜自由抽牌·牌阵占卜·78张牌义',
      description: 'YiTatro 塔罗专厅：78 张经典韦特塔罗牌义库、自由选牌、牌阵占卜、爱情塔罗、是否决断与每日一牌。',
      keywords: ['塔罗专厅', '自由抽牌', '78张牌义库', '经典韦特塔罗', '牌阵占卜', '爱情塔罗', '是否占卜', 'YiTatro 塔罗'],
      ogTitle: '塔罗专厅｜经典韦特塔罗 | YiTatro',
      ogDescription: '深度心理学与直觉塔罗指引，静心照见内心真实答案。'
    },
    en: {
      title: 'Tarot Sanctuary - Free Card Tools & AI Tarot Reading',
      description: 'Start with free online tarot tools—random card draw, daily card, yes or no, and love spread—or sign in for a personalized AI tarot reading.',
      keywords: ['Free tarot reading', 'Random tarot card', 'AI tarot reading', '78 tarot card meanings', 'Rider-Waite deck', 'Love tarot', 'Yes or no tarot', 'YiTatro Tarot'],
      ogTitle: 'Tarot Sanctuary | YiTatro',
      ogDescription: 'Free Rider-Waite tarot card tools and personalized AI tarot reading.'
    }
  });
}

/**
 * 西方专厅（A2 静态骨架）：
 * - 黑白排版：白底、#171717 与中性灰 #52525B / #E4E4E7
 * - 西方标题「塔罗 / Tarot」
 * - 主「抽一张牌 / Draw one card」直达 /{lang}/draw?count=1（实心主按钮）
 * - 次入口「牌阵」直达 /{lang}/spreads、「牌义」直达 /{lang}/cards
 * - 静态视觉：复用本地太阳牌 WebP（/cards/major-arcana/the-sun.webp），保留牌图本色
 * - 其余既有塔罗工具与解读入口完整保留并可直达
 */
export default async function WestLandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const tools = [
    {
      href: `/${lang}/draw`,
      icon: <ToolIcon name="west-draw" />,
      titleEn: 'Random Tarot Card Generator',
      titleZh: '自由抽牌',
      descEn: 'Free online tarot deck draw (1–6 cards) with upright and reversed meanings.',
      descZh: '随手抽牌，理一理眼下最在意的事。',
      actionEn: 'Draw cards free',
      actionZh: '开始抽牌'
    },
    {
      href: `/${lang}/reading`,
      icon: <ToolIcon name="west-reading" />,
      titleEn: 'AI Tarot Reading',
      titleZh: 'AI 塔罗深度占卜',
      descEn: `Personalized AI spread analysis for your specific question (sign-in required, ${READING_COST} points).`,
      descZh: '输入一个具体问题，获取针对它的塔罗解读。',
      actionEn: `Start AI reading (${READING_COST} pts)`,
      actionZh: '进入占卜'
    },
    {
      href: `/${lang}/fortune/daily`,
      icon: <ToolIcon name="west-daily" />,
      titleEn: 'Daily Tarot Card',
      titleZh: '每日一牌 · 晨间神谕',
      descEn: 'Reveal today’s free daily tarot card, key meaning, and a mindful reflection prompt.',
      descZh: '抽一张牌，想想今天值得关注什么。',
      actionEn: 'See today’s card',
      actionZh: '抽取今日'
    },
    {
      href: `/${lang}/spreads`,
      icon: <ToolIcon name="west-spreads" />,
      titleEn: 'Spread Library',
      titleZh: '经典牌阵专区',
      descEn: 'Choose a spread for a relationship question, a tough decision, or another concern.',
      descZh: '按感情、两难选择等问题挑选合适的牌阵。',
      actionEn: 'Browse spreads',
      actionZh: '查看牌阵'
    },
    {
      href: `/${lang}/cards`,
      icon: <ToolIcon name="west-cards" />,
      titleEn: '78 Card Meanings',
      titleZh: '78 牌义大全',
      descEn: 'Look up what a tarot card means upright or reversed.',
      descZh: '查一张塔罗牌正位和逆位时的含义。',
      actionEn: 'Explore meanings',
      actionZh: '查阅牌义'
    },
    {
      href: `/${lang}/yes-no`,
      icon: <ToolIcon name="west-yes-no" />,
      titleEn: 'Yes or No Tarot',
      titleZh: '是否塔罗 · 快速决断',
      descEn: 'Free single-card reflection for a focused Yes, No, or Maybe question.',
      descZh: '问一个能用「是」或「否」回答的问题。',
      actionEn: 'Ask yes or no',
      actionZh: '即刻决断'
    },
    {
      href: `/${lang}/love`,
      icon: <ToolIcon name="west-love" />,
      titleEn: 'Free Love Tarot Reading',
      titleZh: '爱情与关系塔罗',
      descEn: 'Free 3-card relationship spread to reflect on your perspective and next step.',
      descZh: '梳理两个人的相处状态，想清下一步怎么走。',
      actionEn: 'Explore love spread',
      actionZh: '测算关系'
    },
    {
      href: `/${lang}/fortune/weekly`,
      icon: <ToolIcon name="west-weekly" />,
      titleEn: 'Weekly Tarot',
      titleZh: '每周塔罗',
      descEn: 'Reflect on what to prioritize in work, relationships, and spending this week.',
      descZh: '梳理这周在工作、相处和开销上该关注什么。',
      actionEn: 'View weekly spread',
      actionZh: '查看本周'
    }
  ];

  const siteUrl = getSiteUrl();
  const pageTitle = isEn ? 'Western Tarot Sanctuary' : '塔罗专厅｜自由抽牌·牌阵占卜·78张牌义';

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: isEn ? 'Home' : '首页',
          item: `${siteUrl}/${lang}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: pageTitle,
          item: `${siteUrl}/${lang}/west`
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      description: isEn
        ? 'Western tarot sanctuary: 78 Rider-Waite card interpretations, free single and multi-card draws, Celtic Cross spread, love tarot, and daily fortunes.'
        : 'YiTatro 塔罗专厅：78 张经典韦特塔罗牌义库、自由选牌、牌阵占卜、爱情塔罗、是否决断与每日一牌。',
      url: `${siteUrl}/${lang}/west`
    }
  ];

  return (
    <div className="w-full bg-white text-[#171717]">
      <JsonLd data={structuredData} />
      {/* 专厅首屏（Hero）：留白、标题、太阳牌静态视觉（本色保留）、一个实心主按钮与次入口 */}
      <section className="w-full border-b border-[#E4E4E7]" aria-label={isEn ? 'Tarot Hall' : '塔罗专厅'}>
        <div className={`${CONTAINER} py-14 sm:py-20 md:py-24`}>
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-12">
            {/* 左侧：文字层次与行动入口 */}
            <div className="md:col-span-8 lg:col-span-8">
              <span className="text-[12px] font-medium tracking-[0.2em] text-[#52525B] uppercase">
                {isEn ? 'Western Tarot' : '西方塔罗'}
              </span>

              <h1 className="mt-3 font-serif text-[32px] sm:text-[42px] md:text-[50px] font-normal leading-[1.12] tracking-tight text-[#171717]">
                {isEn ? 'Tarot' : '塔罗'}
              </h1>

              <p className="mt-4 max-w-[56ch] text-[15px] sm:text-[16px] leading-relaxed text-[#52525B]">
                {isEn
                  ? `Start with a free tarot reading or random card draw from the 78-card Rider–Waite deck, explore card meanings and spreads, or sign in for personalized AI tarot analysis (${READING_COST} points per reading).`
                  : '从经典韦特牌组抽一张牌、查看牌义，或选一个牌阵梳理你的问题。'}
              </p>

              {/* 行动按钮区：一个实心主按钮 + 次入口「牌阵」「牌义」 */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/* 实心主按钮：直达 /{lang}/draw?count=1 */}
                <Link
                  href={`/${lang}/draw?count=1`}
                  aria-label={isEn ? 'Draw a free tarot card from the deck' : '抽一张牌：进入自由抽牌'}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#171717] px-6 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  <span>{isEn ? 'Draw a free card' : '抽一张牌'}</span>
                  <span aria-hidden="true">→</span>
                </Link>

                {/* 次入口 1：牌阵 /{lang}/spreads */}
                <Link
                  href={`/${lang}/spreads`}
                  aria-label={isEn ? 'Explore tarot spreads' : '浏览塔罗牌阵'}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-[#171717] px-5 py-2.5 text-[14px] font-medium text-[#171717] transition-colors hover:bg-[#F5F5F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  <span>{isEn ? 'Spreads' : '牌阵'}</span>
                </Link>

                {/* 次入口 2：牌义 /{lang}/cards */}
                <Link
                  href={`/${lang}/cards`}
                  aria-label={isEn ? 'View 78 card meanings' : '查看 78 牌义大全'}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-[#E4E4E7] px-5 py-2.5 text-[14px] font-medium text-[#52525B] transition-colors hover:border-[#171717] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  <span>{isEn ? 'Card meanings' : '牌义'}</span>
                </Link>
              </div>
            </div>

            {/* 右侧：太阳牌静态视觉（保留牌图本色，无滤镜） */}
            <div className="flex md:col-span-4 lg:col-span-4 md:justify-end">
              <div
                className="flex flex-col items-center justify-center rounded-sm border border-[#E4E4E7] bg-[#F5F5F6] p-6 sm:p-8"
                aria-label={isEn ? 'The Sun Tarot Card' : '太阳牌'}
              >
                <div className="relative aspect-[2/3] w-[110px] sm:w-[130px] overflow-hidden rounded-sm border border-[#E4E4E7] bg-white shadow-xs">
                  <Image
                    src="/cards/major-arcana/the-sun.webp"
                    alt={isEn ? 'The Sun — Rider-Waite tarot card' : '太阳 — 经典韦特塔罗牌'}
                    fill
                    sizes="(max-width: 640px) 110px, 130px"
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="mt-4 text-[12px] tracking-[0.16em] text-[#52525B]">
                  {isEn ? 'XIX · THE SUN' : 'XIX · 太阳'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 全部既有塔罗工具一览（黑白网格排版，保留所有现有路由与参数） */}
      <section className="w-full py-14 sm:py-20" aria-label={isEn ? 'All Tarot tools' : '全部塔罗工具'}>
        <div className={CONTAINER}>
          <div className="flex items-baseline justify-between border-b border-[#E4E4E7] pb-4">
            <h2 className="font-serif text-[20px] sm:text-[24px] font-normal tracking-tight text-[#171717]">
              {isEn ? 'All Tarot Readings & Tools' : '塔罗占卜与工具'}
            </h2>
            <span className="text-[12px] text-[#52525B]">
              {isEn ? `${tools.length} Tools available` : `共 ${tools.length} 项工具`}
            </span>
          </div>

          <ToolCardGridMotion className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {tools.map((tool) => (
              <FeatureCard
                key={tool.href}
                href={tool.href}
                icon={tool.icon}
                title={isEn ? tool.titleEn : tool.titleZh}
                subtitle={isEn ? tool.titleZh : tool.titleEn}
                desc={isEn ? tool.descEn : tool.descZh}
                action={isEn ? tool.actionEn : tool.actionZh}
              />
            ))}
          </ToolCardGridMotion>
        </div>
      </section>
    </div>
  );
}
