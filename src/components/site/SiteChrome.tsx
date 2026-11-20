'use client';

import React from 'react';
import { SiteNavbar } from './SiteNavbar';
import { SiteFooter } from './SiteFooter';

/**
 * YiTatro 统一站点外壳：
 * 所有本地化路由统一使用黑白中性 SiteNavbar 与 SiteFooter，
 * 保证从卡片或直接访问任何工具与深层页面均获得统一的白底黑字框架与导航结构。
 */
export function SiteChrome({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <div className="mkt flex min-h-screen flex-col bg-white text-ink selection:bg-ink selection:text-white">
      <SiteNavbar lang={lang} />
      <main className="flex-1">{children}</main>
      <SiteFooter lang={lang} />
    </div>
  );
}
