import { createBlogSitemapResponse } from '@/lib/seo/blog-sitemap';

/**
 * Serves /sitemap-blog-zh.xml with the zh blog hub and all zh articles.
 */
export async function GET(): Promise<Response> {
  return createBlogSitemapResponse('zh');
}
