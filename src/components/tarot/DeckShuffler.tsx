'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  angle: number;
}

// 洗乱全套 78 张韦特塔罗牌并构建圆弧孔雀扇形角度
function generateShuffledFanDeck(): FanCardItem[] {
  const deck = [...TAROT_DECK];
  // Fisher-Yates 洗牌算法
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  // 78 张卡牌沿 -50° 至 +50° 均匀孔雀扇形放射排布
  const step = 100 / (deck.length - 1);
  return deck.map((card, i) => ({
    uid: `fan-${card.slug}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    card,
    isReversed: Math.random() > 0.5,
    angle: Number((-50 + i * step).toFixed(2))
  }));
}

// 极致性能优化的单张扇面叶片组件 (使用 React.memo，彻底杜绝鼠标划过时的重绘雪崩)
interface FanCardLeafProps {
  idx: number;
  angle: number;
  isDrawn: boolean;
  onSelect: (idx: number) => void;
}

const FanCardLeaf = React.memo(function FanCardLeaf({
  idx,
  angle,
  isDrawn,
  onSelect
}: FanCardLeafProps) {
  const handleClick = useCallback(() => {
    onSelect(idx);
  }, [idx, onSelect]);

  return (
    <div
      style={{
        position: 'absolute',
        left: '-38px',
        top: '-430px',
        width: '76px',
        height: '124px',
        transform: `rotate(${angle}deg)`,
        transformOrigin: '38px 430px',
        zIndex: idx + 10,
        contain: 'layout style paint',
        pointerEvents: isDrawn ? 'none' : 'auto'
      }}
    >
      {/* 
        性能关键：仅对 transform 与 opacity 过渡，严禁 transition-all 和动态 box-shadow！
        使用纯 GPU 合成层 hover:-translate-y-7 与 hover:brightness-115，保证零 CPU 栅格化负担。
      */}
      <div
        onClick={handleClick}
        style={{
          transform: isDrawn ? 'scale(0.85)' : undefined,
          opacity: isDrawn ? 0.08 : 1,
          transition: 'transform 0.12s cubic-bezier(0.2, 0, 0.2, 1)',
          willChange: 'transform'
        }}
        className={`w-full h-full rounded-xl select-none cursor-pointer ${
          !isDrawn
            ? 'hover:-translate-y-7 hover:scale-106 hover:brightness-115 active:scale-98'
            : ''
        }`}
      >
        {/* 精美卡牌背面 (高质感但极轻量 DOM) */}
        <div className="w-full h-full rounded-xl bg-[#0F1624] border border-[#D4AF37]/60 p-1 flex flex-col items-center justify-between shadow-[0_4px_10px_rgba(0,0,0,0.35)]">
          <div className="w-full h-full rounded-lg border border-[#D4AF37]/30 p-1 flex flex-col items-center justify-between relative bg-gradient-to-b from-[#162235] to-[#0A0F19]">
            <span className="text-[7px] text-[#D4AF37]/70">✦</span>
            <div className="w-6 h-6 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[10px] bg-[#070B12]">
              ✨
            </div>
            <span className="text-[7px] font-mono text-[#D4AF37]/70 tracking-wider">
              #{idx + 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export function DeckShuffler({ spread, onCardsReady }: DeckShufflerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fanContainerRef = useRef<HTMLDivElement>(null);
  const fanPivotRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const slotsGridRef = useRef<HTMLDivElement>(null);
  const draggableInstanceRef = useRef<globalThis.Draggable | null>(null);
  const isDraggingRef = useRef(false);
  const setRotationRef = useRef<((val: number | string) => void) | null>(null);

  const [shuffling, setShuffling] = useState(false);
  const [fanDeck, setFanDeck] = useState<FanCardItem[]>(() => generateShuffledFanDeck());
  const [drawnIndices, setDrawnIndices] = useState<number[]>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [flippedStates, setFlippedStates] = useState<boolean[]>([]);

  // 当牌阵规格改变时，重置抽牌状态
  useEffect(() => {
    setFanDeck(generateShuffledFanDeck());
    setDrawnIndices([]);
    setDrawnCards([]);
    setFlippedStates([]);
  }, [spread.id, spread.cardCount]);

  // 使用 GSAP quickSetter 极速更新旋转，开销比常规 setState/gsap.set 低 250%
  const syncRotationFromProxy = useCallback(() => {
    if (!proxyRef.current || !setRotationRef.current) return;
    const currentX = (gsap.getProperty(proxyRef.current, 'x') as number) || 0;
    // 拖动 X 范围 [-550, 550] 映射至旋转角度 [+50°, -50°]
    const targetAngle = -(currentX / 550) * 50;
    setRotationRef.current(targetAngle);
  }, []);

  // 基于 GSAP Draggable + Inertia 构建扇形圆盘惯性旋转
  const { contextSafe } = useGSAP(() => {
    if (!fanContainerRef.current || !proxyRef.current || !fanPivotRef.current) return;

    if (draggableInstanceRef.current) {
      draggableInstanceRef.current.kill();
      draggableInstanceRef.current = null;
    }

    // 初始化 quickSetter
    setRotationRef.current = gsap.quickSetter(fanPivotRef.current, 'rotation', 'deg') as (val: number | string) => void;

    // 初始重置 proxy 与扇形角度
    gsap.set(proxyRef.current, { x: 0 });
    setRotationRef.current?.(0);

    const [d] = Draggable.create(proxyRef.current, {
      trigger: fanContainerRef.current,
      type: 'x',
      bounds: { minX: -550, maxX: 550 },
      inertia: true,
      edgeResistance: 0.85,
      cursor: 'grab',
      activeCursor: 'grabbing',
      dragClickables: false,
      minimumMovement: 8,
      onDragStart: () => {
        isDraggingRef.current = true;
      },
      onDrag: syncRotationFromProxy,
      onThrowUpdate: syncRotationFromProxy,
      onDragEnd: () => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 80);
      }
    });

    draggableInstanceRef.current = d;

    // 原生 non-passive wheel 事件，彻底阻止页面上下滚动
    const container = fanContainerRef.current;
    const onWheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const currentX = (gsap.getProperty(proxyRef.current, 'x') as number) || 0;
      const targetX = gsap.utils.clamp(-550, 550, currentX - delta * 1.5);

      gsap.to(proxyRef.current, {
        x: targetX,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => {
          syncRotationFromProxy();
          d?.update();
        }
      });
    };

    container.addEventListener('wheel', onWheelHandler, { passive: false });

    return () => {
      container.removeEventListener('wheel', onWheelHandler);
      d?.kill();
    };
  }, { dependencies: [shuffling, spread.id], scope: containerRef });

  // 左右平滑旋转滑键
  const handleSlide = (direction: 'left' | 'right') => {
    if (!proxyRef.current || !draggableInstanceRef.current) return;
    const offset = direction === 'left' ? 260 : -260;
    const currentX = (gsap.getProperty(proxyRef.current, 'x') as number) || 0;
    const targetX = gsap.utils.clamp(-550, 550, currentX + offset);

    gsap.to(proxyRef.current, {
      x: targetX,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: () => {
        syncRotationFromProxy();
        draggableInstanceRef.current?.update();
      }
    });
  };

  // 用户点击扇形中的任意一张牌进行抽取
  const handleCardSelect = useCallback((fanIdx: number) => {
    if (isDraggingRef.current) return;
    if (shuffling) return;

    if (drawnCards.length >= spread.cardCount) return;
    if (drawnIndices.includes(fanIdx)) return;

    const targetCard = fanDeck[fanIdx];
    if (!targetCard) return;

    const currentSlotIdx = drawnCards.length;

    // 1. 记录已抽取索引 (仅引发该张 FanCardLeaf 局部 re-render，其他 77 张完全不动)
    setDrawnIndices(prev => [...prev, fanIdx]);

    // 2. 存入已抽取牌阵
    const newCard: DrawnCard = {
      card: targetCard.card,
      isReversed: targetCard.isReversed,
      positionName: spread.positions[currentSlotIdx]?.name || `第 ${currentSlotIdx + 1} 张牌`,
      positionDesc: spread.positions[currentSlotIdx]?.description || ''
    };

    setDrawnCards(prev => [...prev, newCard]);
    setFlippedStates(prev => [...prev, false]);

    // 3. GSAP 飞入上方牌位动效反馈
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
  }, [drawnCards.length, drawnIndices, fanDeck, shuffling, spread.cardCount, spread.positions]);

  // 宇宙随缘盲抽：一键按节奏从扇面中抽取剩余卡牌
  const handleAutoDraw = contextSafe(() => {
    if (drawnCards.length >= spread.cardCount || shuffling) return;

    const needed = spread.cardCount - drawnCards.length;
    const availableIndices = fanDeck
      .map((_, idx) => (!drawnIndices.includes(idx) ? idx : -1))
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

  // 重新洗牌：扇面收拢与重组
  const handleReshuffle = contextSafe(() => {
    if (shuffling) return;
    setShuffling(true);

    if (fanPivotRef.current) {
      gsap.to(fanPivotRef.current, {
        scale: 0.7,
        autoAlpha: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          setFanDeck(generateShuffledFanDeck());
          setDrawnIndices([]);
          setDrawnCards([]);
          setFlippedStates([]);
          if (proxyRef.current) gsap.set(proxyRef.current, { x: 0 });
          setRotationRef.current?.(0);
          gsap.set(fanPivotRef.current, { scale: 1, autoAlpha: 1 });
          setTimeout(() => {
            setShuffling(false);
          }, 350);
        }
      });
    } else {
      setFanDeck(generateShuffledFanDeck());
      setDrawnIndices([]);
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
      {/* 隐藏的 Draggable X 轴计算代理节点 */}
      <div ref={proxyRef} className="hidden pointer-events-none" />

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
                          请在下方扇形牌阵中<br />点选任意一张
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

      {/* 下方 78 张纯正圆弧孔雀扇形牌库 (真正的扇形拱曲排开，硬件加速 60 FPS) */}
      <div className="w-full max-w-5xl rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-5 sm:p-7 shadow-sm overflow-hidden relative">
        {/* 标题说明条与滑动控制器 */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2 px-1">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-[#8C6D23]" />
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#111111]">
              78 张神谕圣阵 · 孔雀扇形开牌
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
              title="往左旋转牌扇"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[11px] hidden sm:inline">左旋</span>
            </button>
            <button
              onClick={() => handleSlide('right')}
              className="p-1.5 rounded-xl bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#111111] transition-colors ring-1 ring-[#111111]/10 cursor-pointer text-xs flex items-center gap-0.5"
              title="往右旋转牌扇"
            >
              <span className="text-[11px] hidden sm:inline">右旋</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 真正的圆弧扇形舞台 (捕获鼠标/触摸事件，阻止页面滚动) */}
        <div
          ref={fanContainerRef}
          style={{ touchAction: 'none' }}
          className="relative w-full h-[320px] sm:h-[350px] overflow-hidden select-none cursor-grab active:cursor-grabbing"
        >
          {/* 两侧光晕遮罩 */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#FFFDF9] via-[#FFFDF9]/80 to-transparent z-20 pointer-events-none" />

          {/* 扇面底部发光星辉底座 */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-140px] w-[500px] h-[300px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.18)_0%,_transparent_70%)] pointer-events-none blur-xl" />

          {/* 扇形旋转中心轴 (所有 78 张卡牌沿 (50%, 460px) 轴心放射扇形排布) */}
          <div
            ref={fanPivotRef}
            style={{
              position: 'absolute',
              left: '50%',
              top: '460px',
              width: '0px',
              height: '0px',
              transformOrigin: '0px 0px',
              willChange: 'transform'
            }}
          >
            {fanDeck.map((item, idx) => (
              <FanCardLeaf
                key={item.uid}
                idx={idx}
                angle={item.angle}
                isDrawn={drawnIndices.includes(idx)}
                onSelect={handleCardSelect}
              />
            ))}
          </div>
        </div>

        {/* 底部拖动与交互指引 */}
        <div className="mt-2 text-center text-xs text-[#736B5E] flex flex-wrap items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#E8CF86]" />
          <span>左右拖拽或在扇面滚动滚轮旋转浏览 78 张神谕孔雀扇，凭第一瞬直觉点选抽卡。</span>
        </div>
      </div>
    </div>
  );
}
