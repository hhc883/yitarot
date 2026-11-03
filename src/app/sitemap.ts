import type { MetadataRoute } from 'next';
import { getAllCards } from '@/lib/tarot/deck';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://qicosmos.com';
  const now = new Date();

  const coreRoutes = [
    '',
    // 东方周易命理 (FateMaster)
    '/fatemaster',
    '/fatemaster/bazi',
    '/fatemaster/liuyao',
    '/fatemaster/compatibility',
    // 西方塔罗 (Tarotip)
    '/reading',
    '/yes-no',
    '/love',
    '/fortune/daily',
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

  return sitemapEntries;
}
