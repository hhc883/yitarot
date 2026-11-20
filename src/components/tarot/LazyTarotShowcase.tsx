'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroFloatingCards = dynamic(
  () => import('./HeroFloatingCards').then(mod => mod.HeroFloatingCards),
  {
    ssr: false,
    loading: () => <HeroCardsPlaceholder />
  }
);

const DailyDrawWidget = dynamic(
  () => import('./DailyDrawWidget').then(mod => mod.DailyDrawWidget),
  {
    ssr: false,
    loading: () => <DailyDrawPlaceholder />
  }
);

function HeroCardsPlaceholder({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  return (
    <div
      className="w-full flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] border border-[#111111]/8 min-h-[380px] md:min-h-[400px]"
      aria-label={isEn ? 'Tarot card gallery preview' : '塔罗牌库静态预览'}
    >
      <div className="relative flex items-center justify-center -space-x-8 mb-6">
        <div className="relative w-24 h-40 sm:w-28 sm:h-44 rounded-xl border border-[#C8A858]/30 overflow-hidden shadow-sm -rotate-12 bg-[#FAF6ED]">
          <Image
            src="/cards/major-arcana/the-lovers.webp"
            alt={isEn ? 'The Lovers' : '恋人'}
            fill
            sizes="120px"
            className="object-cover"
          />
        </div>
        <div className="relative w-28 h-44 sm:w-32 sm:h-48 rounded-xl border border-[#C8A858]/40 overflow-hidden shadow-md z-10 bg-[#FAF6ED]">
          <Image
            src="/cards/major-arcana/the-star.webp"
            alt={isEn ? 'The Star' : '星星'}
            fill
            sizes="140px"
            className="object-cover"
          />
        </div>
        <div className="relative w-24 h-40 sm:w-28 sm:h-44 rounded-xl border border-[#C8A858]/30 overflow-hidden shadow-sm rotate-12 bg-[#FAF6ED]">
          <Image
            src="/cards/major-arcana/the-sun.webp"
            alt={isEn ? 'The Sun' : '太阳'}
            fill
            sizes="120px"
            className="object-cover"
          />
        </div>
      </div>
      <p className="text-xs font-serif text-[#6E675B] text-center max-w-xs mb-4">
        {isEn
          ? '78 classic archetypes illuminating inner truth and synchronicity.'
          : '经典 78 张韦特塔罗，映照深层潜意识与当下机缘。'}
      </p>
      <Link
        href={`/${lang}/reading`}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-[#111111] text-white hover:bg-black transition-colors"
      >
        <span>{isEn ? 'Enter Tarot Hall' : '进入塔罗专厅'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function DailyDrawPlaceholder({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  return (
    <div
      className="w-full max-w-3xl mx-auto rounded-3xl bg-[#FFFDF9] border border-[rgba(200,168,88,0.25)] p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between min-h-[380px] md:min-h-[400px]"
      aria-label={isEn ? 'Daily Tarot card preview' : '每日一牌静态预览'}
    >
      <div className="flex flex-col items-center shrink-0">
        <div className="relative w-28 h-48 sm:w-32 sm:h-56 rounded-2xl border border-[#C8A858]/40 overflow-hidden shadow-md bg-[#FAF6ED]">
          <Image
            src="/cards/major-arcana/the-sun.webp"
            alt={isEn ? 'The Sun (Daily Card)' : '太阳（今日心念）'}
            fill
            sizes="140px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between text-left w-full h-full">
        <div>
          <div className="mb-2">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#111111] tracking-tight">
              {isEn ? 'Daily Draw' : '每日一签'}
            </h3>
            <p className="text-xs font-serif text-[#7D7466] mt-0.5">
              {isEn ? 'The Sun · Vitality & Light' : '太阳 · 今日核心能量原型'}
            </p>
          </div>
          <p className="text-xs leading-relaxed text-[#555046] my-4 font-serif">
            {isEn
              ? 'A gentle morning reflection or evening solace. Draw a card to align with cosmic synchronicity and focus your intentional energy today.'
              : '每日清晨的灵性定盘与夜间觉察。抽取属于今天的指引牌，感知天地共时性，凝聚专注心念。'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[rgba(200,168,88,0.2)]">
          <Link
            href={`/${lang}/fortune/daily`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-[#111111] text-white hover:bg-black transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'Daily Card' : '进入每日一牌'}</span>
          </Link>
          <Link
            href={`/${lang}/draw`}
            className="inline-flex items-center gap-1 text-xs font-serif text-[#6E675B] hover:text-[#111111] transition-colors"
          >
            <span>{isEn ? 'Free Draw' : '自由抽牌'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LazyTarotShowcase({ lang = 'zh' }: { lang?: string }) {
  const [shouldLoadInteractive, setShouldLoadInteractive] = useState(() => typeof IntersectionObserver === 'undefined');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setShouldLoadInteractive(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '350px 0px' // 距离视口 350px 时提前开始预热加载
      }
    );

    const el = containerRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {shouldLoadInteractive ? (
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <HeroFloatingCards />
          <DailyDrawWidget lang={lang} />
        </div>
      ) : (
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <HeroCardsPlaceholder lang={lang} />
          <DailyDrawPlaceholder lang={lang} />
        </div>
      )}
    </div>
  );
}
