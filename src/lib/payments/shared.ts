export function parseAmountInMinorUnits(value: unknown): number | null {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  const match = /^(\d{1,8})(?:\.(\d{1,2}))?$/.exec(String(value));
  return match ? Number(match[1]) * 100 + Number((match[2] || '').padEnd(2, '0')) : null;
}

export function secureHttpsUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function paymentSiteOrigin(): string | null {
  const value = secureHttpsUrl(process.env.PAYMENT_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL);
  return value ? new URL(value).origin : null;
}

export function objectRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
}

export const UUID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
export const STRIPE_SESSION_ID = /^cs_(?:test_|live_)?[A-Za-z0-9]{1,120}$/;

export const noStore = { 'Cache-Control': 'private, no-store' };
