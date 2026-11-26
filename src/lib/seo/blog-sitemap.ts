import { getAllPosts } from '@/lib/blog/posts';
import { getSiteUrl } from '@/lib/seo/site-url';
import {
  createXmlResponse,
  renderUrlSetXml,
  toValidLastMod,
  type SitemapUrlEntry,
} from '@/lib/seo/sitemap-xml';

/**
 * Builds the XML sitemap response for a single blog language ('zh' or 'en').
 */
export function createBlogSitemapResponse(lang: 'zh' | 'en'): Response {
  const siteUrl = getSiteUrl();
  const entries: SitemapUrlEntry[] = [{ loc: `${siteUrl}/${lang}/blog` }];

  for (const post of getAllPosts(lang)) {
    const lastmod =
      toValidLastMod(post.modifiedAt) ?? toValidLastMod(post.publishedAt);
    entries.push({
      loc: `${siteUrl}/${lang}/blog/${post.slug}`,
      ...(lastmod ? { lastmod } : {}),
    });
  }

  return createXmlResponse(renderUrlSetXml(entries));
}
