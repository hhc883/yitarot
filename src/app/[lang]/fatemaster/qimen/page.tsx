import React, { Suspense } from 'react';
import { QimenBoardWidget } from '@/components/fatemaster/QimenBoardWidget';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

function QimenContent({ lang }: { lang: string }) {
  return <QimenBoardWidget lang={lang} />;
}

export default async function QimenPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#736B5E] animate-pulse">
            正在推演奇门遁甲九宫局象...
          </div>
        }
      >
        <QimenContent lang={lang} />
      </Suspense>
    </div>
  );
}
