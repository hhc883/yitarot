import React from 'react';
import { CoinTossGsap } from '@/components/fatemaster/CoinTossGsap';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function FateMasterLiuYaoPage({
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
          {isEn ? 'I Ching Coin Toss' : '六爻起卦'}
        </h1>
        <p className="mt-2.5 text-sm sm:text-[15px] leading-relaxed text-[#52525B] max-w-xl mx-auto">
          {isEn
            ? 'Cast three ancient coins six times from bottom to top to reveal hexagram lines, changing lines, and timely guidance.'
            : '静心凝神，掷币六次自下而上筑爻，感应动爻与卦变转机，获取客观长远的行动策略。'}
        </p>
      </div>

      <CoinTossGsap lang={lang} />
    </div>
  );
}
