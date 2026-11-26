import React from 'react';
import type { Metadata } from 'next';
import { AccountClient } from '@/components/site/AccountClient';
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
    routePath: '/account',
    title: isEn ? 'Account & Points Ledger' : '个人账户与积分明细',
    description: isEn
      ? 'Manage your YiTatro account, points balance, and divination history.'
      : '管理你的 YiTatro 账户、积分余额与历史占卜记录。',
    noIndex: true
  });
}

export default async function AccountPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full">
      <AccountClient lang={lang} />
    </div>
  );
}
