'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { TAROT_SPREADS, TarotSpread, getSpreadById } from '@/lib/tarot/spreads';
import { TAROT_READERS, TarotReader } from '@/lib/tarot/readers';
import { DrawnCard } from '@/lib/tarot/deck';
import { DeckShuffler } from './DeckShuffler';
import { ReadingResult } from './ReadingResult';
import { ShareCardModal } from './ShareCardModal';
import { ArrowRight } from 'lucide-react';
import { ReaderAvatarIcon } from '@/components/icons/QiIcons';
import { usePointsGate } from '@/components/site/PointsGateProvider';
import { READING_COST } from '@/lib/points/constants';

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

function ReadingConsoleInner({
  defaultCategory = 'love',
  lang = 'zh',
  initialSpread
}: {
  defaultCategory?: string;
  lang?: string;
  initialSpread: TarotSpread;
}) {
  const isEn = lang === 'en';

  // 步骤：'input' -> 'shuffle' -> 'result'
  const [step, setStep] = useState<'input' | 'shuffle' | 'result'>('input');
  const [category, setCategory] = useState(defaultCategory);
  const [question, setQuestion] = useState('');
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread>(initialSpread);
  const [selectedReader, setSelectedReader] = useState<TarotReader>(TAROT_READERS[0]); // 默认露娜
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [interpretationText, setInterpretationText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const pointsGate = usePointsGate();
  const hasConsumedRef = useRef(false);

  // 点击预设问题
  const handleSelectPreset = (q: string) => {
    setQuestion(q);
  };

  // 进入抽牌环节
  const handleStartDraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    hasConsumedRef.current = false;
    setStep('shuffle');
  };

  // 抽牌完毕：先扣积分（失败弹「积分不足」），成功后调用 API 解牌
  const handleCardsReady = useCallback(async (cards: DrawnCard[]) => {
    if (hasConsumedRef.current) return;
    hasConsumedRef.current = true;

    setDrawnCards(cards);
    setStep('result');
    setIsStreaming(true);
    setInterpretationText('');

    const consumed = await pointsGate.consume('tarot');
    if (!consumed.ok) {
      setIsStreaming(false);
      setStep('input');
      return;
    }

    try {
      const response = await fetch('/api/tarot/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          category,
          spread: selectedSpread,
          reader: selectedReader,
          drawnCards: cards,
          points_ref: consumed.ref_id
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
  }, [category, question, selectedReader, selectedSpread, pointsGate]);

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
          {/* 标头与指引 */}
          <header className="text-center mb-8">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#171717] tracking-tight">
              {isEn ? 'Tarot Reading' : '塔罗完整解读'}
            </h1>
            <p className="text-xs sm:text-sm text-[#52525B] mt-2 max-w-lg mx-auto">
              {isEn
                ? 'Clarify your inquiry, pick a spread, and draw the cards for structured insight.'
                : '凝练心中困惑，选定牌阵与视角，抽牌获取结构化启示。'}
            </p>
          </header>

          {/* 分类选项胶囊 */}
          <div className="w-full flex flex-wrap justify-center gap-2 mb-6">
            {CATEGORIES.map(cat => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                    active
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'bg-white text-[#52525B] border-[#E4E4E7] hover:border-[#8A8A91] hover:text-[#171717]'
                  }`}
                >
                  <span>{isEn ? cat.nameEn : cat.nameZh}</span>
                </button>
              );
            })}
          </div>

          {/* 提问输入卡片 */}
          <div className="w-full rounded-2xl bg-white border border-[#E4E4E7] p-5 sm:p-7 shadow-xs mb-6">
            <form onSubmit={handleStartDraw} className="flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="tarot-question-input" className="block text-xs sm:text-sm font-semibold text-[#171717]">
                    {isEn ? 'Your Question' : '明确你的问题'}
                  </label>
                  <span className="text-[11px] text-[#52525B]">
                    {isEn ? 'Step 1 of 2' : '第 1 步：立意'}
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    id="tarot-question-input"
                    rows={3}
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Enter your question, e.g. What are the key catalysts and obstacles in my career right now?'
                        : '输入心中所求之事，如：近期事业发展的转机与阻碍是什么？'
                    }
                    className="w-full px-3.5 py-3 rounded-xl bg-white border border-[#8A8A91] text-xs sm:text-sm text-[#171717] placeholder-[#52525B]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] focus:border-[#171717] resize-none"
                  />
                </div>
              </div>

              {/* 常见提问 */}
              <div>
                <span className="block text-[11px] text-[#52525B] mb-2">
                  {isEn ? 'Recommended inquiries:' : '参考常见提问：'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(isEn
                    ? (PRESET_QUESTIONS_EN[category] || PRESET_QUESTIONS_EN.love)
                    : (PRESET_QUESTIONS_ZH[category] || PRESET_QUESTIONS_ZH.love)
                  ).map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(q)}
                      className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-[#F5F5F6] hover:bg-[#E4E4E7] text-[#171717] transition-colors border border-[#E4E4E7] hover:border-[#8A8A91] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* 牌阵与塔罗师选择 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5 border-t border-[#E4E4E7]">
                {/* 牌阵选择 */}
                <div>
                  <label htmlFor="tarot-spread-select" className="block text-xs sm:text-sm font-semibold text-[#171717] mb-1.5">
                    {isEn ? 'Tarot Spread' : '解读牌阵'}
                  </label>
                  <select
                    id="tarot-spread-select"
                    value={selectedSpread.id}
                    onChange={e => {
                      const sp = getSpreadById(e.target.value);
                      if (sp) setSelectedSpread(sp);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#8A8A91] text-xs sm:text-sm text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] focus:border-[#171717]"
                  >
                    {TAROT_SPREADS.map(s => (
                      <option key={s.id} value={s.id}>
                        {isEn ? `${s.nameEn} (${s.cardCount} cards)` : `${s.nameZh}（${s.cardCount} 张牌）`}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#52525B] mt-1.5 leading-relaxed">
                    {isEn ? sSummary(selectedSpread) : selectedSpread.summary}
                  </p>
                </div>

                {/* 塔罗师人设选择 */}
                <div>
                  <span className="block text-xs sm:text-sm font-semibold text-[#171717] mb-1.5">
                    {isEn ? 'Interpretation Perspective' : '解读视角'}
                  </span>
                  <div className="flex gap-2">
                    {TAROT_READERS.map(r => {
                      const selected = selectedReader.id === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedReader(r)}
                          aria-pressed={selected}
                          className={`flex-1 flex flex-col items-center p-2.5 rounded-xl text-center border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                            selected
                              ? 'bg-[#171717] text-white border-[#171717]'
                              : 'bg-white text-[#52525B] border-[#E4E4E7] hover:border-[#8A8A91] hover:text-[#171717]'
                          }`}
                        >
                          <ReaderAvatarIcon
                            id={r.id}
                            size={20}
                            className={`mb-1 transition-colors ${
                              selected ? 'text-white' : 'text-[#52525B]'
                            }`}
                          />
                          <span className="text-xs font-semibold">
                            {isEn ? r.id.toUpperCase() : r.name.split('·')[0]}
                          </span>
                          <span className={`text-[10px] mt-0.5 ${selected ? 'text-zinc-300' : 'text-[#52525B]'}`}>
                            {isEn ? r.titleEn : r.titleZh}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!question.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-[#171717] hover:bg-black text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer border border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                >
                  <span>{isEn ? 'Proceed to Draw' : '进入抽牌'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[11px] text-[#52525B] mt-2">
                  {isEn
                    ? `Sign-in required · Costs ${READING_COST} points · Next: shuffle and pick cards`
                    : `需登录 · 每次消耗 ${READING_COST} 积分 · 下一步：洗牌与逐一选牌`}
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 步骤二：洗牌与 3D 抽牌 (中性舞台包裹层) */}
      {step === 'shuffle' && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
          <header className="text-center mb-6 max-w-xl px-4">
            <span className="inline-block text-[11px] uppercase tracking-wider font-semibold text-[#52525B] bg-[#F5F5F6] border border-[#E4E4E7] px-2.5 py-0.5 rounded-full mb-2">
              {isEn ? 'Step 2: Card Drawing' : '第 2 步：抽取牌面'}
            </span>
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#171717] break-words">
              “{question}”
            </h2>
            <p className="text-xs text-[#52525B] mt-1.5">
              {isEn
                ? `Spread: ${selectedSpread.nameEn} · Select ${selectedSpread.cardCount} cards in sequence`
                : `所选牌阵：${selectedSpread.nameZh} · 请依序抽取 ${selectedSpread.cardCount} 张牌`}
            </p>
          </header>

          {/* 纯净中性舞台容器 */}
          <div className="w-full rounded-2xl bg-white border border-[#E4E4E7] p-4 sm:p-6 shadow-xs flex flex-col items-center">
            <DeckShuffler spread={selectedSpread} onCardsReady={handleCardsReady} lang={isEn ? 'en' : 'zh'} />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-[#52525B] hover:text-[#171717] underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            >
              {isEn ? 'Cancel and return to edit question' : '放弃并返回修改问题'}
            </button>
          </div>
        </div>
      )}

      {/* 步骤三：AI 解读报告呈现 */}
      {step === 'result' && (
        <div className="w-full animate-in fade-in duration-500">
          <ReadingResult
            question={question}
            reader={selectedReader}
            drawnCards={drawnCards}
            interpretationText={interpretationText}
            isStreaming={isStreaming}
            onReset={handleReset}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            lang={lang}
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

export function ReadingConsole({ defaultCategory = 'love', lang = 'zh' }: { defaultCategory?: string; lang?: string }) {
  const searchParams = useSearchParams();
  const spreadParam = searchParams.get('spread');
  const validatedSpread = (spreadParam && getSpreadById(spreadParam)) || TAROT_SPREADS[2];

  return (
    <ReadingConsoleInner
      key={validatedSpread.id}
      defaultCategory={defaultCategory}
      lang={lang}
      initialSpread={validatedSpread}
    />
  );
}
