import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CONTAINER } from '@/components/site/constants';
import { HexagramGraphic } from '@/components/site/HexagramGraphic';
import { FeatureCard } from '@/components/site/FeatureCard';
import { ToolCardGridMotion } from '@/components/site/ToolCardGridMotion';
import { ToolIcon } from '@/components/site/ToolIcon';
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
    title: isEn ? 'I Ching & BaZi East Metaphysics Portal' : '东方专厅｜周易六爻·四柱八字·紫微斗数',
    description: isEn
      ? 'Explore traditional Eastern metaphysics: Liu Yao coin oracle, Four Pillars of Destiny (BaZi), Zi Wei Dou Shu, and relationship synastry.'
      : 'YiTatro 东方专厅：周易六爻神谕、四柱八字排盘、紫微斗数、梅花易数及生肖干支关系合盘。',
    keywords: isEn
      ? ['I Ching oracle', 'BaZi reading', 'Liu Yao hexagrams', 'Four Pillars of Destiny', 'Zi Wei Dou Shu', 'Chinese synastry', 'Eastern metaphysics', 'YiTatro East']
      : ['东方专厅', '周易起卦', '六爻排盘', '四柱八字', '紫微斗数', '梅花易数', '生肖合盘', 'YiTatro 东方'],
    alternates: {
      canonical: `${siteUrl}/${currentLang}/east`,
      languages: {
        zh: `${siteUrl}/zh/east`,
        en: `${siteUrl}/en/east`,
        'x-default': `${siteUrl}/zh/east`
      }
    },
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_US' : 'zh_CN',
      url: `${siteUrl}/${currentLang}/east`,
      title: isEn ? 'I Ching & BaZi East Metaphysics Portal | YiTatro' : '东方专厅｜周易·八字·紫微 | YiTatro',
      description: isEn
        ? 'Traditional Eastern wisdom calculated with rigorous astrological accuracy.'
        : '严谨传承东方周易术数，提供清澈深邃的命理解读。'
    }
  };
}

/**
 * 东方专厅（A2 静态骨架）：
 * - 黑白排版：白底、#171717 与中性灰 #52525B / #E4E4E7
 * - 东方标题「易经与八字 / I Ching & BaZi」
 * - 主「起一卦 / Cast a hexagram」直达 /{lang}/east/liuyao（实心主按钮）
 * - 次「排八字」直达 /{lang}/east/bazi
 * - 静态六爻矢量图形视觉
 * - 其余既有东方数术工具完整保留并可直达
 */
export default async function EastLandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const tools = [
    {
      href: `/${lang}/east/liuyao`,
      icon: <ToolIcon name="east-liuyao" />,
      titleEn: 'Liu Yao Divination',
      titleZh: '周易六爻神谕',
      descEn: 'Ask about a specific situation, such as whether to pursue a partnership.',
      descZh: '为一件具体的事问卦，比如合作要不要推进。',
      actionEn: 'Cast coins',
      actionZh: '进入起卦'
    },
    {
      href: `/${lang}/east/bazi`,
      icon: <ToolIcon name="east-bazi" />,
      titleEn: 'BaZi Birth Chart',
      titleZh: '四柱八字排盘',
      descEn: 'Use your birth time to explore personality tendencies and life cycles.',
      descZh: '用出生时间排八字，了解自己的性格倾向和大运。',
      actionEn: 'Calculate chart',
      actionZh: '排生辰盘'
    },
    {
      href: `/${lang}/east/ziwei`,
      icon: <ToolIcon name="east-ziwei" />,
      titleEn: 'ZiWei Astrology',
      titleZh: '紫微斗数排盘',
      descEn: 'Explore career, relationship, and wealth themes in your birth chart.',
      descZh: '查看自己的事业、感情和财运趋势。',
      actionEn: 'Open star chart',
      actionZh: '排斗数盘'
    },
    {
      href: `/${lang}/east/meihua`,
      icon: <ToolIcon name="east-meihua" />,
      titleEn: 'Plum Blossom Divination',
      titleZh: '梅花易数决策',
      descEn: 'Cast a hexagram when you need perspective on a choice.',
      descZh: '拿不定主意时，为眼前的选择起一卦。',
      actionEn: 'Cast Meihua',
      actionZh: '起梅花卦'
    },
    {
      href: `/${lang}/east/compatibility`,
      icon: <ToolIcon name="east-compatibility" />,
      titleEn: 'Zodiac & Chart Compatibility',
      titleZh: '生肖干支合盘',
      descEn: 'Compare how two people may get along based on their zodiac signs.',
      descZh: '按生肖比较两个人是否合拍。',
      actionEn: 'Compare charts',
      actionZh: '开始合盘'
    },
    {
      href: `/${lang}/east/bazi-daily`,
      icon: <ToolIcon name="east-bazi-daily" />,
      titleEn: 'Daily BaZi',
      titleZh: '每日八字',
      descEn: 'See which activities and times may suit you today.',
      descZh: '查看今天宜做什么，挑个合适的时段。',
      actionEn: 'View today',
      actionZh: '查看今日'
    },
    {
      href: `/${lang}/east/qimen`,
      icon: <ToolIcon name="east-qimen" />,
      titleEn: 'Qimen Dunjia',
      titleZh: '奇门遁甲',
      descEn: 'Check directions for a specific time when planning an outing or activity.',
      descZh: '查指定时刻的方位，为出行或办事作参考。',
      actionEn: 'Open Qimen',
      actionZh: '排奇门局'
    },
    {
      href: `/${lang}/east/almanac`,
      icon: <ToolIcon name="east-almanac" />,
      titleEn: 'Chinese Almanac Date Finder',
      titleZh: '黄历择日',
      descEn: 'Find dates for moving, opening a business, or signing a contract.',
      descZh: '为搬家、开业或签约选日期。',
      actionEn: 'Find dates',
      actionZh: '查看候选日期'
    },
    {
      href: `/${lang}/east/relationship`,
      icon: <ToolIcon name="east-relationship" />,
      titleEn: 'Relationship Synastry Hub',
      titleZh: '关系合盘中心',
      descEn: 'Explore how you get along with a partner, relative, friend, or colleague.',
      descZh: '看看你和伴侣、家人、朋友或搭档怎么相处。',
      actionEn: 'Explore hub',
      actionZh: '合盘中心'
    }
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitarot.net';
  const pageTitle = isEn ? 'I Ching & BaZi East Metaphysics Portal' : '东方专厅｜周易六爻·四柱八字·紫微斗数';

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
          item: `${siteUrl}/${lang}/east`
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      description: isEn
        ? 'Explore traditional Eastern metaphysics: Liu Yao coin oracle, Four Pillars of Destiny (BaZi), Zi Wei Dou Shu, and relationship synastry.'
        : 'YiTatro 东方专厅：周易六爻神谕、四柱八字排盘、紫微斗数、梅花易数及生肖干支关系合盘。',
      url: `${siteUrl}/${lang}/east`
    }
  ];

  return (
    <div className="w-full bg-white text-[#171717]">
      <JsonLd data={structuredData} />
      {/* 专厅首屏（Hero）：留白、标题、六爻静态视觉、一个实心主按钮与次入口 */}
      <section className="w-full border-b border-[#E4E4E7]" aria-label={isEn ? 'I Ching & BaZi Hall' : '易经与八字专厅'}>
        <div className={`${CONTAINER} py-14 sm:py-20 md:py-24`}>
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-12">
            {/* 左侧：文字层次与行动入口 */}
            <div className="md:col-span-8 lg:col-span-8">
              <span className="text-[12px] font-medium tracking-[0.2em] text-[#52525B] uppercase">
                {isEn ? 'Eastern Metaphysics' : '东方数术'}
              </span>

              <h1 className="mt-3 font-serif text-[32px] sm:text-[42px] md:text-[50px] font-normal leading-[1.12] tracking-tight text-[#171717]">
                {isEn ? 'I Ching & BaZi' : '易经与八字'}
              </h1>

              <p className="mt-4 max-w-[56ch] text-[15px] sm:text-[16px] leading-relaxed text-[#52525B]">
                {isEn
                  ? 'Cast an I Ching hexagram for a question, or build a BaZi chart from your birth date and time.'
                  : '用周易六爻为一个具体问题起卦，或用出生时间排出八字命盘。'}
              </p>

              {/* 行动按钮区：一个实心主按钮 + 次入口「排八字」 */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/* 实心主按钮：直达 /{lang}/east/liuyao */}
                <Link
                  href={`/${lang}/east/liuyao`}
                  aria-label={isEn ? 'Cast a hexagram with Liu Yao divination' : '起一卦：进入周易六爻占卜'}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#171717] px-6 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  <span>{isEn ? 'Cast a hexagram' : '起一卦'}</span>
                  <span aria-hidden="true">→</span>
                </Link>

                {/* 次入口：直达 /{lang}/east/bazi */}
                <Link
                  href={`/${lang}/east/bazi`}
                  aria-label={isEn ? 'Calculate your BaZi birth chart' : '排八字：进入四柱八字排盘'}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-[#171717] px-5 py-2.5 text-[14px] font-medium text-[#171717] transition-colors hover:bg-[#F5F5F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  <span>{isEn ? 'Calculate BaZi' : '排八字'}</span>
                </Link>
              </div>
            </div>

            {/* 右侧：六爻静态视觉 */}
            <div className="flex md:col-span-4 lg:col-span-4 md:justify-end">
              <div
                className="flex flex-col items-center justify-center rounded-sm border border-[#E4E4E7] bg-[#F5F5F6] p-6 sm:p-8"
                aria-hidden="true"
              >
                <HexagramGraphic className="w-24 sm:w-28 h-auto" />
                <span className="mt-4 text-[12px] tracking-[0.16em] text-[#52525B]">
                  {isEn ? 'SIX LINES ORACLE' : '周易六爻 · 乾坤生变'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 全部既有工具一览（黑白网格排版，保留所有现有路由与参数） */}
      <section className="w-full py-14 sm:py-20" aria-label={isEn ? 'All Eastern tools' : '全部东方工具'}>
        <div className={CONTAINER}>
          <div className="flex items-baseline justify-between border-b border-[#E4E4E7] pb-4">
            <h2 className="font-serif text-[20px] sm:text-[24px] font-normal tracking-tight text-[#171717]">
              {isEn ? 'All Eastern Tools' : '东方数术工具'}
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
                prefetch={tool.href.endsWith('/east/almanac') ? false : undefined}
              />
            ))}
          </ToolCardGridMotion>
        </div>
      </section>
    </div>
  );
}
