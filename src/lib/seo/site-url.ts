const DEFAULT_SITE_URL = 'https://yitarot.net';

/**
 * Returns the normalized canonical site origin without trailing slashes.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const base = raw || DEFAULT_SITE_URL;
  return base.replace(/\/+$/, '') || DEFAULT_SITE_URL;
}

export const SITE_URL = getSiteUrl();
