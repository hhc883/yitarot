'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { usePointsGate } from '@/components/site/PointsGateProvider';
import { MarkdownView } from '@/components/common/MarkdownView';
import type { EastChartKind } from '@/lib/metaphysics/east-ai';

interface EastAiReadingPanelProps {
  kind: EastChartKind;
  titleZh: string;
  titleEn: string;
  question?: string;
  chartSummary: string;
  localFallback?: string;
  spendType?: 'liuyao' | 'bazi';
  lang?: string;
  /** 盘面变化标识（变化时自动清空旧报告） */
  resetKey?: string;
}

export function EastAiReadingPanel(props: EastAiReadingPanelProps) {
  return <EastAiReadingPanelInner key={props.resetKey} {...props} />;
}

function EastAiReadingPanelInner({
  kind,
  titleZh,
  titleEn,
  question,
  chartSummary,
  localFallback,
  spendType = 'liuyao',
  lang = 'zh',
}: EastAiReadingPanelProps) {
  const isEn = lang === 'en';
  const pointsGate = usePointsGate();
  const [aiReport, setAiReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleCopy = () => {
    if (!aiReport) return;
    navigator.clipboard.writeText(aiReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    const consumed = await pointsGate.consume(spendType);
    if (!consumed.ok) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsGenerating(true);
    setAiReport('');

    try {
      const response = await fetch('/api/east/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          kind,
          question,
          chartSummary,
          localFallback,
          lang,
          points_ref: consumed.ref_id,
        }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done || controller.signal.aborted) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') break;
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  setAiReport((prev) => prev + parsed.text);
                }
              } catch {
                // ignore partial SSE chunk
              }
            }
          }
        }
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error('East AI reading error:', err);
      if (localFallback) {
        setAiReport(localFallback);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsGenerating(false);
      }
    }
  };

  return (
    <section className="w-full mt-6 rounded-2xl bg-white border border-zinc-200 p-5 sm:p-6 text-left space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
            {isEn ? 'AI Holographic Reading' : 'AI 深度盘面解析'}
          </span>
          <h3 className="font-serif text-lg font-semibold text-zinc-900 mt-1">
            {isEn ? titleEn : titleZh}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {aiReport && (
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-full border border-zinc-300 hover:bg-zinc-50 text-zinc-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isEn ? 'Copied' : '已复制') : (isEn ? 'Copy Report' : '复制报告')}</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isGenerating
                ? (isEn ? 'Analyzing...' : 'AI 正在推演解读...')
                : (isEn ? 'Generate AI Reading' : '让 AI 深度解盘')}
            </span>
          </button>
        </div>
      </div>

      {aiReport ? (
        <MarkdownView content={aiReport} className="text-xs sm:text-sm leading-relaxed text-zinc-800" />
      ) : (
        <div className="py-4 text-center text-xs text-zinc-500">
          {isEn
            ? 'Chart is ready. Click the button above to generate a deep AI interpretation.'
            : '盘面已排定，点击上方按钮即可调用 AI 结合当前格局进行深度解盘。'}
        </div>
      )}
    </section>
  );
}
