import { NextRequest, NextResponse } from 'next/server';
import { verifyStripeWebhookSignature } from '@/lib/payments/stripe';
import { creditUserPoints } from '@/lib/points/fulfill';

/**
 * POST /api/webhooks/stripe
 * 接收 Stripe 支付成功异步回调并履约加分
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret) {
    const isValid = verifyStripeWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.warn('[Stripe Webhook] Invalid webhook signature detected.');
      return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
    }
  }

  let event: {
    type?: string;
    data?: {
      object?: {
        id?: string;
        client_reference_id?: string;
        metadata?: Record<string, string>;
      };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data?.object;
    if (session) {
      const userId = session.metadata?.user_id || session.client_reference_id;
      const points = parseInt(session.metadata?.points || '0', 10);
      const orderId = session.metadata?.order_id;
      const sessionId = session.id;

      if (userId && points > 0 && sessionId) {
        console.log(`[Stripe Webhook] Crediting ${points} points to user ${userId} for session ${sessionId}`);
        await creditUserPoints({
          userId,
          points,
          refId: `stripe:${sessionId}`,
          orderId
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
