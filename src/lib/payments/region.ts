export type PaymentRegion = 'domestic' | 'overseas';

export function detectPaymentRegion(
  headers: Pick<Headers, 'get'>,
  hosting: { vercel?: string; geoSource?: string }
): PaymentRegion | null {
  const source = hosting.geoSource || (hosting.vercel === '1' ? 'vercel' : '');
  const header = source === 'vercel' ? 'x-vercel-ip-country' :
    source === 'cloudflare' ? 'cf-ipcountry' : null;
  const code = header ? headers.get(header)?.trim().toUpperCase() : undefined;
  if (!code || !/^[A-Z]{2}$/.test(code) || ['AA', 'EU', 'XX', 'ZZ'].includes(code)) return null;
  return code === 'CN' ? 'domestic' : 'overseas';
}
