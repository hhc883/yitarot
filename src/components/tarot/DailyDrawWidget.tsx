'use client';

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TAROT_DECK, drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

gsap.registerPlugin(useGSAP);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function DailyDrawWidget({ lang = 'zh' }: { lang?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const adviceRef = useRef<HTMLDivElement>(null);
  const prevHeightRef = useRef<number | null>(null);

  // SSR 初始使用确定性卡牌（如太阳牌）
  const [dailyCard, setDailyCard] = useState<DrawnCard>(() => ({
    card: TAROT_DECK[19] || TAROT_DECK[0],
    isReversed: false,
    positionName: '今日心念',
    positionDesc: '指引你当下能量与行动的核心原力'
  }));
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 容器平滑高度过渡 (自动测量并在渲染前执行缓动，彻底消除抽卡后瞬间变长、突兀卡顿的问题)
  useIsomorphicLayoutEffect(() => {
    if (prevHeightRef.current !== null && containerRef.current) {
      const startHeight = prevHeightRef.current;
      const targetHeight = containerRef.current.offsetHeight;
      prevHeightRef.current = null;

      if (Math.abs(targetHeight - startHeight) > 1) {
        gsap.killTweensOf(containerRef.current);
        gsap.fromTo(
          containerRef.current,
          { height: startHeight },
          {
            height: targetHeight,
            duration: 0.5,
            ease: 'power3.out',
            onComplete: () => {
              if (containerRef.current) {
                gsap.set(containerRef.current, { clearProps: 'height' });
              }
            }
          }
        );
      }
    }

    if (textContentRef.current) {
      gsap.killTweensOf(textContentRef.current);
      gsap.fromTo(
        textContentRef.current,
        { opacity: 0.5, y: 6 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isFlipped]);

  // 点击卡牌翻转 (GSAP 3D 悬浮与微触觉缓冲)
  const handleCardClick = () => {
    if (containerRef.current) {
      prevHeightRef.current = containerRef.current.offsetHeight;
    }

    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    if (cardWrapperRef.current) {
      gsap.fromTo(
        cardWrapperRef.current,
        { scale: 0.96, y: -6 },
        { scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }
      );
    }
  };

  // 换一张
  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRefreshing) return;
    setIsRefreshing(true);

    if (containerRef.current) {
      prevHeightRef.current = containerRef.current.offsetHeight;
    }

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
      className="w-full max-w-3xl mx-auto rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center gap-8 justify-between perspective-1000 overflow-hidden md:min-h-[400px]"
    >
      {/* 左侧可交互翻转卡牌 */}
      <div className="flex flex-col items-center shrink-0">
        <div
          ref={cardWrapperRef}
          onClick={handleCardClick}
          className="relative cursor-pointer transition-transform duration-300 group"
          role="button"
          tabIndex={0}
          aria-label={isFlipped ? '收起卡牌' : '抽取卡牌'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCardClick();
            }
          }}
        >
          {/* 金色光晕氛围底衬 */}
          <div
            className={`absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#E8CF86]/35 to-[#FFE59A]/35 blur-lg transition-opacity duration-700 pointer-events-none ${
              isFlipped ? 'opacity-90' : 'opacity-0 group-hover:opacity-40'
            }`}
          />
          <TarotCardView
            card={dailyCard.card}
            isReversed={dailyCard.isReversed}
            isFlipped={isFlipped}
            size="md"
            showDetails={isFlipped}
          />
        </div>
        <span className="text-[11px] text-[#736B5E] mt-3 flex items-center gap-1 font-medium transition-colors duration-300">
          {isFlipped ? '✨ 点击卡牌可合上' : '👉 点击牌背，揭晓你的今日指引'}
        </span>
      </div>

      {/* 右侧卡牌解读与行动 (高度平衡设计，消除未翻与翻开状态的高度落差) */}
      <div ref={textContentRef} className="flex-1 flex flex-col justify-between text-left w-full h-full">
        <div>
          {/* 标签与换一张 */}
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFE59A]/40 text-[#8C6D23] border border-[#E8CF86]/50 shadow-2xs">
              今日能量日签
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs text-[#736B5E] hover:text-[#111111] flex items-center gap-1.5 transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-[#FAF6ED]"
              title="重新抽取一张"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#8C6D23]' : ''}`} />
              <span>换一张</span>
            </button>
          </div>

          {/* 标题与副标题 */}
          <div className="min-h-[58px] flex flex-col justify-center">
            <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#111111] tracking-tight">
              {isFlipped ? dailyCard.card.nameZh : '神秘神谕静候揭幕'}
            </h3>
            <p className="text-xs font-serif italic text-[#736B5E] mt-1">
              {isFlipped ? dailyCard.card.nameEn : '点击左侧卡牌感应今日专属信号'}
            </p>
          </div>

          {/* 阐述正文 */}
          <p className="text-xs sm:text-sm text-[#5C5549] leading-relaxed mt-2.5 min-h-[44px]">
            {isFlipped
              ? dailyCard.card.uprightMeaning
              : '每天清晨，给自己三分钟的留白时间。深呼吸，让潜意识的指针与宇宙频率对齐，汲取前行的勇气。'}
          </p>

          {/* 启示箴言/静候仪式指引（两态对称平衡，避免高度骤变） */}
          <div
            ref={adviceRef}
            className="p-3.5 rounded-2xl bg-[#FAF6ED] ring-1 ring-[#111111]/5 text-xs text-[#111111] font-serif italic border-l-2 border-[#8C6D23] shadow-2xs mt-3.5 mb-1 transition-colors duration-300"
          >
            {isFlipped ? (
              <span>“{dailyCard.card.advice}”</span>
            ) : (
              <span className="text-[#736B5E]">
                “静心默想当下最关切的疑惑，随后轻触牌背，聆听宇宙的回响。”
              </span>
            )}
          </div>
        </div>

        {/* 底部按钮区 */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#111111]/8 mt-3">
          {isFlipped ? (
            <>
              <Link
                href={`/${lang}/reading?card=${dailyCard.card.id}`}
                className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm hover:scale-102"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFE59A]" />
                <span>向 AI 深入探讨此牌</span>
              </Link>

              <Link
                href={`/${lang}/cards/${dailyCard.card.slug}`}
                className="px-4 py-2.5 rounded-full bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#111111] text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap border border-[#111111]/6"
              >
                <span>查看牌义详解</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          ) : (
            <button
              onClick={handleCardClick}
              className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer hover:scale-102"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFE59A]" />
              <span>轻触牌背开启神谕</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
