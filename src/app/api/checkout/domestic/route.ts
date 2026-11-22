import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseUser } from '@/lib/supabase/server';
import { createDomesticPaymentOrder, DOMESTIC_TIERS } from '@/lib/payments/domestic';

/**
 * POST /api/checkout/domestic
 * 发起国内微信/支付宝支付
 */
export async function POST(req: NextRequest) {
  const user = await getSupabaseUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  let body: { points?: number; channel?: 'wechat' | 'alipay' };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const points = Number(body.points);
  if (!DOMESTIC_TIERS[points]) {
    return NextResponse.json(
      { error: 'invalid_tier', message: '支持的国内充值面额为 100, 500, 2000 积分。' },
      { status: 400 }
    );
  }

  const channel = body.channel === 'alipay' ? 'alipay' : 'wechat';
  const origin = req.nextUrl.origin || 'https://www.yitarot.net';

  const result = await createDomesticPaymentOrder({
    userId: user.id,
    points,
    channel,
    origin
  });

  return NextResponse.json(result);
}
