import type { Metadata } from 'next';
import { getSiteUrl, SITE_URL } from '@/lib/seo/site-url';

export { getSiteUrl, SITE_URL };

export interface LocalizedMetadataContent {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
}

export interface BilingualPageMetadataInput {
  lang: string;
  /** Route path after /{lang}, e.g. '/reading', '/fortune/daily', or '' for /{lang}. */
  path: string;
  zh: LocalizedMetadataContent;
  en: LocalizedMetadataContent;
}

/**
 * Builds consistent self-canonical and zh/en/x-default hreflang alternates
 * for a localized route path (e.g. '/east/bazi', '/cards', or '').
 */
export function buildPageAlternates(
  lang: string,
  path: string
): NonNullable<Metadata['alternates']> {
  const siteUrl = getSiteUrl();
  const currentLang = lang === 'en' ? 'en' : 'zh';
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';

  return {
    canonical: `${siteUrl}/${currentLang}${normalizedPath}`,
    languages: {
      zh: `${siteUrl}/zh${normalizedPath}`,
      en: `${siteUrl}/en${normalizedPath}`,
      'x-default': `${siteUrl}/zh${normalizedPath}`,
    },
  };
}

/**
 * Builds consistent bilingual Next.js Metadata with self-canonical,
 * zh/en/x-default hreflang alternates, Open Graph, and Twitter tags.
 */
export function buildBilingualMetadata({
  lang,
  path,
  zh,
  en,
}: BilingualPageMetadataInput): Metadata {
  const currentLang = lang === 'en' ? 'en' : 'zh';
  const isEn = currentLang === 'en';
  const alternates = buildPageAlternates(currentLang, path);
  const localized = isEn ? en : zh;
  const canonicalUrl = alternates.canonical as string;
  const ogTitle = localized.ogTitle || `${localized.title} | YiTatro`;
  const ogDescription = localized.ogDescription || localized.description;

  return {
    title: localized.title,
    description: localized.description,
    ...(localized.keywords ? { keywords: localized.keywords } : {}),
    alternates,
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_US' : 'zh_CN',
      alternateLocale: isEn ? ['zh_CN'] : ['en_US'],
      url: canonicalUrl,
      siteName: 'YiTatro',
      title: ogTitle,
      description: ogDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
    },
  };
}
