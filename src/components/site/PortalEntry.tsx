'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CONTAINER } from './constants';
import { TaijiMark } from './TaijiMark';
import { IconTarotCard } from './SiteIcons';
import { ScrollReveal } from './ScrollReveal';

/**
 * 第 2 屏：上滑之后才出现的东 / 西两个入口。
 * 只放两张入口卡，不放第三张、第四张功能卡。
 */
export function PortalEntry({ lang = 'zh' }: { lang?: string }) {
  const cardClass =
    'group flex h-full min-h-[336px] flex-col rounded-[16px] border border-line bg-white p-8 transition-[border-color,box-shadow] duration-300 hover:border-ink/20 hover:shadow-[0_28px_60px_-44px_rgba(10,10,10,0.4)] sm:p-10';

  const buttonClass =
    'mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] tracking-[0.01em] text-white';

  return (
    <section id="portals" className="w-full bg-white">
      <div className={`${CONTAINER} pb-20 pt-16 sm:pt-24 lg:pb-[120px] lg:pt-[132px]`}>
        <div className="grid gap-5 md:grid-cols-2">
          <ScrollReveal className="h-full">
            <Link href={`/${lang}/east`} className={cardClass} aria-label="东方数术 Eastern Wisdom">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line">
                  <TaijiMark size={20} />
                </span>
                <span className="font-display text-[10px] tracking-[0.3em] text-whisper">EAST</span>
              </div>

              <h2 className="mt-10 font-serif text-[26px] leading-tight tracking-[-0.01em] text-ink sm:text-[30px]">
                {lang === 'en' ? 'Eastern Wisdom' : '东方数术'}
              </h2>

              <p className="mt-4 max-w-[36ch] text-[14px] leading-[1.7] text-soft">
                {lang === 'en'
                  ? 'I Ching, BaZi and Zi Wei — an old Chinese way of reading a life from the hour you were born.'
                  : 'Birth charts, hexagrams and star maps from China — read from the moment you were born.'}
              </p>

              <span className={buttonClass}>
                <span>{lang === 'en' ? 'Enter' : '进入 Enter'}</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
              </span>
            </Link>
          </ScrollReveal>

          <ScrollReveal className="h-full">
            <Link href={`/${lang}/west`} className={cardClass} aria-label="西方塔罗 Western Tarot">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line">
                  <IconTarotCard size={20} />
                </span>
                <span className="font-display text-[10px] tracking-[0.3em] text-whisper">WEST</span>
              </div>

              <h2 className="mt-10 font-serif text-[26px] leading-tight tracking-[-0.01em] text-ink sm:text-[30px]">
                {lang === 'en' ? 'Western Tarot' : '西方塔罗'}
              </h2>

              <p className="mt-4 max-w-[36ch] text-[14px] leading-[1.7] text-soft">
                {lang === 'en'
                  ? 'Seventy-eight Rider-Waite cards, drawn for the question you are holding right now.'
                  : 'Seventy-eight Rider-Waite cards, drawn for the question you are holding.'}
              </p>

              <span className={buttonClass}>
                <span>{lang === 'en' ? 'Enter' : '进入 Enter'}</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
              </span>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
