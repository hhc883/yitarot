import {
  createXmlResponse,
  getSiteUrl,
  renderUrlSetXml,
  type SitemapUrlEntry,
} from '@/lib/seo/sitemap-xml';

const BILINGUAL_CORE_ROUTES = [
  '',
  '/east',
  '/west',
  '/privacy',
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
  '/pricing',
] as const;

const ENGLISH_ONLY_GUIDE_ROUTES = [
  '/en/one-card-tarot',
  '/en/spreads/three-card',
  '/en/spreads/celtic-cross',
] as const;

/**
 * Serves /sitemap-landing.xml with bilingual core routes and English-only tarot guides.
 */
export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const entries: SitemapUrlEntry[] = [];

  for (const route of BILINGUAL_CORE_ROUTES) {
    entries.push({ loc: `${siteUrl}/zh${route}` });
    entries.push({ loc: `${siteUrl}/en${route}` });
  }

  for (const route of ENGLISH_ONLY_GUIDE_ROUTES) {
    entries.push({ loc: `${siteUrl}${route}` });
  }

  return createXmlResponse(renderUrlSetXml(entries));
}
