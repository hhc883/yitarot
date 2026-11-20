import Link from 'next/link';
import { BaziDailyWidget } from '@/components/fatemaster/BaziDailyWidget';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function BaziDailyPage({ params }: { params: Promise<{ lang: string }> }) {
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
          {isEn ? 'Daily BaZi' : '每日八字'}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          {isEn ? 'Use your birth date and hour to explore a daily BaZi reading and its twelve time periods.' : '用出生日期和小时，查看今日八字与十二时辰的解读。'}
        </p>
      </div>
      <BaziDailyWidget lang={isEn ? 'en' : 'zh'} />
    </div>
  );
}
