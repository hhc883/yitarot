import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONTAINER } from './constants';
import { HexagramGraphic } from './HexagramGraphic';

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
      <div className={`${CONTAINER} py-10 sm:py-14 md:py-20`}>
        {/* 双入口分栏：桌面 50/50 对等分栏与中缝分隔线 */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-[#E4E4E7]">
          {/* 左侧入口：东方 · 易经与八字 */}
          <div className="flex flex-col justify-between pb-8 md:pb-0 md:pr-8 lg:pr-12">
            <div className="w-full max-w-[380px] lg:max-w-[420px] mx-auto flex flex-row md:flex-col items-start md:items-center gap-5 sm:gap-6">
              {/* 视觉舞台：严格固定对齐高度，桌面底部对齐基准线，水平垂直轴线居中 */}
              <div className="flex w-[60px] sm:w-[72px] shrink-0 items-start justify-center pt-1 md:h-[180px] md:w-full md:items-end md:justify-center md:pb-3 md:pt-0">
                <HexagramGraphic className="w-[56px] sm:w-[68px] md:w-[104px] h-auto drop-shadow-2xs" />
              </div>

              {/* 文本与按钮区：移动端靠左，PC 视图图片与文本绝对垂直居中对齐 */}
              <div className="flex-1 min-w-0 md:w-full flex flex-col items-start md:items-center md:text-center">
                <h2 className="font-serif text-[22px] sm:text-[26px] md:text-[30px] font-normal tracking-tight text-[#171717]">
                  {isEn ? 'I Ching & BaZi' : '易经与八字'}
                </h2>
                <p className="mt-1.5 md:mt-2 text-[13px] sm:text-[14px] leading-relaxed text-[#52525B] md:min-h-[2.75rem] flex items-center md:justify-center">
                  {isEn
                    ? 'Cast a hexagram or explore your birth chart.'
                    : '起一卦，或查看八字命盘。'}
                </p>
                <div className="mt-4 md:mt-6 w-full flex justify-start md:justify-center">
                  <Link
                    href={`/${lang}/east`}
                    prefetch={false}
                    aria-label={isEn ? 'Explore I Ching and BaZi' : '探索东方：易经与八字'}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#171717] px-6 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#27272A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                  >
                    <span>{isEn ? 'Explore I Ching & BaZi' : '探索东方'}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧入口：西方 · 塔罗 */}
          <div className="flex flex-col justify-between pt-8 border-t border-[#E4E4E7] md:border-t-0 md:pt-0 md:pl-8 lg:pl-12">
            <div className="w-full max-w-[380px] lg:max-w-[420px] mx-auto flex flex-row md:flex-col items-start md:items-center gap-5 sm:gap-6">
              {/* 视觉舞台：与左侧完全相同的 180px 高度与底部基准线对齐 */}
              <div className="flex w-[60px] sm:w-[72px] shrink-0 items-start justify-center pt-1 md:h-[180px] md:w-full md:items-end md:justify-center md:pb-3 md:pt-0">
                <Image
                  src="/cards/major-arcana/the-sun.webp"
                  alt={isEn ? 'The Sun Tarot Card' : '太阳塔罗牌'}
                  width={84}
                  height={130}
                  sizes="(max-width: 640px) 60px, (max-width: 768px) 72px, 100px"
                  className="w-[52px] sm:w-[64px] md:w-[94px] h-auto rounded-sm object-contain shadow-xs border border-[#E4E4E7]/70"
                />
              </div>

              {/* 文本与按钮区：与左侧完全对称对齐 */}
              <div className="flex-1 min-w-0 md:w-full flex flex-col items-start md:items-center md:text-center">
                <h2 className="font-serif text-[22px] sm:text-[26px] md:text-[30px] font-normal tracking-tight text-[#171717]">
                  {isEn ? 'Tarot' : '塔罗'}
                </h2>
                <p className="mt-1.5 md:mt-2 text-[13px] sm:text-[14px] leading-relaxed text-[#52525B] md:min-h-[2.75rem] flex items-center md:justify-center">
                  {isEn
                    ? 'Draw cards to reflect on a question.'
                    : '带着一个问题来抽牌。'}
                </p>
                <div className="mt-4 md:mt-6 w-full flex justify-start md:justify-center">
                  <Link
                    href={`/${lang}/west`}
                    prefetch={false}
                    aria-label={isEn ? 'Explore Tarot reading and cards' : '探索塔罗占卜与卡牌'}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#171717] px-6 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#27272A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                  >
                    <span>{isEn ? 'Explore Tarot' : '探索塔罗'}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部轻量链接：双栏居中对齐与中缝延伸 */}
        <div className="mt-12 sm:mt-16 border-t border-[#E4E4E7] pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-[#E4E4E7]">
            <div className="pb-3 md:pb-0 md:pr-8 lg:pr-12">
              <div className="w-full max-w-[380px] lg:max-w-[420px] mx-auto flex items-center justify-start md:justify-center text-[13px]">
                <Link
                  href={`/${lang}/fortune/daily`}
                  prefetch={false}
                  className="inline-flex min-h-[40px] items-center gap-1.5 text-[#52525B] transition-colors hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  <span>{isEn ? 'Daily Card' : '每日一牌'}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="pt-3 md:pt-0 md:pl-8 lg:pl-12">
              <div className="w-full max-w-[380px] lg:max-w-[420px] mx-auto flex items-center justify-start md:justify-center text-[13px]">
                <Link
                  href={`/${lang}/blog`}
                  prefetch={false}
                  className="inline-flex min-h-[40px] items-center gap-1.5 text-[#52525B] transition-colors hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  <span>{isEn ? 'Learn' : '入门指南'}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
