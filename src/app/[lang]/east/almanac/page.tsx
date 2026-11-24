import type { Metadata } from 'next';
import Link from 'next/link';
import { AlmanacWidget } from '@/components/east/AlmanacWidget';

export const instant = false;

const COPY = {
  zh: {
    title: '黄历择日',
    description: '按传统黄历的每日宜忌，查看入宅搬家、开业和签约的候选日期。无需输入生辰。',
    back: '返回东方专厅',
  },
  en: {
    title: 'Chinese Almanac Date Finder',
    description: 'Compare dates for moving, opening a business, or signing a contract using traditional Chinese almanac entries. No birth details needed.',
    back: 'Back to I Ching & BaZi',
  },
};

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = raw === 'en' ? 'en' : 'zh';
  const { title, description } = COPY[lang];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yitarot.net';
  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${lang}/east/almanac`,
      languages: {
        zh: `${siteUrl}/zh/east/almanac`,
        en: `${siteUrl}/en/east/almanac`,
        'x-default': `${siteUrl}/zh/east/almanac`,
      },
    },
  };
}

export default async function AlmanacPage({ params }: Props) {
  const { lang: raw } = await params;
  const lang = raw === 'en' ? 'en' : 'zh';
  const { title, description, back } = COPY[lang];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 text-neutral-900 sm:px-6 sm:py-12 lg:py-16">
      <Link
        href={`/${lang}/east`}
        className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
      >
        <span aria-hidden="true">←</span>
        {back}
      </Link>
      <div className="mb-8 mt-3 max-w-2xl sm:mb-10">
        <h1 className="font-serif text-[30px] font-semibold leading-tight tracking-tight sm:text-[40px]">
          {title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">{description}</p>
      </div>
      <AlmanacWidget lang={lang} />
    </div>
  );
}
