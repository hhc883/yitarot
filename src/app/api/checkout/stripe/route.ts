import { getSupabaseUser } from '@/lib/supabase/server';
import { createStripeCheckoutSession, isStripeConfigured } from '@/lib/payments/stripe';
import { isPaymentTier } from '@/lib/payments/catalog';
import { noStore, objectRecord } from '@/lib/payments/shared';

export async function POST(req: Request) {
  const send = (body: Record<string, unknown>, status = 200) =>
    Response.json(body, { status, headers: noStore });
  const user = await getSupabaseUser();
  if (!user) return send({ error: 'unauthenticated' }, 401);
  const body = objectRecord(await req.json().catch(() => null));
  if (!body) return send({ error: 'invalid_json' }, 400);
  if (!isPaymentTier(body.points)) return send({ error: 'invalid_tier' }, 400);
  if (!isStripeConfigured()) return send({ error: 'stripe_unavailable' }, 503);
  const result = await createStripeCheckoutSession({
    userId: user.id, email: user.email, points: body.points, lang: body.lang === 'en' ? 'en' : 'zh'
  });
  if (!result) return send({ error: 'checkout_failed' }, 502);
  return send({ ok: true, checkout_url: result.sessionUrl, session_id: result.sessionId });
}
