import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo/sitemap-xml';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
