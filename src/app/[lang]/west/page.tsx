import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { CONTAINER } from '@/components/site/constants';
import { JsonLd } from '@/components/seo/JsonLd';

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
    title: isEn ? 'Western Tarot Sanctuary - Free Draw, Spreads & Card Meanings' : '塔罗专厅｜自由抽牌·牌阵占卜·78张牌义',
    description: isEn
      ? 'Western tarot sanctuary: 78 Rider-Waite card interpretations, free single and multi-card draws, Celtic Cross spread, love tarot, and daily fortunes.'
      : 'YiTatro 塔罗专厅：78 张经典韦特塔罗牌义库、自由选牌、牌阵占卜、爱情塔罗、是否决断与每日一牌。',
    keywords: isEn
      ? ['Tarot reading', 'Free tarot draw', '78 tarot card meanings', 'Rider-Waite deck', 'Celtic Cross spread', 'Love tarot', 'Daily tarot', 'YiTatro Tarot']
      : ['塔罗专厅', '自由抽牌', '78张牌义库', '经典韦特塔罗', '牌阵占卜', '爱情塔罗', '是否占卜', 'YiTatro 塔罗'],
    alternates: {
      canonical: `${siteUrl}/${currentLang}/west`,
      languages: {
        zh: `${siteUrl}/zh/west`,
        en: `${siteUrl}/en/west`,
        'x-default': `${siteUrl}/zh/west`
      }
    },
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_US' : 'zh_CN',
      url: `${siteUrl}/${currentLang}/west`,
      title: isEn ? 'Tarot Sanctuary | YiTatro' : '塔罗专厅｜经典韦特塔罗 | YiTatro',
      description: isEn
        ? 'Deep archetypal psychology and intuitive tarot guidance.'
        : '深度心理学与直觉塔罗指引，静心照见内心真实答案。'
    }
  };
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
      titleEn: 'Free Tarot Draw',
      titleZh: '自由抽牌',
      descEn: 'Draw 1 to 6 cards freely from the 78-card deck for immediate reflection and focus.',
      descZh: '从 78 张经典牌堆中自由选牌，可选 1–6 张，沉淀当下思绪，获得清澈明晰的直观启示。',
      actionEn: 'Draw cards',
      actionZh: '开始抽牌'
    },
    {
      href: `/${lang}/reading`,
      titleEn: 'AI Tarot Reading',
      titleZh: 'AI 塔罗深度占卜',
      descEn: 'Personalized readings based on classic Rider-Waite symbolism and structured inquiries.',
      descZh: '带着具体问题进入占卜，结合经典象征体系与潜意识原型进行深度推演。',
      actionEn: 'Start reading',
      actionZh: '进入占卜'
    },
    {
      href: `/${lang}/fortune/daily`,
      titleEn: 'Daily Card',
      titleZh: '每日一牌 · 晨间神谕',
      descEn: 'Draw a single card each morning for guidance, clarity, and daily mindfulness.',
      descZh: '每日晨起抽取一张心境指引牌，感知今日能量原型与行动觉察。',
      actionEn: 'See today',
      actionZh: '抽取今日'
    },
    {
      href: `/${lang}/spreads`,
      titleEn: 'Spread Library',
      titleZh: '经典牌阵专区',
      descEn: 'Three-Card Spread, Celtic Cross, Two-Choice, and specialized relationship layouts.',
      descZh: '圣三角、凯尔特十字、二选一与关系融通等经典几何牌阵研习与排布。',
      actionEn: 'Browse spreads',
      actionZh: '查看牌阵'
    },
    {
      href: `/${lang}/cards`,
      titleEn: '78 Card Meanings',
      titleZh: '78 牌义大全',
      descEn: 'Comprehensive guide to 22 Major Arcana and 56 Minor Arcana in upright and reversed positions.',
      descZh: '涵盖 22 张大阿卡纳与 56 张小阿卡纳正逆位详尽象征、意象与现实映射。',
      actionEn: 'Explore meanings',
      actionZh: '查阅牌义'
    },
    {
      href: `/${lang}/yes-no`,
      titleEn: 'Yes / No Tarot',
      titleZh: '是否塔罗 · 快速决断',
      descEn: 'Single-card oracle providing a clear directional tendency for pressing questions.',
      descZh: '单张神谕直截了当，为心中摇摆不定的选择提供清晰的决断倾向。',
      actionEn: 'Ask yes or no',
      actionZh: '即刻决断'
    },
    {
      href: `/${lang}/love`,
      titleEn: 'Love & Relationship Tarot',
      titleZh: '爱情与关系塔罗',
      descEn: 'Three-dimensional mirror of emotional ties, hidden friction, and mutual growth.',
      descZh: '深入探寻双方心意连结、潜在阻碍与关系融通之路，映照真实渴望。',
      actionEn: 'Explore love',
      actionZh: '测算关系'
    },
    {
      href: `/${lang}/fortune/weekly`,
      titleEn: 'Weekly Tarot',
      titleZh: '每周塔罗',
      descEn: 'Draw five cards to reflect on the week ahead: its theme, work, relationships, finances, and your next step.',
      descZh: '用五张牌梳理未来一周的整体主题、工作、关系、财务和行动方向。',
      actionEn: 'View weekly spread',
      actionZh: '查看本周'
    }
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitarot.net';
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
                  ? 'Draw from the classic Rider–Waite deck, look up a card meaning, or choose a spread for a question.'
                  : '从经典韦特牌组抽一张牌、查看牌义，或选一个牌阵梳理你的问题。'}
              </p>

              {/* 行动按钮区：一个实心主按钮 + 次入口「牌阵」「牌义」 */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/* 实心主按钮：直达 /{lang}/draw?count=1 */}
                <Link
                  href={`/${lang}/draw?count=1`}
                  aria-label={isEn ? 'Draw one card from the tarot deck' : '抽一张牌：进入自由抽牌'}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#171717] px-6 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  <span>{isEn ? 'Draw one card' : '抽一张牌'}</span>
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

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col justify-between rounded-sm border border-[#E4E4E7] bg-white p-6 transition-[border-color,background-color] hover:border-[#171717] hover:bg-[#F5F5F6]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                <div>
                  <h3 className="font-serif text-[17px] font-normal tracking-tight text-[#171717] transition-colors group-hover:text-[#171717]">
                    {isEn ? tool.titleEn : tool.titleZh}
                  </h3>
                  {!isEn && (
                    <p className="mt-1 text-[12px] tracking-wide text-[#52525B]">
                      {tool.titleEn}
                    </p>
                  )}
                  <p className="mt-3 text-[13.5px] leading-relaxed text-[#52525B]">
                    {isEn ? tool.descEn : tool.descZh}
                  </p>
                </div>

                <div className="mt-6 flex min-h-[44px] items-center gap-1.5 border-t border-[#E4E4E7] pt-4 text-[13px] font-medium text-[#171717]">
                  <span>{isEn ? tool.actionEn : tool.actionZh}</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
