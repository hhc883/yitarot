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
      className="w-full max-w-3xl mx-auto rounded-3xl bg-[#FFFDF9] border border-[rgba(200,168,88,0.25)] hover:border-[rgba(200,168,88,0.45)] p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center gap-8 justify-between perspective-1000 overflow-hidden md:min-h-[400px]"
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
      </div>

      {/* 右侧卡牌解读与行动 */}
      <div ref={textContentRef} className="flex-1 flex flex-col justify-between text-left w-full h-full">
        <div>
          {/* 标题与换一张 */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#111111] tracking-tight">
                {isFlipped ? dailyCard.card.nameZh : (lang === 'en' ? 'Daily Draw' : '每日一签')}
              </h3>
              <p className="text-xs font-serif text-[#7D7466] mt-0.5">
                {isFlipped ? dailyCard.card.nameEn : (lang === 'en' ? 'Daily Archetype' : '今日能量原形')}
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs text-[#7D7466] hover:text-[#111111] flex items-center gap-1 transition-colors cursor-pointer px-2.5 py-1 rounded-md hover:bg-[#F7F3EF]"
              title="重新抽取"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#8C6D23]' : ''}`} />
              <span>{lang === 'en' ? 'Redraw' : '重抽'}</span>
            </button>
          </div>

          {/* 阐述正文 */}
          <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed mt-3 min-h-[44px]">
            {isFlipped
              ? dailyCard.card.uprightMeaning
              : (lang === 'en'
                ? 'Take a quiet moment. Click the card to draw your guiding archetype for today.'
                : '留白三分钟，感应时空能量。轻触牌面，显化今日指引。')}
          </p>

          {/* 启示箴言 */}
          <div
            ref={adviceRef}
            className="p-3 rounded-xl bg-[#F7F3EF] text-xs text-[#111111] font-serif border-l-2 border-[#8C6D23] mt-3 mb-1 transition-colors duration-300"
          >
            {isFlipped ? (
              <span>{dailyCard.card.advice}</span>
            ) : (
              <span className="text-[#7D7466]">
                {lang === 'en' ? 'A direct psychological mirror for clear decisions.' : '不做宿命判决，只作内心镜像。'}
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
                className="px-4 py-2 rounded-full bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C8A858]" />
                <span>{lang === 'en' ? 'AI Consultation' : 'AI 深入解析'}</span>
              </Link>

              <Link
                href={`/${lang}/cards/${dailyCard.card.slug}`}
                className="px-3.5 py-2 rounded-full bg-[#F7F3EF] hover:bg-[#EAE4D9] text-[#111111] text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap border border-[#111111]/6"
              >
                <span>{lang === 'en' ? 'Card Details' : '牌义详解'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          ) : (
            <button
              onClick={handleCardClick}
              className="px-4 py-2 rounded-full bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-serif tracking-wider transition-all shadow-xs cursor-pointer"
            >
              {lang === 'en' ? 'Flip Card' : '翻开卡牌'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
