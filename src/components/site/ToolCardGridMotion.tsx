'use client';

import React, { useEffect, useRef } from 'react';

interface ToolCardGridMotionProps {
  children: React.ReactNode;
  className?: string;
}

const POINTER_MOTION_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/**
 * 极小客户端动效边界：
 * - 仅在首次实际鼠标悬停卡片时按需加载 GSAP（无 idle/timer 预加载），失败时静默保留 CSS fallback
 * - 在 gsap.matchMedia() 同步回调内为每张卡预建 paused timeline，委托 pointerover/out 做 play/reverse
 */
export function ToolCardGridMotion({ children, className }: ToolCardGridMotionProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof window === 'undefined' || !window.matchMedia) return;

    const mql = window.matchMedia(POINTER_MOTION_QUERY);
    let disposed = false;
    let loading = false;
    let mm: { revert: () => void } | null = null;

    const initGsap = async () => {
      if (disposed || loading || mm || !mql.matches) return;
      loading = true;

      try {
        const { default: gsap } = await import('gsap');
        if (disposed || !gridRef.current) return;

        const matchMedia = gsap.matchMedia();
        mm = matchMedia;

        matchMedia.add(POINTER_MOTION_QUERY, () => {
          const targetGrid = gridRef.current;
          if (!targetGrid) return;

          targetGrid.dataset.gsapMotion = 'true';

          const timelines = new Map<HTMLElement, gsap.core.Timeline>();
          const cards = targetGrid.querySelectorAll<HTMLElement>('[data-tool-card]');

          cards.forEach((card) => {
            const stamp = card.querySelector<HTMLElement>('[data-tool-stamp]');
            const arrow = card.querySelector<HTMLElement>('[data-tool-arrow]');
            if (!stamp && !arrow) return;

            const tl = gsap.timeline({ paused: true });
            if (stamp) {
              tl.to(stamp, { y: -2.5, duration: 0.18, ease: 'power2.out' }, 0);
            }
            if (arrow) {
              tl.to(arrow, { x: 3.5, y: -3.5, duration: 0.2, ease: 'power2.out' }, 0);
            }
            timelines.set(card, tl);
          });

          const onPointerOver = (event: PointerEvent) => {
            if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
            const card = (event.target as Element | null)?.closest<HTMLElement>('[data-tool-card]');
            if (!card || !targetGrid.contains(card)) return;
            if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) return;
            timelines.get(card)?.play();
          };

          const onPointerOut = (event: PointerEvent) => {
            if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
            const card = (event.target as Element | null)?.closest<HTMLElement>('[data-tool-card]');
            if (!card || !targetGrid.contains(card)) return;
            if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) return;
            timelines.get(card)?.reverse();
          };

          targetGrid.addEventListener('pointerover', onPointerOver);
          targetGrid.addEventListener('pointerout', onPointerOut);

          const hoveredCard = targetGrid.querySelector<HTMLElement>('[data-tool-card]:hover');
          if (hoveredCard) {
            timelines.get(hoveredCard)?.play();
          }

          return () => {
            targetGrid.removeEventListener('pointerover', onPointerOver);
            targetGrid.removeEventListener('pointerout', onPointerOut);
            timelines.clear();
            delete targetGrid.dataset.gsapMotion;
          };
        });

        grid.removeEventListener('pointerover', onFirstHover);
      } catch {
        // 静默保留 CSS fallback
      } finally {
        loading = false;
      }
    };

    const onFirstHover = (event: PointerEvent) => {
      if (!mql.matches) return;
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      const card = (event.target as Element | null)?.closest('[data-tool-card]');
      if (!card) return;
      void initGsap();
    };

    const onMediaChange = () => {
      if (mql.matches && !mm) {
        grid.addEventListener('pointerover', onFirstHover, { passive: true });
      }
    };

    if (mql.matches) {
      grid.addEventListener('pointerover', onFirstHover, { passive: true });
    }
    mql.addEventListener('change', onMediaChange);

    return () => {
      disposed = true;
      grid.removeEventListener('pointerover', onFirstHover);
      mql.removeEventListener('change', onMediaChange);
      mm?.revert();
      delete grid.dataset.gsapMotion;
    };
  }, []);

  return (
    <div ref={gridRef} className={className}>
      {children}
    </div>
  );
}
