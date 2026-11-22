import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export interface CreditPointsResult {
  ok: boolean;
  newBalance?: number;
  error?: string;
  alreadyCredited?: boolean;
}

/**
 * 为指定用户安全履约充值积分（服务端特权操作，防重复充值）
 * @param params.userId 充值用户的 UUID
 * @param params.points 充值的积分数量（正整数）
 * @param params.refId 充值幂等标识（如 'stripe:cs_123' 或 'redeem:YITA-...'）
 * @param params.orderId 可选的 orders 表 UUID
 * @param params.kind 默认为 'purchase'
 */
export async function creditUserPoints(params: {
  userId: string;
  points: number;
  refId: string;
  orderId?: string;
  kind?: 'purchase' | 'signup_bonus' | 'refund';
}): Promise<CreditPointsResult> {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    console.error('[creditUserPoints] Supabase Admin client not initialized');
    return { ok: false, error: 'service_role_missing' };
  }

  const kind = params.kind || 'purchase';
  const cleanRef = params.refId.trim();

  try {
    // 1. 幂等性检查：该用户该 refId 是否已发放过
    const { data: existingLedger } = await admin
      .from('point_ledger')
      .select('id, balance_after')
      .eq('user_id', params.userId)
      .eq('kind', kind)
      .eq('ref_id', cleanRef)
      .maybeSingle();

    if (existingLedger) {
      if (params.orderId) {
        await admin.from('orders').update({ status: 'completed' }).eq('id', params.orderId);
      }
      return { ok: true, newBalance: existingLedger.balance_after, alreadyCredited: true };
    }

    // 2. 查询当前用户账户余额（求和 point_ledger.amount）
    const { data: ledgerRows, error: balanceError } = await admin
      .from('point_ledger')
      .select('amount')
      .eq('user_id', params.userId);

    if (balanceError) {
      console.error('[creditUserPoints] Failed to query ledger balance:', balanceError);
      return { ok: false, error: balanceError.message };
    }

    const currentBalance = (ledgerRows ?? []).reduce((sum, r) => sum + (r.amount ?? 0), 0);
    const newBalance = currentBalance + params.points;

    // 3. 写入账本记录
    const { error: insertError } = await admin.from('point_ledger').insert({
      user_id: params.userId,
      kind,
      amount: params.points,
      balance_after: newBalance,
      ref_id: cleanRef
    });

    if (insertError) {
      // 若发生并发冲突（唯一约束 point_ledger_unique_ref_idx 命中）
      if (insertError.code === '23505') {
        const { data: recheck } = await admin
          .from('point_ledger')
          .select('balance_after')
          .eq('user_id', params.userId)
          .eq('kind', kind)
          .eq('ref_id', cleanRef)
          .maybeSingle();

        return {
          ok: true,
          newBalance: recheck?.balance_after ?? newBalance,
          alreadyCredited: true
        };
      }
      console.error('[creditUserPoints] Failed to insert ledger row:', insertError);
      return { ok: false, error: insertError.message };
    }

    // 4. 更新订单状态
    if (params.orderId) {
      await admin.from('orders').update({ status: 'completed' }).eq('id', params.orderId);
    }

    return { ok: true, newBalance, alreadyCredited: false };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[creditUserPoints] Exception occurred:', err);
    return { ok: false, error: message };
  }
}
