import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { RELATIONSHIP_CONFIGS, RelationshipType } from '@/lib/metaphysics/relationship';
import { RelationshipSynastryWidget } from '@/components/east/RelationshipSynastryWidget';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/seo/site-url';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const instant = false;

export async function generateStaticParams() {
  const types = Object.keys(RELATIONSHIP_CONFIGS);
  const params: { lang: string; type: string }[] = [];
  ['zh', 'en'].forEach(lang => {
    types.forEach(t => {
      params.push({ lang, type: t });
    });
  });
  return params;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; type: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, type: rawType } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const type = rawType as RelationshipType;
  const config = RELATIONSHIP_CONFIGS[type];
  const siteUrl = getSiteUrl();

  if (!config) {
    return { title: lang === 'en' ? 'Relationship Not Found | YiTatro' : '未找到合盘模型 | YiTatro' };
  }

  const isEn = lang === 'en';
  const title = isEn
    ? `${config.titleEn} - BaZi & Five Elements Synastry | YiTatro`
    : `${config.titleZh} - 生肖干支与八字五行合盘 | YiTatro`;
  const description = isEn ? config.summaryEn : config.summaryZh;

  return {
    title,
    description,
    keywords: isEn
      ? [config.titleEn, 'BaZi synastry', 'Zodiac compatibility', 'Chinese astrology relationship', 'Five Elements synergy', 'YiTatro Synastry']
      : [config.titleZh, '生肖合盘', '八字合盘', '干支配对', '纳音相生相克', '五行生克', 'YiTatro 合盘'],
    alternates: {
      canonical: `${siteUrl}/${lang}/east/relationship/${type}`,
      languages: {
        zh: `${siteUrl}/zh/east/relationship/${type}`,
        en: `${siteUrl}/en/east/relationship/${type}`,
        'x-default': `${siteUrl}/zh/east/relationship/${type}`
      }
    },
    openGraph: {
      type: 'article',
      locale: isEn ? 'en_US' : 'zh_CN',
      url: `${siteUrl}/${lang}/east/relationship/${type}`,
      title,
      description,
      siteName: 'YiTatro'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}

export default async function SpecificRelationshipPage({
  params
}: {
  params: Promise<{ lang: string; type: string }>;
}) {
  const { lang: rawLang, type: rawType } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const type = rawType as RelationshipType;

  if (!RELATIONSHIP_CONFIGS[type]) {
    notFound();
  }

  const config = RELATIONSHIP_CONFIGS[type];
  const siteUrl = getSiteUrl();
  const pageTitle = lang === 'en' ? `${config.titleEn} - BaZi Synastry` : `${config.titleZh} - 生肖干支八字合盘`;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: lang === 'en' ? 'Home' : '首页',
          item: `${siteUrl}/${lang}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lang === 'en' ? 'Eastern Metaphysics' : '东方专厅',
          item: `${siteUrl}/${lang}/east`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: lang === 'en' ? 'Relationships' : '关系合盘',
          item: `${siteUrl}/${lang}/east/relationship`
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: pageTitle,
          item: `${siteUrl}/${lang}/east/relationship/${type}`
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: pageTitle,
      description: lang === 'en' ? config.summaryEn : config.summaryZh,
      author: {
        '@type': 'Organization',
        name: 'YiTatro',
        url: siteUrl
      },
      publisher: {
        '@type': 'Organization',
        name: 'YiTatro',
        url: siteUrl
      },
      mainEntityOfPage: `${siteUrl}/${lang}/east/relationship/${type}`
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-8 pb-16 sm:pt-10 sm:pb-20 text-[#171717]">
      <JsonLd data={structuredData} />
      {/* 返回全系中心导航 */}
      <div className="mb-6">
        <Link
          href={`/${lang}/east/relationship`}
          className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#171717] transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'All Relationships' : '返回关系合盘中心'}</span>
        </Link>
      </div>

      <RelationshipSynastryWidget initialType={type} lang={lang} />
    </div>
  );
}
