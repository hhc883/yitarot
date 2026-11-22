'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, X, Sparkles, RotateCcw, AlertCircle, ArrowRight } from 'lucide-react';
import { usePointsGate } from '@/components/site/PointsGateProvider';
import { MarkdownView } from '@/components/common/MarkdownView';
import { saveReading } from '@/lib/storage/reading-history';

interface HexagramVisionWidgetProps {
  lang?: string;
}

export function HexagramVisionWidget({ lang = 'zh' }: HexagramVisionWidgetProps) {
  const isEn = lang === 'en';
  const pointsGate = usePointsGate();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [isReading, setIsReading] = useState<boolean>(false);
  const [readingResult, setReadingResult] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 识图解卦完成自动存入用户档案
  useEffect(() => {
    if (readingResult && !isReading && !readingResult.includes('失败')) {
      saveReading({
        type: 'liuyao',
        title: isEn ? 'Vision I Ching Oracle' : '视觉识图六爻解卦',
        question: question || (isEn ? 'Hexagram chart image analysis' : '卦象排盘图解析'),
        summary: readingResult.slice(0, 140) + '...',
        fullContent: readingResult
      });
    }
  }, [readingResult, isReading, question, isEn]);

  // 处理文件读取
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg(isEn ? 'Please upload an image file (PNG, JPG, WebP).' : '请上传有效的图片格式文件（PNG、JPG、WebP）。');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg(isEn ? 'Image size cannot exceed 8MB.' : '图片体积不能超过 8MB。');
      return;
    }

    setErrorMsg(null);
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setReadingResult('');
    };
    reader.readAsDataURL(file);
  }, [isEn]);

  // 全局 / 局部剪贴板粘贴监听（支持直接 Ctrl+V 粘贴截图）
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFile]);

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setFileName('');
    setFileSize('');
    setReadingResult('');
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 开始 AI 视觉识卦推演
  const handleStartVisionReading = async () => {
    if (!imagePreview) return;
    setIsReading(true);
    setReadingResult('');
    setErrorMsg(null);

    let pointsRef: string | undefined;
    if (pointsGate) {
      const consumed = await pointsGate.consume('liuyao');
      if (!consumed.ok) {
        setIsReading(false);
        return;
      }
      pointsRef = consumed.ref_id;
    }

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/east/liuyao/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imagePreview,
          question: question.trim(),
          lang: isEn ? 'en' : 'zh',
          points_ref: pointsRef
        }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || (isEn ? 'Vision reading failed' : '识图解卦请求失败'));
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
                setReadingResult((prev) => prev + parsed.text);
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch {
              // Ignore non-json chunk
            }
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* 识卦操作卡片 */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-serif font-medium text-[#171717] tracking-tight">
            {isEn ? 'Upload or Paste Hexagram Screenshot' : '上传或粘贴卦象截图'}
          </h2>
          <p className="mt-1 text-xs text-[#52525B] leading-relaxed">
            {isEn
              ? 'Supports screenshots from other divination apps, manual charts, or coin toss photos. You can press Ctrl+V directly to paste.'
              : '支持其他排盘软件截图、手写卦象单或铜钱照片。支持直接使用 Ctrl+V 快捷粘贴截图。'}
          </p>
        </div>

        {/* 上传区域 */}
        {!imagePreview ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-3 ${
              isDragOver
                ? 'border-[#171717] bg-[#F4F4F5]'
                : 'border-[#E4E4E7] hover:border-[#71717A] bg-[#FAFAFA]'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#E4E4E7] flex items-center justify-center text-[#171717]">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#171717]">
                {isEn ? 'Click to upload or drag image here' : '点击上传，或将截图拖拽至此处'}
              </p>
              <p className="mt-1 text-xs text-[#71717A]">
                {isEn ? 'Supports PNG, JPG, WebP (Max 8MB)' : '支持 PNG、JPG、WebP 格式（最大 8MB）'}
              </p>
            </div>
            <div className="mt-2 text-[11px] font-mono text-[#52525B] bg-[#FFFFFF] border border-[#E4E4E7] px-3 py-1 rounded-full">
              {isEn ? 'Tip: You can press Ctrl+V to paste screenshot directly' : '💡 提示：截图后直接按 Ctrl+V 即可秒速粘贴'}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </div>
        ) : (
          /* 已上传预览 */
          <div className="p-4 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#171717]">
                <ImageIcon size={14} />
                <span className="font-medium truncate max-w-xs">{fileName || (isEn ? 'Pasted Screenshot' : '已粘贴截图')}</span>
                {fileSize && <span className="text-[#71717A]">({fileSize})</span>}
              </div>
              <button
                type="button"
                onClick={handleClearImage}
                disabled={isReading}
                className="text-xs text-[#71717A] hover:text-[#171717] flex items-center gap-1 p-1"
              >
                <X size={14} />
                <span>{isEn ? 'Remove' : '重新选择'}</span>
              </button>
            </div>

            <div className="relative max-h-72 overflow-hidden rounded-lg border border-[#E4E4E7] bg-black/5 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Uploaded Hexagram Screenshot"
                className="max-h-72 w-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* 提问框 */}
        <div className="space-y-1.5">
          <label className="block text-xs font-serif font-medium text-[#52525B]">
            {isEn ? 'Specific Question / Context (Optional)' : '想问的具体问题或关切点（选填）'}
          </label>
          <input
            type="text"
            placeholder={
              isEn
                ? 'e.g. Career switch prospects, negotiation turning point...'
                : '例如：最近换工作的吉凶走向、重要商务谈判的转机在哪...'
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isReading}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E4E4E7] rounded-lg focus:outline-hidden focus:border-[#171717] text-[#171717] placeholder:text-[#A1A1AA]"
          />
        </div>

        {/* 错误提示 */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50/50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 触发按钮 */}
        <button
          type="button"
          onClick={handleStartVisionReading}
          disabled={!imagePreview || isReading}
          className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm ${
            !imagePreview || isReading
              ? 'bg-[#E4E4E7] text-[#A1A1AA] cursor-not-allowed'
              : 'bg-[#171717] text-white hover:bg-black'
          }`}
        >
          {isReading ? (
            <>
              <Sparkles size={14} className="animate-spin text-white" />
              <span>{isEn ? 'Gemini Vision Analyzing Hexagram...' : 'AI 视觉排盘辨爻中...'}</span>
            </>
          ) : (
            <>
              <span>{isEn ? 'Analyze Hexagram Screenshot' : '开始 AI 视觉识卦解卦'}</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>

      {/* 解卦结果展示区 */}
      {readingResult && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#171717] shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-[#F4F4F5]">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#171717]" />
              <h3 className="font-serif text-lg font-medium text-[#171717] tracking-tight">
                {isEn ? 'AI Vision Oracle Analysis' : 'AI 视觉识图解卦报告'}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClearImage}
              className="text-xs text-[#71717A] hover:text-[#171717] flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>{isEn ? 'New Reading' : '重新起卦'}</span>
            </button>
          </div>

          <MarkdownView
            content={readingResult}
            className="text-xs sm:text-[13.5px] leading-relaxed text-[#171717]"
          />
        </div>
      )}
    </div>
  );
}
