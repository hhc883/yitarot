import { NextRequest } from 'next/server';
import { createSupabaseServerClient, getSupabaseUser } from '@/lib/supabase/server';
import { READING_COST, isReadingType } from '@/lib/points/constants';

/**
 * POST /api/readings/consume —— 测算前扣 10 积分（幂等）。
 * body: { type: 'tarot' | 'bazi' | 'liuyao', ref_id?: string }
 * 返回：
 *   200 { status: 'ok' | 'already_spent', balance, ref_id }
 *   401 未登录
 *   402 余额不足（不生成测算）
 *   400 参数非法
 */
export async function POST(req: NextRequest) {
  const user = await getSupabaseUser();

  if (!user) {
    return new Response(JSON.stringify({ status: 'unauthenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body: { type?: string; ref_id?: string } = {};
  try {
    body = (await req.json()) as { type?: string; ref_id?: string };
  } catch {
    body = {};
  }

  const type = isReadingType(body.type) ? body.type : 'tarot';
  // 幂等 key：客户端生成；缺省时由服务端生成（此时幂等性由调用方自行保证）
  const refId =
    typeof body.ref_id === 'string' && body.ref_id.trim().length > 0 && body.ref_id.length <= 128
      ? body.ref_id.trim()
      : `reading:${user.id}:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;

  const supabase = await createSupabaseServerClient();

  // 1. 扣分（数据库函数内含事务、行锁与幂等检查）
  const { data, error } = await supabase.rpc('spend_reading_points', {
    p_amount: READING_COST,
    p_ref: refId
  });

  if (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = (data ?? {}) as { status?: string; balance?: number; need?: number };

  if (result.status === 'unauthenticated') {
    return new Response(JSON.stringify({ status: 'unauthenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (result.status === 'insufficient') {
    return new Response(
      JSON.stringify({
        status: 'insufficient',
        balance: result.balance ?? 0,
        need: result.need ?? READING_COST
      }),
      { status: 402, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (result.status !== 'ok' && result.status !== 'already_spent') {
    return new Response(JSON.stringify({ status: result.status ?? 'error' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. 记录测算历史（幂等重放时不重复记录）
  if (result.status === 'ok') {
    await supabase.from('readings').insert({
      user_id: user.id,
      type,
      points_spent: READING_COST
    });
  }

  return new Response(
    JSON.stringify({ status: result.status, balance: result.balance ?? 0, ref_id: refId }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
