import React from 'react';
import type { Metadata } from 'next';
import { TaijiIntro } from '@/components/site/TaijiIntro';
import { PortalEntry } from '@/components/site/PortalEntry';
import { LegacyShowcase } from '@/components/site/LegacyShowcase';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildFaqJsonLd, buildLocalizedMetadata, SITE_URL } from '@/lib/seo/metadata';

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
    routePath: '',
    title: isEn
      ? 'YiTatro | I Ching, BaZi & Tarot AI Metaphysics Sanctuary'
      : 'YiTatro｜周易六爻·四柱八字·塔罗 AI 命理 - 起卦、排八字、抽塔罗',
    description: isEn
      ? 'Eastern wisdom and Western tarot in one serene sanctuary. Cast I Ching Liu Yao coins, calculate BaZi and Ziwei charts, or draw Rider-Waite tarot cards.'
      : '易有太极，是生两仪。YiTatro 汇聚东方周易（六爻起卦、四柱八字、紫微斗数、奇门遁甲、黄历择日）与西方经典韦特塔罗，提供清澈深邃的自我认知镜像。',
    keywords: isEn
      ? [
          'YiTatro',
          'I Ching divination',
          'BaZi birth chart',
          'Liu Yao coin oracle',
          'Tarot reading',
          'Ziwei Dou Shu',
          'Qimen Dunjia'
        ]
      : [
          'YiTatro',
          '周易起卦',
          '六爻占卜',
          '八字排盘',
          '紫微斗数',
          '奇门遁甲',
          '在线塔罗占卜',
          '78张牌义'
        ]
  });
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const faqJsonLd = buildFaqJsonLd(
    isEn
      ? [
          {
            question: 'What is YiTatro?',
            answer:
              'YiTatro is a bilingual Eastern and Western metaphysics sanctuary offering I Ching Liu Yao coin divination, BaZi Four Pillars birth charts, Ziwei Dou Shu, Qimen Dunjia, Chinese Almanac date selection, and 78-card Rider-Waite tarot readings.'
          },
          {
            question: 'Are the Eastern metaphysics calculations based on classical rules?',
            answer:
              'Yes. BaZi, Qimen Dunjia, and Almanac calculations follow strict astronomical solar terms and Beijing time, while Liu Yao and character readings draw directly from classical canons including Zengshan Buyi, Bushi Quanshu, Meihua Yishu, Jingshi Yizhuan, and Cezi Midie.'
          },
          {
            question: 'Do I need an account to draw tarot cards or cast a hexagram?',
            answer:
              'Core tools such as Free Tarot Draw, Daily Card, 78 Card Meanings, BaZi chart calculation, Qimen Dunjia, and Almanac date finding work immediately without sign-in.'
          }
        ]
      : [
          {
            question: 'YiTatro（天仪灵图）提供哪些占卜与命理工具？',
            answer:
              'YiTatro 汇聚东方周易数术与西方韦特塔罗两大体系：东方包含周易六爻铜钱起卦、四柱八字排盘、紫微斗数、梅花易数、奇门遁甲、黄历择日与 144 组生肖关系合盘；西方包含自由抽牌、AI 深度牌阵、每日一牌、是否塔罗与 78 张牌义百科。'
          },
          {
            question: '东方排盘与解卦是否遵循传统古籍典法？',
            answer:
              '是的。八字、奇门与黄历严格依二十四节气与真太阳时/北京时间精密排盘；六爻与测字解读体系直接锚定《增删卜易》《卜筮全书》《梅花易数》《京氏易传》《测字秘牒》等经典典籍规则，拒绝空洞敷衍。'
          },
          {
            question: '不登录可以使用吗？',
            answer:
              '可以。自由抽牌、每日一牌、78 张牌义查询、八字排盘、奇门排局、黄历择日等核心功能无需登录即可直接体验；登录账号可同步保存历史记录并使用 AI 深度追问服务。'
          }
        ]
  );

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: isEn ? 'YiTatro — I Ching, BaZi & Tarot' : 'YiTatro｜起卦、排八字、抽塔罗',
    url: `${SITE_URL}/${lang}`,
    inLanguage: isEn ? 'en-US' : 'zh-CN'
  };

  return (
    <div className="w-full overflow-x-clip bg-white">
      <JsonLd data={[webPageJsonLd, faqJsonLd]} />
      <TaijiIntro lang={lang} />
      <PortalEntry lang={lang} />
      <LegacyShowcase lang={lang} />
    </div>
  );
}
