import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseUser } from '@/lib/supabase/server';
import { createStripeCheckoutSession, isStripeConfigured } from '@/lib/payments/stripe';

/**
 * POST /api/checkout/stripe
 * 创建 Stripe 国际支付结账会话
 */
export async function POST(req: NextRequest) {
  const user = await getSupabaseUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  let body: { points?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const points = Number(body.points);
  if (![100, 500, 2000].includes(points)) {
    return NextResponse.json(
      { error: 'invalid_tier', message: 'Supported tiers are 100, 500, 2000 points.' },
      { status: 400 }
    );
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error: 'stripe_not_configured',
        message:
          'Stripe 密钥暂未配置。请在 Vercel 环境变量中添加 STRIPE_SECRET_KEY 与 STRIPE_WEBHOOK_SECRET。'
      },
      { status: 503 }
    );
  }

  const origin = req.nextUrl.origin || 'https://www.yitarot.net';

  const result = await createStripeCheckoutSession({
    userId: user.id,
    email: user.email,
    points,
    origin
  });

  if (!result.ok || !result.sessionUrl) {
    return NextResponse.json(
      { error: 'stripe_session_failed', message: result.error || 'Failed to create checkout session' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    checkout_url: result.sessionUrl,
    session_id: result.sessionId
  });
}
