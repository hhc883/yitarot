import { createSupabaseServerClient, getSupabaseUser } from '@/lib/supabase/server';

/**
 * POST /api/points/daily-claim —— 每日领取 10 积分。
 * 以北京时间日期为唯一键：同一天重复请求返回 already_claimed，次日 00:00（北京时间）后可再领。
 */
export async function POST() {
  const user = await getSupabaseUser();

  if (!user) {
    return new Response(JSON.stringify({ status: 'unauthenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('claim_daily_points');

  if (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = (data ?? {}) as { status?: string; balance?: number; date?: string };

  if (result.status === 'unauthenticated') {
    return new Response(JSON.stringify({ status: 'unauthenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
}
