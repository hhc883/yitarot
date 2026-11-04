'use client';

import React, { useState } from 'react';
import { DrawnCard } from '@/lib/tarot/deck';
import { TarotReader } from '@/lib/tarot/readers';
import { TarotCardView } from './TarotCardView';
import { Sparkles, Share2, MessageCircle, Send, RotateCcw, Copy, Check } from 'lucide-react';

interface ReadingResultProps {
  question: string;
  reader: TarotReader;
  drawnCards: DrawnCard[];
  interpretationText: string;
  isStreaming: boolean;
  onReset: () => void;
  onOpenShareModal: () => void;
}

export function ReadingResult({
  question,
  reader,
  drawnCards,
  interpretationText,
  isStreaming,
  onReset,
  onOpenShareModal
}: ReadingResultProps) {
  const [copied, setCopied] = useState(false);
  const [followUpInput, setFollowUpInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);

  // 复制解读内容
  const handleCopy = () => {
    navigator.clipboard.writeText(interpretationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 提交追问
  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim() || isAskingFollowUp) return;

    const userText = followUpInput.trim();
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setFollowUpInput('');
    setIsAskingFollowUp(true);

    try {
      setTimeout(() => {
        let reply = '';
        if (reader.id === 'luna') {
          reply = `关于你追问的“${userText}”，从牌面来看，这触动了你内心最深沉的安全感需求。牌阵中的【${drawnCards[0].card.nameZh}】再次提醒你：不要强迫自己立刻得出所有答案，允许事情有一个缓冲和沉淀的周期。温柔地抱抱现在的自己，你的力量正在悄然汇聚。`;
        } else if (reader.id === 'sophia') {
          reply = `针对追问：“${userText}”，逻辑层面上核心矛盾在于权衡的优先级。参考牌面的【${drawnCards[0].card.nameZh}】，建议你将关注点从“对方怎么看”转移至“我能掌控的实际行动”。先列出你当下最不可退让的底线，决策自然会变得明朗。`;
        } else {
          reply = `你所问的“${userText}”，正如山间迷雾遇风而散。牌面【${drawnCards[0].card.nameZh}】所暗示的，正是顺应此时的机缘，不与当下的阻滞硬碰。静心等待三至七日，新的转机便会浮现。`;
        }
        setChatHistory(prev => [...prev, { role: 'assistant', text: reply }]);
        setIsAskingFollowUp(false);
      }, 1000);
    } catch {
      setIsAskingFollowUp(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* 顶部占卜师与提问回顾 */}
      <div className="w-full rounded-3xl bg-[#FFFDF9] border border-[#1E1B18]/10 p-5 sm:p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${reader.avatarBg}`}>
            {reader.avatarIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-[#1E1B18]">{reader.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1E1B18]/5 text-[#736B5E]">
                {reader.titleZh}
              </span>
            </div>
            <p className="text-xs text-[#736B5E] mt-0.5">
              为你的所念所感 “<strong className="text-[#1E1B18] font-medium">{question}</strong>” 呈递的牌面指引
            </p>
          </div>
        </div>

        {/* 顶部操作区 */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#F5EFE6] hover:bg-[#EAE1D3] text-[#1E1B18] transition-colors border border-[#1E1B18]/10 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? '已复制' : '复制解读'}
          </button>
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#C29026]/10 hover:bg-[#C29026]/20 text-[#8C6D23] transition-colors border border-[#C29026]/25 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            生成结缘海报
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#1E1B18] hover:bg-[#38332D] text-[#FFFDF9] transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            新占卜
          </button>
        </div>
      </div>

      {/* 核心抽牌牌阵展示区 (绝不折叠，高清大图完整展现) */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8C6D23] animate-pulse" />
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#1E1B18]">
              所抽神谕牌阵（共 {drawnCards.length} 张）
            </h3>
          </div>
          <span className="text-[11px] text-[#736B5E] font-serif">
            点击卡牌可翻转查看背影
          </span>
        </div>

        {/* 卡牌横排网格 */}
        <div className="w-full flex flex-wrap justify-center gap-4 sm:gap-6 items-start">
          {drawnCards.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-3 sm:p-4 rounded-3xl bg-[#FFFDF9] border border-[#1E1B18]/10 shadow-xs hover:shadow-md hover:border-[#C29026]/40 transition-all"
            >
              {/* 站位标签 */}
              <div className="text-center mb-3">
                <span className="inline-block text-[11px] font-semibold text-[#8C6D23] bg-[#FFE59A]/35 px-2.5 py-0.5 rounded-full mb-1">
                  {i + 1}. {c.positionName}
                </span>
                {c.positionDesc && (
                  <p className="text-[10px] text-[#736B5E] max-w-[150px] truncate" title={c.positionDesc}>
                    {c.positionDesc}
                  </p>
                )}
              </div>

              {/* 3D 卡牌实体 */}
              <TarotCardView
                card={c.card}
                isReversed={c.isReversed}
                isFlipped={true}
                size="md"
                showDetails={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* AI 解读正文报告 */}
      <div className="w-full rounded-3xl bg-[#FFFDF9] border border-[#1E1B18]/10 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* 流式打字指示器 */}
        {isStreaming && (
          <div className="flex items-center gap-2 text-xs font-medium text-[#8C6D23] bg-[#C29026]/10 px-3 py-1.5 rounded-full w-fit mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            AI 塔罗师正在推演牌阵与潜意识共振，字句正在显化中...
          </div>
        )}

        {/* Markdown 格式化输出 */}
        <div className="prose prose-stone max-w-none text-[#1E1B18] font-sans leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line">
          {interpretationText}
        </div>
      </div>

      {/* 多轮追问模块 (Chat / Follow-up) */}
      {!isStreaming && (
        <div className="w-full mt-8 rounded-3xl bg-[#FFFDF9] border border-[#1E1B18]/10 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-[#8C6D23]" />
            <h3 className="font-serif font-bold text-base text-[#1E1B18]">向塔罗师继续追问</h3>
            <span className="text-xs text-[#736B5E]">针对上述牌面继续探讨你最关切的细节</span>
          </div>

          {/* 历史对话记录 */}
          {chatHistory.length > 0 && (
            <div className="space-y-3 mb-4">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#1E1B18] text-[#FFFDF9]'
                        : 'bg-[#FAF6ED] text-[#1E1B18] border border-[#1E1B18]/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 追问输入表单 */}
          <form onSubmit={handleFollowUpSubmit} className="flex gap-2">
            <input
              type="text"
              value={followUpInput}
              onChange={e => setFollowUpInput(e.target.value)}
              placeholder={`如：“针对${drawnCards[0]?.card.nameZh}，我近期最需要做的一个准备是什么？”`}
              disabled={isAskingFollowUp}
              className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF6ED] border border-[#1E1B18]/10 text-xs sm:text-sm text-[#1E1B18] placeholder-[#736B5E]/60 focus:outline-hidden focus:border-[#C29026]"
            />
            <button
              type="submit"
              disabled={!followUpInput.trim() || isAskingFollowUp}
              className="px-5 py-3 rounded-2xl bg-[#1E1B18] hover:bg-[#38332D] text-[#FFFDF9] text-xs sm:text-sm font-medium flex items-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>追问</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
