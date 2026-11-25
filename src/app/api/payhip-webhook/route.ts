import crypto from 'node:crypto';
import { PAYMENT_TIERS, isPaymentTier } from '@/lib/payments/catalog';
import { objectRecord } from '@/lib/payments/shared';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

function integerCents(value: unknown): number | null {
  if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d{1,8}$/.test(value))) return null;
  const amount = Number(value);
  return Number.isSafeInteger(amount) && amount > 0 && amount <= 99999999 ? amount : null;
}

export async function POST(req: Request) {
  const key = process.env.PAYHIP_API_KEY?.trim();
  if (!key) return Response.json({ error: 'payhip_unavailable' }, { status: 503 });
  const payload = objectRecord(await req.json().catch(() => null));
  if (!payload) return Response.json({ error: 'invalid_payload' }, { status: 400 });
  const signature = payload.signature;
  const expected = crypto.createHash('sha256').update(key).digest();
  if (typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature) ||
      !crypto.timingSafeEqual(expected, Buffer.from(signature, 'hex'))) {
    return Response.json({ error: 'invalid_signature' }, { status: 401 });
  }

  const type = payload.type;
  if (type !== 'paid' && type !== 'refunded') return Response.json({ ok: true, ignored: 'event' });
  const items = payload.items;
  const item = Array.isArray(items) && items.length === 1 ? objectRecord(items[0]) : null;
  const plan = Object.entries(PAYMENT_TIERS).find(([, entry]) => entry.payhip === item?.product_key);
  if (!plan) return Response.json({ ok: true, ignored: 'unsupported_items' });
  const points = Number(plan[0]);
  const price = integerCents(payload.price);
  const tx = payload.id ?? payload.transaction_id;
  if (!isPaymentTier(points) || price === null || typeof tx !== 'string' || !/^[A-Za-z0-9_-]{1,96}$/.test(tx) ||
      typeof payload.currency !== 'string' || payload.currency.toUpperCase() !== 'USD' ||
      (item?.quantity !== '1' && item?.quantity !== 1) || payload.is_gift === true) {
    return Response.json({ error: 'invalid_payment' }, { status: 400 });
  }
  // A discount, an unsupported bundle or a nonstandard tax total must not reconcile
  // automatically against a fixed-price points pack.
  if (price !== plan[1].usd) return Response.json({ error: 'payment_amount_mismatch' }, { status: 400 });

  const refund = type === 'refunded';
  if (refund && integerCents(payload.amount_refunded) !== price) {
    return Response.json({ ok: true, ignored: 'partial_refund_review' });
  }
  const admin = getSupabaseAdminClient();
  if (!admin) return Response.json({ error: 'settlement_unavailable' }, { status: 503 });

  // Existing transactions and their refunds are bound to the original owner by the RPC.
  const { data: order, error: orderError } = await admin.from('orders').select('user_id')
    .eq('payhip_transaction_id', tx).maybeSingle();
  if (orderError) return Response.json({ error: 'settlement_unavailable' }, { status: 503 });
  let userId = order?.user_id ?? null;
  if (!userId && !refund) {
    const incoming = typeof payload.email === 'string' ? payload.email.trim() : '';
    if (!incoming || incoming.length > 254 || !/^[^\s@]+@[^\s@]+$/.test(incoming)) {
      return Response.json({ error: 'invalid_payment_email' }, { status: 400 });
    }
    const { data: owner, error } = await admin.rpc('find_verified_payment_user', { p_email: incoming });
    if (error) return Response.json({ error: 'settlement_unavailable' }, { status: 503 });
    if (typeof owner === 'string') userId = owner;
  }
  const { data, error } = await admin.rpc('settle_payhip_credit', {
    p_user_id: userId, p_transaction: tx, p_points: points, p_minor: price, p_refund: refund
  });
  if (error) console.error('[Payhip] Settlement unavailable', error.code);
  if (data?.status === 'invalid_payment') return Response.json({ error: 'invalid_payment' }, { status: 400 });
  if (error || !['ok', 'already_credited'].includes(data?.status)) {
    return Response.json({ error: 'settlement_unavailable' }, { status: 503 });
  }
  return Response.json({ ok: true });
}
