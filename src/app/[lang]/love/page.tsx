import React from 'react';
import { ReadingConsole } from '@/components/tarot/ReadingConsole';
import { Heart, Sparkles } from 'lucide-react';

export default function LovePage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* 头部介绍 */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium mb-3">
          <Heart className="w-3.5 h-3.5 fill-rose-500" /> 情感关系镜像
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1E1B18]">
          爱情塔罗占卜
        </h1>
        <p className="text-xs sm:text-sm text-[#736B5E] mt-2 max-w-lg mx-auto">
          暗恋心思、复合可能、相处瓶颈还是正缘出现？让三维爱意牌阵照亮彼此潜意识的真实心声。
        </p>
      </div>

      <ReadingConsole defaultCategory="love" />
    </div>
  );
}
