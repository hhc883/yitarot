'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TarotSpread } from '@/lib/tarot/spreads';
import { TAROT_DECK, drawRandomCards, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { Sparkles, RefreshCw, Eye, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(useGSAP);

interface DeckShufflerProps {
  spread: TarotSpread;
  onCardsReady: (drawn: DrawnCard[]) => void;
}

function createDeterministicCards(spread: TarotSpread): DrawnCard[] {
  return spread.positions.map((pos, idx) => ({
    card: TAROT_DECK[idx % TAROT_DECK.length],
    isReversed: false,
    positionName: pos.name,
    positionDesc: pos.description
  }));
}

function createRandomDrawnCards(spread: TarotSpread): DrawnCard[] {
  const raw = drawRandomCards(spread.cardCount, true);
  return raw.map((item, idx) => ({
    card: item.card,
    isReversed: item.isReversed,
    positionName: spread.positions[idx]?.name || `第 ${idx + 1} 张牌`,
    positionDesc: spread.positions[idx]?.description || ''
  }));
}

export function DeckShuffler({ spread, onCardsReady }: DeckShufflerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  const [shuffling, setShuffling] = useState(false);
  // 直接初始化随机抽牌结果，避免挂载后二次更新导致第 1 张牌动画被中断
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>(() => createRandomDrawnCards(spread));
  const [flippedStates, setFlippedStates] = useState<boolean[]>(() => new Array(spread.cardCount).fill(false));

  // 牌阵切换时重新抽牌
  useEffect(() => {
    setDrawnCards(createRandomDrawnCards(spread));
    setFlippedStates(new Array(spread.cardCount).fill(false));
  }, [spread.id, spread.cardCount]);

  // 当洗牌完成或初次呈现时，基于 GSAP Timeline 执行优雅发牌归位动效
  const { contextSafe } = useGSAP(() => {
    if (!shuffling && cardsGridRef.current) {
      const cardNodes = cardsGridRef.current.querySelectorAll('.card-slot');
      if (cardNodes.length === 0) return;

      const count = cardNodes.length;
      const centerIdx = (count - 1) / 2;

      // 使用 GSAP 时间线构建有秩序、有节奏的真实发牌仪式感
      const tl = gsap.timeline({
        delay: 0.15, // 给 DOM 渲染与页面切换留出 150ms 充分时间，确保第 1 张牌绝不漏帧
        defaults: { ease: 'power3.out' }
      });

      // 先快速设置所有卡槽的起始发牌状态（聚拢浮空、带微透光与扇形微倾斜）
      cardNodes.forEach((node, i) => {
        const offset = i - centerIdx;
        gsap.set(node, {
          y: -45,
          x: offset * -18, // 向中心聚拢
          scale: 0.86,
          rotationZ: offset * 3.5, // 微弧度扇形发牌感
          autoAlpha: 0,
          transformPerspective: 1000
        });
      });

      // 逐张发牌至各自牌位（圣三角：第1张 -> 第2张 -> 第3张 依次有序飞入）
      tl.to(cardNodes, {
        y: 0,
        x: 0,
        scale: 1,
        rotationZ: 0,
        autoAlpha: 1,
        duration: 0.65,
        stagger: {
          each: 0.16, // 每张牌清晰间隔 160ms，第 1 张、第 2 张、第 3 张依次清晰滑入归位
          ease: 'power2.out'
        },
        ease: 'back.out(1.15)',
        clearProps: 'transform' // 动画完成后清除 inline transform，确保 hover 与 3D 翻牌不被干扰
      });
    }
  }, { dependencies: [shuffling, spread.id], scope: containerRef, revertOnUpdate: true });

  // 翻开单张 (GSAP 触碰微浮反馈)
  const handleToggleFlip = contextSafe((index: number) => {
    setFlippedStates(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });

    if (cardsGridRef.current) {
      const slots = cardsGridRef.current.querySelectorAll('.card-slot');
      const targetSlot = slots[index];
      if (targetSlot) {
        // 轻弹浮起下落仪式感
        gsap.timeline()
          .to(targetSlot, {
            y: -10,
            scale: 1.03,
            duration: 0.2,
            ease: 'power2.out'
          })
          .to(targetSlot, {
            y: 0,
            scale: 1,
            duration: 0.35,
            ease: 'back.out(1.8)',
            clearProps: 'transform'
          });
      }
    }
  });

  // 一键全部翻开 (GSAP 波浪式接力翻开)
  const handleRevealAll = contextSafe(() => {
    setFlippedStates(new Array(spread.cardCount).fill(true));

    if (cardsGridRef.current) {
      const slots = cardsGridRef.current.querySelectorAll('.card-slot');
      gsap.timeline()
        .to(slots, {
          y: -10,
          scale: 1.025,
          duration: 0.2,
          stagger: 0.12,
          ease: 'power2.out'
        })
        .to(slots, {
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.12,
          ease: 'back.out(1.6)',
          clearProps: 'transform'
        }, '<0.08');
    }
  });

  // GSAP 重新洗牌仪式：牌面收拢归堆，再重新发牌
  const resetDraw = contextSafe(() => {
    if (shuffling) return;

    if (cardsGridRef.current) {
      const slots = cardsGridRef.current.querySelectorAll('.card-slot');
      const centerIdx = (slots.length - 1) / 2;

      // 先做收拢聚牌动画
      gsap.to(slots, {
        scale: 0.75,
        y: -30,
        x: (i) => (centerIdx - i) * 20,
        rotationZ: (i) => (i - centerIdx) * 6,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: () => {
          setShuffling(true);
          setFlippedStates(new Array(spread.cardCount).fill(false));
          setDrawnCards(createRandomDrawnCards(spread));

          setTimeout(() => {
            setShuffling(false);
          }, 350);
        }
      });
    } else {
      setShuffling(true);
      setDrawnCards(createRandomDrawnCards(spread));
      setFlippedStates(new Array(spread.cardCount).fill(false));
      setTimeout(() => {
        setShuffling(false);
      }, 350);
    }
  });

  const allFlipped = drawnCards.length > 0 && flippedStates.length === spread.cardCount && flippedStates.every(Boolean);

  // 当全部翻开时，延迟 1.4 秒平滑过渡，让用户清晰看到全部抽出的牌面
  useEffect(() => {
    if (allFlipped && drawnCards.length === spread.cardCount) {
      const timer = setTimeout(() => {
        onCardsReady(drawnCards);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [allFlipped, drawnCards, onCardsReady, spread.cardCount]);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      {/* 牌阵信息说明条 */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 shadow-xs mb-8">
        <div className="flex items-center gap-2">
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE59A]/40 text-[#8C6D23] border border-[#E8CF86]/50">
            {spread.nameZh}
          </span>
          <span className="text-xs text-[#736B5E]">（需抽取 {spread.cardCount} 张牌）</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetDraw}
            disabled={shuffling}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#111111] transition-colors ring-1 ring-[#111111]/10 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${shuffling ? 'animate-spin' : ''}`} />
            重新洗牌
          </button>
          {!allFlipped && drawnCards.length > 0 && (
            <button
              onClick={handleRevealAll}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] transition-all shadow-sm cursor-pointer hover:scale-102"
            >
              <Eye className="w-3.5 h-3.5" />
              一键翻开所有牌
            </button>
          )}
        </div>
      </div>

      {/* 洗牌切牌动画过渡 */}
      {shuffling ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="relative w-24 h-36 mb-5">
            <div className="absolute inset-0 rounded-2xl bg-[#111625] ring-2 ring-[#E8CF86] rotate-8 animate-pulse shadow-lg" />
            <div className="absolute inset-0 rounded-2xl bg-[#111625] ring-2 ring-[#E8CF86] -rotate-8 animate-pulse shadow-lg" />
            <div className="absolute inset-0 rounded-2xl bg-[#111625] ring-2 ring-[#E8CF86] flex items-center justify-center text-[#E8CF86] shadow-xl">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>
          </div>
          <p className="font-serif text-sm text-[#5C5549] tracking-wider font-medium">
            正在感知你的心念磁场，聚牌切牌中...
          </p>
        </div>
      ) : (
        /* GSAP 发牌与牌阵展示区 */
        <div ref={cardsGridRef} className="w-full max-w-5xl">
          <div
            className={`grid gap-5 sm:gap-6 justify-center items-start ${
              spread.cardCount === 1
                ? 'grid-cols-1 max-w-xs mx-auto'
                : spread.cardCount === 3
                ? 'grid-cols-1 sm:grid-cols-3'
                : spread.cardCount === 5
                ? 'grid-cols-2 sm:grid-cols-5'
                : 'grid-cols-2 sm:grid-cols-5'
            }`}
          >
            {drawnCards.map((item, idx) => {
              const isFlipped = flippedStates[idx] ?? false;
              return (
                <div
                  key={`${spread.id}-${idx}`}
                  className="card-slot flex flex-col items-center p-3.5 rounded-3xl bg-[#FFFDF9]/95 ring-1 ring-[#111111]/10 hover:ring-[#E8CF86] transition-[border-color,box-shadow] shadow-xs hover:shadow-md"
                >
                  {/* 站位标题与说明 */}
                  <div className="text-center mb-3">
                    <span className="inline-block text-[11px] font-semibold text-[#8C6D23] bg-[#FFE59A]/30 px-2.5 py-0.5 rounded-full mb-1">
                      {idx + 1}. {item.positionName}
                    </span>
                    <p className="text-[10px] text-[#736B5E] max-w-[160px] line-clamp-1">{item.positionDesc}</p>
                  </div>

                  {/* 卡牌本身（点击可翻转） */}
                  <TarotCardView
                    card={item.card}
                    isReversed={item.isReversed}
                    isFlipped={isFlipped}
                    size="md"
                    onFlip={() => handleToggleFlip(idx)}
                  />

                  {/* 翻牌引导 */}
                  <div className="mt-3 text-center">
                    {!isFlipped ? (
                      <button
                        onClick={() => handleToggleFlip(idx)}
                        className="text-xs text-[#8C6D23] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> 点击翻开
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 已揭示
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!allFlipped ? (
            <div className="mt-8 text-center text-xs text-[#736B5E] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E8CF86]" />
              <span>凭你的最初直觉逐一点选翻牌，感受潜意识的第一瞬触动。</span>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
              <button
                type="button"
                onClick={() => onCardsReady(drawnCards)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] shadow-xl border border-[#E8CF86]/40 text-xs sm:text-sm font-serif font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FFE59A] animate-spin" />
                <span>牌阵全部揭晓 · 正在推演解牌中...</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
