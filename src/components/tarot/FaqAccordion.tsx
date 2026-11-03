'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'AI 塔罗占卜准吗？它和人工占卜师有什么区别？',
    a: '塔罗占卜的核心并非预言不可更改的未来，而是荣格心理学所阐述的“共时性（Synchronicity）”——即借助 78 张原型符号，将你潜意识中的隐秘心事、思维盲区与情绪纠葛投射出来。AI 塔罗师基于数百年积累的经典象征体系，能严格依据具体牌面站位、元素生克与你的具体情境进行客观、严密且富有人文关怀的推演，不带有任何偏见，像一面极其清晰温润的心灵镜子。'
  },
  {
    q: '抽到逆位牌是不是代表坏运气？',
    a: '绝对不是！在正统塔罗体系中，并没有单纯的“好牌”与“坏牌”。逆位通常表示该卡牌的能量受到了内阻、延迟，或是提示你应当由向外追求转为向内觉察（例如逆位的倒吊人提示停止无谓牺牲，逆位的死神提示勇敢告别旧模式）。逆位往往是比正位更深刻的自我突破转折点。'
  },
  {
    q: '每天占卜有次数限制吗？可以同一件事反复问吗？',
    a: '普通用户每天可免费占卜 3 次，Plus 会员无限制。不过，从心灵探索的角度出发，不建议在短时间内就同一个问题频繁反复抽牌。当你在心慌意乱时反复抽牌，往往反映的是内心的焦虑与失控感。建议每次抽牌后静心反思 24 小时，待心境沉淀或外部出现新动向后再做后续探索。'
  },
  {
    q: '我在手机上抽牌，直觉感应真的有效吗？',
    a: '是的。在现代心理学中，无论实体切牌还是屏幕点击，触发你那一瞬决策的，都是你深层的肌肉记忆与潜意识直觉。当你深呼吸放下杂念、点击选出某张牌的刹那，共时性的连接就已经建立完成。'
  }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // 默认展开第1项

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {FAQS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/8 overflow-hidden transition-all shadow-xs"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full px-5 py-4 text-left font-serif font-bold text-sm sm:text-base text-[#111111] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF6ED]/50 transition-colors"
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#736B5E] shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-[#111111]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5C5549] leading-relaxed animate-in fade-in slide-in-from-top-1 border-t border-[#111111]/5">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
