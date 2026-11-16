'use client';

import React, { useCallback, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { TaijiMark } from './TaijiMark';
import { IconArrowUp } from './SiteIcons';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STORAGE_KEY = 'qicosmos:taiji-opened';

/**
 * 第 1 屏：只展示太极 + 一句 H1 + 上滑提示。
 * 开屏动效只播一次（sessionStorage 记录），回到顶部不重播，点击任意处立即跳过。
 */
export function TaijiIntro({ lang = 'zh' }: { lang?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const doneRef = useRef(false);

  useGSAP(
    () => {
      const mark = markRef.current;
      const title = titleRef.current;
      const hint = hintRef.current;
      if (!mark || !title || !hint) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let alreadyPlayed = false;
      try {
        alreadyPlayed = window.sessionStorage.getItem(STORAGE_KEY) === '1';
      } catch {
        alreadyPlayed = false;
      }

      // 减弱动效 / 本会话已看过：静态展示
      if (reduceMotion || alreadyPlayed) {
        doneRef.current = true;
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          doneRef.current = true;
          try {
            window.sessionStorage.setItem(STORAGE_KEY, '1');
          } catch {
            /* 忽略隐私模式写入失败 */
          }
        }
      });

      tl.fromTo(
        mark,
        { opacity: 0, scale: 0.94, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1 }
      )
        .fromTo(title, { yPercent: 10 }, { yPercent: 0, duration: 0.9 }, 0.34)
        .fromTo(hint, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power1.out' }, 0.7);

      timelineRef.current = tl;
    },
    { scope: rootRef }
  );

  /**
   * 上滑：整屏（太极 + 标题 + 提示）以中心为准向外放大并淡出。
   * 与入场动画分开注册：刷新后入场不重播，但这个滚动动效仍必须存在。
   * scrub 跟随滚动进度，松手即停、下滑可反向恢复；减弱动效时完全不注册，恢复普通滚动。
   */
  useGSAP(
    () => {
      const section = rootRef.current;
      if (!section) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        section,
        { scale: 1, opacity: 1 },
        {
          scale: 1.5,
          opacity: 0,
          ease: 'none',
          transformOrigin: '50% 50%',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=100%',
            pin: true,
            // 不插入额外一屏空白：pin 期间第二屏随文档滚上来，
            // 滑完约一屏即看到东 / 西入口，点击跳转也不会被多出的间距推偏
            pinSpacing: false,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        }
      );
    },
    { scope: rootRef }
  );

  // 一点即跳过：播放中立刻收束；已结束后再次轻触则进入入口区
  const handleInteraction = useCallback(() => {
    const tl = timelineRef.current;
    if (!doneRef.current && tl) {
      tl.progress(1);
      doneRef.current = true;
      try {
        window.sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* noop */
      }
      return;
    }

    document.getElementById('portals')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section
      ref={rootRef}
      onClick={handleInteraction}
      className="relative flex min-h-[100svh] w-full cursor-pointer select-none flex-col items-center justify-center bg-white px-6 pb-28 pt-20"
      aria-label={lang === 'en' ? 'Opening' : '开屏'}
    >
      <div className="flex flex-col items-center">
        <div
          ref={markRef}
          className="shrink-0"
          style={{
            width: 'min(55vh, 78vw, 600px)',
            height: 'min(55vh, 78vw, 600px)'
          }}
        >
          {/* 旋转加在内层：外层 markRef 的 transform 由 GSAP 入场动画控制，互不冲突 */}
          <div className="taiji-spin h-full w-full">
            <TaijiMark size="100%" className="h-full w-full" />
          </div>
        </div>

        <h1
          ref={titleRef}
          className="mt-10 max-w-[16em] text-balance text-center font-serif text-[clamp(27px,4vw,64px)] font-normal leading-[1.12] tracking-[0.03em] text-ink sm:mt-12"
        >
          {lang === 'en' ? 'The One gives rise to the Two.' : '易有太极，是生两仪'}
        </h1>
      </div>

      {/* 底部中央上滑提示 */}
      <div
        ref={hintRef}
        className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2.5 text-[12px] tracking-[0.16em] text-[#8C8C8C] sm:bottom-10"
      >
        <span>{lang === 'en' ? 'Scroll up' : '向上滑 Scroll'}</span>
        <IconArrowUp className="mkt-hint-arrow h-3 w-3" />
      </div>
    </section>
  );
}
