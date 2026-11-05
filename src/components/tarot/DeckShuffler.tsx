'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { TarotSpread } from '@/lib/tarot/spreads';
import { TAROT_DECK, TarotCardData, DrawnCard } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import {
  Sparkles,
  RefreshCw,
  Eye,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Hand,
  Wand2
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin);
}

interface DeckShufflerProps {
  spread: TarotSpread;
  onCardsReady: (drawn: DrawnCard[]) => void;
}

interface FanCardItem {
  uid: string;
  card: TarotCardData;
  isReversed: boolean;
  isDrawn: boolean;
}

// 洗乱全套 78 张韦特塔罗牌
function generateShuffledFanDeck(): FanCardItem[] {
  const deck = [...TAROT_DECK];
  // Fisher-Yates 洗牌算法
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck.map((card, i) => ({
    uid: `fan-${card.slug}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    card,
    isReversed: Math.random() > 0.5,
    isDrawn: false
  }));
}

export function DeckShuffler({ spread, onCardsReady }: DeckShufflerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fanContainerRef = useRef<HTMLDivElement>(null);
  const fanTrackRef = useRef<HTMLDivElement>(null);
  const slotsGridRef = useRef<HTMLDivElement>(null);
  const draggableInstanceRef = useRef<globalThis.Draggable | null>(null);
  const isDraggingRef = useRef(false);

  const [shuffling, setShuffling] = useState(false);
  const [fanDeck, setFanDeck] = useState<FanCardItem[]>(() => generateShuffledFanDeck());
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [flippedStates, setFlippedStates] = useState<boolean[]>([]);
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);

  // 当牌阵规格改变时，重置抽牌状态
  useEffect(() => {
    setFanDeck(generateShuffledFanDeck());
    setDrawnCards([]);
    setFlippedStates([]);
  }, [spread.id, spread.cardCount]);

  // 基于 GSAP Draggable + Inertia 构建 78 张卡牌的扇形平滑拖动
  const { contextSafe } = useGSAP(() => {
    if (!fanTrackRef.current || !fanContainerRef.current) return;

    // 清理旧 draggable 实例
    if (draggableInstanceRef.current) {
      draggableInstanceRef.current.kill();
      draggableInstanceRef.current = null;
    }

    const [d] = Draggable.create(fanTrackRef.current, {
      type: 'x',
      bounds: fanContainerRef.current,
      inertia: true,
      edgeResistance: 0.85,
      cursor: 'grab',
      activeCursor: 'grabbing',
      dragClickables: false,
      minimumMovement: 6,
      onDragStart: () => {
        isDraggingRef.current = true;
      },
      onDragEnd: () => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 80);
      }
    });

    draggableInstanceRef.current = d;

    // 默认居中对齐牌堆，让中央卡牌对准视线正中
    if (d && fanTrackRef.current && fanContainerRef.current) {
      const containerW = fanContainerRef.current.offsetWidth;
      const trackW = fanTrackRef.current.scrollWidth;
      const initialX = Math.min(0, (containerW - trackW) / 2);
      gsap.set(fanTrackRef.current, { x: initialX });
      d.update();
    }

    const handleResize = () => {
      draggableInstanceRef.current?.update(true);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      d?.kill();
    };
  }, { dependencies: [shuffling, spread.id], scope: containerRef });

  // 鼠标滚轮水平滑动牌阵
  const handleWheel = (e: React.WheelEvent) => {
    if (!fanTrackRef.current || !draggableInstanceRef.current) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const d = draggableInstanceRef.current;

    gsap.to(fanTrackRef.current, {
      x: `-=${delta * 1.6}`,
      duration: 0.35,
      ease: 'power2.out',
      modifiers: {
        x: (xVal) => {
          const val = parseFloat(xVal);
          return gsap.utils.clamp(d.minX, d.maxX, val) + 'px';
        }
      },
      onUpdate: () => {
        d.update();
      }
    });
  };

  // 左右快速平滑滚动按钮
  const handleSlide = (direction: 'left' | 'right') => {
    if (!fanTrackRef.current || !draggableInstanceRef.current) return;
    const offset = direction === 'left' ? 380 : -380;
    const d = draggableInstanceRef.current;

    gsap.to(fanTrackRef.current, {
      x: `+=${offset}`,
      duration: 0.45,
      ease: 'power2.out',
      modifiers: {
        x: (xVal) => {
          const val = parseFloat(xVal);
          return gsap.utils.clamp(d.minX, d.maxX, val) + 'px';
        }
      },
      onUpdate: () => {
        d.update();
      }
    });
  };

  // 用户从 78 张扇形牌中手动抽出一张
  const handleCardSelect = contextSafe((fanIdx: number) => {
    if (isDraggingRef.current) return;
    if (shuffling) return;

    // 若当前已选满，提示翻开
    if (drawnCards.length >= spread.cardCount) return;

    const targetCard = fanDeck[fanIdx];
    if (!targetCard || targetCard.isDrawn) return;

    const currentSlotIdx = drawnCards.length;

    // 1. 标记牌堆中该牌已被抽取
    setFanDeck(prev => {
      const next = [...prev];
      next[fanIdx] = { ...next[fanIdx], isDrawn: true };
      return next;
    });

    // 2. 存入已抽取牌阵
    const newCard: DrawnCard = {
      card: targetCard.card,
      isReversed: targetCard.isReversed,
      positionName: spread.positions[currentSlotIdx]?.name || `第 ${currentSlotIdx + 1} 张牌`,
      positionDesc: spread.positions[currentSlotIdx]?.description || ''
    };

    setDrawnCards(prev => [...prev, newCard]);
    setFlippedStates(prev => [...prev, false]);

    // 3. GSAP 飞入上方牌位动效
    if (slotsGridRef.current) {
      setTimeout(() => {
        const slots = slotsGridRef.current?.querySelectorAll('.card-slot');
        const targetSlot = slots?.[currentSlotIdx];
        if (targetSlot) {
          gsap.fromTo(
            targetSlot,
            { y: -30, scale: 0.85, autoAlpha: 0, rotationY: 20 },
            { y: 0, scale: 1, autoAlpha: 1, rotationY: 0, duration: 0.55, ease: 'back.out(1.4)', clearProps: 'transform' }
          );
        }
      }, 50);
    }
  });

  // 宇宙随缘抽牌：一键自动从扇形牌库中抽取剩余所需卡牌
  const handleAutoDraw = contextSafe(() => {
    if (drawnCards.length >= spread.cardCount || shuffling) return;

    const needed = spread.cardCount - drawnCards.length;
    const availableIndices = fanDeck
      .map((item, idx) => (!item.isDrawn ? idx : -1))
      .filter(idx => idx !== -1);

    if (availableIndices.length < needed) return;

    const shuffledAvailable = [...availableIndices].sort(() => Math.random() - 0.5);
    const chosenIndices = shuffledAvailable.slice(0, needed);

    chosenIndices.forEach((fanIdx, i) => {
      setTimeout(() => {
        handleCardSelect(fanIdx);
      }, i * 220);
    });
  });

  // 重新洗牌与扇形重组
  const handleReshuffle = contextSafe(() => {
    if (shuffling) return;
    setShuffling(true);

    if (fanTrackRef.current) {
      const cardEls = fanTrackRef.current.querySelectorAll('.fan-card-item');
      gsap.to(cardEls, {
        y: -35,
        scale: 0.7,
        autoAlpha: 0,
        stagger: 0.005,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          setFanDeck(generateShuffledFanDeck());
          setDrawnCards([]);
          setFlippedStates([]);
          setTimeout(() => {
            setShuffling(false);
          }, 350);
        }
      });
    } else {
      setFanDeck(generateShuffledFanDeck());
      setDrawnCards([]);
      setFlippedStates([]);
      setTimeout(() => {
        setShuffling(false);
      }, 350);
    }
  });

  // 翻开单张卡牌
  const handleToggleFlip = contextSafe((index: number) => {
    setFlippedStates(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });

    if (slotsGridRef.current) {
      const slots = slotsGridRef.current.querySelectorAll('.card-slot');
      const targetSlot = slots[index];
      if (targetSlot) {
        gsap.timeline()
          .to(targetSlot, { y: -10, scale: 1.03, duration: 0.2, ease: 'power2.out' })
          .to(targetSlot, { y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.8)', clearProps: 'transform' });
      }
    }
  });

  // 一键翻开所有牌
  const handleRevealAll = contextSafe(() => {
    setFlippedStates(new Array(spread.cardCount).fill(true));

    if (slotsGridRef.current) {
      const slots = slotsGridRef.current.querySelectorAll('.card-slot');
      gsap.timeline()
        .to(slots, { y: -10, scale: 1.025, duration: 0.2, stagger: 0.12, ease: 'power2.out' })
        .to(slots, { y: 0, scale: 1, duration: 0.4, stagger: 0.12, ease: 'back.out(1.6)', clearProps: 'transform' }, '<0.08');
    }
  });

  const allDrawn = drawnCards.length === spread.cardCount;
  const allFlipped = allDrawn && flippedStates.length === spread.cardCount && flippedStates.every(Boolean);

  // 当全部翻开时，延迟 1.4 秒平滑过渡至解牌报告
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
      {/* 顶部控制栏与进度条 */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 shadow-xs mb-8">
        <div className="flex items-center gap-2.5">
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE59A]/40 text-[#8C6D23] border border-[#E8CF86]/50">
            {spread.nameZh}
          </span>
          <span className="text-xs text-[#736B5E]">
            已抽选 <strong className="text-[#1E1B18] font-bold">{drawnCards.length}</strong> / {spread.cardCount} 张牌
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReshuffle}
            disabled={shuffling}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#111111] transition-colors ring-1 ring-[#111111]/10 cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${shuffling ? 'animate-spin' : ''}`} />
            重新洗牌
          </button>

          {!allDrawn ? (
            <button
              onClick={handleAutoDraw}
              disabled={shuffling}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#FFE59A]/50 hover:bg-[#FFE59A]/80 text-[#8C6D23] border border-[#E8CF86]/60 transition-all cursor-pointer hover:scale-102"
            >
              <Wand2 className="w-3.5 h-3.5" />
              宇宙随缘盲抽
            </button>
          ) : (
            !allFlipped && (
              <button
                onClick={handleRevealAll}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] transition-all shadow-sm cursor-pointer hover:scale-102"
              >
                <Eye className="w-3.5 h-3.5" />
                一键翻开所有牌
              </button>
            )
          )}
        </div>
      </div>

      {/* 牌位槽位展示区 (Spread Slots) */}
      <div ref={slotsGridRef} className="w-full max-w-5xl mb-8">
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
          {spread.positions.map((pos, idx) => {
            const drawnItem = drawnCards[idx];
            const isFlipped = flippedStates[idx] ?? false;
            const isCurrentTarget = idx === drawnCards.length;

            return (
              <div
                key={idx}
                className={`card-slot flex flex-col items-center p-3.5 rounded-3xl transition-[border-color,box-shadow] shadow-xs ${
                  drawnItem
                    ? 'bg-[#FFFDF9]/95 ring-1 ring-[#111111]/10 hover:ring-[#E8CF86]'
                    : isCurrentTarget
                    ? 'bg-[#FFFDF9] ring-2 ring-[#C29026] shadow-md animate-pulse'
                    : 'bg-[#FFFDF9]/60 ring-1 ring-dashed ring-[#111111]/15 opacity-70'
                }`}
              >
                {/* 站位标题与说明 */}
                <div className="text-center mb-3">
                  <span
                    className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-1 ${
                      isCurrentTarget
                        ? 'bg-[#FFE59A] text-[#8C6D23] font-bold shadow-xs'
                        : 'bg-[#FFE59A]/30 text-[#8C6D23]'
                    }`}
                  >
                    {idx + 1}. {pos.name}
                  </span>
                  <p className="text-[10px] text-[#736B5E] max-w-[160px] line-clamp-1">
                    {pos.description}
                  </p>
                </div>

                {/* 卡牌实体 或 等待抽取占位 */}
                {drawnItem ? (
                  <>
                    <TarotCardView
                      card={drawnItem.card}
                      isReversed={drawnItem.isReversed}
                      isFlipped={isFlipped}
                      size="md"
                      onFlip={() => handleToggleFlip(idx)}
                    />
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
                  </>
                ) : (
                  <div
                    onClick={isCurrentTarget ? handleAutoDraw : undefined}
                    className={`w-36 h-58 rounded-2xl flex flex-col items-center justify-center p-3 text-center select-none ${
                      isCurrentTarget
                        ? 'border-2 border-dashed border-[#C29026] bg-[#FAF6ED]/80 cursor-pointer hover:bg-[#FAF6ED]'
                        : 'border border-dashed border-[#111111]/20 bg-[#FAF6ED]/40'
                    }`}
                  >
                    {isCurrentTarget ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#FFE59A]/40 border border-[#E8CF86] flex items-center justify-center text-[#8C6D23] shadow-xs">
                          <Sparkles className="w-5 h-5 animate-spin" />
                        </div>
                        <span className="text-xs font-serif font-bold text-[#8C6D23]">
                          待感应抽取
                        </span>
                        <p className="text-[10px] text-[#736B5E] leading-tight">
                          请在下方牌扇中<br />点选任意一张
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-[#736B5E]/60 text-xs">
                        <span className="block font-serif text-base mb-1 opacity-50">✦</span>
                        <span>待抽第 {idx + 1} 牌</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 全部选定后的揭示引导按钮 */}
        {allDrawn && (
          <div className="mt-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            {!allFlipped ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRevealAll}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] shadow-md text-xs sm:text-sm font-serif font-medium transition-all hover:scale-103 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#FFE59A]" />
                  <span>已选定所有牌 · 点击一键全部翻开</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onCardsReady(drawnCards)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] shadow-xl border border-[#E8CF86]/40 text-xs sm:text-sm font-serif font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FFE59A] animate-spin" />
                <span>牌阵全部揭晓 · 正在推演解牌中...</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 下方 78 张扇形牌库 (Draggable + Inertia 左右滑动抽牌区) */}
      <div className="w-full max-w-5xl rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-5 sm:p-7 shadow-sm overflow-hidden relative">
        {/* 标题说明条与滑动控制器 */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-[#8C6D23]" />
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#111111]">
              78 张神谕圣阵 · 直觉感应选牌
            </h3>
            <span className="text-[11px] text-[#736B5E] hidden sm:inline">
              {!allDrawn
                ? `（请抽取第 ${drawnCards.length + 1} 张：${spread.positions[drawnCards.length]?.name}）`
                : '（全部牌位已选定）'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSlide('left')}
              className="p-1.5 rounded-xl bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#111111] transition-colors ring-1 ring-[#111111]/10 cursor-pointer text-xs flex items-center gap-0.5"
              title="往左滑动"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[11px] hidden sm:inline">左滑</span>
            </button>
            <button
              onClick={() => handleSlide('right')}
              className="p-1.5 rounded-xl bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#111111] transition-colors ring-1 ring-[#111111]/10 cursor-pointer text-xs flex items-center gap-0.5"
              title="往右滑动"
            >
              <span className="text-[11px] hidden sm:inline">右滑</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 扇形牌阵交互容器 */}
        <div
          ref={fanContainerRef}
          onWheel={handleWheel}
          className="relative w-full overflow-hidden py-10 px-4 min-h-[190px] select-none"
        >
          {/* 两端渐隐蒙版 */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/90 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#FFFDF9] via-[#FFFDF9]/90 to-transparent z-20 pointer-events-none" />

          {/* 78 张卡牌扇形水平排布轨道 (可左右无缝拖拽) */}
          <div
            ref={fanTrackRef}
            className="flex items-center relative py-6 cursor-grab active:cursor-grabbing"
            style={{ width: 'max-content', paddingLeft: '80px', paddingRight: '120px' }}
          >
            {fanDeck.map((item, idx) => {
              const isHovered = hoveredCardIdx === idx;
              // 扇形弧度偏移计算 (中间微抬，两侧平滑微倾)
              const curveY = Math.sin((idx / 77) * Math.PI) * -16;
              const curveRotate = (idx - 38.5) * 0.35;

              return (
                <div
                  key={item.uid}
                  onClick={() => handleCardSelect(idx)}
                  onMouseEnter={() => setHoveredCardIdx(idx)}
                  onMouseLeave={() => setHoveredCardIdx(null)}
                  style={{
                    marginLeft: idx === 0 ? '0px' : '-52px',
                    transform: `translateY(${isHovered ? curveY - 26 : curveY}px) rotate(${
                      isHovered ? 0 : curveRotate
                    }deg) scale(${isHovered ? 1.14 : 1})`,
                    zIndex: isHovered ? 250 : idx + 10
                  }}
                  className={`fan-card-item relative flex-shrink-0 w-20 sm:w-22 h-32 sm:h-36 rounded-xl transition-all duration-200 select-none cursor-pointer ${
                    item.isDrawn
                      ? 'opacity-10 scale-90 pointer-events-none'
                      : isHovered
                      ? 'shadow-2xl ring-2 ring-[#E8CF86]'
                      : 'shadow-md hover:shadow-xl'
                  }`}
                >
                  {/* 高质感韦特塔罗牌背 */}
                  <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#111927] via-[#0E1524] to-[#0A0E17] border border-[#D4AF37]/50 p-1.5 flex flex-col items-center justify-between overflow-hidden shadow-inner">
                    <div className="w-full h-full rounded-lg border border-[#D4AF37]/35 p-1 flex flex-col items-center justify-between relative bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.15)_0%,_transparent_75%)]">
                      <span className="text-[7px] text-[#D4AF37]/70">✦</span>

                      <div className="w-7 h-7 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-xs shadow-[0_0_12px_rgba(212,175,55,0.25)] bg-[#0B1019]/80">
                        ✨
                      </div>

                      <span className="text-[7px] font-serif text-[#D4AF37]/70 tracking-widest uppercase">
                        #{idx + 1}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部拖动与交互指引 */}
        <div className="mt-3 text-center text-xs text-[#736B5E] flex flex-wrap items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#E8CF86]" />
          <span>左右拖动或滑动滚轮浏览 78 张全牌库，凭借第一瞬直觉点选卡牌抽入牌阵。</span>
        </div>
      </div>
    </div>
  );
}
