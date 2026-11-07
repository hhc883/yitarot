import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/dict';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';
  const d = getDictionary(lang);
  const t = d.pricing;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 sm:py-16">
      {/* 极简标题 (Linear 风格) */}
      <div className="text-center mb-12">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-2">
          {t.subtitle}
        </p>
      </div>

      {/* 双栏方案对比 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 基础免费版 */}
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 sm:p-8 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#111111]/8">
              <span className="text-xs font-serif font-bold text-[#111111]">{t.freeTitle}</span>
              <span className="text-[10px] font-mono tracking-wider text-[#736B5E] uppercase">Free</span>
            </div>

            <div className="my-6">
              <div className="flex items-baseline gap-1">
                <span className="font-serif font-black text-3xl sm:text-4xl text-[#111111]">{t.freePrice}</span>
                <span className="text-xs font-serif text-[#736B5E]">{t.freePeriod}</span>
              </div>
              <p className="text-xs font-serif text-[#736B5E] mt-2">
                {t.freeDesc}
              </p>
            </div>

            <ul className="space-y-3 text-xs font-serif text-[#222222] pt-4 border-t border-[#111111]/8">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                <span>{isEn ? 'Daily fortune card & Free draw (1-6 cards)' : '每日专属运势签与自由抽牌（1-6张）'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                <span>{isEn ? 'Yes / No Tarot direct oracle' : '是否塔罗单张决断神谕'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                <span>{isEn ? 'Complete 78-card Rider-Waite encyclopedia' : '完整 78 张韦特塔罗牌义典藏百科'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                <span>{isEn ? 'BaZi calculation & I Ching Plum Blossom oracle' : '八字排盘与周易梅花易数基础推演'}</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[#111111]/8">
            <Link
              href={`/${lang}/reading`}
              className="w-full py-3 rounded-xl bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#111111] font-serif text-xs flex items-center justify-center border border-[#111111]/10 transition-colors"
            >
              {t.freeBtn}
            </Link>
          </div>
        </div>

        {/* Plus 专业会员版 */}
        <div className="rounded-2xl bg-[#111111] text-[#FFFDF9] p-6 sm:p-8 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#FFFDF9]/10">
              <span className="text-xs font-serif font-bold text-[#FFFDF9]">{t.plusTitle}</span>
              <span className="text-[10px] font-mono tracking-wider text-[#FFFDF9]/60 uppercase">Professional</span>
            </div>

            <div className="my-6">
              <div className="flex items-baseline gap-1">
                <span className="font-serif font-black text-3xl sm:text-4xl text-[#FFFDF9]">{t.plusPrice}</span>
                <span className="text-xs font-serif text-[#FFFDF9]/60">{t.plusPeriod}</span>
              </div>
              <p className="text-xs font-serif text-[#FFFDF9]/70 mt-2">
                {t.plusDesc}
              </p>
            </div>

            <ul className="space-y-3 text-xs font-serif text-[#FFFDF9]/90 pt-4 border-t border-[#FFFDF9]/10">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FFFDF9] shrink-0" />
                <span>{isEn ? 'Unlimited AI Tarot readings & multi-turn dialog' : '无限次 AI 塔罗占卜与多轮追问对话'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FFFDF9] shrink-0" />
                <span>{isEn ? '10-card Celtic Cross & 3D Love relationship spread' : '解锁 10 牌凯尔特十字与爱情三维合盘'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FFFDF9] shrink-0" />
                <span>{isEn ? 'Seasonal solstice spread & yearly annual forecasts' : '尊享四季牌阵与年度流年运势推演'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#FFFDF9] shrink-0" />
                <span>{isEn ? 'Full BaZi 9-synastry network & ZiWei cloud archive' : '八字九大合盘与紫微斗数命盘全景云端归档'}</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[#FFFDF9]/10">
            <button
              type="button"
              className="w-full py-3 rounded-xl bg-[#FFFDF9] hover:bg-[#FAF6ED] text-[#111111] font-serif font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
            >
              {t.plusBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
