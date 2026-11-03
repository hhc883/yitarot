'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sparkles, RotateCcw, ArrowRight, Eye, Layers } from 'lucide-react';
import { CustomFluidCursor } from './CustomFluidCursor';

gsap.registerPlugin(useGSAP);

export function CanvasBrushDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 状态管理
  const [currentLayer, setCurrentLayer] = useState<1 | 2>(1); // 1: 东方周易, 2: 西方塔罗
  const [wipePercent, setWipePercent] = useState<number>(0);
  const [isCleared, setIsCleared] = useState<boolean>(false);
  const [cursorText, setCursorText] = useState<string>('拂！');
  const [isPointerDown, setIsPointerDown] = useState<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // 初始化或重绘画布蒙版
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || window.innerWidth;
    const height = canvas.parentElement?.clientHeight || window.innerHeight;

    // 高清屏支持 (DPR)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = 'source-over';

    // 绘制手作古宣纸质感渐变
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (currentLayer === 1) {
      grad.addColorStop(0, '#F5EDE0');
      grad.addColorStop(0.5, '#EFE4D2');
      grad.addColorStop(1, '#E6D7BE');
    } else {
      grad.addColorStop(0, '#EAE5F2');
      grad.addColorStop(0.5, '#E2D9EC');
      grad.addColorStop(1, '#D8CCE4');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 绘制淡金墨晕纹理与边框暗纹
    ctx.strokeStyle = 'rgba(140, 109, 35, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    ctx.strokeRect(24, 24, width - 48, height - 48);

    // 绘制宣纸中央召唤印文
    ctx.fillStyle = '#111111';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 26px "Noto Serif SC", serif';
    const mainText = currentLayer === 1 ? '心有所念 · 拂尘见卦' : '星轨流转 · 拭净星尘';
    ctx.fillText(mainText, width / 2, height / 2 - 20);

    ctx.fillStyle = '#8C6D23';
    ctx.font = '500 13px sans-serif';
    ctx.fillText('按住鼠标或在屏幕上滑动 · 拂开迷雾显化天机', width / 2, height / 2 + 20);

    // 绘制微光指示圆圈
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 70, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(232, 207, 134, 0.4)';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    setWipePercent(0);
    setIsCleared(false);
    setCursorText(currentLayer === 1 ? '拂！' : '再拂！');
  }, [currentLayer]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  // 计算擦拭比例 (采样优化，跳跃采样保证高帧率)
  const calculateErasedRatio = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isCleared) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let transparentCount = 0;
    const stride = 32 * 4; // 采样步进
    const totalSamples = data.length / stride;

    for (let i = 3; i < data.length; i += stride) {
      if (data[i] < 128) {
        transparentCount++;
      }
    }

    const ratio = Math.round((transparentCount / totalSamples) * 100);
    setWipePercent(ratio);

    // 当擦拭达到 40% 时，触发类似 Marvis clearCircle 的极光扩散清屏
    if (ratio >= 40 && !isCleared) {
      triggerCircleClear();
    }
  }, [isCleared]);

  // 极光扩散圆全清 (Marvis 核心动效：clearCircle)
  const triggerCircleClear = () => {
    setIsCleared(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || window.innerWidth;
    const height = canvas.parentElement?.clientHeight || window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    const maxRadius = Math.hypot(width, height);
    const animObj = { r: 50 };

    gsap.to(animObj, {
      r: maxRadius,
      duration: 0.85,
      ease: 'power2.inOut',
      onUpdate: () => {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc((width / 2) * dpr, (height / 2) * dpr, animObj.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      },
      onComplete: () => {
        setWipePercent(100);
        setCursorText('已显化 ✨');
      }
    });
  };

  // 画笔绘制插值（防止快速挥动断线）
  const eraseAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isCleared) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.globalCompositeOperation = 'destination-out';

    const brushRadius = 75; // 柔化羽化画笔半径

    const drawCircle = (cx: number, cy: number) => {
      const grad = ctx.createRadialGradient(
        cx * dpr,
        cy * dpr,
        brushRadius * 0.2 * dpr,
        cx * dpr,
        cy * dpr,
        brushRadius * dpr
      );
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(0.7, 'rgba(0,0,0,0.8)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx * dpr, cy * dpr, brushRadius * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    if (lastPointRef.current) {
      const dist = Math.hypot(x - lastPointRef.current.x, y - lastPointRef.current.y);
      const steps = Math.ceil(dist / 12);
      for (let i = 0; i < steps; i++) {
        const ix = lastPointRef.current.x + ((x - lastPointRef.current.x) * i) / steps;
        const iy = lastPointRef.current.y + ((y - lastPointRef.current.y) * i) / steps;
        drawCircle(ix, iy);
      }
    } else {
      drawCircle(x, y);
    }

    lastPointRef.current = { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPointerDown(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      eraseAt(x, y);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      eraseAt(x, y);
      calculateErasedRatio();
    }
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
    lastPointRef.current = null;
    calculateErasedRatio();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-[#FFFDF9] ring-1 ring-[#111111]/15 select-none"
      style={{ height: '620px' }}
    >
      {/* 自定义灵动光标 */}
      <CustomFluidCursor label={cursorText} variant="brush" />

      {/* 1. 底层真容舞台 (Revealed Underneath Stage) */}
      <div className="absolute inset-0 w-full h-full p-8 sm:p-12 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EC]">
        {currentLayer === 1 ? (
          /* 第一层底层：东方周易太极铜钱神谕 */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE59A]/40 text-[#8C6D23] border border-[#E8CF86]/50 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 东方周易神谕显化
            </div>

            <div className="relative flex items-center justify-center py-4">
              {/* 慢旋太极图 */}
              <div className="w-36 h-36 rounded-full border-2 border-[#8C6D23]/30 bg-[#FFFDF9] shadow-inner flex items-center justify-center text-6xl animate-[spin_24s_linear_infinite]">
                ☯️
              </div>

              {/* 围绕太极浮动的乾隆通宝铜钱 */}
              <div className="absolute -top-2 -left-6 w-16 h-16 rounded-full border border-[#B8860B] bg-gradient-to-tr from-[#996515] to-[#FFD700] p-1 shadow-md flex items-center justify-center text-[10px] font-serif font-black text-[#4A3B18]">
                乾隆通宝
              </div>
              <div className="absolute -bottom-2 -right-6 w-16 h-16 rounded-full border border-[#B8860B] bg-gradient-to-tr from-[#996515] to-[#FFD700] p-1 shadow-md flex items-center justify-center text-[10px] font-serif font-black text-[#4A3B18]">
                乾隆通宝
              </div>
            </div>

            <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#111111]">
              【乾为天 · 飞龙在天】
            </h3>
            <p className="max-w-lg text-xs sm:text-sm text-[#5C5549] leading-relaxed">
              天行健，君子以自强不息。初爻至上爻六位纯阳，得此卦者如日中天，宜秉持中正自强，以博大胸襟承托天地大任。
            </p>

            <button
              onClick={() => {
                setCurrentLayer(2);
                setIsCleared(false);
              }}
              className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-medium flex items-center gap-2 shadow-md transition-all hover:scale-103 cursor-pointer"
            >
              <span>继续拂开第二层：西方塔罗秘境</span>
              <ArrowRight className="w-4 h-4 text-[#FFE59A]" />
            </button>
          </div>
        ) : (
          /* 第二层底层：西方经典塔罗神启 */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A9D3FF]/30 text-[#1D4ED8] border border-[#93C5FD]/50 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 西方原型塔罗显化
            </div>

            {/* 3 张悬浮韦特塔罗牌 */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="w-24 h-36 rounded-2xl bg-[#FFFDF9] ring-2 ring-[#E8CF86] p-2 shadow-lg flex flex-col justify-between transform -rotate-6 hover:rotate-0 transition-transform">
                <span className="text-xl">🌟</span>
                <span className="font-serif font-bold text-[11px] text-[#111111]">0 愚人</span>
                <span className="text-[9px] text-[#736B5E]">纯粹本真</span>
              </div>
              <div className="w-28 h-42 rounded-2xl bg-[#FFFDF9] ring-2 ring-[#8C6D23] p-2 shadow-2xl flex flex-col justify-between transform -translate-y-2 hover:scale-105 transition-transform">
                <span className="text-2xl">🎡</span>
                <span className="font-serif font-black text-xs text-[#8C6D23]">X 命运之轮</span>
                <span className="text-[9px] text-[#111111] font-medium">顺应因果</span>
              </div>
              <div className="w-24 h-36 rounded-2xl bg-[#FFFDF9] ring-2 ring-[#E8CF86] p-2 shadow-lg flex flex-col justify-between transform rotate-6 hover:rotate-0 transition-transform">
                <span className="text-xl">☀️</span>
                <span className="font-serif font-bold text-[11px] text-[#111111]">XIX 太阳</span>
                <span className="text-[9px] text-[#736B5E]">至明至朗</span>
              </div>
            </div>

            <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#111111]">
              【命运之轮 · Wheel of Fortune】
            </h3>
            <p className="max-w-lg text-xs sm:text-sm text-[#5C5549] leading-relaxed">
              因缘际会，四序流转。世间一切境遇皆在动态演化中。心怀坦荡，顺流而动，转机即在眼前。
            </p>

            <button
              onClick={() => {
                setCurrentLayer(1);
                setIsCleared(false);
              }}
              className="px-6 py-2.5 rounded-full bg-[#8C6D23] hover:bg-[#A37F29] text-[#FFFDF9] text-xs font-medium flex items-center gap-2 shadow-md transition-all hover:scale-103 cursor-pointer"
            >
              <span>切回第一层：东方周易神谕</span>
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. 顶层 Canvas 蒙版 (可擦拭图层) */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`absolute inset-0 w-full h-full z-20 cursor-crosshair transition-opacity duration-700 ${
          isCleared ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      />

      {/* 3. 顶部交互与状态控制条 */}
      <div className="absolute top-4 inset-x-6 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3 py-1 rounded-full bg-[#111111]/80 backdrop-blur-md text-[#FFFDF9] text-[11px] font-medium flex items-center gap-1.5 shadow-sm">
            <Eye className="w-3.5 h-3.5 text-[#FFE59A]" />
            <span>已拂开：{wipePercent}%</span>
          </span>
          <span className="text-[11px] text-[#736B5E] hidden sm:inline">
            （拂开满 40% 自动如水波圆满散开）
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {!isCleared && (
            <button
              onClick={triggerCircleClear}
              className="px-3 py-1 rounded-full bg-white/80 hover:bg-white text-[#111111] ring-1 ring-[#111111]/10 text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              跳过拂尘 (Skip)
            </button>
          )}

          <button
            onClick={initCanvas}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-[#111111] ring-1 ring-[#111111]/10 shadow-xs transition-colors cursor-pointer"
            title="重新封印迷雾"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
