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
      title: '是／否塔罗｜单张牌快速决断',
      description: '免费抽取一张经典韦特塔罗牌，为二选一或犹豫不决的问题提供「是、否或静观」的倾向性参考。',
      keywords: ['是否塔罗', 'Yes or No 塔罗', '单张塔罗占卜', '二选一塔罗', 'YiTatro'],
    },
    en: {
      title: 'Yes or No Tarot - Free Single-Card Reading',
      description: 'Ask a question and draw a free single tarot card for a Yes, No, or Maybe reflection with upright and reversed meaning.',
      keywords: ['Yes or no tarot', 'Free yes no tarot', 'Single card tarot', 'Yes no maybe tarot', 'Tarot decision tool', 'YiTatro'],
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
            ? 'Draw one free tarot card for a Yes, No, or Maybe reflection on a focused question—meant for perspective, not guaranteed predictions.'
            : '抽一张牌，从另一个角度思考一个可以用「是」或「否」回答的问题。'}
        </p>
      </div>
      <Suspense fallback={<p role="status" className="border-t border-neutral-200 py-6 text-neutral-600">{isEn ? 'Loading the spread…' : '正在载入牌阵…'}</p>}>
        <YesNoWidget lang={lang} />
      </Suspense>
    </div>
  );
}
