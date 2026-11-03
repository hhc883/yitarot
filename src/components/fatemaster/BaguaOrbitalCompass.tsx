'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// 先天八卦八方位定义
export const TRIGRAMS_DATA = [
  { name: '乾', symbol: '☰', pinyin: 'Qián', nature: '天', element: '金', angle: -90, color: '#D4AF37' },
  { name: '兑', symbol: '☱', pinyin: 'Duì', nature: '泽', element: '金', angle: -45, color: '#C5A059' },
  { name: '离', symbol: '☲', pinyin: 'Lí', nature: '火', element: '火', angle: 0, color: '#DC2626' },
  { name: '震', symbol: '☳', pinyin: 'Zhèn', nature: '雷', element: '木', angle: 45, color: '#059669' },
  { name: '坤', symbol: '☷', pinyin: 'Kūn', nature: '地', element: '土', angle: 90, color: '#92400E' },
  { name: '艮', symbol: '☶', pinyin: 'Gèn', nature: '山', element: '土', angle: 135, color: '#B45309' },
  { name: '坎', symbol: '☵', pinyin: 'Kǎn', nature: '水', element: '水', angle: 180, color: '#0284C7' },
  { name: '巽', symbol: '☴', pinyin: 'Xùn', nature: '风', element: '木', angle: 225, color: '#10B981' }
];

interface BaguaOrbitalCompassProps {
  size?: number;
  interactive?: boolean;
  onSelectTrigram?: (trigram: typeof TRIGRAMS_DATA[0]) => void;
  accentColor?: string; // e.g. '#DC2626' (南孚朱砂赤红) or '#D4AF37' (帝王金)
}

export function BaguaOrbitalCompass({
  size = 520,
  interactive = true,
  onSelectTrigram,
  accentColor = '#DC2626' // 致敬南孚标志性赤红与天工朱砂
}: BaguaOrbitalCompassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outerDotsRingRef = useRef<SVGGElement>(null);
  const middleDashedRingRef = useRef<SVGCircleElement>(null);
  const trigramsRingRef = useRef<SVGGElement>(null);
  const innerDashedRingRef = useRef<SVGCircleElement>(null);
  const centerTaijiRef = useRef<SVGGElement>(null);
  const pulseRingRef = useRef<SVGCircleElement>(null);

  const [activeTrigram, setActiveTrigram] = useState<typeof TRIGRAMS_DATA[0] | null>(null);

  // 64 卦圆周天点阵配置 (南孚同款均匀环形点阵)
  const totalDots = 64;
  const outerRadius = 248;
  const dotsArray = Array.from({ length: totalDots }).map((_, i) => {
    const angle = (i * 360) / totalDots;
    const rad = (angle * Math.PI) / 180;
    const cx = 300 + outerRadius * Math.cos(rad);
    const cy = 300 + outerRadius * Math.sin(rad);
    const isCardinal = i % 8 === 0; // 八大正方位主节点稍大
    return { id: i, cx, cy, angle, isCardinal };
  });

  useGSAP(() => {
    // 1. 外层 64 卦点阵环：逆时针恒速天旋 (地道右旋，周期 50s)
    gsap.to(outerDotsRingRef.current, {
      rotation: -360,
      transformOrigin: '300px 300px',
      repeat: -1,
      duration: 50,
      ease: 'none'
    });

    // 2. 中层细虚线环：顺时针天道左旋 (周期 35s)
    gsap.to(middleDashedRingRef.current, {
      rotation: 360,
      transformOrigin: '300px 300px',
      repeat: -1,
      duration: 35,
      ease: 'none'
    });

    // 3. 内层八卦象数天轨：慢速微调旋动 (周期 70s)
    gsap.to(trigramsRingRef.current, {
      rotation: 360,
      transformOrigin: '300px 300px',
      repeat: -1,
      duration: 70,
      ease: 'none'
    });

    // 4. 最内层细虚线环：逆时针微旋
    gsap.to(innerDashedRingRef.current, {
      rotation: -360,
      transformOrigin: '300px 300px',
      repeat: -1,
      duration: 28,
      ease: 'none'
    });

    // 5. 太极中心：如恒星般呼吸脉动
    gsap.to(centerTaijiRef.current, {
      scale: 1.04,
      transformOrigin: '300px 300px',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // 6. 外层点阵环循回点亮流动光波 (Traveling Stagger Wave)
    if (outerDotsRingRef.current) {
      const dots = outerDotsRingRef.current.querySelectorAll('.orbital-dot');
      gsap.fromTo(
        dots,
        { opacity: 0.35, scale: 0.85, transformOrigin: 'center center' },
        {
          opacity: 1,
          scale: 1.45,
          duration: 1.2,
          repeat: -1,
          stagger: {
            each: 0.04,
            repeat: -1,
            yoyo: true
          },
          ease: 'power1.inOut'
        }
      );
    }
  }, { scope: containerRef });

  // 鼠标交互 3D 视差倾斜 (Parallax Tilt)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (-y / (rect.height / 2)) * 14;
    const rotY = (x / (rect.width / 2)) * 14;

    gsap.to(containerRef.current.querySelector('.compass-stage'), {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.45,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  };

  const handleMouseLeave = () => {
    if (!interactive || !containerRef.current) return;
    gsap.to(containerRef.current.querySelector('.compass-stage'), {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'power2.out'
    });
  };

  // 点击触发光波冲击波 (Shockwave Ripple)
  const triggerPulse = (trigram?: typeof TRIGRAMS_DATA[0]) => {
    if (pulseRingRef.current) {
      gsap.fromTo(
        pulseRingRef.current,
        { r: 100, opacity: 0.9, strokeWidth: 4 },
        { r: 270, opacity: 0, strokeWidth: 1, duration: 1.1, ease: 'power2.out' }
      );
    }
    if (trigram) {
      setActiveTrigram(trigram);
      if (onSelectTrigram) onSelectTrigram(trigram);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div
        className="compass-stage relative w-full h-full flex items-center justify-center cursor-pointer transition-transform"
        onClick={() => triggerPulse()}
      >
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full overflow-visible drop-shadow-xl"
        >
          <defs>
            {/* 太极内胆发光滤镜 */}
            <filter id="celestial-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* 径向能量晕渐变 */}
            <radialGradient id="taiji-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFDF9" stopOpacity="1" />
              <stop offset="70%" stopColor="#FAF2E1" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#EAD8B5" stopOpacity="0.3" />
            </radialGradient>

            {/* 点阵主光渐变 */}
            <radialGradient id="dot-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="1" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {/* 0. 冲击波扩散环 (Shockwave Ripple) */}
          <circle
            ref={pulseRingRef}
            cx="300"
            cy="300"
            r="100"
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
            opacity="0"
          />

          {/* 1. 最外层 64 卦圆周天点阵环 (Nanfu 同款点阵，逆时针流转) */}
          <g ref={outerDotsRingRef}>
            {dotsArray.map((dot) => (
              <circle
                key={dot.id}
                className="orbital-dot transition-all"
                cx={dot.cx}
                cy={dot.cy}
                r={dot.isCardinal ? 4.2 : 2.4}
                fill={accentColor}
                opacity="0.8"
              />
            ))}
          </g>

          {/* 2. 中层微细虚线天轨 (顺时针流转) */}
          <circle
            ref={middleDashedRingRef}
            cx="300"
            cy="300"
            r="228"
            fill="none"
            stroke={accentColor}
            strokeWidth="0.9"
            strokeDasharray="2, 5"
            opacity="0.5"
          />

          {/* 3. 八卦象数神圣天轨环 (8 方位卦象与卦爻) */}
          <g ref={trigramsRingRef}>
            {TRIGRAMS_DATA.map((tri, idx) => {
              const rad = (tri.angle * Math.PI) / 180;
              const tx = 300 + 192 * Math.cos(rad);
              const ty = 300 + 192 * Math.sin(rad);
              const isSelected = activeTrigram?.name === tri.name;

              return (
                <g
                  key={idx}
                  className="group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerPulse(tri);
                  }}
                >
                  {/* 悬停光圈底衬 */}
                  <circle
                    cx={tx}
                    cy={ty}
                    r="20"
                    fill={isSelected ? `${tri.color}25` : '#FFFDF9'}
                    stroke={isSelected ? tri.color : 'rgba(140, 109, 35, 0.2)'}
                    strokeWidth={isSelected ? '2' : '1'}
                    className="transition-all duration-300 group-hover:scale-115"
                  />

                  {/* 卦符 (☰, ☷ 等) */}
                  <text
                    x={tx}
                    y={ty - 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isSelected ? tri.color : '#111111'}
                    fontSize="18"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    className="transition-colors duration-200 group-hover:fill-[#DC2626]"
                  >
                    {tri.symbol}
                  </text>

                  {/* 卦名与自然象数 (如 乾 · 天) */}
                  <text
                    x={tx}
                    y={ty + 25}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#736B5E"
                    fontSize="9"
                    fontFamily="serif"
                    fontWeight="600"
                  >
                    {tri.name} ({tri.nature})
                  </text>
                </g>
              );
            })}
          </g>

          {/* 4. 内层虚线同心轨道环 (逆时针微旋) */}
          <circle
            ref={innerDashedRingRef}
            cx="300"
            cy="300"
            r="142"
            fill="none"
            stroke="rgba(140, 109, 35, 0.35)"
            strokeWidth="1.2"
            strokeDasharray="4, 4"
          />

          {/* 5. 核心舞台：太极阴阳天球 (Taiji Sphere) */}
          <g ref={centerTaijiRef}>
            {/* 太极底盘外发光圆 */}
            <circle
              cx="300"
              cy="300"
              r="105"
              fill="url(#taiji-halo)"
              stroke="rgba(140, 109, 35, 0.3)"
              strokeWidth="1.5"
              filter="url(#celestial-glow)"
            />

            {/* 太极阴阳鱼双色图形 (Radius: 90) */}
            <g transform="translate(300, 300)">
              {/* 阳半圆 (白底) */}
              <circle cx="0" cy="0" r="88" fill="#FFFDF9" stroke="#111111" strokeWidth="1" />
              {/* 阴鱼体 (黑色半圆 + S 弯曲) */}
              <path
                d="M 0,-88 A 88,88 0 0,1 0,88 A 44,44 0 0,1 0,0 A 44,44 0 0,0 0,-88 Z"
                fill="#111111"
              />
              {/* 阴中之阳眼 (白鱼眼) */}
              <circle cx="0" cy="-44" r="11" fill="#FFFDF9" />
              {/* 阳中之阴眼 (黑鱼眼) */}
              <circle cx="0" cy="44" r="11" fill="#111111" />
            </g>
          </g>
        </svg>

        {/* 中心微说明标签浮层 */}
        {activeTrigram && (
          <div className="absolute bottom-2 inset-x-4 bg-[#FFFDF9]/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-[#E8CF86] text-center animate-in fade-in slide-in-from-bottom-2">
            <span className="text-xs font-serif font-black text-[#111111]">
              【{activeTrigram.name}为{activeTrigram.nature}】· 五行属{activeTrigram.element}
            </span>
            <span className="text-[10px] text-[#736B5E] block mt-0.5">
              先天方位：{activeTrigram.angle}° · 象征天地之运行气数
            </span>
          </div>
        )}
      </div>

      {/* 底部微信息 */}
      <div className="mt-3 flex items-center gap-3 text-[11px] text-[#736B5E]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <span>天道左旋 · 地道右旋 (64 卦周天点阵)</span>
        </span>
        <span>•</span>
        <span>点击八卦方位可感应天机</span>
      </div>
    </div>
  );
}
