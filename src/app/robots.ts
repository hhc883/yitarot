import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo/site-url';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/zh/account', '/en/account', '/zh/login', '/en/login']
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
