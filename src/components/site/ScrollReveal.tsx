'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** 初始位移距离（px），只使用 transform 与 opacity */
  y?: number;
  /** 进入视口的起止锚点 */
  start?: string;
  end?: string;
}

/**
 * 滚动进度驱动（scroll scrub）的入场：滚一格推进一格，松手即停，可逆回滚。
 * 仅改变 transform / opacity；prefers-reduced-motion 下直接静态展示。
 */
export function ScrollReveal({
  children,
  className = '',
  y = 26,
  start = 'top 94%',
  end = 'top 70%'
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        el,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: true,
            invalidateOnRefresh: true
          }
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
