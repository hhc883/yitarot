import React from 'react';
import Link from 'next/link';
import { TaijiMark } from './TaijiMark';
import './HomeMotion.css';

/**
 * 第 1 屏：太极开屏（服务端组件）
 * - 黑白主题 #FFFFFF / #171717
 * - 顶部：YiTatro 小字标与原生 details/summary 语言切换（简体中文 / English），保留 hrefLang
 * - 中央：圆形太极（原生文档流、无开屏等待），随首屏退出触发原生 CSS view-timeline 轻转与轻升
 * - 英文主标题使用「I Ching, BaZi & Tarot」，中文主标题使用「起卦、排八字、抽塔罗」，题注使用「易有太极，是生两仪」
 * - 底部：保留真实锚点链接 #portals，入口提示「上滑进入」/「Swipe up to enter」，点击区域至少约 44px，可键盘触发、有可见轮廓
 */
export function TaijiIntro({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';

  return (
    <section
      className="yitatro-home-intro relative flex min-h-[100svh] w-full flex-col justify-between bg-white px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 text-[#171717]"
      aria-label={isEn ? 'Opening' : '开屏'}
    >
      {/* 顶部栏：小字标 + 原生 details/summary 语言入口 */}
      <div className="flex w-full items-center justify-between">
        <span className="font-serif text-[18px] sm:text-[20px] font-bold tracking-tight text-[#171717]">
          YiTatro
        </span>

        {/* 原生语言切换（无客户端状态，保留 hrefLang 与键盘操作） */}
        <details className="group relative list-none [&::-webkit-details-marker]:hidden">
          <summary
            aria-label={isEn ? 'Switch language' : '切换语言'}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-1 rounded px-2 text-[13px] text-[#171717] transition-colors hover:text-[#52525B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] list-none select-none marker:content-none"
          >
            <span>{isEn ? 'English' : '简体中文'}</span>
            <span className="text-[10px] leading-none transition-transform group-open:rotate-180" aria-hidden="true">
              ▾
            </span>
          </summary>

          <div className="absolute right-0 top-full mt-1 z-20 min-w-[120px] rounded border border-[#E4E4E7] bg-white py-1 shadow-xs">
            <Link
              href="/zh"
              hrefLang="zh-CN"
              className={`flex min-h-[44px] items-center px-3 py-2 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                !isEn ? 'font-semibold text-[#171717]' : 'text-[#52525B] hover:text-[#171717]'
              }`}
            >
              简体中文
            </Link>
            <Link
              href="/en"
              hrefLang="en"
              className={`flex min-h-[44px] items-center px-3 py-2 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                isEn ? 'font-semibold text-[#171717]' : 'text-[#52525B] hover:text-[#171717]'
              }`}
            >
              English
            </Link>
          </div>
        </details>
      </div>

      {/* 核心中央：太极 + 本地化题句（svh 约束，确保 320–390 CSS px 首屏用途无需滚动可见） */}
      <div className="my-auto flex flex-col items-center py-3 sm:py-5 text-center">
        <div
          className="yitatro-home-taiji shrink-0"
          style={{
            width: 'min(30svh, 52vw, 280px)',
            height: 'min(30svh, 52vw, 280px)'
          }}
        >
          <TaijiMark size="100%" ink="#171717" paper="#FFFFFF" className="h-full w-full" />
        </div>

        <h1 className="mt-4 sm:mt-6 font-serif text-[clamp(22px,4vw,42px)] font-normal leading-tight tracking-[0.02em] text-[#171717]">
          {isEn ? 'I Ching, BaZi & Tarot' : '起卦、排八字、抽塔罗'}
        </h1>

        <p className="mt-2 text-[13px] sm:text-[14px] tracking-wide text-[#52525B]">
          {isEn ? 'Eastern wisdom & Western tarot' : '易有太极，是生两仪'}
        </p>
      </div>

      {/* 底部：可键盘触发的真实锚点 #portals，入口提示说清上滑（点击区域至少约 44px） */}
      <div className="flex w-full flex-col items-center pb-2 sm:pb-4">
        <a
          href="#portals"
          aria-label={isEn ? 'Swipe up to enter portals' : '上滑进入双入口'}
          className="yitatro-home-intro-link inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-sm px-4 py-2 text-[13px] tracking-[0.06em] text-[#52525B] transition-colors hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
        >
          <span className="yitatro-home-intro-arrow text-[13px] leading-none" aria-hidden="true">
            ↑
          </span>
          <span>{isEn ? 'Swipe up to enter' : '上滑进入'}</span>
        </a>
      </div>
    </section>
  );
}
