import { NextRequest } from 'next/server';
import { createSupabaseServerClient, getSupabaseUser } from '@/lib/supabase/server';

/**
 * GET /api/east/liuyao/sessions
 * 1. GET /api/east/liuyao/sessions?id=xxx —— 读取单个卦例快照与所有多轮追问对话记录；
 * 2. GET /api/east/liuyao/sessions —— 读取当前登录用户的所有历史卦例列表。
 */
export async function GET(req: NextRequest) {
  const user = await getSupabaseUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'unauthenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('id');
  const supabase = await createSupabaseServerClient();

  if (sessionId) {
    const [sessionRes, messagesRes] = await Promise.all([
      supabase
        .from('liuyao_sessions')
        .select('id, question, reading_snapshot, created_at')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('liuyao_messages')
        .select('id, role, content, points_spent, created_at')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
    ]);

    if (sessionRes.error || !sessionRes.data) {
      return new Response(JSON.stringify({ error: 'session_not_found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(
      JSON.stringify({
        session: sessionRes.data,
        messages: (messagesRes.data ?? []).map((m) => ({
          id: String(m.id),
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }))
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 列表查询（最近 30 条）
  const { data: list, error: listErr } = await supabase
    .from('liuyao_sessions')
    .select('id, question, reading_snapshot, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30);

  if (listErr) {
    return new Response(JSON.stringify({ error: listErr.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ sessions: list ?? [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
