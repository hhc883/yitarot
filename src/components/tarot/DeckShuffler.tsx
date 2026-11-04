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
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>(() => createDeterministicCards(spread));
  const [flippedStates, setFlippedStates] = useState<boolean[]>(() => new Array(spread.cardCount).fill(false));

  // 客户端初次挂载后切牌
  useEffect(() => {
    setDrawnCards(createRandomDrawnCards(spread));
  }, [spread.id]);

  // GSAP 洗牌发牌主仪式
  const resetDraw = useCallback(() => {
    if (shuffling) return;
    setShuffling(true);
    setFlippedStates([]);

    // 先做收拢聚牌动画
    if (cardsGridRef.current) {
      const cardNodes = cardsGridRef.current.querySelectorAll('.card-slot');
      gsap.to(cardNodes, {
        scale: 0.8,
        y: -30,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          // 生成新卡牌
          const newCards = createRandomDrawnCards(spread);
          setDrawnCards(newCards);
          setFlippedStates(new Array(spread.cardCount).fill(false));

          setTimeout(() => {
            setShuffling(false);
          }, 300);
        }
      });
    } else {
      setTimeout(() => {
        setDrawnCards(createRandomDrawnCards(spread));
        setFlippedStates(new Array(spread.cardCount).fill(false));
        setShuffling(false);
      }, 500);
    }
  }, [shuffling, spread]);

  // 当洗牌完成并呈现新卡牌时，执行 GSAP 优雅飞入发牌动效
  useGSAP(() => {
    if (!shuffling && cardsGridRef.current) {
      const cardNodes = cardsGridRef.current.querySelectorAll('.card-slot');
      gsap.fromTo(
        cardNodes,
        {
          y: 40,
          scale: 0.85,
          autoAlpha: 0,
          rotationY: 15
        },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          rotationY: 0,
          stagger: {
            each: 0.1,
            ease: 'power2.out'
          },
          duration: 0.6,
          ease: 'back.out(1.4)'
        }
      );
    }
  }, { dependencies: [shuffling, drawnCards], scope: containerRef });

  // 翻开单张 (带 GSAP 微弹力反馈)
  const handleToggleFlip = (index: number) => {
    setFlippedStates(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });

    if (cardsGridRef.current) {
      const slot = cardsGridRef.current.querySelectorAll('.card-slot')[index];
      if (slot) {
        gsap.fromTo(
          slot,
          { scale: 0.96 },
          { scale: 1, duration: 0.4, ease: 'back.out(2)' }
        );
      }
    }
  };

  // 一键全部翻开 (GSAP 波浪翻转)
  const handleRevealAll = () => {
    setFlippedStates(new Array(spread.cardCount).fill(true));

    if (cardsGridRef.current) {
      const slots = cardsGridRef.current.querySelectorAll('.card-slot');
      gsap.fromTo(
        slots,
        { scale: 0.94 },
        { scale: 1, stagger: 0.08, duration: 0.45, ease: 'back.out(1.8)' }
      );
    }
  };

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
                  key={idx}
                  className="card-slot flex flex-col items-center p-3.5 rounded-3xl bg-[#FFFDF9]/90 ring-1 ring-[#111111]/10 hover:ring-[#E8CF86] transition-all shadow-xs hover:shadow-md"
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
