const DEFAULT_SITE_URL = 'https://www.yitarot.net';

/**
 * Returns the normalized canonical site origin without trailing slashes.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const base = raw || DEFAULT_SITE_URL;
  const normalized = base.replace(/\/+$/, '') || DEFAULT_SITE_URL;
  if (normalized.toLowerCase() === 'https://yitarot.net') {
    return DEFAULT_SITE_URL;
  }
  return normalized;
}
