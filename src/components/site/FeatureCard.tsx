import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  href: string;
  icon: LucideIcon;
  titleEn: string;
  titleZh: string;
  desc: string;
  action: string;
}

/**
 * 东 / 西 Landing 的功能卡：白底 + 细浅灰边框 + 线性小图标 + 英文大标题 + 中文小标题 + 白话描述。
 * 悬停只做边框加深 + 轻阴影。
 */
export function FeatureCard({ href, icon: Icon, titleEn, titleZh, desc, action }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full min-h-[224px] flex-col rounded-[14px] border border-line bg-white p-7 transition-[border-color,box-shadow] duration-300 hover:border-ink/20 hover:shadow-[0_24px_50px_-40px_rgba(10,10,10,0.4)]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.4} aria-hidden="true" />
      </span>

      <h3 className="mt-6 text-[16.5px] font-semibold leading-snug tracking-[-0.005em] text-ink">{titleEn}</h3>
      <p className="mt-1 text-[12.5px] tracking-[0.02em] text-whisper">{titleZh}</p>

      <p className="mt-4 text-[13.5px] leading-[1.65] text-soft">{desc}</p>

      <span className="mt-auto flex items-center gap-1.5 pt-8 text-[12px] text-ink">
        <span>{action}</span>
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
      </span>
    </Link>
  );
}
