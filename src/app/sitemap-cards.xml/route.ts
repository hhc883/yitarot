import { getAllCards } from '@/lib/tarot/deck';
import {
  createXmlResponse,
  getSiteUrl,
  renderUrlSetXml,
  type SitemapUrlEntry,
} from '@/lib/seo/sitemap-xml';

/**
 * Serves /sitemap-cards.xml with all 78 tarot card detail pages in zh and en.
 */
export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const entries: SitemapUrlEntry[] = [];

  for (const card of getAllCards()) {
    entries.push({ loc: `${siteUrl}/zh/cards/${card.slug}` });
    entries.push({ loc: `${siteUrl}/en/cards/${card.slug}` });
  }

  return createXmlResponse(renderUrlSetXml(entries));
}
