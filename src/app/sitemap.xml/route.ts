import {
  SITEMAP_CHILD_PATHS,
  createXmlResponse,
  getSiteUrl,
  renderSitemapIndexXml,
} from '@/lib/seo/sitemap-xml';

/**
 * Serves the root /sitemap.xml index referencing the split child sitemaps.
 */
export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const xml = renderSitemapIndexXml(
    SITEMAP_CHILD_PATHS.map((path) => ({
      loc: `${siteUrl}${path}`,
    }))
  );

  return createXmlResponse(xml);
}
