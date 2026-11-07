'use client';

import React, { useState } from 'react';
import { drawRandomCards, DrawnCard, TarotCardData } from '@/lib/tarot/deck';
import { TarotCardView } from './TarotCardView';
import { RotateCcw, ArrowRight } from 'lucide-react';

interface YesNoAnalysis {
  verdict: 'YES' | 'NO' | 'MAYBE';
  score: number; // 0 - 100
  titleZh: string;
  energyZh: string;
  blockageZh: string;
  guidanceZh: string;
}

// 塔罗 Yes / No 深度法则推演
function evaluateYesNo(drawn: DrawnCard): YesNoAnalysis {
  const { card, isReversed } = drawn;
  const name = card.nameEn.toLowerCase();

  // 1. 明确的强吉牌 (正位为强肯定 YES)
  const strongYesNames = [
    'the sun', 'the star', 'the world', 'the empress', 'the magician',
    'wheel of fortune', 'ace of cups', 'two of cups', 'three of cups',
    'nine of cups', 'ten of cups', 'ace of pentacles', 'three of pentacles',
    'nine of pentacles', 'ten of pentacles', 'ace of wands', 'four of wands',
    'six of wands', 'the lovers', 'the chariot', 'the hierophant'
  ];

  // 2. 明确的阻碍/否定牌 (正位倾向 NO)
  const strongNoNames = [
    'the tower', 'death', 'three of swords', 'nine of swords', 'ten of swords',
    'five of pentacles', 'five of cups', 'the devil', 'seven of swords',
    'eight of swords', 'five of wands', 'ten of wands'
  ];

  // 3. 悬而未决/需要等待的中性变牌 (MAYBE)
  const maybeNames = [
    'the high priestess', 'the hanged man', 'two of swords', 'four of swords',
    'seven of cups', 'the hermit', 'the moon', 'justice'
  ];

  let verdict: 'YES' | 'NO' | 'MAYBE' = 'MAYBE';
  let score = 50;

  if (strongYesNames.some(k => name.includes(k))) {
    if (!isReversed) {
      verdict = 'YES';
      score = 85 + Math.floor(Math.random() * 12);
    } else {
      verdict = 'MAYBE';
      score = 45 + Math.floor(Math.random() * 10);
    }
  } else if (strongNoNames.some(k => name.includes(k))) {
    if (!isReversed) {
      verdict = 'NO';
      score = 15 + Math.floor(Math.random() * 15);
    } else {
      verdict = 'MAYBE';
      score = 40 + Math.floor(Math.random() * 15);
    }
  } else if (maybeNames.some(k => name.includes(k))) {
    verdict = 'MAYBE';
    score = 50 + (isReversed ? -8 : 8);
  } else {
    // 其他普通小牌：正位偏吉，逆位偏阻
    if (!isReversed) {
      verdict = 'YES';
      score = 65 + Math.floor(Math.random() * 15);
    } else {
      verdict = 'NO';
      score = 30 + Math.floor(Math.random() * 15);
    }
  }

  // 生成结构化解读
  const orientationStr = isReversed ? '逆位' : '正位';
  const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;

  let titleZh = '';
  let energyZh = '';
  let blockageZh = '';
  let guidanceZh = '';

  if (verdict === 'YES') {
    titleZh = `决断倾向：是（YES） · 赞同推进`;
    energyZh = `${card.nameZh}（${orientationStr}）显现顺遂与丰盈之势。当前心识与外界客体处于正向共振期，阻力较小。${meaning}`;
    blockageZh = isReversed
      ? '虽有成事之机，但需警惕节奏拖沓或细节疏忽。'
      : '外在阻碍轻微，主要的变数来自于内心的犹豫与过度保守。';
    guidanceZh = '果断把握当下时机，保持清晰的目标感，顺势而为即可见成效。';
  } else if (verdict === 'NO') {
    titleZh = `决断倾向：否（NO） · 建议暂缓或规避`;
    energyZh = `${card.nameZh}（${orientationStr}）揭示潜在的能量摩擦或结构性限制。强行推动容易事与愿违。${meaning}`;
    blockageZh = isReversed
      ? '深层矛盾尚未见底，仓促决策容易引发连锁反应。'
      : '客观条件尚未成熟，或存在未曾察觉的隐形成本与风险。';
    guidanceZh = '暂缓采取不可逆的行动，重新核验底层事实，保护好现有资源与精力。';
  } else {
    titleZh = `决断倾向：静观（MAYBE） · 机缘未显`;
    energyZh = `${card.nameZh}（${orientationStr}）呈现出潜伏、沉淀或多方拉扯的态势。事物的发展仍在动态演变中。${meaning}`;
    blockageZh = '信息存在盲区，或是双方/多方的意图尚未完全明朗。';
    guidanceZh = '避免急躁求成，先探明未公开的关键信息，等待更明确的征兆浮现。';
  }

  return { verdict, score, titleZh, energyZh, blockageZh, guidanceZh };
}

export function YesNoWidget({ lang = 'zh' }: { lang?: string }) {
  const [question, setQuestion] = useState('');
  const [drawn, setDrawn] = useState<DrawnCard | null>(null);
  const [analysis, setAnalysis] = useState<YesNoAnalysis | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const presetQuestions = [
    '我当前的计划是否值得全力推进？',
    '对方心里对我是否有真实的信任？',
    '近期是否适合做出换工作或转型的决定？',
    '这笔投资或合作是否符合长远利益？'
  ];

  const handleDraw = () => {
    const card = drawRandomCards(1)[0];
    const evaluated = evaluateYesNo(card);
    setDrawn(card);
    setAnalysis(evaluated);
    setIsFlipped(false);
    setTimeout(() => {
      setIsFlipped(true);
    }, 200);
  };

  const handleReset = () => {
    setDrawn(null);
    setAnalysis(null);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 极简标题 (Linear 风格) */}
      <div className="text-center mb-8">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          是否塔罗
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-2">
          单张神谕。为二选一或踌躇不决的问题提供倾向性指引。
        </p>
      </div>

      {/* 核心卡片容器 */}
      <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 sm:p-8 shadow-2xs">
        {!drawn ? (
          <div className="space-y-6">
            {/* 提问输入框 */}
            <div>
              <label className="block text-xs font-serif text-[#736B5E] mb-2">
                默念你的疑惑（推荐是非明确的问题）：
              </label>
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="例如：我是否应该接受这次新的机会？"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-sm font-serif text-[#111111] placeholder-[#736B5E]/50 focus:outline-none focus:border-[#111111]/30 transition-colors"
              />
            </div>

            {/* 预设灵感 */}
            <div>
              <span className="text-[11px] font-serif text-[#736B5E] block mb-2">
                常见决策情境：
              </span>
              <div className="flex flex-wrap gap-2">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuestion(q)}
                    className="text-xs font-serif px-3 py-1.5 rounded-lg bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#111111]/80 border border-[#111111]/8 transition-colors cursor-pointer text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* 抽牌操作按钮 */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDraw}
                className="w-full py-3.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-xs font-serif tracking-widest text-[#FFFDF9] transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                抽 取 决 断 神 谕
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 问题回显 */}
            {question && (
              <div className="text-center pb-4 border-b border-[#111111]/8">
                <span className="text-[11px] font-serif text-[#736B5E] block">你所询问的问题</span>
                <p className="text-sm font-serif font-bold text-[#111111] mt-1">“{question}”</p>
              </div>
            )}

            {/* 卡牌与结论展示 */}
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* 卡牌 */}
              <div className="shrink-0 flex justify-center">
                <TarotCardView
                  card={drawn.card}
                  isReversed={drawn.isReversed}
                  isFlipped={isFlipped}
                  size="md"
                  onFlip={() => setIsFlipped(!isFlipped)}
                />
              </div>

              {/* 决断分析结果 */}
              {analysis && (
                <div className="flex-1 space-y-4">
                  {/* 核心结论横幅 */}
                  <div className="p-4 rounded-xl bg-[#FAF6ED] border border-[#111111]/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-serif font-bold tracking-wide text-[#111111]">
                        {analysis.titleZh}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#111111]/70">
                        {analysis.score}%
                      </span>
                    </div>

                    {/* 进度条 */}
                    <div className="w-full h-1.5 rounded-full bg-[#111111]/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${
                          analysis.verdict === 'YES'
                            ? 'bg-emerald-600'
                            : analysis.verdict === 'NO'
                            ? 'bg-stone-700'
                            : 'bg-amber-600'
                        }`}
                        style={{ width: `${analysis.score}%` }}
                      />
                    </div>
                  </div>

                  {/* 关键解析三要素 */}
                  <div className="space-y-3 text-xs font-serif leading-relaxed text-[#111111]">
                    <div>
                      <span className="font-bold text-[#736B5E] block mb-0.5">【核心动能】</span>
                      <p className="text-[#333333]">{analysis.energyZh}</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#736B5E] block mb-0.5">【潜在阻滞】</span>
                      <p className="text-[#333333]">{analysis.blockageZh}</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#736B5E] block mb-0.5">【行动指引】</span>
                      <p className="text-[#333333]">{analysis.guidanceZh}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 底部重置按钮 */}
            <div className="pt-4 border-t border-[#111111]/8 flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-[#FAF6ED] hover:bg-[#F2ECE1] text-xs font-serif text-[#111111] border border-[#111111]/10 transition-colors cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#736B5E]" />
                <span>重新占断新问题</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
