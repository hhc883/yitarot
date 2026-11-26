import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LoveTarotWidget } from '@/components/tarot/LoveTarotWidget';
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
    path: '/love',
    zh: {
      title: '爱情塔罗｜三张牌关系与情感解读',
      description: '选择当前情感状态，免费抽取三张爱情塔罗牌，分别照见自身心态、对方视角与关系走向。',
      keywords: ['爱情塔罗', '感情占卜', '三张牌爱情牌阵', '复合塔罗', '暧昧塔罗', 'YiTatro'],
    },
    en: {
      title: 'Free Love Tarot Reading - 3-Card Relationship Spread',
      description: 'Choose your relationship context and draw three free love tarot cards to reflect on your perspective, theirs, and a constructive next step.',
      keywords: ['Free love tarot reading', 'Love tarot', '3 card love spread', 'Relationship tarot', 'What is he thinking tarot', 'YiTatro'],
    },
  });
}

export default async function LovePage({
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
          {isEn ? 'Free Love Tarot Reading' : '爱情塔罗'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          {isEn
            ? 'Choose your relationship context—such as crush, partner, conflict, or ex—and draw three cards to reflect on questions like "What is he thinking?" Results support personal clarity and reflection rather than stating another person’s thoughts as fact.'
            : '选择适合你的情境，抽三张牌，分别看看自己的感受、对方的视角和可以尝试的下一步。'}
        </p>
      </div>
      <Suspense fallback={<p role="status" className="border-t border-neutral-200 py-6 text-neutral-600">{isEn ? 'Loading the spread…' : '正在载入牌阵…'}</p>}>
        <LoveTarotWidget lang={lang} />
      </Suspense>
    </div>
  );
}
