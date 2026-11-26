import { getAllPosts } from '@/lib/blog/posts';
import {
  createXmlResponse,
  getSiteUrl,
  renderUrlSetXml,
  toValidLastMod,
  type SitemapUrlEntry,
} from '@/lib/seo/sitemap-xml';

/**
 * Serves /sitemap-blog-zh.xml with the zh blog hub and all zh articles.
 */
export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const entries: SitemapUrlEntry[] = [{ loc: `${siteUrl}/zh/blog` }];

  for (const post of getAllPosts('zh')) {
    const lastmod = toValidLastMod(post.modifiedAt || post.publishedAt);
    entries.push({
      loc: `${siteUrl}/zh/blog/${post.slug}`,
      ...(lastmod ? { lastmod } : {}),
    });
  }

  return createXmlResponse(renderUrlSetXml(entries));
}
