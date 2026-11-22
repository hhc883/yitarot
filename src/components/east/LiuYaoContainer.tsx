'use client';

import React, { useState } from 'react';
import { Coins, Camera } from 'lucide-react';
import { CoinTossGsap } from './CoinTossGsap';
import { HexagramVisionWidget } from './HexagramVisionWidget';

interface LiuYaoContainerProps {
  lang: 'zh' | 'en';
}

export function LiuYaoContainer({ lang }: LiuYaoContainerProps) {
  const isEn = lang === 'en';
  const [activeMode, setActiveMode] = useState<'toss' | 'vision'>('toss');

  return (
    <div className="w-full space-y-8">
      {/* 模式切换器 */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 bg-[#F4F4F5] p-1 rounded-xl border border-[#E4E4E7]">
          <button
            type="button"
            onClick={() => setActiveMode('toss')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeMode === 'toss'
                ? 'bg-white text-[#171717] shadow-xs'
                : 'text-[#71717A] hover:text-[#171717]'
            }`}
          >
            <Coins size={15} />
            <span>{isEn ? 'Coin Toss Ritual' : '三钱投掷起卦'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('vision')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeMode === 'vision'
                ? 'bg-white text-[#171717] shadow-xs'
                : 'text-[#71717A] hover:text-[#171717]'
            }`}
          >
            <Camera size={15} />
            <span className="flex items-center gap-1.5">
              <span>{isEn ? 'Screenshot Reading' : '截图/拍照识卦'}</span>
              <span className="text-[10px] bg-[#171717] text-white px-1.5 py-0.2 rounded font-mono font-normal">
                AI Vision
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* 视图内容 */}
      {activeMode === 'toss' ? (
        <CoinTossGsap lang={lang} />
      ) : (
        <HexagramVisionWidget lang={lang} />
      )}
    </div>
  );
}
