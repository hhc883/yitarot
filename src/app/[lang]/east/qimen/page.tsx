import Link from 'next/link';
import { QimenBoardWidget } from '@/components/east/QimenBoardWidget';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function QimenPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 text-neutral-900 sm:px-6 sm:py-12 lg:py-16">
      <Link href={`/${isEn ? 'en' : 'zh'}/east`} className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">
        <span aria-hidden="true">←</span>
        {isEn ? 'Back to I Ching & BaZi' : '返回东方专厅'}
      </Link>
      <div className="mb-8 mt-3 max-w-2xl sm:mb-10">
        <h1 className="font-serif text-[30px] font-semibold leading-tight tracking-tight sm:text-[40px]">
          {isEn ? 'Qimen Dunjia' : '奇门遁甲'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          {isEn ? 'Cast a rotating nine-palace chart using Beijing time. Select a palace to explore its gate, star, and direction.' : '按北京时间排出时家转盘拆补局，选择一个宫位，查看门、星和方位。'}
        </p>
      </div>
      <QimenBoardWidget lang={isEn ? 'en' : 'zh'} />
    </div>
  );
}
