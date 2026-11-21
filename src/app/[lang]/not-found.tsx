'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LocalizedNotFound() {
  const pathname = usePathname() || '';
  const lang = pathname.split('/').filter(Boolean)[0] === 'en' ? 'en' : 'zh';
  const isEn = lang === 'en';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-white text-[#171717]">
      <span className="font-mono text-xs uppercase tracking-widest text-[#52525B] mb-2">
        404 · NOT FOUND
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#171717] tracking-tight mb-4">
        {isEn ? 'Page Not Found' : '页面未找到'}
      </h1>
      <p className="max-w-md mx-auto text-xs sm:text-sm text-[#52525B] leading-relaxed mb-8">
        {isEn
          ? 'The destination you requested does not exist or has been relocated.'
          : '你所访问的页面不存在、已被移除或链接有误。'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/${lang}`}
          className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333333] text-white text-xs font-serif tracking-wider transition-all shadow-xs cursor-pointer"
        >
          {isEn ? 'Return to Home' : '返回主页'}
        </Link>
        <Link
          href={`/${lang}/east`}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F5F5F6] text-[#171717] border border-[#E4E4E7] text-xs font-serif tracking-wider transition-all cursor-pointer"
        >
          {isEn ? 'Eastern Portal' : '东方专厅'}
        </Link>
        <Link
          href={`/${lang}/west`}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F5F5F6] text-[#171717] border border-[#E4E4E7] text-xs font-serif tracking-wider transition-all cursor-pointer"
        >
          {isEn ? 'Tarot Portal' : '塔罗专厅'}
        </Link>
      </div>
    </div>
  );
}
