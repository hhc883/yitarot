import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * GET /api/auth/callback —— Supabase OAuth / 邮箱验证码回调。
 * 交换 code 换取会话（PKCE），成功后跳转 next（默认账号页）。
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next');

  // 只允许站内相对路径，防止开放重定向
  const safeNext =
    nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
      ? nextParam
      : '/zh/account';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return Response.redirect(new URL(safeNext, origin), 302);
    }
  }

  // 失败时带回错误标记，登录页展示提示
  const lang = safeNext.startsWith('/en') ? 'en' : 'zh';
  return Response.redirect(new URL(`/${lang}/login?error=auth`, origin), 302);
}
