'use client';

import React, { useRef } from 'react';
import { DrawnCard } from '@/lib/tarot/deck';
import { TarotReader } from '@/lib/tarot/readers';
import { X, Download, Sparkles } from 'lucide-react';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  reader: TarotReader;
  drawnCards: DrawnCard[];
}

export function ShareCardModal({
  isOpen,
  onClose,
  question,
  reader,
  drawnCards
}: ShareCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FFFDF9] rounded-3xl p-6 shadow-2xl border border-[#1E1B18]/15 flex flex-col items-center">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FAF6ED] text-[#736B5E] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif font-bold text-lg text-[#1E1B18] mb-1 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#C29026]" /> 塔罗结缘分享卡
        </h3>
        <p className="text-xs text-[#736B5E] mb-5">保存至相册，分享给挚友或记录今日顿悟</p>

        {/* 结缘海报本体 */}
        <div
          ref={cardRef}
          className="w-full rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EC] border-2 border-[#D4AF37]/40 p-6 shadow-lg text-[#1E1B18] relative overflow-hidden"
        >
          {/* 金色雅致底纹装饰 */}
          <div className="absolute top-2 left-2 text-[#D4AF37]/30 text-xs">✦</div>
          <div className="absolute top-2 right-2 text-[#D4AF37]/30 text-xs">✦</div>
          <div className="absolute bottom-2 left-2 text-[#D4AF37]/30 text-xs">✦</div>
          <div className="absolute bottom-2 right-2 text-[#D4AF37]/30 text-xs">✦</div>

          <div className="text-center mb-4">
            <span className="font-serif tracking-widest text-[11px] text-[#8C6D23] uppercase">
              TAROTIP · 心灵神谕
            </span>
            <div className="w-12 h-0.5 bg-[#C29026]/40 mx-auto mt-1 mb-3" />
            <h4 className="font-serif font-bold text-base text-[#1E1B18] line-clamp-2 px-2">
              “{question}”
            </h4>
          </div>

          {/* 牌卡展示 */}
          <div className="flex justify-center gap-2 my-4">
            {drawnCards.map((c, i) => (
              <div
                key={i}
                className="flex-1 max-w-[100px] flex flex-col items-center p-2 rounded-xl bg-white/80 border border-[#D4AF37]/30 shadow-xs text-center"
              >
                <span className="text-[9px] text-[#8C6D23] font-medium line-clamp-1">{c.positionName}</span>
                <span className="text-xl my-1">{c.card.arcana === 'major' ? '🔮' : '✦'}</span>
                <span className="font-serif font-bold text-xs text-[#1E1B18]">{c.card.nameZh}</span>
                <span
                  className={`text-[9px] px-1 rounded-sm mt-0.5 ${
                    c.isReversed ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {c.isReversed ? '逆位' : '正位'}
                </span>
              </div>
            ))}
          </div>

          {/* 塔罗师指引金句 */}
          <div className="mt-4 p-3 rounded-xl bg-[#F5ECE0]/60 border border-[#C29026]/20 text-center">
            <p className="font-serif italic text-xs text-[#5C5549] leading-relaxed">
              “{drawnCards[0]?.card.advice || '静心听从内心的回响，所有答案都早已在你心中。'}”
            </p>
          </div>

          {/* 底部水印与时间 */}
          <div className="mt-5 pt-3 border-t border-[#1E1B18]/10 flex items-center justify-between text-[10px] text-[#736B5E]">
            <div className="flex items-center gap-1.5">
              <span>{reader.avatarIcon}</span>
              <span>解牌：{reader.name}</span>
            </div>
            <span>{new Date().toLocaleDateString('zh-CN')}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex gap-3 w-full">
          <button
            onClick={() => {
              alert('结缘卡已就绪！你可以使用手机或电脑截图保存此卡片分享至小红书/朋友圈。');
            }}
            className="flex-1 py-3 rounded-2xl bg-[#1E1B18] hover:bg-[#38332D] text-[#FFFDF9] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            保存结缘卡
          </button>
        </div>
      </div>
    </div>
  );
}
