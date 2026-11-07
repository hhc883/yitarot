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

interface CategoryItem {
  id: string;
  nameZh: string;
  nameEn: string;
  hintZh: string;
  hintEn: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'love', nameZh: '爱情感情', nameEn: 'Love & Romance', hintZh: '暗恋、复合、关系转折、桃花走向', hintEn: 'Feelings, reconciliation, chemistry' },
  { id: 'career', nameZh: '事业发展', nameEn: 'Career & Ambition', hintZh: '跳槽机遇、职场人际、创业项目', hintEn: 'Job opportunities, ventures, focus' },
  { id: 'decision', nameZh: '重大抉择', nameEn: 'Decisive Forks', hintZh: '两难选择、该不该行动、利弊分析', hintEn: 'Dilemmas, whether to act, trade-offs' },
  { id: 'fortune', nameZh: '运势启示', nameEn: 'Fortune & Timing', hintZh: '近期待遇、核心课题、转机节点', hintEn: 'Upcoming lessons, timing, momentum' },
  { id: 'emotion', nameZh: '情绪心境', nameEn: 'Emotional Solace', hintZh: '抚平焦虑、向内觉察、灵性疗愈', hintEn: 'Inner mindfulness, anxiety relief' },
  { id: 'growth', nameZh: '个人成长', nameEn: 'Personal Growth', hintZh: '潜能发掘、突破瓶颈、寻找天命', hintEn: 'Unlocking potential, purpose' }
];

const PRESET_QUESTIONS_ZH: Record<string, string[]> = {
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

const PRESET_QUESTIONS_EN: Record<string, string[]> = {
  love: [
    'What is the unfolding trajectory of our relationship?',
    'What are their true, unspoken feelings toward me?',
    'What is the core emotional blockage between us right now?',
    'Will a genuine romantic connection emerge soon?'
  ],
  career: [
    'Is there meaningful breakthrough potential in my current role?',
    'Is now the opportune moment for a job transition or career pivot?',
    'What latent resistance might my current project encounter?',
    'What is my greatest competitive edge and professional strength?'
  ],
  decision: [
    'Between the two paths before me, which aligns more with my soul?',
    'Should I take the proactive first step to break the current impasse?',
    'If I choose to release and walk away now, will the outcome be better?'
  ],
  fortune: [
    'What is the overarching energetic theme of my upcoming month?',
    'What key signs or synchronicities should I pay close attention to?',
    'What important wisdom does the universe wish to convey to me today?'
  ],
  emotion: [
    'What is the root cause of my recent anxiety and inner unrest?',
    'How can I restore my inner tranquility, peace, and self-trust?'
  ],
  growth: [
    'What is my core soul lesson and evolutionary focus right now?',
    'How can I overcome my present ceiling in self-understanding?'
  ]
};

function sSummary(s: TarotSpread): string {
  const enSummaries: Record<string, string> = {
    single: 'Quick direct insight for daily reflection or immediate clarity.',
    yes_no: 'Decisive binary clarity and directional trend for crossroads.',
    triangle: 'Classic past, present, and future trajectory for relationships and dilemmas.',
    two_choices: 'Side-by-side comparison of two divergent paths and their outcomes.',
    celtic_cross: 'The gold standard 10-card comprehensive panoramic inquiry.',
    horseshoe: '7-card sequence examining subconscious drivers and external influences.',
    astrological: '12-house full lifecycle diagnostic mapping your upcoming year.',
    hexagram: 'Spiritual alignment and psychological breakthrough spread.',
    relationship: 'Synastry and mirror spread exploring dynamics between two souls.'
  };
  return enSummaries[s.id] || s.summary;
}

export function ReadingConsole({ defaultCategory = 'love', lang = 'zh' }: { defaultCategory?: string; lang?: string }) {
  const isEn = lang === 'en';
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
              {isEn ? 'AI Tarot Divination' : '塔罗占卜'}
            </h1>
            <p className="text-xs text-[#736B5E] mt-1.5 max-w-sm mx-auto">
              {isEn
                ? 'Focus your intention to consult the archetypes of the Rider-Waite deck.'
                : '凝聚意念，向韦特塔罗叩问当下课题与启示。'}
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
                <span>{isEn ? cat.nameEn : cat.nameZh}</span>
              </button>
            ))}
          </div>

          {/* 提问输入卡片 */}
          <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#1E1B18]/10 p-5 sm:p-7 shadow-2xs mb-6">
            <form onSubmit={handleStartDraw} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-serif font-semibold text-[#1E1B18] mb-2">
                  {isEn ? 'Your Inquiry' : '问题与困惑'}
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Enter your question, e.g. What are the key catalysts and obstacles in my career right now?'
                        : '输入心中所求之事，如：近期事业发展的转机与阻碍是什么？'
                    }
                    className="w-full px-3.5 py-3 rounded-xl bg-[#FAF6ED] border border-[#1E1B18]/10 text-xs sm:text-sm text-[#1E1B18] placeholder-[#736B5E]/50 focus:outline-hidden focus:border-[#1E1B18] resize-none"
                  />
                </div>
              </div>

              {/* 常见提问 */}
              <div className="flex flex-wrap gap-1.5">
                {(isEn
                  ? (PRESET_QUESTIONS_EN[category] || PRESET_QUESTIONS_EN.love)
                  : (PRESET_QUESTIONS_ZH[category] || PRESET_QUESTIONS_ZH.love)
                ).map((q, idx) => (
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
                    {isEn ? 'Spread' : '牌阵'}
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
                        {isEn ? `${s.nameEn} (${s.cardCount} cards)` : `${s.nameZh}（${s.cardCount} 张牌）`}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] font-serif text-[#736B5E] mt-1">
                    {isEn ? sSummary(selectedSpread) : selectedSpread.summary}
                  </p>
                </div>

                {/* 塔罗师人设选择 */}
                <div>
                  <label className="block text-xs font-serif font-semibold text-[#1E1B18] mb-1.5">
                    {isEn ? 'Reader Perspective' : '解牌视角'}
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
                        <span className="text-xs font-serif font-semibold">
                          {isEn ? r.id.toUpperCase() : r.name.split('·')[0]}
                        </span>
                        <span className="text-[10px] text-[#8C6D23] font-serif">
                          {isEn ? r.titleEn : r.titleZh}
                        </span>
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
                  <span>{isEn ? 'Begin Draw' : '开始抽牌'}</span>
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
              {isEn ? 'Reveal the cards one by one' : '逐一揭开卡牌'}
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
