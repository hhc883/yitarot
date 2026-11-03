'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Layers } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollytellingDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);

  // 动画节点引用
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const centralSymbolRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);
  const cardsGroupRef = useRef<HTMLDivElement>(null);
  const heroCoinRef = useRef<HTMLDivElement>(null);
  const heroTarotRef = useRef<HTMLDivElement>(null);
  const portalsFinalRef = useRef<HTMLDivElement>(null);

  // 当前激活的进度步数 (1 ~ 5)
  const [activeStep, setActiveStep] = useState<number>(1);

  useGSAP(() => {
    if (!pinStageRef.current || !containerRef.current) return;

    // 核心 GSAP 钉图滚动时间轴 (复刻 Marvis clamp(+=600%) scrub: 1.5 机制)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinStageRef.current,
        pin: true,
        scrub: 1.5,
        start: 'top top',
        end: '+=600%',
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const step = p < 0.2 ? 1 : p < 0.4 ? 2 : p < 0.6 ? 3 : p < 0.8 ? 4 : 5;
          setActiveStep(step);
        }
      }
    });

    // 1. 阶段一：太极图腾极速巨幅推进 (scale: 1 -> 6)，背景由暖纸嬗变为深邃星夜
    tl.fromTo(
      centralSymbolRef.current,
      { scale: 1, rotation: 0, opacity: 1 },
      { scale: 6.5, rotation: 90, opacity: 0, ease: 'power2.inOut', duration: 2 }
    )
      .fromTo(
        bgLayerRef.current,
        { backgroundColor: '#FAF7F2', color: '#111111' },
        { backgroundColor: '#13172E', color: '#FFFDF9', ease: 'power1.inOut', duration: 2 },
        '<'
      )
      .fromTo(
        title1Ref.current,
        { yPercent: 40, opacity: 0 },
        { yPercent: -40, opacity: 1, duration: 1.5 },
        '-=1.5'
      )
      .to(title1Ref.current, { yPercent: -120, opacity: 0, duration: 1 });

    // 2. 阶段二：铜钱与塔罗牌破空而起 (yPercent: 180 -> -10)，进入两仪四象
    tl.fromTo(
      cardsGroupRef.current,
      { yPercent: 160, opacity: 0 },
      { yPercent: 0, opacity: 1, ease: 'power3.out', duration: 2.5 }
    )
      .fromTo(
        title2Ref.current,
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.5 },
        '-=1.8'
      )
      .to(
        bgLayerRef.current,
        { backgroundColor: '#261438', duration: 2, ease: 'power1.inOut' },
        '<'
      );

    // 3. 阶段三：主轴神谕翻转定格 (中央铜钱 3D 翻飞，塔罗命运之轮金光旋转)
    tl.to(heroCoinRef.current, {
      rotationY: 720,
      scale: 1.35,
      y: -25,
      duration: 2,
      ease: 'back.out(1.5)'
    })
      .to(
        heroTarotRef.current,
        {
          rotationZ: 12,
          scale: 1.25,
          y: -20,
          duration: 2,
          ease: 'power2.out'
        },
        '<'
      )
      .to(title2Ref.current, { yPercent: -100, opacity: 0, duration: 1.2 }, '-=1');

    // 4. 阶段四：万物汇聚，背景复归明亮典雅纸感，双门入口端然落定
    tl.to(cardsGroupRef.current, {
      yPercent: -120,
      opacity: 0,
      scale: 0.8,
      duration: 2,
      ease: 'power2.in'
    })
      .to(
        bgLayerRef.current,
        { backgroundColor: '#FAF7F2', color: '#111111', duration: 2, ease: 'power1.inOut' },
        '<'
      )
      .fromTo(
        portalsFinalRef.current,
        { yPercent: 120, opacity: 0, scale: 0.88 },
        { yPercent: 0, opacity: 1, scale: 1, duration: 2.5, ease: 'back.out(1.4)' },
        '-=1.2'
      );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full">
      {/* 滚动长舞台（Pin Container 钉死全屏舞台） */}
      <div
        ref={pinStageRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between"
      >
        {/* 背景过渡色底板 */}
        <div
          ref={bgLayerRef}
          className="absolute inset-0 w-full h-full pointer-events-none transition-colors duration-300"
        />

        {/* 顶部指示状态条 */}
        <div className="relative z-30 max-w-7xl mx-auto w-full px-6 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D23] animate-pulse" />
            <span className="text-xs font-serif font-bold tracking-widest uppercase opacity-80">
              QICOSMOS · 乾坤流转长卷
            </span>
          </div>

          <div className="text-xs font-serif opacity-70">
            向下滚动页面触发深度 GSAP Scrub 叙事 ⬇️
          </div>
        </div>

        {/* 侧边 5 步进度胶囊指示器 (类似 Marvis progress-bullet--1 到 5) */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
          {[
            { step: 1, name: '混沌初开' },
            { step: 2, name: '两仪显化' },
            { step: 3, name: '数象相生' },
            { step: 4, name: '神谕定轴' },
            { step: 5, name: '双门齐开' }
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2.5 group cursor-pointer justify-end">
              <span
                className={`text-[11px] font-serif transition-opacity ${
                  activeStep === item.step ? 'opacity-100 font-bold' : 'opacity-0 group-hover:opacity-60'
                }`}
              >
                {item.name}
              </span>
              <div
                className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                  activeStep === item.step
                    ? 'bg-[#E8CF86] border-[#8C6D23] scale-125 shadow-sm'
                    : 'bg-transparent border-[#8C6D23]/40'
                }`}
              />
            </div>
          ))}
        </div>

        {/* 中央舞台核心视差层 */}
        <div className="relative z-20 flex-1 flex items-center justify-center w-full max-w-6xl mx-auto px-4">
          {/* 阶段 1：中心巨幅缩放太极印 */}
          <div
            ref={centralSymbolRef}
            className="absolute flex items-center justify-center text-7xl sm:text-8xl select-none filter drop-shadow-2xl"
          >
            ☯️
          </div>

          {/* 阶段 1 文案：混沌无极 */}
          <div
            ref={title1Ref}
            className="absolute text-center max-w-xl mx-auto pointer-events-none px-4"
          >
            <span className="text-xs font-serif tracking-widest text-[#E8CF86] uppercase block mb-2">
              THE CELESTIAL ORIGIN
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-5xl leading-tight">
              易有太极，<br />
              <span className="italic text-[#E8CF86]">是生两仪。</span>
            </h2>
            <p className="text-xs sm:text-sm mt-3 opacity-80 leading-relaxed">
              自混沌蒙昧之时，天地万象初动。一切问卜与测算，皆始于人心向内之自照。
            </p>
          </div>

          {/* 阶段 2 文案：两仪交相呼应 */}
          <div
            ref={title2Ref}
            className="absolute -top-12 text-center max-w-lg mx-auto pointer-events-none px-4"
          >
            <span className="text-xs font-serif tracking-widest text-[#E8CF86] uppercase block mb-1">
              DUAL ARCHETYPES
            </span>
            <h3 className="font-serif font-black text-2xl sm:text-4xl">
              东方以数起爻 · 西方以象明心
            </h3>
          </div>

          {/* 阶段 2 & 3：铜钱与塔罗牌破空并列组 */}
          <div
            ref={cardsGroupRef}
            className="absolute w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14"
          >
            {/* 东方代表：乾隆通宝 3D 铜钱 */}
            <div
              ref={heroCoinRef}
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-3 border-[#B8860B] bg-gradient-to-tr from-[#996515] via-[#DAA520] to-[#FFD700] p-2.5 shadow-2xl flex items-center justify-center text-center transform-style-3d"
            >
              <div className="w-full h-full rounded-full border border-[#8B6508]/60 flex items-center justify-center relative bg-[#C59B27]/90 shadow-inner">
                <div className="w-12 h-12 bg-[#FFFDF9] border border-[#8B6508] shadow-inner" />
                <span className="absolute top-2 text-xs font-serif font-black text-[#4A3B18]">乾</span>
                <span className="absolute bottom-2 text-xs font-serif font-black text-[#4A3B18]">隆</span>
                <span className="absolute left-2 text-xs font-serif font-black text-[#4A3B18]">通</span>
                <span className="absolute right-2 text-xs font-serif font-black text-[#4A3B18]">宝</span>
              </div>
            </div>

            {/* 西方代表：韦特命运之轮立体金卡 */}
            <div
              ref={heroTarotRef}
              className="w-36 h-56 sm:w-44 sm:h-64 rounded-3xl bg-[#FFFDF9] ring-2 ring-[#E8CF86] p-4 shadow-2xl flex flex-col justify-between text-[#111111]"
            >
              <div className="flex justify-between items-center text-xs text-[#8C6D23] font-serif">
                <span>X</span>
                <span>ROTA</span>
              </div>
              <div className="text-center my-auto">
                <span className="text-4xl block mb-2">🎡</span>
                <span className="font-serif font-black text-sm block">WHEEL OF FORTUNE</span>
                <span className="text-[10px] text-[#736B5E] block mt-1">命运之轮</span>
              </div>
              <div className="text-center text-[9px] text-[#8C6D23] font-serif">
                T-A-R-O
              </div>
            </div>
          </div>

          {/* 阶段 4：双门现世定格入口 (Final Portals Settle) */}
          <div
            ref={portalsFinalRef}
            className="absolute w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6 p-4"
          >
            {/* 东方周易门 */}
            <div className="p-8 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/12 shadow-xl flex flex-col justify-between text-left hover:scale-102 transition-transform">
              <div>
                <span className="text-3xl mb-2 block">☯️</span>
                <span className="text-[11px] font-serif font-semibold text-[#8C6D23] uppercase">
                  FATEMASTER.AI
                </span>
                <h4 className="font-serif font-black text-2xl text-[#111111] mb-2">
                  东方周易 · 四柱六爻
                </h4>
                <p className="text-xs text-[#5C5549] leading-relaxed">
                  24 节气换月柱排盘，乾隆通宝 3D 掷币起卦，日主元神五行调候。
                </p>
              </div>
              <Link
                href="/zh/fatemaster"
                className="mt-6 py-3 rounded-2xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-medium flex items-center justify-center gap-2"
              >
                <span>叩启周易之门</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 西方塔罗门 */}
            <div className="p-8 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/12 shadow-xl flex flex-col justify-between text-left hover:scale-102 transition-transform">
              <div>
                <span className="text-3xl mb-2 block">🔮</span>
                <span className="text-[11px] font-serif font-semibold text-[#8C6D23] uppercase">
                  TAROTIP.COM
                </span>
                <h4 className="font-serif font-black text-2xl text-[#111111] mb-2">
                  西方秘境 · 韦特塔罗
                </h4>
                <p className="text-xs text-[#5C5549] leading-relaxed">
                  78 张大阿卡纳与小阿卡纳，3D 洗牌抽牌，多位 AI 导师沉浸式解牌。
                </p>
              </div>
              <Link
                href="/zh/reading"
                className="mt-6 py-3 rounded-2xl bg-[#8C6D23] hover:bg-[#A37F29] text-[#FFFDF9] text-xs font-medium flex items-center justify-center gap-2"
              >
                <span>叩启塔罗之门</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 底部微信息 */}
        <div className="relative z-30 max-w-7xl mx-auto w-full px-6 pb-6 flex justify-between items-center text-xs opacity-60">
          <span>GSAP ScrollTrigger (pin: true, scrub: 1.5, end: +=600%)</span>
          <span>步骤 {activeStep} / 5</span>
        </div>
      </div>
    </div>
  );
}
