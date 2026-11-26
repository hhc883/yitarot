import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LoveTarotWidget } from '@/components/tarot/LoveTarotWidget';
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
    routePath: '/love',
    title: isEn
      ? 'Love Tarot Reading - Relationship Mirror & Next Step Spread'
      : '爱情塔罗｜情感关系镜像·对方视角与下一步指引',
    description: isEn
      ? 'Choose your relationship situation and draw three tarot cards to explore your perspective, your partner’s inner stance, and a constructive next step.'
      : '选择当前情感状态（暧昧、恋爱、复合或沟通），抽取三张塔罗牌，照见自我真实感受、对方内心视角与关系破局方向。',
    keywords: isEn
      ? ['Love tarot', 'Relationship tarot spread', 'Does he love me tarot', 'Reconciliation tarot']
      : ['爱情塔罗', '情感占卜', '复合塔罗', '对方心里想法塔罗', '三张牌爱情牌阵']
  });
}

export default async function LovePage({
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
      { name: isEn ? 'Love Tarot' : '爱情塔罗', path: '/love' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/love',
      name: isEn ? 'Love Tarot Spread' : 'YiTatro 爱情塔罗牌阵',
      description: isEn
        ? 'Three-card love and relationship tarot reading.'
        : '三张牌情感关系镜像与下一步行动指引工具。'
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
          {isEn ? 'Love Tarot' : '爱情塔罗'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          {isEn
            ? 'Choose your relationship situation and draw three cards to explore your perspective, theirs, and a possible next step.'
            : '选择适合你的情境，抽三张牌，分别看看自己的感受、对方的视角和可以尝试的下一步。'}
        </p>
      </div>
      <Suspense
        fallback={
          <p role="status" className="border-t border-neutral-200 py-6 text-neutral-600">
            {isEn ? 'Loading the spread…' : '正在载入牌阵…'}
          </p>
        }
      >
        <LoveTarotWidget lang={lang} />
      </Suspense>
    </div>
  );
}
