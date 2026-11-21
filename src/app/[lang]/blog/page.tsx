import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { TarotHandbook } from '@/components/tarot/TarotHandbook';
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitatro.com';
  const currentLang = isEn ? 'en' : 'zh';

  return {
    title: isEn ? 'Tarot & I Ching Study Guide - Beginner Handbook | YiTatro' : '心法指南｜周易与塔罗心学实修手册 - YiTatro',
    description: isEn
      ? 'A clean, notes-style handbook covering classic tarot card archetypes, I Ching hexagram principles, and Jungian depth psychology.'
      : '极简便签风格的心学指南：涵盖经典韦特塔罗原型、周易数术入门心法与荣格深度心理学实修。',
    alternates: {
      canonical: `${siteUrl}/${currentLang}/blog`,
      languages: {
        zh: `${siteUrl}/zh/blog`,
        en: `${siteUrl}/en/blog`,
        'x-default': `${siteUrl}/zh/blog`
      }
    }
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitatro.com';
  const pageTitle = lang === 'en' ? 'Tarot & I Ching Study Guide' : '心法指南｜周易与塔罗心学实修手册';

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
          name: pageTitle,
          item: `${siteUrl}/${lang}/blog`
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: pageTitle,
      description:
        lang === 'en'
          ? 'A clean, notes-style handbook covering classic tarot card archetypes, I Ching hexagram principles, and Jungian depth psychology.'
          : '极简便签风格的心学指南：涵盖经典韦特塔罗原型、周易数术入门心法与荣格深度心理学实修。',
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
      mainEntityOfPage: `${siteUrl}/${lang}/blog`
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <JsonLd data={structuredData} />
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#52525B] animate-pulse">
            {lang === 'en' ? 'Loading Beginner Handbook...' : '加载新手指南...'}
          </div>
        }
      >
        <TarotHandbook lang={lang} />
      </Suspense>
    </div>
  );
}
