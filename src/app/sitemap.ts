import type { MetadataRoute } from 'next';
import { getAllCards } from '@/lib/tarot/deck';
import { BLOG_POSTS } from '@/lib/blog/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitarot.net';
  const now = new Date();

  const coreRoutes = [
    '',
    // 东西专厅入口与核心主页
    '/east',
    '/west',
    '/blog',
    '/privacy',
    // 东方周易命理
    '/east',
    '/east/bazi',
    '/east/bazi-daily',
    '/east/liuyao',
    '/east/ziwei',
    '/east/ziwei-marriage',
    '/east/meihua',
    '/east/qimen',
    '/east/almanac',
    '/east/relationship',
    '/east/relationship-network',
    '/east/compatibility',
    // 西方塔罗神谕
    '/reading',
    '/draw',
    '/yes-no',
    '/love',
    '/fortune/daily',
    '/fortune/weekly',
    '/fortune/monthly',
    '/fortune/seasonal',
    '/fortune/yearly',
    '/cards',
    '/spreads',
    '/pricing'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Core pages in both zh and en
  for (const route of coreRoutes) {
    sitemapEntries.push({
      url: `${baseUrl}/zh${route}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: route === '' ? 1.0 : 0.9
    });
    sitemapEntries.push({
      url: `${baseUrl}/en${route}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: route === '' ? 0.9 : 0.8
    });
  }

  // English-only tarot spread & draw guides (no /zh counterparts)
  const englishOnlyRoutes = [
    '/en/one-card-tarot',
    '/en/spreads/three-card',
    '/en/spreads/celtic-cross'
  ];
  for (const route of englishOnlyRoutes) {
    sitemapEntries.push({
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8
    });
  }

  // 78 张牌单独详情页（高权重 SEO）
  const cards = getAllCards();
  for (const card of cards) {
    sitemapEntries.push({
      url: `${baseUrl}/zh/cards/${card.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: card.arcana === 'major' ? 0.8 : 0.6
    });
    sitemapEntries.push({
      url: `${baseUrl}/en/cards/${card.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: card.arcana === 'major' ? 0.7 : 0.5
    });
  }

  // 博客与深度研习文章（高权重 SEO，每日/每周更新）
  for (const post of BLOG_POSTS) {
    sitemapEntries.push({
      url: `${baseUrl}/${post.lang}/blog/${post.slug}`,
      lastModified: new Date(post.modifiedAt || post.publishedAt),
      changeFrequency: 'weekly',
      priority: post.featured ? 0.85 : 0.75
    });
  }

  return sitemapEntries;
}
