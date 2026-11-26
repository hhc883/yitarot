'use client';

import React, { useState } from 'react';
import { DrawnCard } from '@/lib/tarot/deck';
import { TarotReader } from '@/lib/tarot/readers';
import { TarotCardView } from './TarotCardView';
import { Share2, MessageCircle, Send, RotateCcw, Copy, Check, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ReaderAvatarIcon } from '@/components/icons/QiIcons';
import { MarkdownView } from '@/components/common/MarkdownView';
import { saveReading, getSavedReadings } from '@/lib/storage/reading-history';

interface ReadingResultProps {
  question: string;
  reader: TarotReader;
  drawnCards: DrawnCard[];
  spreadId?: string;
  interpretationText: string;
  isStreaming: boolean;
  onReset: () => void;
  onOpenShareModal: () => void;
  lang?: string;
}

export function ReadingResult({
  question,
  reader,
  drawnCards,
  spreadId,
  interpretationText,
  isStreaming,
  onReset,
  onOpenShareModal,
  lang = 'zh'
}: ReadingResultProps) {
  const isEn = lang === 'en';
  const [copied, setCopied] = useState(false);
  const [followUpInput, setFollowUpInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>(() => {
    if (typeof window === 'undefined') return [];
    const rawSessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!rawSessionId) return [];
    const list = getSavedReadings();
    const found = list.find((r) => r.id === rawSessionId);
    return found?.chatHistory && found.chatHistory.length > 0 ? found.chatHistory : [];
  });
  const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);
  const savedIdRef = React.useRef<string>('');

  React.useEffect(() => {
    const rawSessionId = new URLSearchParams(window.location.search).get('session_id');
    if (rawSessionId) {
      savedIdRef.current = rawSessionId;
    }
  }, []);

  // 自动将本次解读与追问会话持久化保存到本地档案
  React.useEffect(() => {
    if (interpretationText && !isStreaming && !interpretationText.includes('网络波动')) {
      const entry = saveReading({
        id: savedIdRef.current || undefined,
        type: 'tarot',
        title: question || (isEn ? 'Tarot Reading' : '塔罗牌阵占卜'),
        question,
        summary: interpretationText.slice(0, 140) + '...',
        fullContent: interpretationText,
        cards: drawnCards.map(c => ({
          name: isEn ? c.card.nameEn : c.card.nameZh,
          position: c.positionName || '',
          isReversed: c.isReversed
        })),
        chatHistory: chatHistory.map(c => ({ role: c.role, text: c.text }))
      });
      savedIdRef.current = entry.id;
    }
  }, [interpretationText, isStreaming, question, drawnCards, chatHistory, isEn]);

  // 完整复制档案（包含所问事项、牌阵卡牌、深度解读与追问对话）
  const handleCopy = () => {
    if (!interpretationText) return;
    let fullLog = isEn ? `【YiTarot · Tarot Reading Record】\n` : `【YiTarot · 塔罗占卜档案】\n`;
    if (question) fullLog += isEn ? `Inquiry: ${question}\n` : `所问事项：${question}\n`;
    fullLog += isEn
      ? `Spread Layout: ${drawnCards.map(c => `${c.positionName || ''} - ${c.card.nameEn}${c.isReversed ? ' (Reversed)' : ' (Upright)'}`).join('; ')}\n\n`
      : `抽选牌阵：${drawnCards.map(c => `${c.positionName} - ${c.card.nameZh}${c.isReversed ? ' (逆位)' : ' (正位)'}`).join('；')}\n\n`;
    fullLog += isEn ? `【Interpretation Report】\n${interpretationText}\n` : `【解读正文】\n${interpretationText}\n`;
    if (chatHistory.length > 0) {
      fullLog += isEn ? `\n【Follow-up Dialogues】\n` : `\n【追问对话记录】\n`;
      chatHistory.forEach(m => {
        fullLog += `\n${m.role === 'user' ? (isEn ? 'Q: ' : '问：') : (isEn ? 'A: ' : '答：')}${m.text}\n`;
      });
    }
    navigator.clipboard.writeText(fullLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 提交追问
  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim() || isAskingFollowUp) return;

    const userText = followUpInput.trim();
    const currentHistory = [...chatHistory];
    setChatHistory(prev => [
      ...prev,
      { role: 'user', text: userText },
      { role: 'assistant', text: '' }
    ]);
    setFollowUpInput('');
    setIsAskingFollowUp(true);

    try {
      const response = await fetch('/api/tarot/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          ...(spreadId ? { spreadId } : {}),
          reader,
          drawnCards,
          initialInterpretation: interpretationText,
          followUpHistory: currentHistory.map(m => ({
            role: m.role,
            content: m.text
          })),
          followUpQuestion: userText,
          lang
        })
      });

      if (!response.ok) {
        throw new Error('追问网络请求失败');
      }

      const streamReader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (streamReader) {
        let accumulated = '';
        while (true) {
          const { done, value } = await streamReader.read();
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
                  setChatHistory(prev => {
                    const next = [...prev];
                    const lastIdx = next.length - 1;
                    if (lastIdx >= 0 && next[lastIdx].role === 'assistant') {
                      next[lastIdx] = { ...next[lastIdx], text: accumulated };
                    }
                    return next;
                  });
                }
              } catch {
                // Ignore SSE parsing chunk errors
              }
            }
          }
        }
      }
    } catch {
      setChatHistory(prev => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        if (lastIdx >= 0 && next[lastIdx].role === 'assistant') {
          next[lastIdx] = {
            ...next[lastIdx],
            text: isEn
              ? 'Encountered a momentary connection issue. Please feel free to re-ask your question.'
              : '解答生成遇到了短暂网络波动，请再次尝试发送追问。'
          };
        }
        return next;
      });
    } finally {
      setIsAskingFollowUp(false);
    }
  };

  const isNetworkError = interpretationText.includes('网络波动') || interpretationText.includes('解牌请求失败');

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* 顶部占卜师与提问回顾 */}
      <div className="w-full rounded-2xl bg-white border border-[#E4E4E7] p-5 sm:p-6 shadow-xs mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-[#E4E4E7] bg-[#F5F5F6] text-[#171717]">
            <ReaderAvatarIcon id={reader.id} size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm sm:text-base text-[#171717]">{reader.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F5F5F6] text-[#52525B] border border-[#E4E4E7]">
                {isEn ? reader.titleEn : reader.titleZh}
              </span>
            </div>
            <p className="text-xs text-[#52525B] mt-1 break-words">
              {isEn ? 'Inquiry: ' : '所问事项：'}“<strong className="text-[#171717] font-medium">{question}</strong>”
            </p>
          </div>
        </div>

        {/* 顶部操作区 */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E4E4E7]">
          {interpretationText && !isStreaming && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#52525B] mr-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEn ? 'Saved to history' : '已自动保存对话'}</span>
            </span>
          )}
          <button
            onClick={handleCopy}
            disabled={!interpretationText || isStreaming}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-[#F5F5F6] text-[#171717] transition-colors border border-[#8A8A91] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#171717]" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isEn ? 'Copied' : '已复制完整对话') : (isEn ? 'Copy Full Log' : '复制完整对话')}
          </button>
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-[#F5F5F6] text-[#171717] transition-colors border border-[#8A8A91] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            <Share2 className="w-3.5 h-3.5" />
            {isEn ? 'Share Card' : '结缘海报'}
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#171717] hover:bg-black text-white transition-colors border border-[#171717] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isEn ? 'New Reading' : '重新占卜'}
          </button>
        </div>
      </div>

      {/* 核心抽牌牌阵展示区 */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#171717]" />
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#171717]">
              {isEn
                ? `Spread Layout (${drawnCards.length} ${drawnCards.length === 1 ? 'card' : 'cards'})`
                : `所抽牌阵（共 ${drawnCards.length} 张）`}
            </h2>
          </div>
          <span className="text-[11px] text-[#52525B]">
            {isEn ? 'Click card to flip' : '点击卡牌可翻转查看背影'}
          </span>
        </div>

        {/* 卡牌横排/多列网格 */}
        <div className="w-full flex flex-wrap justify-center gap-4 sm:gap-6 items-start">
          {drawnCards.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs hover:border-[#8A8A91] transition-colors"
            >
              {/* 站位标签 */}
              <div className="text-center mb-3">
                <span className="inline-block text-[11px] font-semibold text-[#171717] bg-[#F5F5F6] border border-[#E4E4E7] px-2.5 py-0.5 rounded-full mb-1">
                  {i + 1}. {c.positionName}
                </span>
                {c.positionDesc && (
                  <p
                    className="text-[10px] text-[#52525B] max-w-[150px] truncate"
                    title={c.positionDesc}
                    {...(isEn && /[\u4e00-\u9fa5]/.test(c.positionDesc) ? { lang: 'zh-CN' } : {})}
                  >
                    {c.positionDesc}
                  </p>
                )}
              </div>

              {/* 卡牌实体（保持真实艺术原貌） */}
              <TarotCardView
                card={c.card}
                isReversed={c.isReversed}
                isFlipped={true}
                size="md"
                showDetails={true}
                lang={isEn ? 'en' : 'zh'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* AI 解读正文报告与状态反馈 */}
      <div className="w-full rounded-2xl bg-white border border-[#E4E4E7] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* 流式打字指示器 */}
        {isStreaming && (
          <div className="flex items-center gap-2 text-xs font-medium text-[#171717] bg-[#F5F5F6] border border-[#E4E4E7] px-3 py-1.5 rounded-full w-fit mb-5 animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-[#171717] animate-ping" />
            <span>
              {isEn
                ? 'Synthesizing interpretation from card positions...'
                : '正在推演牌阵与问题关联，解读生成中...'}
            </span>
          </div>
        )}

        {/* 错误提示态 */}
        {isNetworkError && !isStreaming && (
          <div className="rounded-xl border border-red-200 bg-red-50/60 p-4 mb-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div className="text-xs text-red-800 leading-relaxed">
              <p className="font-semibold">{isEn ? 'Reading generation interrupted' : '解读生成遇到异常'}</p>
              <p className="mt-0.5">
                {isEn
                  ? 'Network transmission encountered a delay. You can use New Reading to retry.'
                  : '解牌生成遇到了短暂网络波动，请点击右上角「重新占卜」重试。'}
              </p>
            </div>
          </div>
        )}

        {/* 内容空状态 */}
        {!interpretationText && !isStreaming && (
          <div className="py-10 text-center text-xs text-[#52525B]">
            {isEn ? 'Awaiting interpretation text...' : '等待解读生成...'}
          </div>
        )}

        {/* 解读报告正文 */}
        {interpretationText && !isNetworkError && (
          <MarkdownView
            content={interpretationText}
            className="text-xs sm:text-sm lg:text-[15px] leading-relaxed text-[#171717]"
          />
        )}
      </div>

      {/* 多轮追问模块 (Chat / Follow-up) */}
      {!isStreaming && !isNetworkError && (
        <div className="w-full mt-6 rounded-2xl bg-white border border-[#E4E4E7] p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#171717]" />
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#171717]">
                {isEn ? 'Follow-up Inquiry' : '向解牌视角追问'}
              </h3>
            </div>
            <span className="text-[11px] text-[#52525B]">
              {isEn ? 'Explore deeper implications of the spread' : '针对牌面深入探讨具体行动或时间线'}
            </span>
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
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#171717] text-white'
                        : 'bg-[#F5F5F6] text-[#171717] border border-[#E4E4E7]'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      msg.text ? (
                        <MarkdownView content={msg.text} className="text-xs sm:text-[13px]" />
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#52525B] animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8A8A91] inline-block" />
                          {isEn ? 'Connecting with the cards...' : '正在静心感应牌意...'}
                        </span>
                      )
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 追问输入表单 */}
          <form onSubmit={handleFollowUpSubmit} className="flex flex-col sm:flex-row gap-2">
            <label htmlFor="tarot-followup-input" className="sr-only">
              {isEn ? 'Follow-up question' : '追问内容'}
            </label>
            <input
              id="tarot-followup-input"
              type="text"
              value={followUpInput}
              onChange={e => setFollowUpInput(e.target.value)}
              placeholder={
                isEn
                  ? `e.g., "Given ${drawnCards[0]?.card.nameEn || 'the first card'}, what immediate step should I take?"`
                  : `如：“针对${drawnCards[0]?.card.nameZh || '主牌'}，我近期最需要做的一个准备是什么？”`
              }
              disabled={isAskingFollowUp}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#8A8A91] text-xs sm:text-sm text-[#171717] placeholder-[#52525B]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] focus:border-[#171717]"
            />
            <button
              type="submit"
              disabled={!followUpInput.trim() || isAskingFollowUp}
              className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-black text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer border border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEn ? 'Ask' : '追问'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
