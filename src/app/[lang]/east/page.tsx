import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CONTAINER } from '@/components/site/constants';
import { HexagramGraphic } from '@/components/site/HexagramGraphic';
import { FeatureCard } from '@/components/site/FeatureCard';
import { ToolCardGridMotion } from '@/components/site/ToolCardGridMotion';
import {
  IconCoinLiuYao,
  IconLove,
  IconScrollBaZi,
  IconSparklesDraw,
  IconZodiacDragon
} from '@/components/icons/QiIcons';
import { Calendar, CalendarDays, Compass, LayoutGrid } from 'lucide-react';
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
      icon: <IconCoinLiuYao size={26} />,
      titleEn: 'Liu Yao Divination',
      titleZh: '周易六爻神谕',
      descEn: 'Classic 3D coin toss oracle, changing lines, and hexagram shifts for timely decisions.',
      descZh: '乾隆通宝 3D 物理掷币起卦，自下而上筑爻断卦，以变爻洞察局势转机。',
      actionEn: 'Cast coins',
      actionZh: '进入起卦'
    },
    {
      href: `/${lang}/east/bazi`,
      icon: <IconScrollBaZi size={26} />,
      titleEn: 'BaZi Birth Chart',
      titleZh: '四柱八字排盘',
      descEn: 'Four Pillars of Destiny calculated from your exact birth date and time, five elements & ten gods.',
      descZh: '依据出生年月日时推算四柱八字、节气换柱、五行生克与日主元神格局。',
      actionEn: 'Calculate chart',
      actionZh: '排生辰盘'
    },
    {
      href: `/${lang}/east/ziwei`,
      icon: <Compass className="h-6 w-6" strokeWidth={1.6} />,
      titleEn: 'ZiWei Astrology',
      titleZh: '紫微斗数排盘',
      descEn: 'Traditional Eastern star chart mapping 12 life palaces and 14 major stars.',
      descZh: '十二命宫、十四主星与生年四化星曜互动，深入剖析人生轨迹。',
      actionEn: 'Open star chart',
      actionZh: '排斗数盘'
    },
    {
      href: `/${lang}/east/meihua`,
      icon: <IconSparklesDraw size={26} />,
      titleEn: 'Plum Blossom Divination',
      titleZh: '梅花易数决策',
      descEn: 'Time and number based spontaneous I Ching divination for clear daily decisions.',
      descZh: '以先天心易神数、体用生克决断吉凶，简明快捷，应机决断。',
      actionEn: 'Cast Meihua',
      actionZh: '起梅花卦'
    },
    {
      href: `/${lang}/east/compatibility`,
      icon: <IconZodiacDragon size={26} />,
      titleEn: 'Zodiac & Chart Compatibility',
      titleZh: '生肖干支合盘',
      descEn: '144 pairwise combinations, examining earthly branch harmonies and energetic friction.',
      descZh: '144 组干支配对，天作六合、三合与相冲相刑分析，洞察彼此共振点。',
      actionEn: 'Compare charts',
      actionZh: '开始合盘'
    },
    {
      href: `/${lang}/east/bazi-daily`,
      icon: <CalendarDays className="h-6 w-6" strokeWidth={1.6} />,
      titleEn: 'Daily BaZi',
      titleZh: '每日八字',
      descEn: 'Use your birth date and hour to explore a daily reading and its twelve time periods.',
      descZh: '用出生日期和小时，查看今日八字、宜忌与十二时辰的解读。',
      actionEn: 'View today',
      actionZh: '查看今日'
    },
    {
      href: `/${lang}/east/qimen`,
      icon: <LayoutGrid className="h-6 w-6" strokeWidth={1.6} />,
      titleEn: 'Qimen Dunjia',
      titleZh: '奇门遁甲',
      descEn: 'Cast a rotating nine-palace chart using Beijing time and explore its gates, stars, and directions.',
      descZh: '按北京时间排出时家转盘拆补局，查看各宫位的门、星和方位。',
      actionEn: 'Open Qimen',
      actionZh: '排奇门局'
    },
    {
      href: `/${lang}/east/almanac`,
      icon: <Calendar className="h-6 w-6" strokeWidth={1.6} />,
      titleEn: 'Chinese Almanac Date Finder',
      titleZh: '黄历择日',
      descEn: 'Compare traditional almanac entries for moving, opening a business, and signing a contract.',
      descZh: '按传统黄历宜忌，查看入宅搬家、开业或签约的候选日期。',
      actionEn: 'Find dates',
      actionZh: '查看候选日期'
    },
    {
      href: `/${lang}/east/relationship`,
      icon: <IconLove size={24} />,
      titleEn: 'Relationship Synastry Hub',
      titleZh: '关系合盘中心',
      descEn: 'Nine distinct relationship synastry types including marriage, partnership, and family.',
      descZh: '涵盖合婚、恋爱、事业搭档等九大合盘维度，多视角解析互动契机。',
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
