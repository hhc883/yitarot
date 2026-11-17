import React from 'react';
import Link from 'next/link';
import { CONTAINER } from './constants';

/** 首页 / 东·西 Landing 的极简页脚（黑白中性） */
export function SiteFooter({ lang = 'zh' }: { lang?: string }) {
  const links = [
    { href: `/${lang}/east`, zh: '易经与八字', en: 'I Ching & BaZi' },
    { href: `/${lang}/west`, zh: '塔罗', en: 'Tarot' },
    { href: `/${lang}/blog`, zh: '指南', en: 'Learn' },
    { href: `/${lang}/pricing`, zh: '会员', en: 'Membership' },
    {
      href: `/${lang}/privacy`,
      zh: '隐私政策',
      en: 'Privacy Policy'
    }
  ];

  return (
    <footer className="w-full border-t border-[#E4E4E7] bg-white">
      <div className={`${CONTAINER} py-12 lg:py-16`}>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-serif text-[18px] font-bold tracking-tight text-[#171717]">YiTatro</p>
            <p className="mt-3 max-w-[30ch] text-[12.5px] leading-relaxed text-[#52525B]">
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
                className="whitespace-nowrap text-[12.5px] text-[#52525B] transition-colors hover:text-[#171717]"
              >
                {lang === 'en' ? link.en : link.zh}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[#E4E4E7] pt-6 text-[11.5px] text-[#8A8A91] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 YiTatro</p>
          <p>For reflection and insight — not a substitute for professional advice.</p>
        </div>
      </div>
    </footer>
  );
}
