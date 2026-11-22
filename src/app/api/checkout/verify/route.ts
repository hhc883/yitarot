import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseUser } from '@/lib/supabase/server';
import { retrieveStripeCheckoutSession } from '@/lib/payments/stripe';
import { creditUserPoints } from '@/lib/points/fulfill';

/**
 * GET /api/checkout/verify?session_id=...
 * 客户端结账返回后即时核验并到账
 */
export async function GET(req: NextRequest) {
  const user = await getSupabaseUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'missing_session_id' }, { status: 400 });
  }

  const session = await retrieveStripeCheckoutSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'session_not_found' }, { status: 404 });
  }

  const sessionUserId = session.metadata?.user_id || session.client_reference_id;
  if (sessionUserId && sessionUserId !== user.id) {
    return NextResponse.json({ error: 'unauthorized_session' }, { status: 403 });
  }

  const isPaid = session.payment_status === 'paid';
  if (!isPaid) {
    return NextResponse.json({
      ok: false,
      status: session.payment_status,
      message: 'Payment not completed yet.'
    });
  }

  const points = parseInt(session.metadata?.points || '0', 10);
  const orderId = session.metadata?.order_id;

  const result = await creditUserPoints({
    userId: user.id,
    points,
    refId: `stripe:${sessionId}`,
    orderId
  });

  return NextResponse.json({
    ok: true,
    status: 'paid',
    points,
    newBalance: result.newBalance,
    alreadyCredited: result.alreadyCredited
  });
}
