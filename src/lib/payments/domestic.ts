import crypto from 'crypto';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export interface DomesticTier {
  points: number;
  priceCny: number;
  name: string;
}

export const DOMESTIC_TIERS: Record<number, DomesticTier> = {
  100: {
    points: 100,
    priceCny: 29.9,
    name: 'YiTarot 100 积分体验包'
  },
  500: {
    points: 500,
    priceCny: 99.0,
    name: 'YiTarot 500 积分畅享包 (最受欢迎)'
  },
  2000: {
    points: 2000,
    priceCny: 299.0,
    name: 'YiTarot 2000 积分尊享包 (最高性价比)'
  }
};

/**
 * 校验卡密安全密钥（服务端专用）
 */
function getRedeemSecret(): string {
  return (
    process.env.REDEEM_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 32) ||
    'yitarot-domestic-redeem-secret-key-2026'
  );
}

/**
 * 生成防伪抗篡改的卡密/礼品兑换码
 * 格式示例：YITA100-7A9B2C-3E8F1D
 */
export function generateRedemptionCode(points: number, count: number = 1): string[] {
  if (![100, 500, 2000].includes(points)) {
    throw new Error(`不支持的积分档位: ${points}`);
  }

  const secret = getRedeemSecret();
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const salt = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 位随机字符
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${points}:${salt}`);
    const hash = hmac.digest('hex').slice(0, 6).toUpperCase(); // 6 位签名
    codes.push(`YITA${points}-${salt}-${hash}`);
  }

  return codes;
}

/**
 * 校验卡密真实性与提取积分面额
 */
export function verifyRedemptionCodeFormat(rawCode: string): {
  valid: boolean;
  points?: number;
  error?: string;
} {
  const code = (rawCode || '').trim().toUpperCase();
  const match = code.match(/^YITA(100|500|2000)-([A-F0-9]{6})-([A-F0-9]{6})$/);

  if (!match) {
    return { valid: false, error: '卡密格式无效（标准格式如：YITA100-XXXXXX-XXXXXX）' };
  }

  const points = parseInt(match[1], 10);
  const salt = match[2];
  const providedHash = match[3];

  const secret = getRedeemSecret();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${points}:${salt}`);
  const expectedHash = hmac.digest('hex').slice(0, 6).toUpperCase();

  const bufExpected = Buffer.from(expectedHash, 'utf8');
  const bufProvided = Buffer.from(providedHash, 'utf8');

  if (bufExpected.length !== bufProvided.length || !crypto.timingSafeEqual(bufExpected, bufProvided)) {
    return { valid: false, error: '卡密签名校验失败，无效或伪造的卡密' };
  }

  return { valid: true, points };
}

/**
 * 检查国内个人/聚合支付网关是否已配置环境变量
 */
export function isDomesticGatewayConfigured(): boolean {
  return Boolean(process.env.DOMESTIC_PAY_APP_ID && process.env.DOMESTIC_PAY_APP_SECRET);
}

/**
 * 创建国内支付请求（支持微信/支付宝）
 */
export async function createDomesticPaymentOrder(params: {
  userId: string;
  points: number;
  channel: 'wechat' | 'alipay';
  origin: string;
}): Promise<{
  ok: boolean;
  payUrl?: string;
  qrUrl?: string;
  orderId?: string;
  error?: string;
  manualFallback?: boolean;
}> {
  const tier = DOMESTIC_TIERS[params.points];
  if (!tier) {
    return { ok: false, error: `不支持的积分规格: ${params.points}` };
  }

  const admin = getSupabaseAdminClient();
  let orderId: string | undefined;

  if (admin) {
    try {
      const { data: newOrder } = await admin
        .from('orders')
        .insert({
          user_id: params.userId,
          amount: tier.priceCny,
          points: tier.points,
          status: 'pending'
        })
        .select('id')
        .single();

      if (newOrder) orderId = newOrder.id;
    } catch (e) {
      console.warn('[Domestic Pay] Failed to insert pending order:', e);
    }
  }

  const appId = process.env.DOMESTIC_PAY_APP_ID;
  const appSecret = process.env.DOMESTIC_PAY_APP_SECRET;
  const apiUrl = process.env.DOMESTIC_PAY_API_URL || 'https://api.xunhupay.com/payment/do.html';

  if (!appId || !appSecret) {
    // 环境变量未配置聚合网关时，优雅返回人工扫码/卡密指引
    return {
      ok: true,
      manualFallback: true,
      orderId,
      error: 'DOMESTIC_PAY_GATEWAY_NOT_CONFIGURED'
    };
  }

  try {
    const notifyUrl = `${params.origin.replace(/\/$/, '')}/api/webhooks/domestic`;
    const returnUrl = `${params.origin.replace(/\/$/, '')}/pricing?payment_status=success`;
    const tradeOrderId = orderId || `D${Date.now()}`;

    // 标准 MD5 签名聚合网关协议（虎皮椒/通用易支付标准）
    const requestData: Record<string, string> = {
      version: '1.1',
      appid: appId,
      trade_order_id: tradeOrderId,
      total_fee: String(tier.priceCny),
      title: tier.name,
      time: String(Math.floor(Date.now() / 1000)),
      notify_url: notifyUrl,
      return_url: returnUrl,
      type: params.channel === 'alipay' ? 'alipay' : 'wechat',
      wap_url: params.origin,
      wap_name: 'YiTarot'
    };

    // 字典升序拼接
    const sortedKeys = Object.keys(requestData).sort();
    const signString = sortedKeys.map((k) => `${k}=${requestData[k]}`).join('&') + appSecret;
    requestData.hash = crypto.createHash('md5').update(signString, 'utf8').digest('hex');

    const form = new URLSearchParams();
    for (const [k, v] of Object.entries(requestData)) {
      form.append(k, v);
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });

    const result = await res.json();
    if (result.errcode === 0 || result.url || result.code_url) {
      return {
        ok: true,
        payUrl: result.url || result.url_qrcode,
        qrUrl: result.code_url || result.url_qrcode || result.url,
        orderId: tradeOrderId
      };
    }

    return {
      ok: false,
      error: result.errmsg || 'Domestic payment gateway error'
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    return { ok: false, error: msg };
  }
}

/**
 * 校验国内网关回调签名
 */
export function verifyDomesticCallbackSignature(
  params: Record<string, string>,
  appSecret: string
): boolean {
  if (!params.hash) return false;

  const { hash, ...rest } = params;
  const sortedKeys = Object.keys(rest).sort();
  const signString = sortedKeys.map((k) => `${k}=${rest[k]}`).join('&') + appSecret;
  const expectedHash = crypto.createHash('md5').update(signString, 'utf8').digest('hex');

  return expectedHash.toLowerCase() === hash.toLowerCase();
}
