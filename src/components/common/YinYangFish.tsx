'use client';

import React from 'react';

interface YinYangFishProps {
  size?: number;
  className?: string;
  spin?: boolean;
  glow?: boolean;
  accentColor?: string;
}

/**
 * 经典高精度矢量阴阳太极鱼 (数学严谨 S 曲线几何)
 */
export function YinYangFish({
  size = 120,
  className = '',
  spin = false,
  glow = true,
  accentColor = '#8C6D23'
}: YinYangFishProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        viewBox="-100 -100 200 200"
        className={`w-full h-full drop-shadow-xl ${spin ? 'animate-[spin_24s_linear_infinite]' : ''}`}
        style={{ transformOrigin: 'center center' }}
      >
        <defs>
          {/* 金辉微光滤镜 */}
          {glow && (
            <filter id="yinyang-halo" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          )}

          {/* 阳鱼宣纸微光渐变 */}
          <radialGradient id="yang-paper-grad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#FFFDF9" />
            <stop offset="100%" stopColor="#F5EFE6" />
          </radialGradient>

          {/* 阴鱼墨韵渐变 */}
          <radialGradient id="yin-ink-grad" cx="70%" cy="70%" r="70%">
            <stop offset="0%" stopColor="#2A2A2A" />
            <stop offset="60%" stopColor="#151515" />
            <stop offset="100%" stopColor="#0A0A0A" />
          </radialGradient>
        </defs>

        {/* 1. 外围典雅金环暗轨 (Hairline Orbital Ring) */}
        <circle
          cx="0"
          cy="0"
          r="98"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.2"
          opacity="0.5"
          filter={glow ? 'url(#yinyang-halo)' : undefined}
        />

        {/* 2. 底盘白鱼体 (阳鱼 - 全圆铺底) */}
        <circle
          cx="0"
          cy="0"
          r="94"
          fill="url(#yang-paper-grad)"
          stroke="#111111"
          strokeWidth="1.5"
        />

        {/* 3. 黑色阴鱼体 (严谨古典 S 曲线闭合路径) */}
        <path
          d="M 0,-94
             A 94,94 0 0,1 0,94
             A 47,47 0 0,1 0,0
             A 47,47 0 0,0 0,-94
             Z"
          fill="url(#yin-ink-grad)"
        />

        {/* 4. 阳中之阴眼 (上方白鱼头部里的实心黑眼：阳中有阴) */}
        <circle
          cx="0"
          cy="-47"
          r="11.5"
          fill="#111111"
        />

        {/* 5. 阴中之阳眼 (下方黑鱼头部里的实心白眼：阴中有阳) */}
        <circle
          cx="0"
          cy="47"
          r="11.5"
          fill="#FFFDF9"
        />

        {/* 6. 最外层修容发丝线 (精细收口) */}
        <circle
          cx="0"
          cy="0"
          r="94"
          fill="none"
          stroke="rgba(140, 109, 35, 0.3)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
