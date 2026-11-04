'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, ChevronDown } from 'lucide-react';
import { YinYangFish } from '@/components/common/YinYangFish';

export function TarotNavbar({ lang = 'zh' }: { lang?: string }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isEastern = pathname.includes('/fatemaster');
  const isTarot = pathname.includes('/reading') || pathname.includes('/cards') || pathname.includes('/yes-no') || pathname.includes('/love');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#111111]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 左侧品牌 Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-[#FFFDF9] border border-[#E8CF86]/60 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <YinYangFish size={26} spin={false} glow={false} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-lg sm:text-xl tracking-tight text-[#111111]">
              QiCosmos
            </span>
            <span className="text-[9px] tracking-widest text-[#736B5E] -mt-1 uppercase">
              周易 · 塔罗 · AI 命理
            </span>
          </div>
        </Link>

        {/* 中间桌面双模块导航 */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
          <Link
            href={`/${lang}`}
            className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors ${
              pathname === `/${lang}`
                ? 'bg-[#111111] text-[#FFFDF9]'
                : 'text-[#5C5549] hover:bg-[#FAF6ED] hover:text-[#111111]'
            }`}
          >
            双门首页
          </Link>

          {/* 东方周易 */}
          <Link
            href={`/${lang}/fatemaster`}
            className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isEastern
                ? 'bg-[#111111] text-[#FFFDF9]'
                : 'text-[#5C5549] hover:bg-[#FAF6ED] hover:text-[#111111]'
            }`}
          >
            <YinYangFish size={15} spin={false} />
            <span>东方周易</span>
          </Link>

          {/* 西方塔罗 */}
          <Link
            href={`/${lang}/reading`}
            className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors flex items-center gap-1 ${
              isTarot
                ? 'bg-[#111111] text-[#FFFDF9]'
                : 'text-[#5C5549] hover:bg-[#FAF6ED] hover:text-[#111111]'
            }`}
          >
            <span>🔮 西方塔罗</span>
          </Link>

          <Link
            href={`/${lang}/cards`}
            className="px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium text-[#5C5549] hover:bg-[#FAF6ED] hover:text-[#111111]"
          >
            78 牌义库
          </Link>

          <Link
            href={`/${lang}/pricing`}
            className="px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium text-[#5C5549] hover:bg-[#FAF6ED] hover:text-[#111111]"
          >
            会员订阅
          </Link>
        </nav>

        {/* 右侧操作区 */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={lang === 'zh' ? '/en' : '/zh'}
            className="text-xs font-serif text-[#736B5E] hover:text-[#111111] px-2 py-1 rounded-md border border-[#111111]/10 hover:border-[#111111]/30 transition-colors"
          >
            {lang === 'zh' ? 'EN / 英文' : '中文'}
          </Link>

          <Link
            href={`/${lang}/reading`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] shadow-xs transition-all hover:scale-102"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE59A]" />
            <span>问问牌</span>
          </Link>
        </div>

        {/* 移动端汉堡菜单触发器 */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href={`/${lang}/reading`}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#111111] text-[#FFFDF9]"
          >
            占卜
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#111111] hover:bg-[#FAF6ED] transition-colors"
            aria-label="打开菜单"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#111111]" />}
          </button>
        </div>
      </div>

      {/* 移动端菜单抽屉 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF9] border-b border-[#111111]/10 px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          <Link
            href={`/${lang}`}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#111111] hover:bg-[#FAF6ED]"
          >
            双门首页
          </Link>
          <Link
            href={`/${lang}/fatemaster`}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#111111] hover:bg-[#FAF6ED]"
          >
            <YinYangFish size={16} spin={false} />
            <span>东方周易 · FateMaster</span>
          </Link>
          <Link
            href={`/${lang}/reading`}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#111111] hover:bg-[#FAF6ED]"
          >
            🔮 西方塔罗 · Tarotip
          </Link>
          <Link
            href={`/${lang}/cards`}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#111111] hover:bg-[#FAF6ED]"
          >
            78 牌义库
          </Link>
          <Link
            href={`/${lang}/pricing`}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#111111] hover:bg-[#FAF6ED]"
          >
            会员订阅
          </Link>
          <div className="pt-3 border-t border-[#111111]/10 flex justify-between items-center px-3">
            <span className="text-xs text-[#736B5E]">当前语言</span>
            <Link
              href={lang === 'zh' ? '/en' : '/zh'}
              className="text-xs font-serif text-[#111111] px-2 py-1 rounded-md border border-[#111111]/15"
            >
              {lang === 'zh' ? 'Switch to English' : '切换为中文'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
