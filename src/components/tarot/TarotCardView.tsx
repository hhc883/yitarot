'use client';

import React from 'react';
import { TarotCardData } from '@/lib/tarot/deck';

interface TarotCardViewProps {
  card: TarotCardData;
  isReversed?: boolean;
  isFlipped?: boolean; // false = back visible, true = front visible
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onFlip?: () => void;
  className?: string;
  showDetails?: boolean;
}

export function TarotCardView({
  card,
  isReversed = false,
  isFlipped = true,
  size = 'md',
  onFlip,
  className = '',
  showDetails = true
}: TarotCardViewProps) {
  // 尺寸映射
  const sizeClasses = {
    sm: 'w-24 h-40 text-xs',
    md: 'w-36 h-60 text-sm',
    lg: 'w-48 h-80 text-base',
    xl: 'w-64 h-104 text-lg'
  }[size];

  // 元素与花色象征徽标
  const getSuitSymbol = () => {
    if (card.arcana === 'major') return '✦';
    switch (card.suit) {
      case 'wands': return '🔥';
      case 'cups': return '💧';
      case 'swords': return '⚔️';
      case 'pentacles': return '🪙';
      default: return '✦';
    }
  };

  return (
    <div
      onClick={onFlip}
      className={`group relative perspective-1000 select-none ${sizeClasses} ${onFlip ? 'cursor-pointer' : ''} ${className}`}
    >
      <div
        className={`relative w-full h-full rounded-2xl transition-transform duration-700 transform-style-3d shadow-md hover:shadow-xl ${
          isFlipped ? '' : 'rotate-y-180'
        }`}
      >
        {/* 卡牌正面 (Front) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl backface-hidden bg-[#FFFDF9] border border-[#1E1B18]/15 flex flex-col justify-between p-2.5 sm:p-3 overflow-hidden shadow-[inset_0_0_15px_rgba(194,144,38,0.06)] ${
            isReversed ? 'rotate-180' : ''
          }`}
        >
          {/* 顶部标头 */}
          <div className="flex items-center justify-between border-b border-[#1E1B18]/10 pb-1.5">
            <span className="font-serif font-bold text-[#8C6D23] tracking-widest text-[11px] sm:text-xs">
              {card.romanNumeral || `#${card.number}`}
            </span>
            <span className="text-xs opacity-75">{getSuitSymbol()}</span>
            <span className="text-[10px] font-sans uppercase tracking-wider text-[#736B5E]">
              {card.arcana === 'major' ? 'Major' : card.suit}
            </span>
          </div>

          {/* 卡牌中央艺术插画区域 */}
          <div className="relative my-auto flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#FAF6ED] to-[#F3ECE0] border border-[#C29026]/20">
            {/* 神圣几何光圈背景 */}
            <div className="absolute inset-0 rounded-xl opacity-20 pointer-events-none bg-[radial-gradient(#C29026_1px,transparent_1px)] [background-size:8px_8px]" />

            {/* 核心意象图案 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-white/90 shadow-sm border border-[#C29026]/30 mb-2">
                <span className="text-2xl sm:text-3xl filter drop-shadow">
                  {card.arcana === 'major' ? '🔮' : getSuitSymbol()}
                </span>
              </div>
              <div className="font-serif font-bold text-[#1E1B18] text-sm sm:text-base tracking-wide">
                {card.nameZh}
              </div>
              <div className="text-[10px] sm:text-xs font-serif italic text-[#736B5E] tracking-tight">
                {card.nameEn}
              </div>
            </div>
          </div>

          {/* 底部正逆位与关键词提示 */}
          {showDetails && (
            <div className="pt-1.5 border-t border-[#1E1B18]/10 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    isReversed
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {isReversed ? '逆位 🔄' : '正位 ✨'}
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-[#736B5E] line-clamp-1">
                {isReversed ? card.reversedKeywords.slice(0, 2).join(' · ') : card.uprightKeywords.slice(0, 2).join(' · ')}
              </p>
            </div>
          )}
        </div>

        {/* 卡牌背面 (Back) */}
        <div className="absolute inset-0 w-full h-full rounded-2xl backface-hidden rotate-y-180 bg-[#16202E] border-2 border-[#D4AF37]/50 p-2 shadow-inner flex flex-col items-center justify-between overflow-hidden">
          {/* 金色华丽边框衬线 */}
          <div className="w-full h-full rounded-xl border border-[#D4AF37]/40 p-2 flex flex-col items-center justify-center relative bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.15)_0%,_transparent_70%)]">
            {/* 四角几何符号 */}
            <span className="absolute top-1 left-1 text-[9px] text-[#D4AF37]/60">✦</span>
            <span className="absolute top-1 right-1 text-[9px] text-[#D4AF37]/60">✦</span>
            <span className="absolute bottom-1 left-1 text-[9px] text-[#D4AF37]/60">✦</span>
            <span className="absolute bottom-1 right-1 text-[9px] text-[#D4AF37]/60">✦</span>

            {/* 中心日月星芒图腾 */}
            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-[#0F1722]/80 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
              <div className="text-xl sm:text-2xl animate-pulse">☀️</div>
            </div>

            <div className="mt-3 font-serif tracking-[0.25em] text-[10px] uppercase text-[#D4AF37]/80">
              TAROTIP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
