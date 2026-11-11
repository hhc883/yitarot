'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { TarotNavbar } from '@/components/tarot/TarotNavbar';
import { TarotFooter } from '@/components/tarot/TarotFooter';
import { SiteNavbar } from './SiteNavbar';
import { SiteFooter } from './SiteFooter';

/**
 * 站点外壳：首页 / 东·西 Landing / 登录 / 账号 / 定价走新的黑白中性导航（首页首屏隐藏导航），
 * 其余原有页面（排盘、塔罗、知识库等）完全沿用既有导航与页脚，不做任何改动。
 */
export function SiteChrome({ lang, children }: { lang: string; children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isMarketing = [
    `/${lang}`,
    `/${lang}/east`,
    `/${lang}/west`,
    `/${lang}/login`,
    `/${lang}/account`,
    `/${lang}/pricing`
  ].some(
    (path) => pathname === path || pathname === `${path}/`
  );

  if (isMarketing) {
    return (
      <div className="mkt flex min-h-screen flex-col bg-white text-ink selection:bg-ink selection:text-white">
        <SiteNavbar lang={lang} />
        <main className="flex-1">{children}</main>
        <SiteFooter lang={lang} />
      </div>
    );
  }

  return (
    <div className="paper-grain flex min-h-screen flex-col bg-[#F7F3EF] text-[#2B261F] selection:bg-[#EAE4D9] selection:text-[#111111]">
      <TarotNavbar lang={lang} />
      <main className="flex-1">{children}</main>
      <TarotFooter lang={lang} />
    </div>
  );
}
