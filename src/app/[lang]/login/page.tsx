import React from 'react';
import { LoginForm } from '@/components/site/LoginForm';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
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
