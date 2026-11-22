import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseUser } from '@/lib/supabase/server';
import { verifyRedemptionCodeFormat } from '@/lib/payments/domestic';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { creditUserPoints } from '@/lib/points/fulfill';

/**
 * POST /api/points/redeem
 * 使用防伪卡密/兑换码直接充值积分（即时生效）
 */
export async function POST(req: NextRequest) {
  const user = await getSupabaseUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const rawCode = (body.code || '').trim().toUpperCase();
  if (!rawCode) {
    return NextResponse.json(
      { error: 'empty_code', message: '请输入兑换码/卡密。' },
      { status: 400 }
    );
  }

  // 1. 密码学签名核验（校验格式、面额、防篡改签名）
  const verifyResult = verifyRedemptionCodeFormat(rawCode);
  if (!verifyResult.valid || !verifyResult.points) {
    return NextResponse.json(
      {
        error: 'invalid_code',
        message: verifyResult.error || '兑换码无效或已过期，请核对后重新输入。'
      },
      { status: 400 }
    );
  }

  const points = verifyResult.points;
  const refId = `redeem:${rawCode}`;

  // 2. 检查全库是否已被任意用户兑换过（卡密全局一次性有效）
  const admin = getSupabaseAdminClient();
  if (admin) {
    const { data: alreadyUsed } = await admin
      .from('point_ledger')
      .select('id, user_id, created_at')
      .eq('kind', 'purchase')
      .eq('ref_id', refId)
      .maybeSingle();

    if (alreadyUsed) {
      return NextResponse.json(
        {
          error: 'code_already_used',
          message: '该兑换码已被使用过，每张卡密仅可兑换一次。'
        },
        { status: 400 }
      );
    }
  }

  // 3. 履约发放积分到当前用户
  const fulfillResult = await creditUserPoints({
    userId: user.id,
    points,
    refId
  });

  if (!fulfillResult.ok) {
    return NextResponse.json(
      {
        error: 'fulfill_failed',
        message: fulfillResult.error || '积分入账失败，请稍后重试。'
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    pointsAdded: points,
    newBalance: fulfillResult.newBalance,
    code: rawCode
  });
}
