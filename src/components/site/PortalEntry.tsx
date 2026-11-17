import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONTAINER } from './constants';

/** 六爻图形（Hexagram Graphic）：经典易经六爻矢量表现，与图稿 01、05 对齐 */
function HexagramGraphic({ className = '' }: { className?: string }) {
  return (
    <svg
      width="72"
      height="56"
      viewBox="0 0 72 56"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* 上爻（六）：阳爻（整段） */}
      <rect x="0" y="0" width="72" height="5" fill="#171717" />
      {/* 五爻：阴爻（断两段） */}
      <rect x="0" y="10.2" width="31" height="5" fill="#171717" />
      <rect x="41" y="10.2" width="31" height="5" fill="#171717" />
      {/* 四爻：阴爻（断两段） */}
      <rect x="0" y="20.4" width="31" height="5" fill="#171717" />
      <rect x="41" y="20.4" width="31" height="5" fill="#171717" />
      {/* 三爻：阴爻（断两段） */}
      <rect x="0" y="30.6" width="31" height="5" fill="#171717" />
      <rect x="41" y="30.6" width="31" height="5" fill="#171717" />
      {/* 二爻：阴爻（断两段） */}
      <rect x="0" y="40.8" width="31" height="5" fill="#171717" />
      <rect x="41" y="40.8" width="31" height="5" fill="#171717" />
      {/* 初爻（一）：阳爻（整段） */}
      <rect x="0" y="51" width="72" height="5" fill="#171717" />
    </svg>
  );
}

/**
 * 第 2 屏：双入口（服务端组件，A1 静态骨架）
 * - 纯白平面分栏，六爻与现有 /cards/major-arcana/the-sun.webp
 * - 390×844 手机：图标/小牌图在左、文字与按钮在右，紧凑竖排，跳转至 #portals 时两侧操作均可见
 * - 桌面：双栏对等分栏
 * - 保留 /{lang}/east 和 /{lang}/west
 * - 英文两个 CTA 采用不同可访问名称
 * - 锚点 #portals 支持键盘定位、可见轮廓且 scroll-mt 预留导航高度不遮挡
 */
export function PortalEntry({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';

  return (
    <section
      id="portals"
      tabIndex={-1}
      className="w-full bg-white scroll-mt-16 lg:scroll-mt-[72px] focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
      aria-label={isEn ? 'Portals' : '双入口'}
    >
      <div className={`${CONTAINER} py-8 sm:py-12 md:py-16 lg:py-20`}>
        {/* 双入口分栏：桌面双列（含细中缝），手机紧凑竖排 */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-[#E4E4E7]">
          {/* 左侧入口：东方 · 易经与八字 */}
          <div className="flex flex-col justify-between pb-6 md:pb-0 md:pr-8 lg:pr-12">
            <div className="flex flex-row md:flex-col items-start gap-4 sm:gap-6">
              <div className="flex w-[54px] sm:w-[64px] shrink-0 items-start justify-center pt-0.5 md:h-40 md:w-full md:items-center md:pt-0">
                <HexagramGraphic className="w-full h-auto max-w-[54px] sm:max-w-[64px] md:max-w-[104px]" />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-[20px] sm:text-[24px] md:text-[28px] font-normal tracking-tight text-[#171717]">
                  {isEn ? 'I Ching & BaZi' : '易经与八字'}
                </h2>
                <p className="mt-1 text-[13px] sm:text-[14px] leading-relaxed text-[#52525B] md:min-h-[3rem]">
                  {isEn
                    ? 'Cast a hexagram or explore your birth chart.'
                    : '起一卦，或查看八字命盘。'}
                </p>
                <div className="mt-3 md:mt-6">
                  <Link
                    href={`/${lang}/east`}
                    prefetch={false}
                    aria-label={isEn ? 'Explore I Ching and BaZi' : '探索东方：易经与八字'}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#171717] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                  >
                    <span>{isEn ? 'Explore I Ching' : '探索东方'}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧入口：西方 · 塔罗 */}
          <div className="flex flex-col justify-between pt-6 border-t border-[#E4E4E7] md:border-t-0 md:pt-0 md:pl-8 lg:pl-12">
            <div className="flex flex-row md:flex-col items-start gap-4 sm:gap-6">
              <div className="flex w-[54px] sm:w-[64px] shrink-0 items-start justify-center pt-0.5 md:h-40 md:w-full md:items-center md:pt-0">
                <Image
                  src="/cards/major-arcana/the-sun.webp"
                  alt={isEn ? 'The Sun Tarot Card' : '太阳塔罗牌'}
                  width={84}
                  height={130}
                  sizes="(max-width: 640px) 54px, (max-width: 768px) 64px, 104px"
                  className="w-[50px] sm:w-[60px] md:w-[104px] h-auto rounded object-contain shadow-xs"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-[20px] sm:text-[24px] md:text-[28px] font-normal tracking-tight text-[#171717]">
                  {isEn ? 'Tarot' : '塔罗'}
                </h2>
                <p className="mt-1 text-[13px] sm:text-[14px] leading-relaxed text-[#52525B] md:min-h-[3rem]">
                  {isEn
                    ? 'Draw cards to reflect on a question.'
                    : '带着一个问题来抽牌。'}
                </p>
                <div className="mt-3 md:mt-6">
                  <Link
                    href={`/${lang}/west`}
                    prefetch={false}
                    aria-label={isEn ? 'Explore Tarot reading and cards' : '探索塔罗占卜与卡牌'}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#171717] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                  >
                    <span>{isEn ? 'Explore Tarot' : '探索塔罗'}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部轻量链接：每日一牌 / 入门指南 */}
        <div className="mt-10 sm:mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[#E4E4E7] pt-5 text-[13px]">
          <Link
            href={`/${lang}/fortune/daily`}
            prefetch={false}
            className="inline-flex min-h-[44px] items-center gap-1.5 text-[#171717] transition-colors hover:text-[#52525B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            <span>{isEn ? 'Daily Card' : '每日一牌'}</span>
            <span aria-hidden="true">→</span>
          </Link>

          <Link
            href={`/${lang}/blog`}
            prefetch={false}
            className="inline-flex min-h-[44px] items-center gap-1.5 text-[#171717] transition-colors hover:text-[#52525B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            <span>{isEn ? 'Learn' : '入门指南'}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
