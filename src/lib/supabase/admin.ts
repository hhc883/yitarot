import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedAdminClient: SupabaseClient | null = null;

/**
 * 服务端 Supabase Admin 客户端（使用 SUPABASE_SERVICE_ROLE_KEY）。
 * 拥有绕过 RLS 权限，仅用于服务端处理订单履约、积分发放、账本对账等高特权逻辑。
 * 禁止暴露给客户端！
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY 未配置，无法执行特权数据写入。'
      );
    }
    return null;
  }

  if (!cachedAdminClient) {
    cachedAdminClient = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return cachedAdminClient;
}
