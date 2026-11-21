import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import { BlogToolCta } from '@/types/blog';

interface BlogToolCtaProps {
  tool: BlogToolCta;
  lang: 'zh' | 'en';
}

export function BlogToolCtaBanner({ tool, lang }: BlogToolCtaProps) {
  const isEn = lang === 'en';
  const name = isEn ? tool.nameEn : tool.nameZh;
  const desc = isEn ? tool.descEn : tool.descZh;
  const cta = isEn ? tool.ctaEn : tool.ctaZh;
  const href = `/${lang}${tool.href}`;

  return (
    <section className="my-12 p-6 sm:p-8 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
        <Compass size={160} />
      </div>

      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#171717] text-white text-[11px] font-mono font-medium">
          <span>{isEn ? 'Recommended Tool' : '心智实修配套工具'}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-serif font-medium text-[#171717] tracking-tight">
          {name}
        </h3>

        <p className="text-sm text-[#52525B] leading-relaxed max-w-xl">
          {desc}
        </p>

        <div className="pt-2">
          <Link
            href={href}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#171717] text-[#FFFFFF] text-xs sm:text-sm font-medium hover:bg-black transition-all shadow-sm group-hover:translate-x-0.5"
          >
            <span>{cta}</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
