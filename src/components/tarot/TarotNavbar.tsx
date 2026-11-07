'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TarotNavbar({ lang = 'zh' }: { lang?: string }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === `/${lang}` || pathname === `/${lang}/` || pathname === '/';
  const isEastern = pathname.includes('/fatemaster');
  const isCards = pathname.includes('/cards');
  const isTarot = !isCards && (
    pathname.includes('/reading') ||
    pathname.includes('/spreads') ||
    pathname.includes('/yes-no') ||
    pathname.includes('/love') ||
    pathname.includes('/fortune')
  );
  const isPricing = pathname.includes('/pricing');

  // 高端人文学术排版：纯文字律动与微金细线底标，彻底摒弃塑料药丸背景
  const navItemClass = (isActive: boolean) =>
    `relative py-1.5 text-xs lg:text-sm font-serif tracking-wider transition-all duration-200 select-none ${
      isActive
        ? 'text-[#111111] font-bold after:content-[""] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[1.5px] after:bg-[#8C6D23]'
        : 'text-[#6E675B] hover:text-[#111111]'
    }`;

  const mobileItemClass = (isActive: boolean) =>
    `block py-3 px-2 text-sm font-serif tracking-wider border-b border-[#111111]/6 transition-colors ${
      isActive
        ? 'text-[#111111] font-bold text-base'
        : 'text-[#6E675B] hover:text-[#111111]'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F3EF]/95 backdrop-blur-md border-b border-[#111111]/8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
        
        {/* 左侧品牌区：朱砂赤印 + 典雅字标 */}
        <Link href={`/${lang}`} className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-[3px] border border-[#B84034] text-[#B84034] bg-[rgba(184,64,52,0.06)] flex items-center justify-center font-serif font-black text-sm select-none shadow-2xs group-hover:scale-105 transition-transform duration-300">
            象
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-lg sm:text-xl tracking-tight text-[#111111]">
              QiCosmos
            </span>
            <span className="text-[9px] tracking-[0.22em] text-[#8C8375] uppercase -mt-0.5 font-serif font-medium">
              {lang === 'en' ? 'Cosmic Continuum' : '天仪灵图 · 易境塔罗'}
            </span>
          </div>
        </Link>

        {/* 中间桌面导航：无任何 Icon，纯正文人古籍与古典西文律动 */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-10">
          <Link
            href={`/${lang}`}
            className={navItemClass(isHome)}
          >
            {lang === 'en' ? 'Origins' : '双门首页'}
          </Link>

          <Link
            href={`/${lang}/fatemaster`}
            className={navItemClass(isEastern)}
          >
            {lang === 'en' ? 'I Ching' : '东方周易'}
          </Link>

          <Link
            href={`/${lang}/reading`}
            className={navItemClass(isTarot)}
          >
            {lang === 'en' ? 'Tarot Archetypes' : '西方塔罗'}
          </Link>

          <Link
            href={`/${lang}/cards`}
            className={navItemClass(isCards)}
          >
            {lang === 'en' ? 'Card Codex' : '牌义典藏'}
          </Link>

          <Link
            href={`/${lang}/pricing`}
            className={navItemClass(isPricing)}
          >
            {lang === 'en' ? 'Membership' : '会员知命'}
          </Link>
        </nav>

        {/* 右侧操作区：极简双语切换 + 纯字排版仪式感按钮 */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={lang === 'zh' ? '/en' : '/zh'}
            className="text-[11px] font-serif tracking-widest text-[#7D7466] hover:text-[#111111] transition-colors uppercase px-2 py-1"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </Link>

          <span className="w-px h-3 bg-[#111111]/15" />

          <Link
            href={`/${lang}/reading`}
            className="px-5 py-2 rounded-full border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#FFFDF9] text-xs font-serif tracking-widest transition-all duration-300 shadow-2xs hover:shadow-sm"
          >
            {lang === 'en' ? 'Consult Oracle' : '凝神起卦'}
          </Link>
        </div>

        {/* 移动端菜单按钮：极简双细线设计，去除厚重图标 */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            href={`/${lang}/reading`}
            className="px-3.5 py-1.5 rounded-full border border-[#111111] text-[11px] font-serif text-[#111111]"
          >
            {lang === 'en' ? 'Oracle' : '起卦'}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-xs font-serif tracking-widest text-[#111111] select-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>

      {/* 移动端菜单抽屉：纯文字宋体清秀排版 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF9] border-b border-[#111111]/10 px-6 pt-3 pb-8 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          <Link
            href={`/${lang}`}
            onClick={() => setMobileMenuOpen(false)}
            className={mobileItemClass(isHome)}
          >
            {lang === 'en' ? 'Origins · Home' : '双门首页'}
          </Link>
          <Link
            href={`/${lang}/fatemaster`}
            onClick={() => setMobileMenuOpen(false)}
            className={mobileItemClass(isEastern)}
          >
            {lang === 'en' ? 'Eastern I Ching · BaZi' : '东方周易 · 命盘六爻'}
          </Link>
          <Link
            href={`/${lang}/reading`}
            onClick={() => setMobileMenuOpen(false)}
            className={mobileItemClass(isTarot)}
          >
            {lang === 'en' ? 'Western Tarot Archetypes' : '西方塔罗 · 秘境神谕'}
          </Link>
          <Link
            href={`/${lang}/cards`}
            onClick={() => setMobileMenuOpen(false)}
            className={mobileItemClass(isCards)}
          >
            {lang === 'en' ? 'Card Codex (78 Deck)' : '牌义典藏 (78 牌库)'}
          </Link>
          <Link
            href={`/${lang}/pricing`}
            onClick={() => setMobileMenuOpen(false)}
            className={mobileItemClass(isPricing)}
          >
            {lang === 'en' ? 'Membership & Wisdom' : '会员知命 · 权益'}
          </Link>
          <div className="pt-4 flex justify-between items-center text-xs font-serif text-[#7D7466]">
            <span>语言选择 / Language</span>
            <Link
              href={lang === 'zh' ? '/en' : '/zh'}
              className="text-[#111111] font-semibold underline underline-offset-4"
            >
              {lang === 'zh' ? 'English' : '中文版'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
