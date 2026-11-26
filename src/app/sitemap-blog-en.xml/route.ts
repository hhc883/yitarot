import { getAllPosts } from '@/lib/blog/posts';
import {
  createXmlResponse,
  getSiteUrl,
  renderUrlSetXml,
  toValidLastMod,
  type SitemapUrlEntry,
} from '@/lib/seo/sitemap-xml';

/**
 * Serves /sitemap-blog-en.xml with the en blog hub and all en articles.
 */
export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const entries: SitemapUrlEntry[] = [{ loc: `${siteUrl}/en/blog` }];

  for (const post of getAllPosts('en')) {
    const lastmod = toValidLastMod(post.modifiedAt || post.publishedAt);
    entries.push({
      loc: `${siteUrl}/en/blog/${post.slug}`,
      ...(lastmod ? { lastmod } : {}),
    });
  }

  return createXmlResponse(renderUrlSetXml(entries));
}
