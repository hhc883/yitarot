import type { Metadata } from 'next';
import Link from 'next/link';
import { LiurenBoardWidget } from '@/components/east/LiurenBoardWidget';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildBreadcrumbJsonLd,
  buildLocalizedMetadata,
  buildWebAppJsonLd,
} from '@/lib/seo/metadata';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return buildLocalizedMetadata({
    lang,
    routePath: '/east/liuren',
    title: isEn
      ? 'Da Liu Ren Divination Chart - Four Lessons & Three Transmissions'
      : '大六壬排盘｜月将加时·四课三传九宗门·十二天将推演',
    description: isEn
      ? 'Cast a traditional Da Liu Ren chart using Beijing time, solar-term monthly general, day/night GuiRen, Four Lessons, and Three Transmissions.'
      : '严格依据北京时间、中气月将、昼夜贵人排出大六壬天地盘、四课、三传（九宗门）与十二天将。',
    keywords: isEn
      ? ['Da Liu Ren', 'Liu Ren Chart', 'Four Lessons', 'Three Transmissions', 'Chinese metaphysics']
      : ['大六壬', '大六壬排盘', '四课三传', '九宗门', '十二天将'],
  });
}

export default async function LiurenPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  const structuredData = [
    buildBreadcrumbJsonLd(lang, [
      { name: isEn ? 'I Ching & BaZi' : '东方专厅', path: '/east' },
      { name: isEn ? 'Da Liu Ren' : '大六壬', path: '/east/liuren' },
    ]),
    buildWebAppJsonLd({
      lang,
      routePath: '/east/liuren',
      name: isEn ? 'Da Liu Ren Chart Calculator' : 'YiTatro 大六壬在线排盘',
      description: isEn
        ? 'Da Liu Ren Four Lessons and Three Transmissions chart calculator.'
        : '大六壬天地盘、四课三传九宗门在线排盘工具。',
    }),
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
          {isEn ? 'Da Liu Ren' : '大六壬'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          {isEn
            ? 'Cast a Da Liu Ren chart with solar-term monthly general, day/night GuiRen, Four Lessons, and Nine ZongMen transmissions.'
            : '依中气月将、昼夜贵人排布天地盘、四课与九宗门三传，洞察事态始末与神将吉凶。'}
        </p>
      </div>
      <LiurenBoardWidget lang={lang} />
    </div>
  );
}
