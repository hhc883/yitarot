import React from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/site/LoginForm';
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
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return buildLocalizedMetadata({
    lang,
    routePath: '/login',
    title: isEn ? 'Sign In' : '登录 YiTatro',
    description: isEn
      ? 'Sign in to YiTatro to sync your points and divination history.'
      : '登录 YiTatro 同步积分权益与历史排盘占卜记录。',
    noIndex: true
  });
}

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="flex min-h-[calc(100svh-72px)] w-full items-center justify-center bg-white px-6 py-16">
      <LoginForm lang={lang} />
    </div>
  );
}
