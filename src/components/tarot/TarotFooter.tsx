'use client';

import React from 'react';
import Link from 'next/link';
import { YinYangFish } from '@/components/common/YinYangFish';

export function TarotFooter({ lang = 'zh' }: { lang?: string }) {
  return (
    <footer className="w-full bg-[#F5EFE6]/70 border-t border-[#1E1B18]/10 text-[#5C5549] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌简介 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFFDF9] border border-[#E8CF86]/60 flex items-center justify-center shadow-xs">
                <YinYangFish size={20} spin={false} glow={false} />
              </div>
              <span className="font-serif font-black text-xl text-[#1E1B18]">QiCosmos</span>
            </div>
            <p className="text-xs leading-relaxed text-[#736B5E]">
              心里有件事，问问牌吧。QiCosmos 是你的专属 AI 命理与塔罗导师，结合荣格共时性心理学与东西方玄学精髓，为你带来温润治愈的即时解答。
            </p>
            <div className="text-[11px] text-[#8C6D23] font-serif">
              ✦ 凭直觉抽牌 · 探寻潜意识指引 ✦
            </div>
          </div>

          {/* 占卜模式 */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1E1B18] mb-3">占卜频道</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${lang}/reading`} className="hover:text-[#1E1B18] transition-colors">
                  AI 塔罗综合占卜
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/yes-no`} className="hover:text-[#1E1B18] transition-colors">
                  是否塔罗（Yes or No）
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/love`} className="hover:text-[#1E1B18] transition-colors">
                  爱情与关系解读
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/fortune/daily`} className="hover:text-[#1E1B18] transition-colors">
                  每日塔罗运势签
                </Link>
              </li>
            </ul>
          </div>

          {/* 塔罗知识库 */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1E1B18] mb-3">牌库与牌阵</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${lang}/cards`} className="hover:text-[#1E1B18] transition-colors">
                  78 张塔罗牌全义大全
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/spreads`} className="hover:text-[#1E1B18] transition-colors">
                  经典塔罗牌阵详解
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/cards/the-fool`} className="hover:text-[#1E1B18] transition-colors">
                  愚人牌（The Fool）牌义
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/cards/the-magician`} className="hover:text-[#1E1B18] transition-colors">
                  魔术师（The Magician）牌义
                </Link>
              </li>
            </ul>
          </div>

          {/* 规则与商业 */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1E1B18] mb-3">会员与支持</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${lang}/pricing`} className="hover:text-[#1E1B18] transition-colors">
                  会员权益与订阅
                </Link>
              </li>
              <li>
                <span className="text-[#A59E92]">隐私政策与使用条款</span>
              </li>
              <li>
                <span className="text-[#A59E92]">退款与取消政策</span>
              </li>
              <li>
                <span className="text-[#A59E92]">联系客服支持</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权与免责 */}
        <div className="mt-12 pt-6 border-t border-[#1E1B18]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A59E92] gap-3">
          <p>© 2026 QiCosmos. 保留所有权利。</p>
          <p className="text-center sm:text-right max-w-md">
            免责声明：塔罗牌占卜旨在提供心灵陪伴、直觉启发与自我反思，不可替代专业心理咨询、医疗或法律财务决策。
          </p>
        </div>
      </div>
    </footer>
  );
}
