import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * GET /api/auth/callback —— Supabase OAuth / 邮箱验证码回调。
 * 交换 code 换取会话（PKCE），成功后跳转 next（默认账号页）。
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next');

  // 计算外部代理下的真实公共域名基准（适配 Vercel/Cloudflare 反代与本地环境）
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  const isLocalEnv = process.env.NODE_ENV === 'development';

  const baseUrl = isLocalEnv
    ? origin
    : forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : process.env.NEXT_PUBLIC_SITE_URL || origin;

  // 只允许站内相对路径，防止开放重定向漏洞
  const safeNext =
    nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
      ? nextParam
      : '/zh/account';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 必须使用 NextResponse.redirect，确保 Supabase 设置的 auth token cookie 正确注入响应头
      return NextResponse.redirect(new URL(safeNext, baseUrl));
    }

    console.error('Supabase exchangeCodeForSession failed:', error);
  }

  // 失败时带回错误标记，登录页展示提示
  const lang = safeNext.startsWith('/en') ? 'en' : 'zh';
  return NextResponse.redirect(new URL(`/${lang}/login?error=auth`, baseUrl));
}
