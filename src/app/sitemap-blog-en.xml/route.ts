import { createBlogSitemapResponse } from '@/lib/seo/blog-sitemap';

/**
 * Serves /sitemap-blog-en.xml with the en blog hub and all en articles.
 */
export async function GET(): Promise<Response> {
  return createBlogSitemapResponse('en');
}
