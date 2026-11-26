import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitarot.net';

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
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const localized = isEn ? en : zh;
  const canonicalUrl = `${SITE_URL}/${currentLang}${normalizedPath}`;
  const ogTitle = localized.ogTitle || `${localized.title} | YiTatro`;
  const ogDescription = localized.ogDescription || localized.description;

  return {
    title: localized.title,
    description: localized.description,
    ...(localized.keywords ? { keywords: localized.keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        zh: `${SITE_URL}/zh${normalizedPath}`,
        en: `${SITE_URL}/en${normalizedPath}`,
        'x-default': `${SITE_URL}/zh${normalizedPath}`,
      },
    },
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
