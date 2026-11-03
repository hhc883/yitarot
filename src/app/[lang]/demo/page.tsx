'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CanvasBrushDemo } from '@/components/demo/CanvasBrushDemo';
import { ScrollytellingDemo } from '@/components/demo/ScrollytellingDemo';
import { Sparkles, ArrowRight, Eye, Layers, Compass, RotateCcw } from 'lucide-react';

export default function MarvisInteractionDemosPage() {
  const [selectedDemo, setSelectedDemo] = useState<'brush' | 'scrollytelling'>('brush');

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-[#111111] flex flex-col items-center">
      {/* 顶部标题与 Demo 切换器 */}
      <header className="w-full max-w-5xl mx-auto px-4 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE59A]/40 text-[#8C6D23] border border-[#E8CF86]/50 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> 逆向 Marvis.com 同原理交互验证
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#111111]">
          两大核心交互体验原型 (Demo Lab)
        </h1>
        <p className="text-xs sm:text-sm text-[#736B5E] mt-2 max-w-xl mx-auto">
          基于 Marvis 官网底层 Webpack 逆向所得的技术机制，分别重构为契合东方周易与西方塔罗美学的专属交互。
        </p>

        {/* 切换 Tab */}
        <div className="inline-flex p-1.5 rounded-full bg-[#EFE9DD] ring-1 ring-[#111111]/10 mt-6 shadow-inner">
          <button
            onClick={() => setSelectedDemo('brush')}
            className={`px-5 py-2 rounded-full text-xs font-serif font-medium transition-all cursor-pointer flex items-center gap-2 ${
              selectedDemo === 'brush'
                ? 'bg-[#111111] text-[#FFFDF9] shadow-sm'
                : 'text-[#736B5E] hover:text-[#111111]'
            }`}
          >
            <span>🖌️ Demo 1：水墨星云 · 拂尘擦拭揭秘</span>
            <span className="text-[10px] opacity-70">（Canvas Eraser）</span>
          </button>
          <button
            onClick={() => setSelectedDemo('scrollytelling')}
            className={`px-5 py-2 rounded-full text-xs font-serif font-medium transition-all cursor-pointer flex items-center gap-2 ${
              selectedDemo === 'scrollytelling'
                ? 'bg-[#111111] text-[#FFFDF9] shadow-sm'
                : 'text-[#736B5E] hover:text-[#111111]'
            }`}
          >
            <span>📜 Demo 2：乾坤流转 · 钉图深度长卷</span>
            <span className="text-[10px] opacity-70">（GSAP Scrollytelling）</span>
          </button>
        </div>
      </header>

      {/* 核心演示区 */}
      <main className="w-full flex-1">
        {selectedDemo === 'brush' ? (
          <div className="w-full max-w-5xl mx-auto px-4 pb-20">
            {/* 特性解读卡 */}
            <div className="mb-6 p-4 rounded-2xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 text-xs text-[#5C5549] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <strong className="text-[#111111] block mb-0.5">
                  体验指引：请在下方画布上按住鼠标左键（或在触摸屏上滑动手指）擦除表面古纸迷雾
                </strong>
                <span>
                  • 搭载灵动微光标（跟着鼠标跟随变化） • 擦除达 40% 自动触发 Marvis 同款圆形波纹全开动画 • 支持揭示周易铜钱与塔罗牌双重底图
                </span>
              </div>
            </div>

            <CanvasBrushDemo />
          </div>
        ) : (
          <div className="w-full">
            {/* 特性解读卡 */}
            <div className="max-w-5xl mx-auto px-4 mb-4">
              <div className="p-4 rounded-2xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 text-xs text-[#5C5549] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <strong className="text-[#111111] block mb-0.5">
                    体验指引：鼠标向下滚动，观察页面被 Pin 钉死时的 5 步剧场式视差演化
                  </strong>
                  <span>
                    • 1:1 移植 Marvis `clamp(+=600%)` 钉屏长叙事 • 太极图腾放大 6.5 倍破空入画 • 背景自暖纸渐变为深邃星夜绀青 • 铜钱与塔罗牌旋转定格
                  </span>
                </div>
              </div>
            </div>

            <ScrollytellingDemo />
          </div>
        )}
      </main>
    </div>
  );
}
