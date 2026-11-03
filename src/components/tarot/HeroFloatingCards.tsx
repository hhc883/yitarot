'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TarotCardView } from './TarotCardView';
import { getCardBySlug } from '@/lib/tarot/deck';
import { Sparkles } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export function HeroFloatingCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardLeftRef = useRef<HTMLDivElement>(null);
  const cardCenterRef = useRef<HTMLDivElement>(null);
  const cardRightRef = useRef<HTMLDivElement>(null);
  const insightPillRef = useRef<HTMLDivElement>(null);

  const card1 = getCardBySlug('the-lovers') || getCardBySlug('the-fool')!;
  const card2 = getCardBySlug('the-star') || getCardBySlug('the-magician')!;
  const card3 = getCardBySlug('the-sun') || getCardBySlug('the-world')!;

  const [activeCardIndex, setActiveCardIndex] = useState(1); // 默认选中心间
  const [activeInsight, setActiveInsight] = useState('✦ 星星：风暴过后的天空，繁星正在为你引路');

  // GSAP 核心时间轴与悬浮微动效
  useGSAP(() => {
    // 1. 入场编排时间轴 (Entrance Choreography)
    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.6)', duration: 0.9 } });

    tl.from(cardCenterRef.current, {
      y: 60,
      scale: 0.8,
      autoAlpha: 0,
      duration: 1
    })
      .from(
        cardLeftRef.current,
        {
          x: -50,
          y: 40,
          rotation: -25,
          scale: 0.8,
          autoAlpha: 0
        },
        '-=0.7'
      )
      .from(
        cardRightRef.current,
        {
          x: 50,
          y: 40,
          rotation: 25,
          scale: 0.8,
          autoAlpha: 0
        },
        '-=0.7'
      )
      .from(
        insightPillRef.current,
        {
          y: 20,
          scale: 0.9,
          autoAlpha: 0,
          ease: 'power2.out',
          duration: 0.5
        },
        '-=0.4'
      );

    // 2. 真实 3D 浮动循环动画 (Continuous Organic Float)
    gsap.to(cardCenterRef.current, {
      y: '-=12',
      rotationZ: '+=1.2',
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to(cardLeftRef.current, {
      y: '+=10',
      rotationZ: '-=1.5',
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.4
    });

    gsap.to(cardRightRef.current, {
      y: '-=10',
      rotationZ: '+=1.5',
      duration: 4.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.8
    });
  }, { scope: containerRef });

  // 鼠标 3D 视差移动响应 (Mouse Parallax)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 ~ 0.5
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardLeftRef.current, {
      x: xRatio * 20,
      y: yRatio * 15,
      rotationY: xRatio * 18,
      rotationX: -yRatio * 15,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    gsap.to(cardCenterRef.current, {
      x: xRatio * 28,
      y: yRatio * 20,
      rotationY: xRatio * 14,
      rotationX: -yRatio * 12,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    gsap.to(cardRightRef.current, {
      x: xRatio * 22,
      y: yRatio * 15,
      rotationY: xRatio * 18,
      rotationX: -yRatio * 15,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  // 鼠标离开时平滑复位
  const handleMouseLeave = () => {
    gsap.to([cardLeftRef.current, cardCenterRef.current, cardRightRef.current], {
      x: 0,
      y: 0,
      rotationY: 0,
      rotationX: 0,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  // 点击卡牌聚焦
  const selectCard = (index: number, insight: string) => {
    setActiveCardIndex(index);
    setActiveInsight(insight);

    // 胶囊弹性弹跳
    if (insightPillRef.current) {
      gsap.fromTo(
        insightPillRef.current,
        { scale: 0.92, y: 4 },
        { scale: 1, y: 0, duration: 0.45, ease: 'back.out(2)' }
      );
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg mx-auto flex items-center justify-center py-8 select-none perspective-1000"
    >
      {/* 柔彩光晕背景 */}
      <div className="absolute -left-12 -top-10 w-64 h-64 rounded-full bg-[#A9D3FF]/30 blur-3xl pointer-events-none" />
      <div className="absolute -right-12 -bottom-10 w-72 h-72 rounded-full bg-[#FFB5C1]/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#FFE59A]/25 blur-3xl pointer-events-none" />

      {/* 3张扇形卡牌 */}
      <div className="relative flex items-center justify-center h-84 sm:h-96 w-full transform-style-3d">
        {/* 左侧卡牌：恋人 */}
        <div
          ref={cardLeftRef}
          onClick={() => selectCard(0, '✦ 恋人：坦诚倾听你的心声，选择你所深爱的')}
          className={`absolute -left-4 sm:left-4 z-10 transition-all duration-300 cursor-pointer ${
            activeCardIndex === 0 ? 'scale-108 z-40' : 'opacity-85 hover:opacity-100'
          }`}
          style={{ transform: 'rotate(-11deg)' }}
        >
          <div className="shadow-xl rounded-2xl">
            <TarotCardView
              card={card1}
              isReversed={false}
              isFlipped={true}
              size="sm"
              showDetails={false}
            />
          </div>
        </div>

        {/* 中间核心牌：星星 */}
        <div
          ref={cardCenterRef}
          onClick={() => selectCard(1, '✦ 星星：风暴过后的天空，繁星正在为你引路')}
          className={`relative z-30 transition-all duration-300 cursor-pointer ${
            activeCardIndex === 1 ? 'scale-108 z-40 ring-2 ring-[#FFE59A]' : 'opacity-85 hover:opacity-100'
          }`}
        >
          <div className="shadow-2xl rounded-2xl">
            <TarotCardView
              card={card2}
              isReversed={false}
              isFlipped={true}
              size="md"
              showDetails={false}
            />
          </div>
        </div>

        {/* 右侧卡牌：太阳 */}
        <div
          ref={cardRightRef}
          onClick={() => selectCard(2, '✦ 太阳：阴霾尽散，成功与生机正向你涌来')}
          className={`absolute -right-4 sm:right-4 z-20 transition-all duration-300 cursor-pointer ${
            activeCardIndex === 2 ? 'scale-108 z-40' : 'opacity-85 hover:opacity-100'
          }`}
          style={{ transform: 'rotate(10deg)' }}
        >
          <div className="shadow-xl rounded-2xl">
            <TarotCardView
              card={card3}
              isReversed={false}
              isFlipped={true}
              size="sm"
              showDetails={false}
            />
          </div>
        </div>
      </div>

      {/* 底部神谕动态提示胶囊 */}
      <div
        ref={insightPillRef}
        className="absolute -bottom-2 z-40 px-4 py-2 rounded-full bg-[#FFFDF9]/95 backdrop-blur-md ring-1 ring-[#111111]/10 shadow-lg text-xs font-serif text-[#111111] flex items-center gap-2"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#E8CF86] shrink-0" />
        <span className="font-medium tracking-wide">{activeInsight}</span>
      </div>
    </div>
  );
}
