'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CustomFluidCursorProps {
  label?: string;
  variant?: 'default' | 'brush' | 'scroll' | 'inspect';
}

export function CustomFluidCursor({ label = '拂', variant = 'brush' }: CustomFluidCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // 仅在支持精密指针的设备（非纯触摸屏）上启用
    if (window.matchMedia('(pointer: coarse)').matches) {
      cursor.style.display = 'none';
      return;
    }

    // GSAP quickTo 物理阻尼跟随
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power2.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex items-center justify-center transition-opacity duration-300"
    >
      <div
        className={`w-18 h-18 rounded-full border border-[#8C6D23]/60 bg-[#FAF7F2]/85 backdrop-blur-md shadow-lg flex items-center justify-center text-center transition-transform duration-200 ${
          variant === 'brush' ? 'scale-105' : 'scale-90'
        }`}
      >
        <span
          ref={textRef}
          className="text-xs font-serif font-black tracking-wider text-[#111111] select-none"
        >
          {label}
        </span>
      </div>
    </div>
  );
}
