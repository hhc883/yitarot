'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CanvasBrushDemo } from '@/components/demo/CanvasBrushDemo';
import { ScrollytellingDemo } from '@/components/demo/ScrollytellingDemo';
import { BaguaOrbitalCompass } from '@/components/fatemaster/BaguaOrbitalCompass';
import { Sparkles, ArrowRight, Eye, Layers, Compass, RotateCcw, Palette } from 'lucide-react';

export default function MarvisInteractionDemosPage() {
  const [selectedDemo, setSelectedDemo] = useState<'brush' | 'scrollytelling' | 'bagua'>('bagua');
  const [baguaColor, setBaguaColor] = useState<string>('#DC2626'); // 默认南孚同款朱砂红

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-[#111111] flex flex-col items-center">
      {/* 顶部标题与 Demo 切换器 */}
      <header className="w-full max-w-5xl mx-auto px-4 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE59A]/40 text-[#8C6D23] border border-[#E8CF86]/50 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> 动效原型实验室 · 顶级互动探索
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#111111]">
          前沿交互原型实验厅 (Motion Lab)
        </h1>
        <p className="text-xs sm:text-sm text-[#736B5E] mt-2 max-w-xl mx-auto">
          融合 Marvis 官网顶级卷轴擦除叙事，与 Nanfu Global 同心星轨点阵旋转灵感，为东方周易与西方塔罗注入灵魂级动效。
        </p>

        {/* 切换 Tab */}
        <div className="inline-flex flex-wrap justify-center p-1.5 rounded-full bg-[#EFE9DD] ring-1 ring-[#111111]/10 mt-6 shadow-inner gap-1">
          <button
            onClick={() => setSelectedDemo('bagua')}
            className={`px-5 py-2 rounded-full text-xs font-serif font-medium transition-all cursor-pointer flex items-center gap-2 ${
              selectedDemo === 'bagua'
                ? 'bg-[#111111] text-[#FFFDF9] shadow-sm'
                : 'text-[#736B5E] hover:text-[#111111]'
            }`}
          >
            <span>☯️ Demo 3：南孚灵感 · 八卦同心星轨罗盘</span>
            <span className="text-[10px] text-[#FFE59A]">（Nanfu Orbit）</span>
          </button>
          <button
            onClick={() => setSelectedDemo('scrollytelling')}
            className={`px-5 py-2 rounded-full text-xs font-serif font-medium transition-all cursor-pointer flex items-center gap-2 ${
              selectedDemo === 'scrollytelling'
                ? 'bg-[#111111] text-[#FFFDF9] shadow-sm'
                : 'text-[#736B5E] hover:text-[#111111]'
            }`}
          >
            <span>📜 Demo 2：乾坤流转 · 钉图长卷</span>
            <span className="text-[10px] opacity-70">（Marvis Scrollytelling）</span>
          </button>
          <button
            onClick={() => setSelectedDemo('brush')}
            className={`px-5 py-2 rounded-full text-xs font-serif font-medium transition-all cursor-pointer flex items-center gap-2 ${
              selectedDemo === 'brush'
                ? 'bg-[#111111] text-[#FFFDF9] shadow-sm'
                : 'text-[#736B5E] hover:text-[#111111]'
            }`}
          >
            <span>🖌️ Demo 1：水墨拂尘 · 画布擦拭</span>
            <span className="text-[10px] opacity-70">（Marvis Eraser）</span>
          </button>
        </div>
      </header>

      {/* 核心演示区 */}
      <main className="w-full flex-1">
        {selectedDemo === 'bagua' ? (
          <div className="w-full max-w-5xl mx-auto px-4 pb-20 flex flex-col items-center">
            {/* 特性解读卡 */}
            <div className="w-full mb-8 p-5 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 text-xs text-[#5C5549] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div>
                <strong className="text-[#111111] text-sm block mb-1">
                  南孚同心点阵动效 ➔ 周易八卦周天罗盘的美学映射
                </strong>
                <p className="leading-relaxed">
                  • <strong>外圈 64 卦点阵环</strong>：逆时针恒速天旋（地道右旋，周期 50s），带一道循回点亮流动光波（Traveling Stagger Wave）<br />
                  • <strong>中层细虚线天轨</strong>：顺时针天道左旋，复现古典天文浑天仪相摩相荡视觉<br />
                  • <strong>八卦象数神圣环</strong>：正南【☰ 乾】至正北【☷ 坤】，悬浮高亮，点击发射能量冲击波<br />
                  • <strong>太极中央核心</strong>：呼吸脉动，随鼠标移入具备细腻的 3D 景深悬浮视差（Tilt 3D Parallax）
                </p>
              </div>

              {/* 调色板控制 */}
              <div className="flex sm:flex-col items-center gap-2 border-t sm:border-t-0 sm:border-l border-[#111111]/10 pt-3 sm:pt-0 sm:pl-4">
                <span className="text-[10px] text-[#736B5E] whitespace-nowrap">点阵主色调：</span>
                <div className="flex gap-2">
                  {[
                    { label: '南孚朱砂赤红', color: '#DC2626' },
                    { label: '帝王乾坤金', color: '#D4AF37' },
                    { label: '玄天青碧', color: '#059669' },
                    { label: '深邃幽紫', color: '#7C3AED' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setBaguaColor(c.color)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        baguaColor === c.color ? 'scale-120 border-[#111111]' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 八卦同心星轨罗盘实体展示 */}
            <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 shadow-xl flex items-center justify-center">
              <BaguaOrbitalCompass size={480} accentColor={baguaColor} interactive={true} />
            </div>
          </div>
        ) : selectedDemo === 'brush' ? (
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
