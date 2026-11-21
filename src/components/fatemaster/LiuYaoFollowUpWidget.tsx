'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Clock, ShieldCheck, User } from 'lucide-react';
import { IChingReading } from '@/lib/metaphysics/iching';
import { usePointsGate } from '@/components/site/PointsGateProvider';

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface LiuYaoFollowUpWidgetProps {
  reading: IChingReading;
  initialQuestion: string;
  lang?: 'zh' | 'en';
}

export function LiuYaoFollowUpWidget({
  reading,
  initialQuestion,
  lang = 'zh'
}: LiuYaoFollowUpWidgetProps) {
  const isEn = lang === 'en';
  const pointsGate = usePointsGate();

  const [inputQuestion, setInputQuestion] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnswering]);

  const handleSendFollowUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputQuestion.trim();
    if (!query || isAnswering) return;

    setErrorMsg(null);

    // 1. 积分扣减（追问固定 2 积分）
    let pointsRef: string | undefined;
    if (pointsGate) {
      const consumed = await pointsGate.consume('liuyao_followup');
      if (!consumed.ok) return;
      pointsRef = consumed.ref_id;
    }

    const userMessageId = `msg-${Date.now()}`;
    const botMessageId = `bot-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 添加用户消息
    const updatedMessages: MessageItem[] = [
      ...messages,
      { id: userMessageId, role: 'user', content: query, timestamp: nowTime }
    ];
    setMessages(updatedMessages);
    setInputQuestion('');
    setIsAnswering(true);

    // 预置 AI 占位消息
    setMessages(prev => [
      ...prev,
      { id: botMessageId, role: 'assistant', content: '', timestamp: nowTime }
    ]);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/fatemaster/liuyao/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          reading,
          previous_messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          points_ref: pointsRef,
          lang
        }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || (isEn ? 'Follow-up query failed' : '追问解卦请求失败'));
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No readable stream available');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const raw = line.slice(6).trim();
            if (raw === '[DONE]') continue;
            try {
              const parsed = JSON.parse(raw);
              if (parsed.text) {
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === botMessageId
                      ? { ...msg, content: msg.content + parsed.text }
                      : msg
                  )
                );
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch {
              // 忽略单个 chunk 的解析异常
            }
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessageId
            ? { ...msg, content: (isEn ? 'Query interrupted: ' : '解卦受阻：') + msg }
            : msg
        )
      );
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="w-full mt-6 rounded-3xl bg-[#FAFAFA] border border-[#E4E4E7] p-5 sm:p-7 space-y-5">
      {/* 头部标题与 7 天保存规则提示 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-[#E4E4E7]">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#171717] text-white">
            <Sparkles size={16} />
          </span>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#171717]">
              {isEn ? 'Follow-up on This Hexagram' : '针对此卦继续叩问'}
            </h4>
            <p className="text-[11px] text-[#71717A] mt-0.5">
              {initialQuestion ? `原叩问：“${initialQuestion}” · ` : ''}
              {isEn
                ? `Grounded in ${reading.primaryHexagram.nameZh}`
                : `紧扣【${reading.primaryHexagram.nameZh}】原卦用神与动爻演进答疑`}
            </p>
          </div>
        </div>

        {/* 规则与积分标签 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-white border border-[#E4E4E7] text-[#52525B] px-2.5 py-1 rounded-full shadow-2xs">
            <span>每次追问 2 积分</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#71717A] bg-[#F4F4F5] px-2.5 py-1 rounded-full">
            <Clock size={11} />
            <span>普通用户保存 7 天 · 会员永久</span>
          </span>
        </div>
      </div>

      {/* 消息对话气泡流 */}
      {messages.length > 0 && (
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center shrink-0 text-[11px] font-serif font-bold">
                  易
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#171717] text-white rounded-br-xs'
                    : 'bg-white border border-[#E4E4E7] text-[#171717] rounded-bl-xs shadow-2xs whitespace-pre-wrap font-serif'
                }`}
              >
                {msg.content || (
                  <span className="flex items-center gap-1.5 text-[#71717A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#71717A] animate-pulse" />
                    <span>依卦象深层推演中...</span>
                  </span>
                )}
                <div
                  className={`mt-1.5 text-[9px] font-mono text-right ${
                    msg.role === 'user' ? 'text-white/60' : 'text-[#A1A1AA]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] text-[#52525B] flex items-center justify-center shrink-0 text-xs">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* 快捷追问灵感预设 */}
      {messages.length === 0 && (
        <div className="p-3.5 rounded-2xl bg-white border border-[#E4E4E7] space-y-2">
          <span className="text-[11px] font-serif font-medium text-[#71717A] flex items-center gap-1">
            <ShieldCheck size={13} />
            <span>你可以围绕原卦继续深入探讨：</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              '具体到农历哪个月份最有利？',
              '我和对方复合/合作的几率大吗？',
              '这件事有什么隐藏的暗礁需要提防？',
              '如果我选择按兵不动，局势会如何变化？'
            ].map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setInputQuestion(preset)}
                className="text-[11px] font-serif bg-[#FAFAFA] hover:bg-[#F4F4F5] text-[#171717] px-2.5 py-1 rounded-lg border border-[#E4E4E7] transition-colors cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
          {errorMsg}
        </div>
      )}

      {/* 输入与发送栏 */}
      <form onSubmit={handleSendFollowUp} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputQuestion}
            onChange={e => setInputQuestion(e.target.value)}
            placeholder={
              isEn
                ? 'Ask a specific follow-up about this hexagram...'
                : '追问卦象细节（每次扣 2 积分，普通用户保留 7 天）...'
            }
            disabled={isAnswering}
            className="w-full h-11 pl-4 pr-10 text-xs sm:text-sm bg-white border border-[#E4E4E7] rounded-2xl text-[#171717] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#171717] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={!inputQuestion.trim() || isAnswering}
          className="h-11 px-5 rounded-2xl bg-[#171717] hover:bg-[#333333] text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-sm shrink-0"
        >
          <Send size={14} />
          <span>{isAnswering ? (isEn ? 'Thinking...' : '推演中...') : (isEn ? 'Ask (-2)' : '追问 (-2)')}</span>
        </button>
      </form>
    </div>
  );
}
