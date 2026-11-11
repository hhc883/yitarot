import { createSupabaseServerClient, getSupabaseUser } from '@/lib/supabase/server';

export interface SpendVerification {
  ok: boolean;
  /** HTTP 状态码：401 未登录 / 400 参数非法 / 402 未找到有效扣分记录（未扣分或伪造） */
  status: number;
}

/**
 * 测算 API 的服务端二次校验：确认该用户确有一笔 reading_spend 账本记录
 * 与客户端提交的 points_ref 匹配（幂等键），防止绕过扣分接口直接生成测算。
 */
export async function verifyReadingSpend(refId: unknown): Promise<SpendVerification> {
  const user = await getSupabaseUser();
  if (!user) return { ok: false, status: 401 };

  if (typeof refId !== 'string' || refId.trim().length === 0 || refId.length > 128) {
    return { ok: false, status: 400 };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('point_ledger')
    .select('id')
    .eq('user_id', user.id)
    .eq('kind', 'reading_spend')
    .eq('ref_id', refId.trim())
    .maybeSingle();

  if (error) return { ok: false, status: 500 };
  if (!data) return { ok: false, status: 402 };

  return { ok: true, status: 200 };
}

/** 统一的 JSON 错误响应 */
export function pointsErrorResponse(status: number) {
  const reason =
    status === 401
      ? 'unauthenticated'
      : status === 402
        ? 'insufficient'
        : status === 400
          ? 'invalid_points_ref'
          : 'points_unavailable';

  return new Response(JSON.stringify({ error: reason }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
