import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { YesNoWidget } from '@/components/tarot/YesNoWidget';
import { buildBilingualMetadata } from '@/lib/seo/metadata';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return buildBilingualMetadata({
    lang,
    path: '/yes-no',
    zh: {
      title: '是／否塔罗｜单张牌意与典籍参考',
      description: '免费抽取一张经典韦特塔罗牌，为是非类问题提供正逆位牌义与韦特原著典籍依据参考。',
      keywords: ['是否塔罗', 'Yes or No 塔罗', '单张塔罗占卜', '二选一塔罗', 'YiTatro'],
    },
    en: {
      title: 'Yes or No Tarot - Free Single-Card Reading',
      description: 'Draw a free single Rider-Waite tarot card for yes/no questions, with upright or reversed card meaning and historical source basis.',
      keywords: ['Yes or no tarot', 'Free yes no tarot', 'Single card tarot', 'Tarot card meaning', 'Tarot decision tool', 'YiTatro'],
    },
  });
}

export default async function YesNoPage({
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
          {isEn ? 'Yes or No Tarot' : '是／否塔罗'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          {isEn
            ? 'Draw one free tarot card for a yes/no question to review its upright or reversed meaning and historical source basis—meant for perspective rather than a fixed verdict.'
            : '免费抽取一张塔罗牌，结合正逆位牌义与历史典籍依据，从另一角度审视可以用「是」或「否」提出的问题。'}
        </p>
      </div>
      <Suspense fallback={<p role="status" className="border-t border-neutral-200 py-6 text-neutral-600">{isEn ? 'Loading the spread…' : '正在载入牌阵…'}</p>}>
        <YesNoWidget lang={lang} />
      </Suspense>
    </div>
  );
}
