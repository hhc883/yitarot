import React from 'react';
import Link from 'next/link';
import { CONTAINER } from './constants';

/** 首页 / 东·西 Landing 的极简页脚（黑白中性） */
export function SiteFooter({ lang = 'zh' }: { lang?: string }) {
  const links = [
    { href: `/${lang}/east`, zh: '东方数术', en: 'East' },
    { href: `/${lang}/west`, zh: '西方塔罗', en: 'West' },
    { href: `/${lang}/blog`, zh: 'Blog', en: 'Blog' },
    { href: `/${lang}/pricing`, zh: '会员', en: 'Membership' }
  ];

  return (
    <footer className="w-full border-t border-line bg-white">
      <div className={`${CONTAINER} py-12 lg:py-16`}>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-serif text-[17px] font-semibold tracking-[-0.01em] text-ink">QiCosmos</p>
            <p className="mt-3 max-w-[30ch] text-[12.5px] leading-relaxed text-whisper">
              不做宿命判决，只作内心镜像。
              <br />
              A mirror for the mind, not a verdict from fate.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-10 gap-y-4" aria-label="页脚导航">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12.5px] text-soft transition-colors hover:text-ink"
              >
                {lang === 'en' ? link.en : link.zh}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[11.5px] text-whisper sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 QiCosmos</p>
          <p>For reflection and insight — not a substitute for professional advice.</p>
        </div>
      </div>
    </footer>
  );
}
