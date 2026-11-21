'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime client error
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-white text-[#171717]">
      <span className="font-mono text-xs uppercase tracking-widest text-[#52525B] mb-2">
        RUNTIME NOTICE
      </span>
      <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#171717] tracking-tight mb-4">
        服务暂时遇到异常
      </h1>
      <p className="max-w-md mx-auto text-xs sm:text-sm text-[#52525B] leading-relaxed mb-8">
        页面加载出现波动。你可以尝试刷新重试，或直接返回主页继续浏览。
        <br />
        An unexpected issue occurred while rendering. You can retry or head back home.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333333] text-white text-xs font-serif tracking-wider transition-all shadow-xs cursor-pointer"
        >
          重新尝试 / Retry
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F5F5F6] text-[#171717] border border-[#E4E4E7] text-xs font-serif tracking-wider transition-all cursor-pointer"
        >
          返回首页 / Home
        </Link>
      </div>
    </main>
  );
}
