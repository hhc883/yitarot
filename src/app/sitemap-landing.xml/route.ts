import { RELATIONSHIP_CONFIGS } from '@/lib/metaphysics/relationship';
import {
  createXmlResponse,
  getSiteUrl,
  renderUrlSetXml,
  type SitemapUrlEntry,
} from '@/lib/seo/sitemap-xml';

const BILINGUAL_LANDING_ROUTES = [
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

/**
 * Serves /sitemap-landing.xml with bilingual independent landing pages and
 * canonical /east/relationship/{type} pages.
 */
export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const entries: SitemapUrlEntry[] = [];
  const seen = new Set<string>();

  const pushLoc = (loc: string) => {
    if (seen.has(loc)) return;
    seen.add(loc);
    entries.push({ loc });
  };

  for (const route of BILINGUAL_LANDING_ROUTES) {
    pushLoc(`${siteUrl}/zh${route}`);
    pushLoc(`${siteUrl}/en${route}`);
  }

  for (const type of Object.keys(RELATIONSHIP_CONFIGS)) {
    pushLoc(`${siteUrl}/zh/east/relationship/${type}`);
    pushLoc(`${siteUrl}/en/east/relationship/${type}`);
  }

  return createXmlResponse(renderUrlSetXml(entries));
}
