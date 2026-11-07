'use client';

import React from 'react';
import Link from 'next/link';
import { YinYangFish } from '@/components/common/YinYangFish';
import { getDictionary } from '@/lib/i18n/dict';

export function TarotFooter({ lang = 'zh' }: { lang?: string }) {
  const d = getDictionary(lang);
  const f = d.footer;

  return (
    <footer className="w-full bg-[#F0EAE1]/80 border-t border-[#111111]/8 text-[#524B40] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌简介 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFFDF9] border border-[#E8CF86]/60 flex items-center justify-center shadow-xs">
                <YinYangFish size={20} spin={false} glow={false} />
              </div>
              <span className="font-serif font-black text-xl text-[#1E1B18]">QiCosmos</span>
            </div>
            <p className="text-xs leading-relaxed text-[#736B5E]">
              {f.brandDesc}
            </p>
            <div className="text-[11px] text-[#8C6D23] font-serif">
              {f.intuition}
            </div>
          </div>

          {/* 占卜模式 */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1E1B18] mb-3">{f.channels}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${lang}/reading`} className="hover:text-[#1E1B18] transition-colors">
                  {f.reading}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/yes-no`} className="hover:text-[#1E1B18] transition-colors">
                  {f.yesNo}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/love`} className="hover:text-[#1E1B18] transition-colors">
                  {f.love}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/fortune/daily`} className="hover:text-[#1E1B18] transition-colors">
                  {f.dailyFortune}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/fortune/seasonal`} className="hover:text-[#1E1B18] transition-colors">
                  {f.seasonalSpread}
                </Link>
              </li>
            </ul>
          </div>

          {/* 塔罗知识库 */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1E1B18] mb-3">{f.knowledge}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${lang}/cards`} className="hover:text-[#1E1B18] transition-colors">
                  {f.deck78}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/spreads`} className="hover:text-[#1E1B18] transition-colors">
                  {f.spreads}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/draw`} className="hover:text-[#1E1B18] transition-colors">
                  {f.freeDraw}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/blog`} className="hover:text-[#1E1B18] transition-colors">
                  {f.handbook}
                </Link>
              </li>
            </ul>
          </div>

          {/* 会员与支持 */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1E1B18] mb-3">{f.membership}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${lang}/pricing`} className="hover:text-[#1E1B18] transition-colors">
                  {f.pricing}
                </Link>
              </li>
              <li>
                <span className="text-[#A59E92]">{f.privacy}</span>
              </li>
              <li>
                <span className="text-[#A59E92]">{f.terms}</span>
              </li>
              <li>
                <span className="text-[#A59E92]">{f.contact}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权与免责 */}
        <div className="mt-12 pt-6 border-t border-[#1E1B18]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A59E92] gap-3">
          <p>{f.copyright}</p>
          <p className="text-center sm:text-right max-w-md">
            {lang === 'en'
              ? 'Disclaimer: Tarot divination is intended for psychological reflection, emotional companionship, and intuitive insight. It does not replace professional medical, legal, or financial advice.'
              : '免责声明：塔罗牌占卜旨在提供心灵陪伴、直觉启发与自我反思，不可替代专业心理咨询、医疗或法律财务决策。'}
          </p>
        </div>
      </div>
    </footer>
  );
}
