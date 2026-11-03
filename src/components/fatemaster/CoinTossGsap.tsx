'use client';

import React, { useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  CoinTossLine,
  IChingReading,
  tossCoins,
  getHexagramByBinary,
  HexagramData
} from '@/lib/metaphysics/iching';
import { Sparkles, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(useGSAP);

interface CoinTossGsapProps {
  onReadingReady?: (reading: IChingReading) => void;
  lang?: string;
}

export function CoinTossGsap({ onReadingReady, lang = 'zh' }: CoinTossGsapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const coin1Ref = useRef<HTMLDivElement>(null);
  const coin2Ref = useRef<HTMLDivElement>(null);
  const coin3Ref = useRef<HTMLDivElement>(null);
  const linesBoardRef = useRef<HTMLDivElement>(null);

  const [question, setQuestion] = useState('我近期的事业合作与重大决策，走向与转机如何？');
  const [currentLine, setCurrentLine] = useState<number>(0); // 0 to 6
  const [lines, setLines] = useState<CoinTossLine[]>([]);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [displayCoins, setDisplayCoins] = useState<[number, number, number]>([3, 3, 2]);
  const [reading, setReading] = useState<IChingReading | null>(null);
  const [aiReport, setAiReport] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // GSAP 掷币抛掷物理时间轴
  const handleCastNextLine = useCallback(() => {
    if (currentLine >= 6 || isFlipping) return;

    setIsFlipping(true);
    const coins = tossCoins();
    setDisplayCoins(coins);

    const coinEls = [coin1Ref.current, coin2Ref.current, coin3Ref.current].filter(Boolean);

    // GSAP 抛掷抛物线与 3D 翻滚
    const tl = gsap.timeline({
      onComplete: () => {
        const sum = coins[0] + coins[1] + coins[2];
        const isYang = sum === 7 || sum === 9;
        const isChanging = sum === 6 || sum === 9;
        const changedYang = sum === 6 ? true : sum === 9 ? false : isYang;

        const newLine: CoinTossLine = {
          lineIndex: currentLine + 1,
          coins,
          sum,
          isYang,
          isChanging,
          changedYang
        };

        const updatedLines = [...lines, newLine];
        setLines(updatedLines);
        setCurrentLine(currentLine + 1);
        setIsFlipping(false);

        // 如果已满 6 爻，完成定卦
        if (currentLine + 1 === 6) {
          let pBinary = '';
          let tBinary = '';
          const changingIndices: number[] = [];

          updatedLines.forEach(l => {
            pBinary += l.isYang ? '1' : '0';
            tBinary += l.changedYang ? '1' : '0';
            if (l.isChanging) changingIndices.push(l.lineIndex);
          });

          const pGua = getHexagramByBinary(pBinary) || {
            number: 1,
            binary: '111111',
            symbol: '䷀',
            nameZh: '乾为天',
            pinyin: 'Qián',
            nameEn: 'The Creative',
            upperTrigram: '乾',
            lowerTrigram: '乾',
            judgmentZh: '元亨利贞。天行健，君子以自强不息。',
            judgmentEn: 'Sublime success through perseverance.',
            imageZh: '天行健，君子以自强不息。',
            imageEn: 'Heaven moves with ceaseless power.',
            careerAdviceZh: '大展宏图的巅峰机遇期，凡事依道而行。',
            careerAdviceEn: 'A golden window for launching bold ventures.',
            relationshipAdviceZh: '坦荡相待，以正道感化对方。',
            relationshipAdviceEn: 'Honesty and mutual respect.'
          };

          const tGua = changingIndices.length > 0 ? getHexagramByBinary(tBinary) || null : null;

          const completeReading: IChingReading = {
            lines: updatedLines,
            primaryHexagram: pGua,
            transformedHexagram: tGua,
            changingLineIndices: changingIndices
          };

          setReading(completeReading);
          if (onReadingReady) onReadingReady(completeReading);
        }
      }
    });

    coinEls.forEach((el, i) => {
      const isHeads = coins[i] === 3;
      const targetRotateX = isHeads ? 720 : 900;
      const targetRotateY = (i === 1 ? -1 : 1) * 540;

      tl.to(
        el,
        {
          y: -110 - Math.random() * 30,
          rotationX: `+=${targetRotateX}`,
          rotationY: `+=${targetRotateY}`,
          rotationZ: `+=${(Math.random() - 0.5) * 60}`,
          scale: 1.15,
          duration: 0.45 + i * 0.05,
          ease: 'power2.out'
        },
        i * 0.04
      ).to(
        el,
        {
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'bounce.out'
        },
        '-=0.1'
      );
    });
  }, [currentLine, isFlipping, lines, onReadingReady]);

  // 重置起卦
  const handleReset = () => {
    setCurrentLine(0);
    setLines([]);
    setReading(null);
    setIsFlipping(false);
    setAiReport('');
  };

  // 生成 AI 六爻断卦报告（支持 SSE 流式推演）
  const handleGenerateAiReport = async () => {
    if (!reading) return;
    setIsGeneratingAi(true);
    setAiReport('');

    try {
      const response = await fetch('/api/fatemaster/liuyao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          reading
        })
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') break;
              try {
                const data = JSON.parse(jsonStr);
                if (data.text) {
                  setAiReport(prev => prev + data.text);
                }
              } catch {
                // ignore
              }
            }
          }
        }
      } else {
        throw new Error('API unavailable');
      }
    } catch {
      // 本地离线备用
      const p = reading.primaryHexagram;
      const t = reading.transformedHexagram;
      const fallbackText = `针对你所叩问之事：**“${question}”**，铜钱六掷，神谕已成。

---

### ䷀ 卦象全景与当下时势
本卦得**【${p.nameZh}】**（${p.upperTrigram}上 / ${p.lowerTrigram}下）。
> *“${p.judgmentZh}”*
大象传云：*“${p.imageZh}”*
当前事情正处于【${p.nameZh}】的节律之中，整体气场反映出内在能量正在蓄势或面临方向上的重新校准。

---

### 🔍 卦爻辞深层映射
${reading.lines.map(l => `- 第 ${l.lineIndex} 爻（${l.isYang ? '阳' : '阴'}${l.isChanging ? ' · 动爻 ⚡' : ''}）：得数 ${l.sum}，${l.isChanging ? '主此阶段发生核心转折' : '气象平稳'}。`).join('\n')}

${t ? `### ⚡ 变卦走向：【${t.nameZh}】
动爻引动气场流转，变卦显化为**【${t.nameZh}】**。
> *“${t.judgmentZh}”*
这预示着经过初期的磨合与动荡后，事情将朝着${t.nameZh}所示的方向演进。` : '六爻安静，纯守本卦，宜稳扎稳打。'}

---

### 🧭 破局行动指南
- 💡 **宜（Do）**：${p.careerAdviceZh} 保持诚笃守正的心态，凡事提前谋篇布局。
- ⚠️ **忌（Don't）**：切忌急功近利、在情绪未定之时强行推进行动。

---

### ✨ 易道天心箴言
> *“天地感而万物化生，圣人感人心而天下和平。顺应大势所趋，吉无不利。”*`;

      let i = 0;
      const timer = setInterval(() => {
        i += 8;
        setAiReport(fallbackText.slice(0, i));
        if (i >= fallbackText.length) {
          clearInterval(timer);
        }
      }, 20);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* 提问框 */}
      <div className="w-full max-w-2xl mb-8 p-5 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 shadow-xs">
        <label className="block text-xs font-semibold text-[#8C6D23] mb-2">
          ☯️ 凝神默念心事，向周易六十四卦叩问
        </label>
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="如：当前的项目合作是否存在隐性阻力？如何转危为安？"
          className="w-full px-4 py-3 rounded-2xl bg-[#FAF6ED] ring-1 ring-[#111111]/10 text-sm text-[#111111] placeholder-[#736B5E]/50 focus:outline-hidden focus:ring-[#C29026]"
        />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* 左侧：3D 铜钱抛掷台 */}
        <div className="md:col-span-7 flex flex-col items-center p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 shadow-xs text-center">
          <div className="flex items-center justify-between w-full mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFE59A]/40 text-[#8C6D23] border border-[#E8CF86]/50">
              乾隆通宝 · 金钱起卦法
            </span>
            <span className="text-xs text-[#736B5E]">
              {currentLine === 6 ? '六爻已成' : `第 ${currentLine + 1} 爻 / 共 6 爻`}
            </span>
          </div>

          {/* 铜钱展示区 (3D 抛掷台) */}
          <div className="relative w-full h-44 sm:h-52 flex items-center justify-center gap-4 sm:gap-6 my-2 perspective-1000">
            {/* 铜钱阴影台面 */}
            <div className="absolute bottom-4 inset-x-8 h-8 rounded-full bg-[#111111]/5 blur-md pointer-events-none" />

            {/* 三枚乾隆通宝铜钱 */}
            {[
              { ref: coin1Ref, val: displayCoins[0] },
              { ref: coin2Ref, val: displayCoins[1] },
              { ref: coin3Ref, val: displayCoins[2] }
            ].map((coin, idx) => {
              const isYang = coin.val === 3;
              return (
                <div
                  key={idx}
                  ref={coin.ref}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#B8860B] bg-gradient-to-tr from-[#996515] via-[#DAA520] to-[#FFD700] p-1.5 shadow-md flex items-center justify-center text-center select-none transform-style-3d cursor-pointer"
                  onClick={currentLine < 6 ? handleCastNextLine : undefined}
                >
                  {/* 外圆内方铜钱纹样 */}
                  <div className="w-full h-full rounded-full border border-[#8B6508]/60 flex items-center justify-center relative bg-[#C59B27]/90 shadow-inner">
                    {/* 方孔 */}
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#FFFDF9] border border-[#8B6508] shadow-inner" />
                    {/* 乾隆通宝四字 */}
                    <span className="absolute top-1 text-[9px] sm:text-[10px] font-serif font-black text-[#4A3B18]">
                      乾
                    </span>
                    <span className="absolute bottom-1 text-[9px] sm:text-[10px] font-serif font-black text-[#4A3B18]">
                      隆
                    </span>
                    <span className="absolute left-1 text-[9px] sm:text-[10px] font-serif font-black text-[#4A3B18]">
                      通
                    </span>
                    <span className="absolute right-1 text-[9px] sm:text-[10px] font-serif font-black text-[#4A3B18]">
                      宝
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 掷币按钮与状态 */}
          <div className="w-full mt-6 flex flex-col items-center gap-3">
            {currentLine < 6 ? (
              <button
                onClick={handleCastNextLine}
                disabled={isFlipping}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-103 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FFE59A]" />
                <span>{isFlipping ? '铜钱飞掷流转中...' : `掷出第 ${currentLine + 1} 爻`}</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> 六爻圆满，卦象已定
                </span>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-[#FAF6ED] hover:bg-[#F2ECE1] text-[#111111] transition-colors ring-1 ring-[#111111]/10 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> 重新起卦
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：六爻逐层筑构面板 */}
        <div
          ref={linesBoardRef}
          className="md:col-span-5 flex flex-col p-6 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 shadow-xs"
        >
          <div className="flex items-center justify-between mb-4 border-b border-[#111111]/8 pb-2">
            <h4 className="font-serif font-bold text-sm text-[#111111]">六爻层递图谱</h4>
            <span className="text-[11px] text-[#736B5E]">自下而上（初爻至上爻）</span>
          </div>

          {/* 6 爻画线区（倒序排列：第6爻在最上，第1爻在最下） */}
          <div className="flex flex-col-reverse gap-2.5 my-2">
            {[1, 2, 3, 4, 5, 6].map(idx => {
              const lineData = lines.find(l => l.lineIndex === idx);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#FAF6ED] ring-1 ring-[#111111]/5 text-xs"
                >
                  <span className="font-serif text-[11px] text-[#736B5E] w-12">
                    {idx === 1 ? '初爻' : idx === 6 ? '上爻' : `第 ${idx} 爻`}
                  </span>

                  {/* 爻线图形 */}
                  <div className="flex-1 flex justify-center px-2">
                    {lineData ? (
                      lineData.isYang ? (
                        /* 阳爻 ⚊ */
                        <div className="h-2 w-28 bg-[#111111] rounded-xs relative flex items-center justify-center">
                          {lineData.isChanging && (
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white absolute" />
                          )}
                        </div>
                      ) : (
                        /* 阴爻 ⚋ */
                        <div className="flex gap-2 items-center justify-center">
                          <div className="h-2 w-12 bg-[#111111] rounded-xs" />
                          {lineData.isChanging && (
                            <span className="text-[10px] text-rose-600 font-bold">✕</span>
                          )}
                          <div className="h-2 w-12 bg-[#111111] rounded-xs" />
                        </div>
                      )
                    ) : (
                      /* 未掷爻占位虚线 */
                      <div className="h-2 w-28 border-b-2 border-dashed border-[#111111]/20" />
                    )}
                  </div>

                  <span className="text-[10px] text-[#8C6D23] font-medium w-14 text-right">
                    {lineData
                      ? lineData.sum === 9
                        ? '老阳 ⚡'
                        : lineData.sum === 6
                        ? '老阴 ⚡'
                        : lineData.sum === 7
                        ? '少阳'
                        : '少阴'
                      : '等待掷币'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 卦象结果精要提示 */}
          {reading && (
            <div className="mt-4 pt-3 border-t border-[#111111]/8 text-center animate-in fade-in">
              <div className="text-3xl my-1">{reading.primaryHexagram.symbol}</div>
              <span className="font-serif font-black text-base text-[#111111]">
                {reading.primaryHexagram.nameZh}
              </span>
              <p className="text-[11px] text-[#5C5549] mt-1 line-clamp-2">
                {reading.primaryHexagram.judgmentZh}
              </p>

              {reading.transformedHexagram && (
                <div className="mt-2 text-xs text-rose-700 bg-rose-50 p-2 rounded-xl">
                  动爻化卦：<strong>{reading.transformedHexagram.nameZh}</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI 六爻全息神谕报告 */}
      {reading && (
        <div className="w-full mt-8 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/10 p-6 sm:p-8 shadow-xs text-left animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                周易六爻 · AI 神谕解卦
              </span>
              <h4 className="font-serif font-black text-xl text-[#111111] mt-1">
                【{reading.primaryHexagram.nameZh}】神谕全息洞察
              </h4>
            </div>

            <button
              onClick={handleGenerateAiReport}
              disabled={isGeneratingAi}
              className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFE59A]" />
              <span>{isGeneratingAi ? 'AI 正在依卦辞断爻...' : '让 AI 深度解卦'}</span>
            </button>
          </div>

          {aiReport ? (
            <div className="prose prose-stone max-w-none text-[#111111] text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line border-t border-[#111111]/8 pt-6 animate-in fade-in">
              {aiReport}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#736B5E] border-t border-[#111111]/8">
              铜钱六爻已排定。点击上方按钮，让 AI 依据你叩问之事，结合本卦、动爻与变卦提供深层决策建议。
            </div>
          )}
        </div>
      )}
    </div>
  );
}
