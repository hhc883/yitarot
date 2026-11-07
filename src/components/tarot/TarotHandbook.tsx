'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

interface GuideChapter {
  id: string;
  number: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  contentZh: string[];
}

const CHAPTERS: GuideChapter[] = [
  {
    id: 'essence',
    number: '01',
    titleZh: '塔罗的本质：潜意识的投射之镜',
    titleEn: 'The Mirror of the Subconscious',
    summaryZh: '塔罗并非预先写死命运的玄虚宿命论，而是荣格心理学中的“共时性”工具。',
    contentZh: [
      '很多人对塔罗的第一印象是“占卜吉凶”，但真正成熟的研习者都明白：塔罗不是用来预测不可更改的结局，而是用来照见你此刻潜意识里的真实盲区。',
      '心理学家卡尔·荣格（Carl Jung）曾指出，心灵具有“共时性”（Synchronicity）法则——内心的隐秘渴望、深层恐惧和未消化的情绪，会在外界特定的图像和符号中找到共鸣。',
      '当你洗牌、切牌并翻开那张卡片时，牌面呈现的并非冷酷的既定判决，而是你内心深处早已知道、却在意识层面刻意回避的答案。'
    ]
  },
  {
    id: 'questioning',
    number: '02',
    titleZh: '提问的艺术：如何问出一个有力量的问题',
    titleEn: 'The Art of Asking Questions',
    summaryZh: '一个好问题比抽十次牌更有力量。从被动等待宣判，转向主动夺回生活的掌控权。',
    contentZh: [
      '在塔罗推演中，提问的质量直接决定了答案的深度。最糟糕的问题往往是被动且闭合的，比如：“我今年会不会发财？”或“他到底爱不爱我？”',
      '这类问题将你置于受害者的等待席上，仿佛命运是完全外在于你的力量。有力量的问题始终是开放且聚焦行动的：',
      '· 替代“他会回来找我吗？”——“为了修复我们之间的隔阂，我现在可以迈出怎样的一步？”',
      '· 替代“我换工作会成功吗？”——“当前阻碍我职业跃迁的核心盲点是什么？我该如何化解？”',
      '当你把焦点从“结果是什么”转移到“我该如何应对和成长”时，塔罗才能成为你最清醒的战略顾问。'
    ]
  },
  {
    id: 'orientations',
    number: '03',
    titleZh: '正位与逆位：超越非黑即白的二元论',
    titleEn: 'Upright and Reversed Perspectives',
    summaryZh: '正位不一定全是吉，逆位亦非全然是凶。逆位通常意味着能量的受阻、内化或过度倾斜。',
    contentZh: [
      '初学者最容易陷入“正位开心、逆位害怕”的焦虑陷阱。然而在高级解读中，正逆位只是能量流动的方向差异。',
      '· 顺畅外显：正位通常代表该卡牌的核心原型正在你的现实世界中自然、顺畅地向外表达。',
      '· 内向沉淀：逆位往往提醒你，这种能量正处于向内探索的阶段，或者正在受到抑制与反思。例如：逆位的宝剑骑士可能不是危险，而是提醒你“行动前需冷静深思，不可盲目冲动”。',
      '· 过度或不足：逆位也可能代表某种特质的过犹不及，提示你需要做减法与调候。'
    ]
  },
  {
    id: 'structure',
    number: '04',
    titleZh: '78 张牌的宇宙骨架：大阿卡纳与四元素',
    titleEn: 'The Architecture of the 78 Cards',
    summaryZh: '22 张大阿卡纳映射灵魂英雄之旅，56 张小阿卡纳构筑起日常生活的四重物质基石。',
    contentZh: [
      '经典的韦特塔罗体系由 78 张卡牌构成，严密如同精密的天体钟表：',
      '1. 22 张大阿卡纳（Major Arcana）：从“0 愚人”的纯真启程，历经魔术师、女祭司、恋人，穿越命运之轮、塔的崩解，最终抵达“21 世界”的圆融。这是一条完整的个人心智与灵魂成熟轨迹。',
      '2. 56 张小阿卡纳（Minor Arcana）：由四大家族构成，分别对应生命的核心面向：',
      '  - 权杖（火元素）：意志力、事业、创造力与热情。',
      '  - 圣杯（水元素）：情感、直觉、人际连结与内心世界。',
      '  - 宝剑（风元素）：心智、理性、沟通、逻辑与冲突。',
      '  - 星币（土元素）：物质、财富、身体、健康与稳固基础。'
    ]
  },
  {
    id: 'daily-practice',
    number: '05',
    titleZh: '初学者的刻意练习：每日单张晨昏日记',
    titleEn: 'The Daily Practice Routine',
    summaryZh: '不急于摆弄复杂大阵。用最纯粹的单张冥想，建立你与卡牌之间的私人心灵触感。',
    contentZh: [
      '建立塔罗语感最好的方法，不是死记硬背厚厚的牌义字典，而是每天清晨的一张“灵感日签”：',
      '1. 晨间抽牌：深呼吸三次，抽出一张牌，先不急着看文字解析，而是端详牌面上的颜色、人物视线与细微动作，记录第一直觉。',
      '2. 日间观察：在一天的工作和生活中，留心留意哪件事、哪段对话在呼应这张牌的原型特征。',
      '3. 晚间复盘：睡前用两三句话在备忘录写下你的体悟。持续一个月，你会发现自己对人性与世事的理解变得前所未有的敏锐。'
    ]
  }
];

export function TarotHandbook({ lang = 'zh' }: { lang?: string }) {
  const [activeChapterId, setActiveChapterId] = useState<string>('essence');

  const activeChapter = CHAPTERS.find(c => c.id === activeChapterId) || CHAPTERS[0];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 极简标题 */}
      <div className="text-center mb-10">
        <span className="text-[11px] font-mono tracking-widest text-[#736B5E] uppercase block mb-1">
          PRACTITIONER'S NOTEBOOK
        </span>
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          塔罗新手指南
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-2 max-w-lg mx-auto">
          极简清晰的心法手记。剥离迷信神秘色彩，以现代心理学与符号学透视 78 张卡牌的内在逻辑。
        </p>
      </div>

      {/* 左右分栏或紧凑阅读架构 (Apple Notes 风格) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 左侧章节索引 (md:col-span-4) */}
        <div className="md:col-span-4 space-y-2">
          <span className="text-[11px] font-serif text-[#736B5E] px-2 block mb-1">
            指南目录
          </span>
          <div className="space-y-1.5">
            {CHAPTERS.map(chap => {
              const isSelected = chap.id === activeChapterId;
              return (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => setActiveChapterId(chap.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-baseline gap-3 ${
                    isSelected
                      ? 'bg-[#111111] text-[#FFFDF9] border-[#111111] shadow-2xs'
                      : 'bg-[#FFFDF9] text-[#111111] border-[#111111]/10 hover:bg-[#FAF6ED]'
                  }`}
                >
                  <span
                    className={`text-xs font-mono font-bold shrink-0 ${
                      isSelected ? 'text-[#FFFDF9]/60' : 'text-[#736B5E]'
                    }`}
                  >
                    {chap.number}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-serif font-bold truncate">
                      {chap.titleZh.split('：')[0]}
                    </div>
                    <div
                      className={`text-[11px] font-serif truncate mt-0.5 ${
                        isSelected ? 'text-[#FFFDF9]/70' : 'text-[#736B5E]'
                      }`}
                    >
                      {chap.titleZh.split('：')[1] || chap.titleEn}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 快捷跳转实操 */}
          <div className="p-4 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 mt-6 space-y-2">
            <span className="text-[11px] font-serif font-bold text-[#111111] block">
              准备好开始推演了吗？
            </span>
            <p className="text-[11px] font-serif text-[#736B5E] leading-relaxed">
              理论领会之后，最好的学习即是上手抽出一张牌。
            </p>
            <div className="pt-2 flex flex-col gap-1.5">
              <Link
                href={`/${lang}/fortune/daily`}
                className="text-xs font-serif text-[#111111] hover:underline flex items-center gap-1"
              >
                <span>抽取今日运势灵感牌</span>
                <ArrowRight className="w-3 h-3 text-[#736B5E]" />
              </Link>
              <Link
                href={`/${lang}/cards`}
                className="text-xs font-serif text-[#111111] hover:underline flex items-center gap-1"
              >
                <span>查阅 78 张经典牌义字典</span>
                <ArrowRight className="w-3 h-3 text-[#736B5E]" />
              </Link>
            </div>
          </div>
        </div>

        {/* 右侧正文精读区 (md:col-span-8) */}
        <div className="md:col-span-8 rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 sm:p-10 shadow-2xs">
          <div className="pb-6 border-b border-[#111111]/8">
            <span className="text-[11px] font-mono tracking-widest text-[#736B5E] uppercase block mb-1">
              CHAPTER {activeChapter.number} · {activeChapter.titleEn}
            </span>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#111111] tracking-tight">
              {activeChapter.titleZh}
            </h2>
            <p className="text-xs font-serif text-[#736B5E] mt-2 italic leading-relaxed">
              “{activeChapter.summaryZh}”
            </p>
          </div>

          <div className="mt-6 space-y-4 text-xs sm:text-sm font-serif leading-relaxed text-[#222222]">
            {activeChapter.contentZh.map((paragraph, pIdx) => (
              <p key={pIdx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
