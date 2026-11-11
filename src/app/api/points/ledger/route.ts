import { createSupabaseServerClient, getSupabaseUser } from '@/lib/supabase/server';

/**
 * GET /api/points/ledger —— 当前用户积分流水（时间倒序，最多 100 条）。
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
  const { data, error } = await supabase
    .from('point_ledger')
    .select('id, kind, amount, balance_after, ref_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return new Response(JSON.stringify({ error: 'ledger_unavailable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ entries: data ?? [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
