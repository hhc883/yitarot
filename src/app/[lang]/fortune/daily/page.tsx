'use client';

import React, { useSyncExternalStore } from 'react';
import { ReadingConsole } from '@/components/tarot/ReadingConsole';
import { Sun } from 'lucide-react';

function getFormattedDate() {
  if (typeof window === 'undefined') return '今日灵感';
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

const emptySubscribe = () => () => {};

export default function DailyFortunePage() {
  const todayStr = useSyncExternalStore(
    emptySubscribe,
    getFormattedDate,
    () => '今日灵感'
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium mb-3">
          <Sun className="w-3.5 h-3.5 text-amber-600" /> {todayStr}
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1E1B18]">
          每日塔罗运势签
        </h1>
        <p className="text-xs sm:text-sm text-[#736B5E] mt-2 max-w-lg mx-auto">
          每天清晨抽取一张你的专属能量牌，聆听宇宙今日为你送达的心灵神谕与行动指引。
        </p>
      </div>

      <ReadingConsole defaultCategory="fortune" />
    </div>
  );
}
