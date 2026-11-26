import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitarot.net';

export type SupportedLang = 'zh' | 'en';

export interface LocalizedMetaOptions {
  lang: SupportedLang;
  /** Route path starting with '/' (or '' for homepage), without '/zh' or '/en' prefix */
  routePath: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: 'website' | 'article';
  noIndex?: boolean;
}

/**
 * 统一多语言页面 Metadata 构建器：
 * 严格生成自指 Canonical、双向 Hreflang (zh-CN / en-US / x-default)、OpenGraph、Twitter Card 与 Robots 策略。
 */
export function buildLocalizedMetadata({
  lang,
  routePath,
  title,
  description,
  keywords,
  type = 'website',
  noIndex = false
}: LocalizedMetaOptions): Metadata {
  const normalizedPath = routePath === '/' ? '' : routePath;
  const isEn = lang === 'en';
  const currentUrl = `${SITE_URL}/${lang}${normalizedPath}`;
  const zhUrl = `${SITE_URL}/zh${normalizedPath}`;
  const enUrl = `${SITE_URL}/en${normalizedPath}`;

  return {
    title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical: currentUrl,
      languages: {
        'zh-CN': zhUrl,
        'en-US': enUrl,
        'x-default': zhUrl
      }
    },
    openGraph: {
      type,
      locale: isEn ? 'en_US' : 'zh_CN',
      alternateLocale: isEn ? ['zh_CN'] : ['en_US'],
      url: currentUrl,
      siteName: 'YiTatro',
      title: `${title} | YiTatro`,
      description,
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${title} - YiTatro`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | YiTatro`,
      description,
      images: [`${SITE_URL}/opengraph-image`]
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1
          }
        }
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * 构建 Schema.org BreadcrumbList 结构化数据
 */
export function buildBreadcrumbJsonLd(
  lang: SupportedLang,
  items: BreadcrumbItem[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'en' ? 'Home' : '首页',
        item: `${SITE_URL}/${lang}`
      },
      ...items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: item.name,
        item: `${SITE_URL}/${lang}${item.path}`
      }))
    ]
  };
}

/**
 * 构建 Schema.org WebApplication 结构化数据（用于在线排盘、起卦、抽牌工具页）
 */
export function buildWebAppJsonLd({
  lang,
  routePath,
  name,
  description,
  category = 'LifestyleApplication'
}: {
  lang: SupportedLang;
  routePath: string;
  name: string;
  description: string;
  category?: string;
}): Record<string, unknown> {
  const normalizedPath = routePath === '/' ? '' : routePath;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: `${SITE_URL}/${lang}${normalizedPath}`,
    applicationCategory: category,
    operatingSystem: 'All',
    inLanguage: lang === 'en' ? 'en-US' : 'zh-CN',
    publisher: {
      '@type': 'Organization',
      name: 'YiTatro',
      url: SITE_URL
    }
  };
}

/**
 * 构建 Schema.org FAQPage 结构化数据
 */
export function buildFaqJsonLd(
  items: Array<{ question: string; answer: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

/**
 * 为关系合盘别名路由（/east/bazi-*）生成统一 Metadata，并将 Canonical 归并至 /east/relationship/[type]
 */
export function buildRelationshipAliasMetadata({
  lang,
  type,
  titleZh,
  titleEn,
  descZh,
  descEn
}: {
  lang: SupportedLang;
  type: string;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
}): Metadata {
  const isEn = lang === 'en';
  const canonicalPath = `/east/relationship/${type}`;
  return buildLocalizedMetadata({
    lang,
    routePath: canonicalPath,
    title: isEn ? titleEn : titleZh,
    description: isEn ? descEn : descZh
  });
}
