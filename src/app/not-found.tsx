import React from 'react';
import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-white text-[#171717]">
      <span className="font-mono text-xs uppercase tracking-widest text-[#52525B] mb-2">
        404 · NOT FOUND
      </span>
      <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#171717] tracking-tight mb-4">
        页面未找到 / Page Not Found
      </h1>
      <p className="max-w-md mx-auto text-xs sm:text-sm text-[#52525B] leading-relaxed mb-8">
        你所访问的页面不存在、已被移除或链接有误。
        <br />
        The page you are looking for does not exist or may have been relocated.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333333] text-white text-xs font-serif tracking-wider transition-all shadow-xs cursor-pointer"
        >
          返回首页 / Return Home
        </Link>
        <Link
          href="/zh/east"
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F5F5F6] text-[#171717] border border-[#E4E4E7] text-xs font-serif tracking-wider transition-all cursor-pointer"
        >
          东方命理专厅
        </Link>
        <Link
          href="/zh/west"
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F5F5F6] text-[#171717] border border-[#E4E4E7] text-xs font-serif tracking-wider transition-all cursor-pointer"
        >
          西方塔罗专厅
        </Link>
      </div>
    </main>
  );
}
