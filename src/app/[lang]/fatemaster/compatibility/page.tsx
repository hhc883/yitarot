import React, { Suspense } from 'react';
import { ZodiacCompatibilityWidget } from '@/components/fatemaster/ZodiacCompatibilityWidget';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function FateMasterCompatibilityPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 sm:py-16">
      <Suspense fallback={<div className="py-20 text-center text-xs text-[#736B5E] animate-pulse">正在载入生肖配对...</div>}>
        <ZodiacCompatibilityWidget lang={lang} />
      </Suspense>
    </div>
  );
}
