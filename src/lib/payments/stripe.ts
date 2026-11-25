import crypto from 'node:crypto';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { PAYMENT_TIERS, type PaymentTier } from '@/lib/payments/catalog';
import { objectRecord, paymentSiteOrigin, secureHttpsUrl, STRIPE_SESSION_ID, UUID } from '@/lib/payments/shared';

export function isStripeConfigured(): boolean {
  return Boolean(paymentSiteOrigin() && process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET &&
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function createStripeCheckoutSession(params: {
  userId: string;
  email?: string;
  points: PaymentTier;
  lang: 'zh' | 'en';
}) {
  const origin = paymentSiteOrigin();
  const admin = getSupabaseAdminClient();
  if (!isStripeConfigured() || !origin || !admin) return null;
  const amount = PAYMENT_TIERS[params.points].usd;
  const id = crypto.randomUUID();
  const { error } = await admin.from('orders').insert({
    id, user_id: params.userId, amount: amount / 100, points: params.points,
    payment_provider: 'stripe', currency: 'USD', status: 'pending'
  });
  if (error) return null;

  const pathname = origin + '/' + params.lang + '/pricing';
  const body = new URLSearchParams({
    mode: 'payment',
    success_url: pathname + '?payment_status=success&session_id={CHECKOUT_SESSION_ID}',
    cancel_url: pathname + '?payment_status=cancelled',
    client_reference_id: params.userId,
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': String(amount),
    'line_items[0][price_data][product_data][name]': 'YiTatro ' + params.points + ' Points',
    'line_items[0][quantity]': '1',
    'metadata[user_id]': params.userId,
    'metadata[order_id]': id,
    'metadata[points]': String(params.points)
  });
  if (params.email) body.set('customer_email', params.email);

  try {
    const response = await stripeRequest('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Idempotency-Key': id },
      body
    });
    const session = objectRecord(await response.json());
    if (!response.ok || !session || typeof session.id !== 'string' || !STRIPE_SESSION_ID.test(session.id)) return null;
    const url = secureHttpsUrl(session.url);
    if (!url || new URL(url).hostname !== 'checkout.stripe.com') return null;
    const { error: linkError } = await admin.from('orders').update({ stripe_session_id: session.id }).eq('id', id);
    return linkError ? null : { sessionUrl: url, sessionId: session.id };
  } catch {
    return null;
  }
}

function stripeRequest(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set('Authorization', 'Bearer ' + process.env.STRIPE_SECRET_KEY);
  return fetch('https://api.stripe.com/v1/checkout/sessions' + path, {
    ...init, headers, cache: 'no-store', signal: AbortSignal.timeout(10000), redirect: 'error'
  });
}

export async function retrieveStripeCheckoutSession(sessionId: string) {
  if (!STRIPE_SESSION_ID.test(sessionId)) return { status: 'not_found' } as const;
  if (!process.env.STRIPE_SECRET_KEY) return { status: 'unavailable' } as const;
  try {
    const res = await stripeRequest('/' + sessionId);
    if (res.status === 404) return { status: 'not_found' } as const;
    if (!res.ok) return { status: 'unavailable' } as const;
    const session = objectRecord(await res.json());
    return session?.id === sessionId ? { status: 'ok', session } as const : { status: 'unavailable' } as const;
  } catch {
    return { status: 'unavailable' } as const;
  }
}

export function stripeSessionOwner(session: Record<string, unknown>): string | null {
  const metadata = objectRecord(session.metadata);
  const reference = session.client_reference_id;
  const owner = metadata?.user_id ?? reference;
  return typeof owner === 'string' && UUID.test(owner) && (reference == null || reference === owner) ? owner : null;
}

export async function validateStripeSettlement(session: Record<string, unknown>) {
  const metadata = objectRecord(session.metadata);
  const orderId = metadata?.order_id;
  const sessionId = session.id;
  const userId = stripeSessionOwner(session);
  const amount = session.amount_total;
  if (!userId || session.mode !== 'payment' || session.currency !== 'usd' ||
      typeof orderId !== 'string' || !UUID.test(orderId) ||
      typeof sessionId !== 'string' || !STRIPE_SESSION_ID.test(sessionId) ||
      typeof amount !== 'number' || !Number.isSafeInteger(amount) || amount <= 0) {
    return { status: 'invalid' } as const;
  }
  const admin = getSupabaseAdminClient();
  if (!admin) return { status: 'unavailable' } as const;
  const { data: order, error } = await admin.from('orders').select('user_id, stripe_session_id')
    .eq('id', orderId).maybeSingle();
  if (error) return { status: 'unavailable' } as const;
  if (!order || order.user_id !== userId || order.stripe_session_id !== sessionId) return { status: 'invalid' } as const;
  return { status: 'ok', orderId, amount, sessionId } as const;
}

export function verifyStripeWebhookSignature(
  rawBody: string, signatureHeader: string | null, webhookSecret: string, now = Math.floor(Date.now() / 1000)
): boolean {
  if (!signatureHeader || !webhookSecret) return false;
  const fields = signatureHeader.split(',').map(item => item.trim());
  const timestamps = fields.filter(item => item.startsWith('t='));
  if (timestamps.length !== 1 || !/^t=\d{1,12}$/.test(timestamps[0])) return false;
  const timestamp = timestamps[0].slice(2);
  if (Math.abs(now - Number(timestamp)) > 300) return false;
  const expected = crypto.createHmac('sha256', webhookSecret).update(timestamp + '.' + rawBody).digest();
  return fields.some(item => /^v1=[a-f0-9]{64}$/i.test(item) &&
    crypto.timingSafeEqual(expected, Buffer.from(item.slice(3), 'hex')));
}
