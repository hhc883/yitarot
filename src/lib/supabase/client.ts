import { createBrowserClient } from '@supabase/ssr';

/**
 * 浏览器端 Supabase 客户端（仅使用 publishable/anon key，配合 RLS）。
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
