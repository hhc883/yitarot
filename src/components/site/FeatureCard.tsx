import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export interface FeatureCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  desc: string;
  action: string;
  prefetch?: boolean;
}

/**
 * 东 / 西专厅工具入口卡：
 * - 产品工具卡结构：左方章图章（56px）+ 标题与中英文副名 → 简短说明 → 底部对齐的操作标签与圆形箭头
 * - 浅灰壳/白章标准卡
 * - 整卡为单一 <Link>，focus-visible 明确，无 JS 亦可完整阅读与交互
 */
export function FeatureCard({
  href,
  icon,
  title,
  subtitle,
  desc,
  action,
  prefetch
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      data-tool-card=""
      className="group relative flex h-full flex-col rounded-xl border border-[#D4D4D8] bg-[#F8F8F8] p-5 text-[#171717] shadow-[0_1px_2px_rgba(23,23,23,0.04)] transition-[border-color,background-color,box-shadow] duration-200 hover:border-[#A1A1AA] hover:bg-white hover:shadow-[0_10px_24px_-16px_rgba(23,23,23,0.16)] active:scale-[0.995] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] sm:p-6"
    >
      <div className="flex items-center gap-4">
        <span
          data-tool-stamp=""
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#D4D4D8] bg-white text-[#171717] shadow-[0_1px_2px_rgba(23,23,23,0.04)] transition-transform duration-200 ease-out group-hover:[transform:translateY(-2px)] motion-reduce:transition-none motion-reduce:group-hover:[transform:none] [[data-gsap-motion=true]_&]:transition-none [[data-gsap-motion=true]_&]:group-hover:[transform:none]"
        >
          {icon}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[17px] font-medium leading-snug tracking-tight text-[#171717] break-words">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-[12px] leading-snug tracking-wide text-[#52525B] break-words">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 mb-5 text-[13.5px] leading-[1.6] text-[#52525B]">
        {desc}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#E4E4E7] pt-4">
        <span className="text-[13px] font-medium text-[#171717]">
          {action}
        </span>
        <span
          data-tool-arrow=""
          aria-hidden="true"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D4D4D8] bg-white text-[#171717] transition-transform duration-200 ease-out group-hover:[transform:translate(3px,-3px)] motion-reduce:transition-none motion-reduce:group-hover:[transform:none] [[data-gsap-motion=true]_&]:transition-none [[data-gsap-motion=true]_&]:group-hover:[transform:none]"
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </div>
    </Link>
  );
}
