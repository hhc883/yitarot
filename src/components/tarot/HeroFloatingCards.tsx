'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sparkles } from 'lucide-react';
import { getCardBySlug, getCardImageUrl } from '@/lib/tarot/deck';

gsap.registerPlugin(useGSAP);

interface CardItem {
  slug: string;
  fallbackSlug: string;
  numeral: string;
  rotation: number;
  zIndex: number;
  insight: string;
}

const HERO_CARDS: CardItem[] = [
  {
    slug: 'the-lovers',
    fallbackSlug: 'the-fool',
    numeral: 'VI',
    rotation: -14,
    zIndex: 10,
    insight: '✦ 恋人：坦诚倾听你的心声，选择你所深爱的'
  },
  {
    slug: 'the-star',
    fallbackSlug: 'the-magician',
    numeral: 'XVII',
    rotation: 0,
    zIndex: 25,
    insight: '✦ 星星：风暴过后的天空，繁星正在为你引路'
  },
  {
    slug: 'the-sun',
    fallbackSlug: 'the-world',
    numeral: 'XIX',
    rotation: 14,
    zIndex: 15,
    insight: '✦ 太阳：阴霾尽散，成功与生机正向你涌来'
  }
];

export function HeroFloatingCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const insightPillRef = useRef<HTMLDivElement>(null);

  const [activeCardIndex, setActiveCardIndex] = useState(1); // 默认选中心间（星星）
  const [activeInsight, setActiveInsight] = useState(HERO_CARDS[1].insight);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // 预先获取卡牌元数据
  const cardsData = HERO_CARDS.map(item => {
    const card = getCardBySlug(item.slug) || getCardBySlug(item.fallbackSlug)!;
    return { ...item, card };
  });

  // 点击卡牌聚焦
  const handleSelectCard = (index: number, insight: string) => {
    setActiveCardIndex(index);
    setActiveInsight(insight);

    // 提示胶囊弹性弹跳
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
      className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center py-4 select-none overflow-visible"
    >
      {/* 典雅暖宣纸与泥金流光氛围背景（严格遵循 QiCosmos 东方宋宣与曜石玄墨设计规范） */}
      <div className="absolute -left-10 -top-8 w-64 h-64 rounded-full bg-[#C8A858]/14 blur-3xl pointer-events-none" />
      <div className="absolute -right-10 -bottom-8 w-72 h-72 rounded-full bg-[#D4AF37]/14 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-84 h-84 rounded-full bg-[#FFE59A]/18 blur-3xl pointer-events-none" />

      {/* 3张扇形叠放与悬浮展开卡牌容器（用户提供的 Glass Stack 交互形态） */}
      <div
        className="hero-cards-deck w-full min-h-[280px] sm:min-h-[330px] py-4"
        role="region"
        aria-label="塔罗卡牌扇形展台"
      >
        {cardsData.map((item, idx) => {
          const isActive = activeCardIndex === idx;
          const imageSrc = imgErrors[item.slug]
            ? getCardImageUrl(item.card, 'png')
            : getCardImageUrl(item.card, 'webp');

          return (
            <div
              key={item.slug}
              data-text={`${item.card.nameZh} · ${item.card.nameEn}`}
              style={{
                '--r': item.rotation,
                zIndex: isActive ? 35 : item.zIndex
              } as React.CSSProperties}
              onClick={() => handleSelectCard(idx, item.insight)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectCard(idx, item.insight);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${item.card.nameZh} - ${item.card.nameEn}`}
              className={`hero-glass-card group ${isActive ? 'is-active' : ''}`}
            >
              {/* 卡牌插画核心展示区 */}
              <div className="relative w-full flex-1 rounded-xl overflow-hidden border border-[#C8A858]/25 bg-[#FAF6ED] p-0.5">
                <Image
                  src={imageSrc}
                  alt={`${item.card.nameZh} (${item.card.nameEn})`}
                  fill
                  sizes="(max-width: 640px) 150px, 200px"
                  className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-104"
                  onError={() => setImgErrors(prev => ({ ...prev, [item.slug]: true }))}
                  priority={idx === 1}
                />

                {/* 羊皮纸温润微光与古金反光质感 */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 via-transparent to-white/12" />

                {/* 顶部古典罗马数字角标 */}
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-sm bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#C8A858]/35 text-[9px] font-serif font-black text-[#8C6D23] shadow-2xs pointer-events-none">
                  {item.numeral}
                </div>
              </div>

              {/* 底部玻璃拟态牌名横条（对应 attr(data-text) 形式，适配网站宋宣与香槟金排版） */}
              <div className="w-full mt-1.5 pt-1.5 pb-1 px-2.5 rounded-xl bg-[#FFFDF9]/92 backdrop-blur-md border border-[#C8A858]/25 flex items-center justify-between text-left shadow-2xs">
                <span className="font-serif font-bold text-xs text-[#111111] tracking-wide">
                  {item.card.nameZh}
                </span>
                <span className="text-[10px] font-serif italic text-[#8C6D23] font-medium tracking-tight">
                  {item.card.nameEn}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部神谕动态提示胶囊 */}
      <div
        ref={insightPillRef}
        className="mt-3 z-40 px-4 py-2 rounded-full bg-[#FFFDF9]/95 backdrop-blur-md ring-1 ring-[#111111]/10 shadow-lg text-xs font-serif text-[#111111] flex items-center gap-2 max-w-[92%] text-center"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#C8A858] shrink-0" />
        <span className="font-medium tracking-wide">{activeInsight}</span>
      </div>
    </div>
  );
}
