'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TAROT_DECK, drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export function DailyDrawWidget({ lang = 'zh' }: { lang?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  // SSR 初始使用确定性卡牌（如太阳牌）
  const [dailyCard, setDailyCard] = useState<DrawnCard>(() => ({
    card: TAROT_DECK[19] || TAROT_DECK[0],
    isReversed: false,
    positionName: '今日心念',
    positionDesc: '指引你当下能量与行动的核心原力'
  }));
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 点击卡牌翻转 (GSAP 3D 悬浮与弹性缓冲)
  const handleCardClick = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    if (cardWrapperRef.current) {
      gsap.fromTo(
        cardWrapperRef.current,
        { scale: 0.95, y: -6 },
        { scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.8)' }
      );
    }

    if (nextFlipped && textContentRef.current) {
      gsap.fromTo(
        textContentRef.current,
        { y: 12, autoAlpha: 0.5 },
        { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' }
      );
    }
  };

  // 换一张
  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);

    if (cardWrapperRef.current) {
      gsap.to(cardWrapperRef.current, {
        scale: 0.8,
        rotationY: '+=180',
        autoAlpha: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          const raw = drawRandomCards(1, false);
          setDailyCard({
            card: raw[0].card,
            isReversed: false,
            positionName: '今日心念',
            positionDesc: '指引你当下能量与行动的核心原力'
          });
          setIsFlipped(false);
          setIsRefreshing(false);

          gsap.fromTo(
            cardWrapperRef.current,
            { scale: 0.8, autoAlpha: 0, y: 15 },
            { scale: 1, autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }
          );
        }
      });
    } else {
      setIsFlipped(false);
      setIsRefreshing(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-3xl mx-auto rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center gap-8 justify-between perspective-1000"
    >
      {/* 左侧可交互翻转卡牌 */}
      <div className="flex flex-col items-center">
        <div
          ref={cardWrapperRef}
          onClick={handleCardClick}
          className="relative cursor-pointer transition-transform duration-300"
        >
          <TarotCardView
            card={dailyCard.card}
            isReversed={dailyCard.isReversed}
            isFlipped={isFlipped}
            size="md"
            showDetails={isFlipped}
          />
        </div>
        <span className="text-[11px] text-[#736B5E] mt-3 flex items-center gap-1">
          {isFlipped ? '✨ 点击卡牌可合上' : '👉 点击牌背，揭晓你的今日指引'}
        </span>
      </div>

      {/* 右侧卡牌解读与行动 */}
      <div ref={textContentRef} className="flex-1 flex flex-col justify-between text-left">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFE59A]/40 text-[#8C6D23] border border-[#E8CF86]/50">
              今日能量日签
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs text-[#736B5E] hover:text-[#111111] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              换一张
            </button>
          </div>

          <h3 className="font-serif font-black text-2xl text-[#111111] mt-2 mb-1">
            {isFlipped ? dailyCard.card.nameZh : '神秘神谕静候揭幕'}
          </h3>
          <p className="text-xs font-serif italic text-[#736B5E] mb-4">
            {isFlipped ? dailyCard.card.nameEn : '点击左侧卡牌感应今日专属信号'}
          </p>

          <p className="text-xs sm:text-sm text-[#5C5549] leading-relaxed mb-4">
            {isFlipped
              ? dailyCard.card.uprightMeaning
              : '每天清晨，给自己三分钟的留白时间。深呼吸，让潜意识的指针与宇宙频率对齐，汲取前行的勇气。'}
          </p>

          {isFlipped && (
            <div className="p-3 rounded-2xl bg-[#FAF6ED] ring-1 ring-[#111111]/5 text-xs text-[#111111] font-serif italic mb-6">
              “{dailyCard.card.advice}”
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-[#111111]/8">
          <Link
            href={`/${lang}/reading?card=${dailyCard.card.id}`}
            className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE59A]" />
            <span>向 AI 深入探讨此牌</span>
          </Link>

          {isFlipped && (
            <Link
              href={`/${lang}/cards/${dailyCard.card.slug}`}
              className="px-4 py-2.5 rounded-full bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#111111] text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <span>查看牌义详解</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
