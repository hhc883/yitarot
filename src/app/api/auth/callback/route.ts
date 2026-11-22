import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * GET /api/auth/callback —— Supabase OAuth / 邮箱验证码回调。
 * 交换 code 换取会话（PKCE），成功后跳转 next（默认账号页）。
 *
 * 关键注意：
 * 在 Next.js Route Handler 中，NextResponse.redirect 会创建全新的响应实例，
 * 默认不会继承 next/headers cookieStore 中写入的 cookie。
 * 必须将 setAll 明确写入该 redirectResponse.cookies，浏览器才能在 307 跳转时
 * 收到 Set-Cookie 头，后续访问 /api/me 才能携带会话凭证。
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next');
  const errorParam = searchParams.get('error');
  const errorDesc = searchParams.get('error_description');

  if (errorParam || errorDesc) {
    console.error('Supabase OAuth callback received error:', errorParam, errorDesc);
  }

  // 计算外部代理下的真实公共域名基准（适配 Vercel/Cloudflare 反代与本地环境）
  const forwardedHost = req.headers.get('x-forwarded-host')?.split(',')[0].trim();
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
    const targetUrl = new URL(safeNext, baseUrl);
    const redirectResponse = NextResponse.redirect(targetUrl);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              req.cookies.set(name, value);
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectResponse.cookies.set(name, value, options);
            });
          }
        }
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return redirectResponse;
    }

    console.error('Supabase exchangeCodeForSession failed:', error);
  }

  // 失败时带回错误标记，登录页展示提示
  const lang = safeNext.startsWith('/en') ? 'en' : 'zh';
  return NextResponse.redirect(new URL(`/${lang}/login?error=auth`, baseUrl));
}
