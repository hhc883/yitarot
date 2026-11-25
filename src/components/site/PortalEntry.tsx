import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONTAINER } from './constants';
import { HexagramGraphic } from './HexagramGraphic';
import './HomeMotion.css';

/**
 * 第 2 屏：双入口（服务端组件）
 * - 两张对等浅灰白专题入口卡，保留六爻矢量图与 /cards/major-arcana/the-sun.webp
 * - 390×844 手机：紧凑图文行上下排列，从 #portals 抵达无需额外拖动即可见两主 CTA；320px 可正常换行
 * - 桌面：双栏并列，带更宽的图形舞台与底部对齐的 CTA
 * - 保留 /{lang}/east、/{lang}/west 及下方 /{lang}/fortune/daily、/{lang}/blog 独立链接与 prefetch={false}
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
      <div className={`${CONTAINER} py-6 sm:py-10 md:py-16 lg:py-20`}>
        {/* 双入口卡片：手机紧凑上下排列，桌面 50/50 对等并列 */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
          {/* 左侧入口卡：东方 · 易经与八字 */}
          <div className="flex flex-col rounded-2xl border border-[#E4E4E7] bg-[#FAFAFA] p-3.5 sm:p-5 md:p-7 lg:p-8 shadow-[0_2px_10px_-4px_rgba(23,23,23,0.06)]">
            <div className="flex flex-1 flex-row md:flex-col items-center md:items-stretch gap-3.5 sm:gap-5 md:gap-6">
              {/* 固定尺寸图形舞台：触发元素保持固定布局，内部图形入视窗时轻移 */}
              <div
                className="yitatro-home-portal-stage-east flex w-[72px] h-[88px] sm:w-[96px] sm:h-[112px] md:w-full md:h-[210px] lg:h-[230px] shrink-0 items-center justify-center rounded-xl border border-[#E4E4E7]/80 bg-white"
              >
                <div className="yitatro-home-portal-art flex items-center justify-center">
                  <HexagramGraphic className="w-[46px] sm:w-[58px] md:w-[92px] lg:w-[104px] h-auto" />
                </div>
              </div>

              {/* 文本与主 CTA：标题、说明与按钮无条件可见且立即可点 */}
              <div className="flex-1 min-w-0 flex flex-col items-start md:items-center md:text-center">
                <h2 className="font-serif text-[20px] sm:text-[24px] md:text-[28px] font-normal leading-tight tracking-tight text-[#171717]">
                  {isEn ? 'I Ching & BaZi' : '易经与八字'}
                </h2>
                <p className="mt-1 sm:mt-1.5 md:mt-2 text-[13px] sm:text-[14px] leading-snug md:leading-relaxed text-[#52525B] md:min-h-[2.75rem] flex items-center md:justify-center">
                  {isEn
                    ? 'Cast a hexagram or explore your birth chart.'
                    : '起一卦，或查看八字命盘。'}
                </p>
                <div className="mt-3 sm:mt-4 md:mt-auto md:pt-6 w-full flex justify-start md:justify-center">
                  <Link
                    href={`/${lang}/east`}
                    prefetch={false}
                    aria-label={isEn ? 'Explore I Ching and BaZi' : '探索东方：易经与八字'}
                    className="yitatro-home-portal-link inline-flex max-w-full min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#171717] px-4 sm:px-6 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#27272A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                  >
                    <span>{isEn ? 'Explore I Ching' : '探索东方'}</span>
                    <span className="yitatro-home-portal-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧入口卡：西方 · 塔罗 */}
          <div className="flex flex-col rounded-2xl border border-[#E4E4E7] bg-[#FAFAFA] p-3.5 sm:p-5 md:p-7 lg:p-8 shadow-[0_2px_10px_-4px_rgba(23,23,23,0.06)]">
            <div className="flex flex-1 flex-row md:flex-col items-center md:items-stretch gap-3.5 sm:gap-5 md:gap-6">
              {/* 固定尺寸图形舞台：与左侧完全一致的尺寸、比例与背景 */}
              <div
                className="yitatro-home-portal-stage-west flex w-[72px] h-[88px] sm:w-[96px] sm:h-[112px] md:w-full md:h-[210px] lg:h-[230px] shrink-0 items-center justify-center rounded-xl border border-[#E4E4E7]/80 bg-white"
              >
                <div className="yitatro-home-portal-art flex items-center justify-center">
                  <Image
                    src="/cards/major-arcana/the-sun.webp"
                    alt={isEn ? 'The Sun Tarot Card' : '太阳塔罗牌'}
                    width={84}
                    height={130}
                    sizes="(max-width: 640px) 46px, (max-width: 768px) 58px, 108px"
                    className="w-[46px] sm:w-[58px] md:w-[96px] lg:w-[106px] aspect-[84/130] h-auto rounded-sm object-contain border border-[#E4E4E7]/80 shadow-xs"
                  />
                </div>
              </div>

              {/* 文本与主 CTA：与左侧完全对等对齐 */}
              <div className="flex-1 min-w-0 flex flex-col items-start md:items-center md:text-center">
                <h2 className="font-serif text-[20px] sm:text-[24px] md:text-[28px] font-normal leading-tight tracking-tight text-[#171717]">
                  {isEn ? 'Tarot' : '塔罗'}
                </h2>
                <p className="mt-1 sm:mt-1.5 md:mt-2 text-[13px] sm:text-[14px] leading-snug md:leading-relaxed text-[#52525B] md:min-h-[2.75rem] flex items-center md:justify-center">
                  {isEn
                    ? 'Draw cards to reflect on a question.'
                    : '带着一个问题来抽牌。'}
                </p>
                <div className="mt-3 sm:mt-4 md:mt-auto md:pt-6 w-full flex justify-start md:justify-center">
                  <Link
                    href={`/${lang}/west`}
                    prefetch={false}
                    aria-label={isEn ? 'Explore Tarot reading and cards' : '探索塔罗占卜与卡牌'}
                    className="yitatro-home-portal-link inline-flex max-w-full min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#171717] px-4 sm:px-6 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#27272A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                  >
                    <span>{isEn ? 'Explore Tarot' : '探索塔罗'}</span>
                    <span className="yitatro-home-portal-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部轻量独立链接 */}
        <div className="mt-6 sm:mt-10 md:mt-14 border-t border-[#E4E4E7] pt-4 sm:pt-6">
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            <div className="flex items-center justify-start md:justify-center text-[13px]">
              <Link
                href={`/${lang}/fortune/daily`}
                prefetch={false}
                className="yitatro-home-portal-link inline-flex min-h-[44px] items-center gap-1.5 text-[#52525B] transition-colors hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                <span>{isEn ? 'Daily Card' : '每日一牌'}</span>
                <span className="yitatro-home-portal-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>

            <div className="flex items-center justify-end md:justify-center text-[13px]">
              <Link
                href={`/${lang}/blog`}
                prefetch={false}
                className="yitatro-home-portal-link inline-flex min-h-[44px] items-center gap-1.5 text-[#52525B] transition-colors hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                <span>{isEn ? 'Learn' : '入门指南'}</span>
                <span className="yitatro-home-portal-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
