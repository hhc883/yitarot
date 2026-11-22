import React, { Suspense } from 'react';
import { LiuYaoContainer } from '@/components/east/LiuYaoContainer';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function EastLiuYaoPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-10 pb-16 sm:pt-14 sm:pb-20">
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-[#171717]">
          {isEn ? 'I Ching Divination & Vision Oracle' : '周易六爻 · 神谕与视觉识卦'}
        </h1>
        <p className="mt-2.5 text-sm sm:text-[15px] leading-relaxed text-[#52525B] max-w-xl mx-auto">
          {isEn
            ? 'Cast three ancient coins or upload a hexagram screenshot to reveal lines, moving pivots, and strategic action counsel.'
            : '静心凝神，掷币六次自下而上筑爻，或上传其他排盘截图让 AI 视觉识卦，感应动爻与卦变转机。'}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-20 text-center text-xs font-serif text-[#52525B] animate-pulse">
            {isEn ? 'Loading I Ching Sanctuary...' : '正在排定六爻时空象数场...'}
          </div>
        }
      >
        <LiuYaoContainer lang={lang} />
      </Suspense>
    </div>
  );
}
