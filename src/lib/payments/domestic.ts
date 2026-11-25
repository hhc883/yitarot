import crypto from 'node:crypto';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { PAYMENT_TIERS, type PaymentTier } from '@/lib/payments/catalog';
import { objectRecord, paymentSiteOrigin, secureHttpsUrl } from '@/lib/payments/shared';

export function getDomesticGateway() {
  const appId = process.env.DOMESTIC_PAY_APP_ID?.trim();
  const secret = process.env.DOMESTIC_PAY_APP_SECRET?.trim();
  const url = secureHttpsUrl(process.env.DOMESTIC_PAY_API_URL || 'https://api.xunhupay.com/payment/do.html');
  const channel = process.env.DOMESTIC_PAY_CHANNEL || 'wechat';
  const origin = paymentSiteOrigin();
  if (!appId || !secret || !url || !origin ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY ||
      (channel !== 'wechat' && channel !== 'alipay')) return null;
  return { appId, secret, url, channel, origin };
}

function getRedeemSecret(): string | null {
  const secret = process.env.REDEEM_SECRET_KEY?.trim();
  return secret && secret.length >= 32 && secret !== 'yitarot-domestic-redeem-secret-key-2026'
    ? secret : null;
}

export function verifyRedemptionCodeFormat(rawCode: string) {
  const secret = getRedeemSecret();
  if (!secret) return { valid: false, unavailable: true };
  const clean = rawCode.trim().toUpperCase();
  const v2 = /^YITA2-(100|500|2000)-([A-F0-9]{32})-([A-F0-9]{32})$/.exec(clean);
  // Old codes are accepted only when an operator opts in after checking their issuance key.
  const legacy = !v2 && process.env.REDEEM_ALLOW_LEGACY === '1'
    ? /^YITA(100|500|2000)-([A-F0-9]{6})-([A-F0-9]{6})$/.exec(clean)
    : null;
  const match = v2 || legacy;
  if (!match) return { valid: false };
  const expected = crypto.createHmac('sha256', secret).update((v2 ? 'v2:' : '') + match[1] + ':' + match[2])
    .digest().subarray(0, v2 ? 16 : 3);
  return crypto.timingSafeEqual(Buffer.from(match[3], 'hex'), expected)
    ? { valid: true, points: Number(match[1]) } : { valid: false };
}

function sign(params: Record<string, string>, secret: string): string {
  const message = Object.keys(params).sort()
    .filter(key => key !== 'hash' && params[key] !== '')
    .map(key => key + '=' + params[key]).join('&');
  return crypto.createHash('md5').update(message + secret, 'utf8').digest('hex');
}

export function verifyDomesticCallbackSignature(params: Record<string, string>, appSecret: string): boolean {
  return Boolean(appSecret && /^[a-f0-9]{32}$/i.test(params.hash || '') &&
    crypto.timingSafeEqual(Buffer.from(sign(params, appSecret), 'hex'), Buffer.from(params.hash, 'hex')));
}

export async function createDomesticPaymentOrder(params: {
  userId: string;
  points: PaymentTier;
  lang: 'zh' | 'en';
  gateway: NonNullable<ReturnType<typeof getDomesticGateway>>;
}) {
  const { gateway, points, lang } = params;
  const admin = getSupabaseAdminClient();
  if (!admin) return null;
  const amount = PAYMENT_TIERS[points].cny;
  // The gateway accepts up to 32 characters; the database still stores the UUID.
  const id = crypto.randomUUID();
  const { error } = await admin.from('orders').insert({
    id, user_id: params.userId, amount: amount / 100, points, status: 'pending',
    payment_provider: 'domestic', currency: 'CNY'
  });
  if (error) {
    console.error('[Domestic checkout] order insert failed', error.code);
    return null;
  }

  const requestData: Record<string, string> = {
    version: '1.1',
    appid: gateway.appId,
    trade_order_id: id.replaceAll('-', ''),
    total_fee: (amount / 100).toFixed(2),
    title: 'YiTatro ' + points + ' 积分',
    time: String(Math.floor(Date.now() / 1000)),
    nonce_str: crypto.randomBytes(16).toString('hex'),
    notify_url: gateway.origin + '/api/webhooks/domestic',
    return_url: gateway.origin + '/' + lang + '/pricing?payment_status=pending',
    callback_url: gateway.origin + '/' + lang + '/pricing?payment_status=cancelled'
  };
  requestData.hash = sign(requestData, gateway.secret);

  try {
    const response = await fetch(gateway.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(requestData),
      signal: AbortSignal.timeout(10000),
      redirect: 'error'
    });
    const raw = objectRecord(await response.json());
    if (!response.ok || !raw || (raw.errcode !== 0 && raw.errcode !== '0') ||
        Object.values(raw).some(value => value !== null && !['string', 'number', 'boolean'].includes(typeof value))) return null;
    const signed = Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== null).map(([k, v]) => [k, String(v)]));
    if (!verifyDomesticCallbackSignature(signed, gateway.secret)) return null;
    const payUrl = secureHttpsUrl(raw.url);
    const qrUrl = secureHttpsUrl(raw.url_qrcode);
    return payUrl || qrUrl ? { ok: true, payUrl, qrUrl, orderId: id } : null;
  } catch {
    return null;
  }
}
