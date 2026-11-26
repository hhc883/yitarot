import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { YesNoWidget } from '@/components/tarot/YesNoWidget';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildBreadcrumbJsonLd,
  buildLocalizedMetadata,
  buildWebAppJsonLd
} from '@/lib/seo/metadata';

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
    routePath: '/yes-no',
    title: isEn
      ? 'Yes or No Tarot - Single Card Quick Decision Oracle'
      : '是／否塔罗｜单张牌快速决断与倾向指引',
    description: isEn
      ? 'Draw one Rider-Waite card for a clear Yes, No, or Neutral tendency on pressing questions, along with the hidden variable behind the outcome.'
      : '心中拿不定主意？抽取一张韦特塔罗牌，快速获得「是 / 否 / 中性」的清晰倾向判断与关键变量提示。',
    keywords: isEn
      ? ['Yes or No tarot', 'Quick tarot answer', 'Single card decision tarot']
      : ['是否塔罗', 'Yes No 塔罗', '单张塔罗决断', '在线塔罗测试']
  });
}

export default async function YesNoPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const structuredData = [
    buildBreadcrumbJsonLd(lang, [
      { name: isEn ? 'Tarot' : '塔罗专厅', path: '/west' },
      { name: isEn ? 'Yes or No Tarot' : '是／否塔罗', path: '/yes-no' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/yes-no',
      name: isEn ? 'Yes or No Tarot' : 'YiTatro 是／否塔罗',
      description: isEn
        ? 'Single-card Yes or No tarot decision tool.'
        : '单张牌快速决断的在线是／否塔罗工具。'
    })
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 text-neutral-900 sm:px-6 sm:py-12 lg:py-16">
      <JsonLd data={structuredData} />
      <Link
        href={`/${lang}/west`}
        className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
      >
        <span aria-hidden="true">←</span>
        {isEn ? 'Back to Tarot' : '返回塔罗专厅'}
      </Link>
      <div className="mb-8 mt-3 max-w-2xl sm:mb-10">
        <h1 className="font-serif text-[30px] font-semibold leading-tight tracking-tight sm:text-[40px]">
          {isEn ? 'Yes or No Tarot' : '是／否塔罗'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          {isEn
            ? 'Draw one card to reflect on a question with two possible answers.'
            : '抽一张牌，从另一个角度思考一个可以用「是」或「否」回答的问题。'}
        </p>
      </div>
      <Suspense
        fallback={
          <p role="status" className="border-t border-neutral-200 py-6 text-neutral-600">
            {isEn ? 'Loading the spread…' : '正在载入牌阵…'}
          </p>
        }
      >
        <YesNoWidget lang={lang} />
      </Suspense>
    </div>
  );
}
