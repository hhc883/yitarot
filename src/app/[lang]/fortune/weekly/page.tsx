import { Suspense } from 'react';
import Link from 'next/link';
import { WeeklyTarotWidget } from '@/components/tarot/WeeklyTarotWidget';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function WeeklyFortunePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 text-neutral-900 sm:px-6 sm:py-12 lg:py-16">
      <Link href={`/${lang}/west`} className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">
        <span aria-hidden="true">←</span>
        {isEn ? 'Back to Tarot' : '返回塔罗专厅'}
      </Link>
      <div className="mb-8 mt-3 max-w-2xl sm:mb-10">
        <h1 className="font-serif text-[30px] font-semibold leading-tight tracking-tight sm:text-[40px]">
          {isEn ? 'Weekly Tarot' : '每周塔罗'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          {isEn ? 'Explore five cards for the week ahead, from work and relationships to the next step you can take.' : '用五张牌梳理接下来一周的整体主题、工作、关系、财务和行动方向。'}
        </p>
      </div>
      <Suspense fallback={<p role="status" className="border-t border-neutral-200 py-6 text-neutral-600">{isEn ? 'Loading the spread…' : '正在载入牌阵…'}</p>}>
        <WeeklyTarotWidget lang={lang} />
      </Suspense>
    </div>
  );
}
