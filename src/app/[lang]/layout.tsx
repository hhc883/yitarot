import type { Metadata } from 'next';
import React from 'react';
import { SiteChrome } from '@/components/site/SiteChrome';

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export const instant = false;

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const isEn = rawLang === 'en';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitatro.com';
  const currentLang = isEn ? 'en' : 'zh';

  return {
    title: {
      default: isEn
        ? 'YiTatro | I Ching, BaZi & Tarot AI Metaphysics - Online Divination & Self-Reflection'
        : 'YiTatro｜周易·八字·塔罗 AI 命理 - 在线占卜与自我认知镜像',
      template: '%s | YiTatro'
    },
    description: isEn
      ? 'YiTatro brings together Eastern I Ching (BaZi astrology, Liu Yao coin oracle, Zodiac harmony) and classic Western Rider-Waite tarot with depth psychology for lucid, insightful readings.'
      : 'YiTatro 汇聚东方周易（八字排盘、六爻铜钱神谕、生肖纳音）与西方经典韦特塔罗，结合现代深度心理学，为你提供清澈、深邃的即时命理解读。',
    alternates: {
      canonical: `${siteUrl}/${currentLang}`,
      languages: {
        en: `${siteUrl}/en`,
        zh: `${siteUrl}/zh`,
        'x-default': `${siteUrl}/zh`
      }
    },
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_US' : 'zh_CN',
      alternateLocale: isEn ? ['zh_CN'] : ['en_US'],
      url: `${siteUrl}/${currentLang}`,
      siteName: 'YiTatro',
      title: isEn
        ? 'YiTatro | I Ching, BaZi & Tarot AI Metaphysics'
        : 'YiTatro｜周易·八字·塔罗 AI 命理 - 在线占卜与自我认知镜像',
      description: isEn
        ? 'Online divination & self-reflection combining Eastern I Ching & Western Tarot.'
        : 'YiTatro 汇聚东方周易与西方经典韦特塔罗，为你提供温润治愈的心灵指引与决策参考。'
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn
        ? 'YiTatro | I Ching & Tarot AI Metaphysics'
        : 'YiTatro｜东方周易与西方塔罗 AI 命理',
      description: isEn
        ? 'Have a question on your mind? Consult the oracle or draw a card.'
        : '心里有件事，问问卦或牌吧。你的全天候 AI 命理与潜意识导师。'
    }
  };
}

export default async function LangLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return <SiteChrome lang={lang}>{children}</SiteChrome>;
}
