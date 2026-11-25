import { objectRecord } from '@/lib/payments/shared';
import { validateStripeSettlement, verifyStripeWebhookSignature } from '@/lib/payments/stripe';
import { settleCheckoutOrder } from '@/lib/points/fulfill';

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: 'stripe_unavailable' }, { status: 503 });
  const body = await req.text();
  if (!verifyStripeWebhookSignature(body, req.headers.get('stripe-signature'), secret)) {
    return Response.json({ error: 'invalid_signature' }, { status: 400 });
  }
  let event: Record<string, unknown> | null;
  try {
    event = objectRecord(JSON.parse(body));
  } catch {
    event = null;
  }
  if (!event) return Response.json({ error: 'invalid_payload' }, { status: 400 });
  if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.async_payment_succeeded') {
    return Response.json({ received: true });
  }
  const session = objectRecord(objectRecord(event.data)?.object);
  if (!session) return Response.json({ error: 'invalid_payload' }, { status: 400 });
  if (session.payment_status !== 'paid') return Response.json({ received: true });

  const payment = await validateStripeSettlement(session);
  if (payment.status === 'invalid') return Response.json({ error: 'invalid_order' }, { status: 400 });
  if (payment.status === 'unavailable') return Response.json({ error: 'settlement_unavailable' }, { status: 503 });
  const result = await settleCheckoutOrder({
    orderId: payment.orderId, amount: payment.amount, transaction: payment.sessionId,
    provider: 'stripe', currency: 'USD'
  });
  if (result?.status === 'ok' || result?.status === 'already_credited') return Response.json({ received: true });
  return Response.json({ error: 'settlement_failed' }, { status: result?.status === 'invalid_payment' ? 400 : 503 });
}
