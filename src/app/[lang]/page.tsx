import React from 'react';
import { TaijiIntro } from '@/components/site/TaijiIntro';
import { PortalEntry } from '@/components/site/PortalEntry';
import { LegacyShowcase } from '@/components/site/LegacyShowcase';

export const instant = false;

export async function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

/**
 * 首页（第一版改版）：
 * 第 1 屏 只展示太极 + H1 + 上滑提示 → 第 2 屏 东 / 西两个入口 → 必须保留区（东方周易 / 西方塔罗 / 定调）。
 */
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'zh';

  return (
    <div className="w-full overflow-x-clip">
      <TaijiIntro lang={lang} />
      <PortalEntry lang={lang} />
      <LegacyShowcase lang={lang} />
    </div>
  );
}
