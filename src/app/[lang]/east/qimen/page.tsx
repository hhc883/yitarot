import type { Metadata } from 'next';
import Link from 'next/link';
import { QimenBoardWidget } from '@/components/east/QimenBoardWidget';
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
    routePath: '/east/qimen',
    title: isEn
      ? 'Qimen Dunjia Nine-Palace Chart - Rotating Chai-Bu Plate'
      : '奇门遁甲排盘｜时家转盘拆补局·八门九星八神方位推演',
    description: isEn
      ? 'Cast a rotating nine-palace Qimen Dunjia chart using Beijing time and solar terms. Inspect the gates, stars, deities, and directional dynamics of each palace.'
      : '严格依据北京时间与节气定局排出时家奇门遁甲转盘拆补局，直观查看九宫天地盘、八门、九星、八神与方位吉凶。',
    keywords: isEn
      ? ['Qimen Dunjia', 'Nine Palace Chart', 'Chinese metaphysics', 'Chai Bu Qimen']
      : ['奇门遁甲', '奇门遁甲排盘', '时家转盘', '拆补局', '八门九星']
  });
}

export default async function QimenPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const structuredData = [
    buildBreadcrumbJsonLd(lang, [
      { name: isEn ? 'I Ching & BaZi' : '东方专厅', path: '/east' },
      { name: isEn ? 'Qimen Dunjia' : '奇门遁甲', path: '/east/qimen' }
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/east/qimen',
      name: isEn ? 'Qimen Dunjia Chart Calculator' : 'YiTatro 奇门遁甲在线排盘',
      description: isEn
        ? 'Rotating nine-palace Qimen Dunjia chart calculator.'
        : '时家转盘拆补法奇门遁甲九宫在线排盘工具。'
    })
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 text-neutral-900 sm:px-6 sm:py-12 lg:py-16">
      <JsonLd data={structuredData} />
      <Link
        href={`/${lang}/east`}
        className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
      >
        <span aria-hidden="true">←</span>
        {isEn ? 'Back to I Ching & BaZi' : '返回东方专厅'}
      </Link>
      <div className="mb-8 mt-3 max-w-2xl sm:mb-10">
        <h1 className="font-serif text-[30px] font-semibold leading-tight tracking-tight sm:text-[40px]">
          {isEn ? 'Qimen Dunjia' : '奇门遁甲'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          {isEn
            ? 'Cast a rotating nine-palace chart using Beijing time. Select a palace to explore its gate, star, and direction.'
            : '按北京时间排出时家转盘拆补局，选择一个宫位，查看门、星和方位。'}
        </p>
      </div>
      <QimenBoardWidget lang={lang} />
    </div>
  );
}
