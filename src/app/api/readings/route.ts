import { createSupabaseServerClient, getSupabaseUser } from '@/lib/supabase/server';

/**
 * GET /api/readings —— 当前用户的测算历史（时间倒序，最多 50 条）。
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
    .from('readings')
    .select('id, type, points_spent, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return new Response(JSON.stringify({ error: 'readings_unavailable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ readings: data ?? [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
