import { getSupabaseUser } from '@/lib/supabase/server';
import { retrieveStripeCheckoutSession, stripeSessionOwner, validateStripeSettlement } from '@/lib/payments/stripe';
import { settleCheckoutOrder } from '@/lib/points/fulfill';
import { noStore, STRIPE_SESSION_ID } from '@/lib/payments/shared';

export async function GET(req: Request) {
  const send = (body: Record<string, unknown>, status = 200) =>
    Response.json(body, { status, headers: noStore });
  const user = await getSupabaseUser();
  if (!user) return send({ error: 'unauthenticated' }, 401);
  const sessionId = new URL(req.url).searchParams.get('session_id');
  if (!sessionId || !STRIPE_SESSION_ID.test(sessionId)) return send({ error: 'invalid_session_id' }, 400);
  const found = await retrieveStripeCheckoutSession(sessionId);
  if (found.status === 'not_found') return send({ error: 'session_not_found' }, 404);
  if (found.status !== 'ok') return send({ error: 'verification_unavailable' }, 503);
  const { session } = found;
  if (stripeSessionOwner(session) !== user.id) return send({ error: 'unauthorized_session' }, 403);
  if (session.payment_status !== 'paid') return send({ ok: false, status: 'pending' });
  const payment = await validateStripeSettlement(session);
  if (payment.status === 'invalid') return send({ error: 'invalid_order' }, 400);
  if (payment.status === 'unavailable') return send({ error: 'settlement_unavailable' }, 503);
  const result = await settleCheckoutOrder({
    orderId: payment.orderId, amount: payment.amount, transaction: payment.sessionId,
    provider: 'stripe', currency: 'USD'
  });
  if (!result || (result.status !== 'ok' && result.status !== 'already_credited')) {
    return send({ error: 'settlement_failed' }, result?.status === 'invalid_payment' ? 400 : 503);
  }
  return send({ ok: true, status: 'paid', points: result.points, newBalance: result.balance,
    alreadyCredited: result.status === 'already_credited' });
}
