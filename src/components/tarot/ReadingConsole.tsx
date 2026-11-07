'use client';

import React, { useState, useCallback } from 'react';
import { TAROT_SPREADS, TarotSpread, getSpreadById } from '@/lib/tarot/spreads';
import { TAROT_READERS, TarotReader } from '@/lib/tarot/readers';
import { DrawnCard } from '@/lib/tarot/deck';
import { DeckShuffler } from './DeckShuffler';
import { ReadingResult } from './ReadingResult';
import { ShareCardModal } from './ShareCardModal';
import { Sparkles, HelpCircle, ArrowRight, Wand2, Compass } from 'lucide-react';
import { CategoryIcon, ReaderAvatarIcon } from '@/components/icons/QiIcons';

const CATEGORIES = [
  { id: 'love', name: '爱情感情', hint: '暗恋、复合、关系转折、桃花走向' },
  { id: 'career', name: '事业发展', hint: '跳槽机遇、职场人际、创业项目' },
  { id: 'decision', name: '重大抉择', hint: '两难选择、该不该行动、利弊分析' },
  { id: 'fortune', name: '运势启示', hint: '近期待遇、核心课题、转机节点' },
  { id: 'emotion', name: '情绪心境', hint: '抚平焦虑、向内觉察、灵性疗愈' },
  { id: 'growth', name: '个人成长', hint: '潜能发掘、突破瓶颈、寻找天命' }
];

const PRESET_QUESTIONS: Record<string, string[]> = {
  love: [
    '我和他未来的关系走向会如何？',
    '他心里对我的真实想法究竟是什么？',
    '我们之间目前最核心的情感阻碍是什么？',
    '近期会有新的正缘桃花出现吗？'
  ],
  career: [
    '我目前这份工作是否有更好的突破空间？',
    '近期如果考虑跳槽转型，时机合适吗？',
    '当前推进的项目可能会遇到什么隐性阻力？',
    '我的个人核心职业竞争力和优势在何处？'
  ],
  decision: [
    '在当前的两个选择中，哪一条路更契合我？',
    '是否应该主动打破目前的僵局迈出第一步？',
    '如果我现在选择放手，结果会更好吗？'
  ],
  fortune: [
    '我未来一个月的整体能量状态与关键指引？',
    '最近有什么我需要格外留意的信号或转机？',
    '今天宇宙有什么重要信息想传达给我？'
  ],
  emotion: [
    '我最近频繁焦虑不安的潜意识根源是什么？',
    '我该如何重新找回内心的安宁与自信？'
  ],
  growth: [
    '我当下的灵魂课题与成长重点是什么？',
    '如何突破目前在自我认知上的瓶颈？'
  ]
};

export function ReadingConsole({ defaultCategory = 'love' }: { defaultCategory?: string }) {
  // 步骤：'input' -> 'shuffle' -> 'result'
  const [step, setStep] = useState<'input' | 'shuffle' | 'result'>('input');
  const [category, setCategory] = useState(defaultCategory);
  const [question, setQuestion] = useState('');
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread>(TAROT_SPREADS[2]); // 默认圣三角
  const [selectedReader, setSelectedReader] = useState<TarotReader>(TAROT_READERS[0]); // 默认露娜
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [interpretationText, setInterpretationText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 点击预设问题
  const handleSelectPreset = (q: string) => {
    setQuestion(q);
  };

  // 进入抽牌环节
  const handleStartDraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setStep('shuffle');
  };

  // 抽牌完毕，调用 API 解牌
  const handleCardsReady = useCallback(async (cards: DrawnCard[]) => {
    setDrawnCards(cards);
    setStep('result');
    setIsStreaming(true);
    setInterpretationText('');

    try {
      const response = await fetch('/api/tarot/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          category,
          spread: selectedSpread,
          reader: selectedReader,
          drawnCards: cards
        })
      });

      if (!response.ok) {
        throw new Error('解牌请求失败');
      }

      const readerStream = response.body?.getReader();
      const decoder = new TextDecoder();

      if (readerStream) {
        let accumulated = '';
        while (true) {
          const { done, value } = await readerStream.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setInterpretationText(accumulated);
                }
              } catch {
                // Ignore parse errors on raw tokens
              }
            }
          }
        }
      }
    } catch (_err: unknown) {
      setInterpretationText('解牌生成遇到了短暂网络波动，请点击右上角重试。');
    } finally {
      setIsStreaming(false);
    }
  }, [category, question, selectedReader, selectedSpread]);

  // 重置占卜
  const handleReset = () => {
    setStep('input');
    setQuestion('');
    setDrawnCards([]);
    setInterpretationText('');
    setIsStreaming(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 步骤一：意图输入与配置 */}
      {step === 'input' && (
        <div className="w-full max-w-3xl flex flex-col items-center">
          {/* 标头 */}
          <div className="text-center mb-6">
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1E1B18] tracking-tight">
              塔罗占卜
            </h1>
            <p className="text-xs text-[#736B5E] mt-1.5 max-w-sm mx-auto">
              凝聚意念，向韦特塔罗叩问当下课题与启示。
            </p>
          </div>

          {/* 分类选项胶囊 */}
          <div className="w-full flex flex-wrap justify-center gap-1.5 mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-serif transition-all cursor-pointer ${
                  category === cat.id
                    ? 'bg-[#1E1B18] text-[#FFFDF9]'
                    : 'bg-[#FFFDF9] text-[#736B5E] hover:bg-[#F5EFE6] border border-[#1E1B18]/10'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* 提问输入卡片 */}
          <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#1E1B18]/10 p-5 sm:p-7 shadow-2xs mb-6">
            <form onSubmit={handleStartDraw} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-serif font-semibold text-[#1E1B18] mb-2">
                  问题与困惑
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="输入心中所求之事，如：近期事业发展的转机与阻碍是什么？"
                    className="w-full px-3.5 py-3 rounded-xl bg-[#FAF6ED] border border-[#1E1B18]/10 text-xs sm:text-sm text-[#1E1B18] placeholder-[#736B5E]/50 focus:outline-hidden focus:border-[#1E1B18] resize-none"
                  />
                </div>
              </div>

              {/* 常见提问 */}
              <div className="flex flex-wrap gap-1.5">
                {(PRESET_QUESTIONS[category] || PRESET_QUESTIONS.love).map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(q)}
                    className="text-left text-xs px-2.5 py-1 rounded-lg bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#5C5549] transition-colors border border-[#1E1B18]/5 cursor-pointer font-serif"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* 牌阵与塔罗师选择 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1E1B18]/8 mt-1">
                {/* 牌阵选择 */}
                <div>
                  <label className="block text-xs font-serif font-semibold text-[#1E1B18] mb-1.5">
                    牌阵
                  </label>
                  <select
                    value={selectedSpread.id}
                    onChange={e => {
                      const sp = getSpreadById(e.target.value);
                      if (sp) setSelectedSpread(sp);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] border border-[#1E1B18]/10 text-xs text-[#1E1B18] focus:outline-hidden focus:border-[#1E1B18]"
                  >
                    {TAROT_SPREADS.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.nameZh}（{s.cardCount} 张牌）
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] font-serif text-[#736B5E] mt-1">{selectedSpread.summary}</p>
                </div>

                {/* 塔罗师人设选择 */}
                <div>
                  <label className="block text-xs font-serif font-semibold text-[#1E1B18] mb-1.5">
                    解牌视角
                  </label>
                  <div className="flex gap-2">
                    {TAROT_READERS.map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedReader(r)}
                        className={`flex-1 flex flex-col items-center p-2 rounded-xl text-center border transition-all cursor-pointer ${
                          selectedReader.id === r.id
                            ? 'bg-[#FAF6ED] border-[#111111] text-[#1E1B18]'
                            : 'bg-white border-[#1E1B18]/10 text-[#736B5E] hover:bg-[#FAF6ED]/50'
                        }`}
                      >
                        <ReaderAvatarIcon
                          id={r.id}
                          size={20}
                          className={`mb-1 transition-colors ${
                            selectedReader.id === r.id ? 'text-[#8C6D23]' : 'text-[#736B5E]'
                          }`}
                        />
                        <span className="text-xs font-serif font-semibold">{r.name.split('·')[0]}</span>
                        <span className="text-[10px] text-[#8C6D23] font-serif">{r.titleZh}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="pt-3 mt-1">
                <button
                  type="submit"
                  disabled={!question.trim()}
                  className="w-full py-3 rounded-xl bg-[#1E1B18] hover:bg-[#38332D] text-[#FFFDF9] font-serif text-xs tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <span>开始抽牌</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 步骤二：洗牌与 3D 抽牌 */}
      {step === 'shuffle' && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
          <div className="text-center mb-6">
            <h2 className="font-serif font-bold text-xl text-[#1E1B18]">
              “{question}”
            </h2>
            <p className="text-xs font-serif text-[#736B5E] mt-1">
              逐一揭开卡牌
            </p>
          </div>

          <DeckShuffler spread={selectedSpread} onCardsReady={handleCardsReady} />
        </div>
      )}

      {/* 步骤三：AI 解读报告呈现 */}
      {step === 'result' && (
        <div className="w-full animate-in fade-in duration-700">
          <ReadingResult
            question={question}
            reader={selectedReader}
            drawnCards={drawnCards}
            interpretationText={interpretationText}
            isStreaming={isStreaming}
            onReset={handleReset}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        </div>
      )}

      {/* 结缘海报弹窗 */}
      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        question={question}
        reader={selectedReader}
        drawnCards={drawnCards}
      />
    </div>
  );
}
