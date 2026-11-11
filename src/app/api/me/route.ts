import { createSupabaseServerClient, getSupabaseUser } from '@/lib/supabase/server';

export interface MeResponse {
  user: {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string;
  };
  balance: number;
  daily_claimed: boolean;
}

/** 北京时间当日日期（YYYY-MM-DD） */
export function beijingToday(): string {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }))
    .toISOString()
    .slice(0, 10);
}

/**
 * GET /api/me —— 返回登录用户档案、当前积分余额（余额 = 账本求和）与今日是否已领取。
 * 未登录返回 401。
 */
export async function GET() {
  const user = await getSupabaseUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'unauthenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const supabase = await createSupabaseServerClient();

  const [profileResult, ledgerResult, claimResult] = await Promise.all([
    supabase.from('profiles').select('email, display_name, avatar_url').eq('id', user.id).maybeSingle(),
    supabase.from('point_ledger').select('amount').eq('user_id', user.id),
    supabase
      .from('daily_claims')
      .select('claim_date')
      .eq('user_id', user.id)
      .eq('claim_date', beijingToday())
      .maybeSingle()
  ]);

  if (ledgerResult.error) {
    return new Response(JSON.stringify({ error: 'ledger_unavailable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const balance = (ledgerResult.data ?? []).reduce((sum, row) => sum + (row.amount ?? 0), 0);
  const profile = profileResult.data;

  const payload: MeResponse = {
    user: {
      id: user.id,
      email: user.email ?? profile?.email ?? '',
      display_name:
        profile?.display_name ??
        (user.user_metadata?.full_name as string | undefined) ??
        (user.email ? user.email.split('@')[0] : ''),
      avatar_url:
        profile?.avatar_url ??
        (user.user_metadata?.avatar_url as string | undefined) ??
        (user.user_metadata?.picture as string | undefined) ??
        ''
    },
    balance,
    daily_claimed: Boolean(claimResult.data)
  };

  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' }
  });
}
