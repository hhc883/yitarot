import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog/posts';
import { BlogIndexClient } from '@/components/blog/BlogIndexClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/seo/site-url';

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
  const siteUrl = getSiteUrl();
  const currentLang = isEn ? 'en' : 'zh';

  const title = isEn
    ? 'Metaphysical Insights & Guides - Tarot, BaZi & I Ching | YiTatro'
    : '研习洞察与心学指南｜塔罗牌义、八字命理与周易智慧 - YiTatro';
  const description = isEn
    ? 'Deep dives into 78 tarot archetypes, BaZi elemental dynamics, Jungian synchronicity, and real-world reflective case studies.'
    : '涵盖78张塔罗原型深度剖析、四柱八字五行生克、荣格共时性心理学与真实推演复盘，将古老数术转化为清醒的自我赋权工具。';

  return {
    title,
    description,
    keywords: isEn
      ? ['Metaphysics blog', 'Tarot card guides', 'BaZi analysis', 'I Ching wisdom', 'Jungian synchronicity', 'Spiritual reflection', 'YiTatro Blog']
      : ['命理研习博客', '塔罗心法指南', '八字十神分析', '周易智慧', '荣格共时性', '自我认知镜像', 'YiTatro 博客'],
    alternates: {
      canonical: `${siteUrl}/${currentLang}/blog`,
      languages: {
        zh: `${siteUrl}/zh/blog`,
        en: `${siteUrl}/en/blog`,
        'x-default': `${siteUrl}/zh/blog`
      }
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${currentLang}/blog`,
      siteName: 'YiTatro',
      locale: isEn ? 'en_US' : 'zh_CN',
      type: 'website'
    }
  };
}

export default async function BlogPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const siteUrl = getSiteUrl();
  const posts = getAllPosts(lang);

  const pageTitle = lang === 'en' ? 'Metaphysical Insights & Guides' : '研习洞察与心学指南';
  const pageDescription =
    lang === 'en'
      ? 'Deep dives into 78 tarot archetypes, BaZi elemental dynamics, Jungian synchronicity, and real-world reflective case studies.'
      : '涵盖78张塔罗原型深度剖析、四柱八字五行生克、荣格共时性心理学与真实推演复盘，将古老数术转化为清醒的自我赋权工具。';

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
      '@type': 'CollectionPage',
      name: pageTitle,
      description: pageDescription,
      url: `${siteUrl}/${lang}/blog`,
      publisher: {
        '@type': 'Organization',
        name: 'YiTatro',
        url: siteUrl
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: posts.map((post, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${siteUrl}/${lang}/blog/${post.slug}`,
          name: post.title
        }))
      }
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <JsonLd data={structuredData} />
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#52525B] animate-pulse">
            {lang === 'en' ? 'Loading articles...' : '加载研习文章...'}
          </div>
        }
      >
        <BlogIndexClient posts={posts} lang={lang} />
      </Suspense>
    </div>
  );
}
