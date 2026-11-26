import type { MetadataRoute } from 'next';
import { getAllCards } from '@/lib/tarot/deck';
import { BLOG_POSTS } from '@/lib/blog/posts';
import { RELATIONSHIP_CONFIGS } from '@/lib/metaphysics/relationship';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitarot.net';
  const now = new Date();

  const highPriorityRoutes = [
    '',
    '/east',
    '/west',
    '/blog',
    '/east/bazi',
    '/east/liuyao',
    '/east/ziwei',
    '/east/meihua',
    '/east/qimen',
    '/east/almanac',
    '/east/compatibility',
    '/reading',
    '/draw',
    '/yes-no',
    '/love',
    '/cards',
    '/spreads',
    '/fortune/daily'
  ];

  const secondaryRoutes = [
    '/east/bazi-daily',
    '/east/bazi-calculate',
    '/east/ziwei-doushu',
    '/east/ziwei-marriage',
    '/east/meihua/daily-decision',
    '/east/chinese-zodiac-compatibility',
    '/east/relationship',
    '/east/relationship-network',
    '/east/bazi-marriage',
    '/east/bazi-lover',
    '/east/bazi-business',
    '/east/bazi-friends',
    '/east/bazi-leader',
    '/east/bazi-parent-child',
    '/east/bazi-mother-child',
    '/east/bazi-mother-in-law',
    '/east/bazi-best-friends',
    '/fortune/weekly',
    '/fortune/monthly',
    '/fortune/seasonal',
    '/fortune/yearly',
    '/pricing',
    '/privacy'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  const pushEntry = (
    url: string,
    priority: number,
    changeFrequency: 'daily' | 'weekly' | 'monthly',
    lastModified: Date = now
  ) => {
    if (seenUrls.has(url)) return;
    seenUrls.add(url);
    sitemapEntries.push({ url, lastModified, changeFrequency, priority });
  };

  for (const route of highPriorityRoutes) {
    pushEntry(`${baseUrl}/zh${route}`, route === '' ? 1.0 : 0.9, 'daily');
    pushEntry(`${baseUrl}/en${route}`, route === '' ? 0.95 : 0.85, 'daily');
  }

  for (const route of secondaryRoutes) {
    pushEntry(`${baseUrl}/zh${route}`, 0.75, 'weekly');
    pushEntry(`${baseUrl}/en${route}`, 0.7, 'weekly');
  }

  // 9 大关系合盘深度矩阵页
  for (const type of Object.keys(RELATIONSHIP_CONFIGS)) {
    pushEntry(`${baseUrl}/zh/east/relationship/${type}`, 0.8, 'weekly');
    pushEntry(`${baseUrl}/en/east/relationship/${type}`, 0.75, 'weekly');
  }

  // 78 张牌单独详情页（高权重 pSEO）
  const cards = getAllCards();
  for (const card of cards) {
    pushEntry(`${baseUrl}/zh/cards/${card.slug}`, card.arcana === 'major' ? 0.8 : 0.65, 'weekly');
    pushEntry(`${baseUrl}/en/cards/${card.slug}`, card.arcana === 'major' ? 0.75 : 0.6, 'weekly');
  }

  // 博客与深度研习文章
  for (const post of BLOG_POSTS) {
    pushEntry(
      `${baseUrl}/${post.lang}/blog/${post.slug}`,
      post.featured ? 0.85 : 0.75,
      'weekly',
      new Date(post.modifiedAt || post.publishedAt)
    );
  }

  return sitemapEntries;
}
