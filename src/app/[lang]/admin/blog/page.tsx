import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';
import { BlogAdminClient } from '@/components/blog/BlogAdminClient';
import { CONTAINER, NAV_OFFSET } from '@/components/site/constants';
import { requireBlogAdmin } from '@/lib/blog/admin-auth';
import { loadAdminBlogPosts } from '@/lib/blog/admin-posts';
import { BlogLang } from '@/lib/blog/admin-validation';
import { buildLocalizedMetadata } from '@/lib/seo/metadata';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang: BlogLang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return buildLocalizedMetadata({
    lang,
    routePath: '/admin/blog',
    title: isEn ? 'Blog Admin' : '博客后台管理',
    description: isEn
      ? 'Internal bilingual blog editor and review publisher.'
      : '内部双语博客编辑与审稿发布台。',
    noIndex: true
  });
}

async function BlogAdminGate({ lang }: { lang: BlogLang }) {
  await connection();
  const isEn = lang === 'en';
  const auth = await requireBlogAdmin();

  if (!auth.ok) {
    if (auth.reason === 'unauthenticated') {
      return (
        <div className={`${NAV_OFFSET} min-h-[75vh] bg-white text-[#171717]`}>
          <div className={`${CONTAINER} flex min-h-[65vh] items-center justify-center py-16`}>
            <div className="w-full max-w-md rounded-2xl border border-[#E4E4E7] bg-white p-8 space-y-5 text-center">
              <h1 className="font-serif text-2xl font-medium text-[#171717]">
                {isEn ? 'Sign In Required' : '需要登录后台'}
              </h1>
              <p className="text-sm text-[#52525B] leading-relaxed">
                {isEn
                  ? 'Please sign in with an authorized administrator account to access the blog studio.'
                  : '请使用已授权的管理员账号登录后再访问博客编辑后台。'}
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href={`/${lang}/login`}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#171717] px-6 text-sm font-medium text-white transition-opacity hover:opacity-85"
                >
                  {isEn ? 'Go to Sign In' : '前往登录'}
                </Link>
                <Link
                  href={`/${lang}/blog`}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#E4E4E7] px-6 text-sm font-medium text-[#52525B] hover:border-[#171717] hover:text-[#171717]"
                >
                  {isEn ? 'Back to Blog' : '返回博客首页'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`${NAV_OFFSET} min-h-[75vh] bg-white text-[#171717]`}>
        <div className={`${CONTAINER} flex min-h-[65vh] items-center justify-center py-16`}>
          <div className="w-full max-w-md rounded-2xl border border-[#E4E4E7] bg-white p-8 space-y-5 text-center">
            <h1 className="font-serif text-2xl font-medium text-[#171717]">
              {isEn ? 'Access Denied' : '无访问权限'}
            </h1>
            <p className="text-sm text-[#52525B] leading-relaxed">
              {isEn
                ? 'Your account is not in the configured blog administrator allowlist.'
                : '当前登录账号不在博客管理员白名单中，已被服务端拒绝访问。'}
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href={`/${lang}/account`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#171717] px-6 text-sm font-medium text-white transition-opacity hover:opacity-85"
              >
                {isEn ? 'Account Center' : '前往个人中心'}
              </Link>
              <Link
                href={`/${lang}/blog`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#E4E4E7] px-6 text-sm font-medium text-[#52525B] hover:border-[#171717] hover:text-[#171717]"
              >
                {isEn ? 'Back to Blog' : '返回博客首页'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const loaded = await loadAdminBlogPosts(lang);
  if (!loaded.ok) {
    return null;
  }

  const githubConfigured = Boolean((process.env.YITATRO_BLOG_GITHUB_TOKEN ?? '').trim());

  return (
    <BlogAdminClient
      lang={lang}
      adminEmail={auth.user.email}
      posts={loaded.posts}
      githubConfigured={githubConfigured}
    />
  );
}

export default async function BlogAdminPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: BlogLang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return (
    <Suspense
      fallback={
        <div className={`${NAV_OFFSET} min-h-[75vh] bg-white text-[#52525B]`}>
          <div className={`${CONTAINER} py-24 text-center font-serif text-sm`}>
            {isEn ? 'Verifying administrator session…' : '正在校验管理员会话…'}
          </div>
        </div>
      }
    >
      <BlogAdminGate lang={lang} />
    </Suspense>
  );
}
