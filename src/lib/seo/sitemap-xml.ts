import { getSiteUrl } from '@/lib/seo/site-url';

export { getSiteUrl };

const SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const ISO_DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_DATETIME_RE =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

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

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Strictly validates W3C/ISO-8601 date or datetime strings (rejecting impossible
 * calendar dates and non-ISO formats) and returns a deterministic ISO-8601 timestamp.
 */
export function toValidLastMod(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const dateOnlyMatch = ISO_DATE_ONLY_RE.exec(trimmed);
  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const month = Number(dateOnlyMatch[2]);
    const day = Number(dateOnlyMatch[3]);
    if (!isValidCalendarDate(year, month, day)) {
      return undefined;
    }
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  }

  const dateTimeMatch = ISO_DATETIME_RE.exec(trimmed);
  if (!dateTimeMatch) {
    return undefined;
  }

  const year = Number(dateTimeMatch[1]);
  const month = Number(dateTimeMatch[2]);
  const day = Number(dateTimeMatch[3]);
  const hour = Number(dateTimeMatch[4]);
  const minute = Number(dateTimeMatch[5]);
  const second = dateTimeMatch[6] !== undefined ? Number(dateTimeMatch[6]) : 0;
  const tz = dateTimeMatch[7];

  if (!isValidCalendarDate(year, month, day)) {
    return undefined;
  }
  if (hour > 23 || minute > 59 || second > 59) {
    return undefined;
  }
  if (tz !== 'Z') {
    const [tzHour, tzMin] = tz.slice(1).split(':').map(Number);
    if (tzHour > 23 || tzMin > 59) {
      return undefined;
    }
  }

  const timestamp = Date.parse(trimmed);
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
