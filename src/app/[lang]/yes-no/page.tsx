import React, { Suspense } from 'react';
import { YesNoWidget } from '@/components/tarot/YesNoWidget';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function YesNoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#736B5E] animate-pulse">
            加载决断神谕...
          </div>
        }
      >
        <YesNoWidget lang={lang} />
      </Suspense>
    </div>
  );
}
