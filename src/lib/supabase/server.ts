import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 服务端 Supabase 客户端（Server Component / Route Handler）。
 * 会话令牌读写走 Next.js cookies；在 Route Handler 中可直接写回，在
 * Server Component 中只读（写入会抛错，已被捕获忽略——刷新交给 src/proxy.ts）。
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component 中无法写 cookie：忽略，由 proxy.ts 统一刷新会话
          }
        }
      }
    }
  );
}

/** 获取当前登录用户（未登录返回 null） */
export async function getSupabaseUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}
