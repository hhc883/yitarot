const DEFAULT_SITE_URL = 'https://yitarot.net';
const SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';

export const SITEMAP_CHILD_PATHS = [
  '/sitemap-landing.xml',
  '/sitemap-cards.xml',
  '/sitemap-blog-zh.xml',
  '/sitemap-blog-en.xml',
] as const;

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
}

export interface SitemapIndexEntry {
  loc: string;
  lastmod?: string;
}

/**
 * Returns the normalized canonical site origin without trailing slashes.
 */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
}

/**
 * Escapes XML special characters for safe interpolation inside text nodes.
 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;');
}

/**
 * Parses a date string into a deterministic ISO-8601 timestamp when valid.
 */
export function toValidLastMod(value?: string): string | undefined {
  if (!value || !value.trim()) {
    return undefined;
  }
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    return undefined;
  }
  return new Date(timestamp).toISOString();
}

function renderEntryNode(tag: 'url' | 'sitemap', entry: SitemapUrlEntry | SitemapIndexEntry): string {
  const lines = [`  <${tag}>`, `    <loc>${escapeXml(entry.loc)}</loc>`];
  if (entry.lastmod) {
    lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
  }
  lines.push(`  </${tag}>`);
  return lines.join('\n');
}

/**
 * Renders a standard Sitemap XML <urlset> document.
 */
export function renderUrlSetXml(entries: SitemapUrlEntry[]): string {
  const body = entries.map((entry) => renderEntryNode('url', entry)).join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${SITEMAP_NS}">`,
    body,
    '</urlset>',
    '',
  ].join('\n');
}

/**
 * Renders a Sitemap Index XML <sitemapindex> document.
 */
export function renderSitemapIndexXml(entries: SitemapIndexEntry[]): string {
  const body = entries.map((entry) => renderEntryNode('sitemap', entry)).join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<sitemapindex xmlns="${SITEMAP_NS}">`,
    body,
    '</sitemapindex>',
    '',
  ].join('\n');
}

/**
 * Builds an XML HTTP response with UTF-8 application/xml content type.
 */
export function createXmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
