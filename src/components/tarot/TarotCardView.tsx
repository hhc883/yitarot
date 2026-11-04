'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TarotCardData, getCardImageUrl } from '@/lib/tarot/deck';

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
  // 尺寸映射 (保持 2:3 黄金比例)
  const sizeClasses = {
    sm: 'w-24 h-38 text-xs',
    md: 'w-36 h-58 text-sm',
    lg: 'w-48 h-76 text-base',
    xl: 'w-64 h-100 text-lg'
  }[size];

  const imageSrc = getCardImageUrl(card, 'webp');
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onFlip}
      className={`group relative perspective-1000 select-none ${sizeClasses} ${onFlip ? 'cursor-pointer' : ''} ${className}`}
    >
      <div
        className={`relative w-full h-full rounded-2xl transition-transform duration-700 transform-style-3d shadow-md hover:shadow-2xl ${
          isFlipped ? '' : 'rotate-y-180'
        }`}
      >
        {/* 卡牌正面 (Front) */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl backface-hidden bg-[#FFFDF9] border border-[#C29026]/35 p-1.5 sm:p-2 flex flex-col justify-between overflow-hidden shadow-[inset_0_0_15px_rgba(194,144,38,0.08)]"
        >
          {/* 高清真实卡牌插画层 */}
          <div
            className={`relative w-full flex-1 rounded-xl overflow-hidden border border-[#C29026]/25 shadow-inner transition-transform duration-500 bg-[#FAF6ED] ${
              isReversed ? 'rotate-180' : ''
            }`}
          >
            <Image
              src={imgError ? getCardImageUrl(card, 'png') : imageSrc}
              alt={`${card.nameZh} (${card.nameEn})`}
              fill
              sizes="(max-width: 640px) 150px, (max-width: 1024px) 240px, 320px"
              className="object-cover"
              onError={() => setImgError(true)}
              loading="lazy"
            />

            {/* 微妙的羊皮纸与金箔反光质感层 */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 via-transparent to-white/10" />
          </div>

          {/* 底部牌名与关键词指示条 (保持正向不倒转) */}
          {showDetails && (
            <div className="relative z-10 pt-1.5 px-1 text-center bg-[#FFFDF9]/95 backdrop-blur-xs rounded-b-xl border-t border-[#C29026]/20 mt-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-serif font-black text-[#1E1B18] text-[11px] sm:text-xs truncate">
                  {card.nameZh}
                </span>
                <span
                  className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold tracking-wider ${
                    isReversed
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-[#FFE59A]/40 text-[#8C6D23] border border-[#E8CF86]/50'
                  }`}
                >
                  {isReversed ? '逆' : '正'}
                </span>
              </div>
              <p className="text-[9px] text-[#736B5E] truncate">
                {isReversed
                  ? card.reversedKeywords.slice(0, 2).join(' · ')
                  : card.uprightKeywords.slice(0, 2).join(' · ')}
              </p>
            </div>
          )}
        </div>

        {/* 卡牌背面 (Back) */}
        <div className="absolute inset-0 w-full h-full rounded-2xl backface-hidden rotate-y-180 bg-gradient-to-b from-[#111927] to-[#0A0E17] border border-[#D4AF37]/50 p-1.5 sm:p-2 shadow-2xl flex flex-col items-center justify-between overflow-hidden">
          {/* 金色神圣几何双层边框 */}
          <div className="w-full h-full rounded-xl border border-[#D4AF37]/40 p-2 flex flex-col items-center justify-between relative bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.18)_0%,_transparent_75%)]">
            {/* 四角星芒 */}
            <span className="absolute top-1 left-1.5 text-[9px] text-[#D4AF37]/70">✦</span>
            <span className="absolute top-1 right-1.5 text-[9px] text-[#D4AF37]/70">✦</span>
            <span className="absolute bottom-1 left-1.5 text-[9px] text-[#D4AF37]/70">✦</span>
            <span className="absolute bottom-1 right-1.5 text-[9px] text-[#D4AF37]/70">✦</span>

            {/* 顶部经典铭文 */}
            <span className="text-[8px] font-serif uppercase tracking-[0.2em] text-[#D4AF37]/60">
              TAROTIP ORACLE
            </span>

            {/* 中心日月星辉神圣图腾 */}
            <div className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-full border border-[#D4AF37]/60 flex items-center justify-center bg-[#0B1019]/90 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-dashed border-[#D4AF37]/40 flex items-center justify-center animate-spin-slow">
                <span className="text-xl sm:text-2xl filter drop-shadow">✨</span>
              </div>
            </div>

            {/* 底部品牌 */}
            <div className="font-serif tracking-[0.3em] text-[9px] sm:text-[10px] uppercase text-[#D4AF37]/80 font-bold">
              EST. MMXXIV
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
