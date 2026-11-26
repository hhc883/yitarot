import { createBrowserClient } from '@supabase/ssr';

export function isSupabaseBrowserConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * 浏览器端 Supabase 客户端（仅使用 publishable/anon key，配合 RLS）。
 * 在未配置环境变量的静态构建阶段提供安全兜底，避免 SSG 预渲染崩溃。
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
  return createBrowserClient(url, key);
}
