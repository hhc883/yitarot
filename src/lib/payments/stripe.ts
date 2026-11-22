import crypto from 'crypto';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export interface StripeTier {
  points: number;
  priceUsd: number;
  cents: number;
  name: string;
}

export const STRIPE_TIERS: Record<number, StripeTier> = {
  100: {
    points: 100,
    priceUsd: 4.99,
    cents: 499,
    name: 'YiTarot 100 Points'
  },
  500: {
    points: 500,
    priceUsd: 19.99,
    cents: 1999,
    name: 'YiTarot 500 Points (Popular)'
  },
  2000: {
    points: 2000,
    priceUsd: 59.99,
    cents: 5999,
    name: 'YiTarot 2000 Points (Best Value)'
  }
};

/**
 * 检查 Stripe 环境变量是否就绪
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * 创建 Stripe 结账会话
 */
export async function createStripeCheckoutSession(params: {
  userId: string;
  email?: string;
  points: number;
  origin: string;
}): Promise<{ ok: boolean; sessionUrl?: string; sessionId?: string; error?: string }> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return {
      ok: false,
      error: 'STRIPE_SECRET_KEY is not configured in server environment variables.'
    };
  }

  const tier = STRIPE_TIERS[params.points];
  if (!tier) {
    return { ok: false, error: `Invalid points tier: ${params.points}` };
  }

  const admin = getSupabaseAdminClient();
  let orderId: string | undefined;

  // 1. 若 Admin Client 存在，记录待支付订单
  if (admin) {
    try {
      const { data: newOrder, error: orderError } = await admin
        .from('orders')
        .insert({
          user_id: params.userId,
          amount: tier.priceUsd,
          points: tier.points,
          status: 'pending'
        })
        .select('id')
        .single();

      if (!orderError && newOrder) {
        orderId = newOrder.id;
      }
    } catch (e) {
      console.warn('[Stripe] Could not create pending orders record:', e);
    }
  }

  // 2. 调用 Stripe Checkout Sessions REST API
  try {
    const origin = params.origin.replace(/\/$/, '');
    const successUrl = `${origin}/pricing?payment_status=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/pricing?payment_status=cancelled`;

    const bodyParams = new URLSearchParams();
    bodyParams.append('mode', 'payment');
    bodyParams.append('success_url', successUrl);
    bodyParams.append('cancel_url', cancelUrl);
    bodyParams.append('client_reference_id', params.userId);

    if (params.email) {
      bodyParams.append('customer_email', params.email);
    }

    bodyParams.append('line_items[0][price_data][currency]', 'usd');
    bodyParams.append('line_items[0][price_data][unit_amount]', String(tier.cents));
    bodyParams.append('line_items[0][price_data][product_data][name]', tier.name);
    bodyParams.append(
      'line_items[0][price_data][product_data][description]',
      `YiTarot AI Divination Credits (${tier.points} Points)`
    );
    bodyParams.append('line_items[0][quantity]', '1');

    bodyParams.append('metadata[user_id]', params.userId);
    bodyParams.append('metadata[points]', String(tier.points));
    if (orderId) {
      bodyParams.append('metadata[order_id]', orderId);
    }

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyParams.toString()
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[Stripe] Create session failed:', data);
      return { ok: false, error: data?.error?.message || 'Stripe API error' };
    }

    // 3. 关联 stripe_session_id
    if (admin && orderId && data.id) {
      await admin.from('orders').update({ stripe_session_id: data.id }).eq('id', orderId);
    }

    return {
      ok: true,
      sessionId: data.id,
      sessionUrl: data.url
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    console.error('[Stripe] Exception creating session:', err);
    return { ok: false, error: msg };
  }
}

/**
 * 查询指定 Stripe Checkout 会话详情
 */
export async function retrieveStripeCheckoutSession(sessionId: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`
      }
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * 校验 Stripe Webhook 签名（防伪造与重放攻击）
 */
export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  webhookSecret: string
): boolean {
  if (!signatureHeader || !webhookSecret) return false;

  try {
    const items = signatureHeader.split(',');
    let timestamp = '';
    const signatures: string[] = [];

    for (const item of items) {
      const [key, val] = item.trim().split('=');
      if (key === 't') timestamp = val;
      if (key === 'v1') signatures.push(val);
    }

    if (!timestamp || signatures.length === 0) return false;

    // 允许 300 秒时间漂移
    const eventTime = parseInt(timestamp, 10);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - eventTime) > 300) {
      console.warn('[Stripe Webhook] Timestamp drift > 300s');
      return false;
    }

    const signedPayload = `${timestamp}.${rawBody}`;
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(signedPayload);
    const expectedSignature = hmac.digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    for (const sig of signatures) {
      const sigBuffer = Buffer.from(sig, 'utf8');
      if (
        expectedBuffer.length === sigBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, sigBuffer)
      ) {
        return true;
      }
    }

    return false;
  } catch (e) {
    console.error('[Stripe Webhook] Signature verification error:', e);
    return false;
  }
}
