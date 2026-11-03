'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, ChevronDown } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface MasterScrollytellingHeroProps {
  lang?: string;
}

export function MasterScrollytellingHero({ lang = 'zh' }: MasterScrollytellingHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);

  // 动画图层与节点
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const centralSymbolRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);
  const cardsGroupRef = useRef<HTMLDivElement>(null);
  const heroCoinRef = useRef<HTMLDivElement>(null);
  const heroTarotRef = useRef<HTMLDivElement>(null);
  const portalsFinalRef = useRef<HTMLDivElement>(null);

  // 5 步步进状态
  const [activeStep, setActiveStep] = useState<number>(1);

  useGSAP(() => {
    if (!pinStageRef.current || !containerRef.current) return;

    // 响应式滚动配置 (Desktop +=600%, Mobile +=450%)
    const isMobile = window.innerWidth < 768;
    const endDistance = isMobile ? '+=450%' : '+=600%';
    const zoomScale = isMobile ? 4.5 : 6.8;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinStageRef.current,
        pin: true,
        scrub: 1.4,
        start: 'top top',
        end: endDistance,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const step = p < 0.2 ? 1 : p < 0.4 ? 2 : p < 0.6 ? 3 : p < 0.8 ? 4 : 5;
          setActiveStep(step);
        }
      }
    });

    // 1. 阶段一：太极图腾极速巨幅推进 (scale: 1 -> 6.8)，背景自暖纸色嬗变为深夜星空
    tl.fromTo(
      centralSymbolRef.current,
      { scale: 1, rotation: 0, opacity: 1 },
      { scale: zoomScale, rotation: 90, opacity: 0, ease: 'power2.inOut', duration: 2 }
    )
      .fromTo(
        bgLayerRef.current,
        { backgroundColor: '#FAF7F2', color: '#111111' },
        { backgroundColor: '#111528', color: '#FFFDF9', ease: 'power1.inOut', duration: 2 },
        '<'
      )
      .fromTo(
        title1Ref.current,
        { yPercent: 40, opacity: 0 },
        { yPercent: -40, opacity: 1, duration: 1.5 },
        '-=1.5'
      )
      .to(title1Ref.current, { yPercent: -120, opacity: 0, duration: 1 });

    // 2. 阶段二：铜钱与塔罗牌破空而起 (yPercent: 160 -> 0)，两仪显化
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
      scale: isMobile ? 1.15 : 1.35,
      y: isMobile ? -10 : -25,
      duration: 2,
      ease: 'back.out(1.5)'
    })
      .to(
        heroTarotRef.current,
        {
          rotationZ: 12,
          scale: isMobile ? 1.1 : 1.25,
          y: isMobile ? -10 : -20,
          duration: 2,
          ease: 'power2.out'
        },
        '<'
      )
      .to(title2Ref.current, { yPercent: -100, opacity: 0, duration: 1.2 }, '-=1');

    // 4. 阶段四 & 五：万象汇通，背景回归温润治愈手作纸感，双门大开端然落定
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

  const stepsData = [
    { step: 1, nameZh: '混沌初开', nameEn: 'The Void' },
    { step: 2, nameZh: '两仪显化', nameEn: 'Dual Archetypes' },
    { step: 3, nameZh: '数象相生', nameEn: 'Oracle Resonance' },
    { step: 4, nameZh: '神谕定轴', nameEn: 'Cosmic Alignment' },
    { step: 5, nameZh: '双门齐开', nameEn: 'Dual Portals' }
  ];

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden">
      {/* 滚动长舞台（Pin Container 钉死全屏舞台） */}
      <div
        ref={pinStageRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between"
      >
        {/* 背景过渡色底板 (暖米色 -> 深邃星夜 -> 灵性紫金 -> 暖米色) */}
        <div
          ref={bgLayerRef}
          className="absolute inset-0 w-full h-full pointer-events-none transition-colors duration-300"
        />

        {/* 顶部标语与滚动提示 */}
        <div className="relative z-30 max-w-7xl mx-auto w-full px-5 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D23] animate-pulse" />
            <span className="text-xs font-serif font-black tracking-widest uppercase opacity-80">
              QICOSMOS · {lang === 'zh' ? '乾坤流转长卷' : 'COSMIC CONTINUUM'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-serif opacity-75 animate-bounce">
            <span>{lang === 'zh' ? '向下滚动，启幕乾坤' : 'Scroll down to explore'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 侧边 5 步进度胶囊指示器 (类似 Marvis progress-bullet--1 到 5) */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 pointer-events-none">
          {stepsData.map((item) => (
            <div key={item.step} className="flex items-center gap-2.5 justify-end">
              <span
                className={`text-[11px] font-serif transition-opacity duration-300 ${
                  activeStep === item.step ? 'opacity-100 font-bold text-[#8C6D23]' : 'opacity-0'
                }`}
              >
                {lang === 'zh' ? item.nameZh : item.nameEn}
              </span>
              <div
                className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                  activeStep === item.step
                    ? 'bg-[#E8CF86] border-[#8C6D23] scale-135 shadow-sm'
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
              {lang === 'zh' ? '✦ 混沌初开 · 天人之镜 ✦' : '✦ THE CELESTIAL ORIGIN ✦'}
            </span>
            <h1 className="font-serif font-black text-3xl sm:text-6xl leading-tight">
              {lang === 'zh' ? (
                <>
                  易有太极，<br />
                  <span className="italic text-[#E8CF86]">是生两仪。</span>
                </>
              ) : (
                <>
                  As Above, <br />
                  <span className="italic text-[#E8CF86]">So Below.</span>
                </>
              )}
            </h1>
            <p className="text-xs sm:text-sm mt-3 opacity-80 leading-relaxed max-w-md mx-auto">
              {lang === 'zh'
                ? '自古至今，问卜决断皆始于人心向内之自照。东方铜钱数变，西方塔罗原型，在此共振合璧。'
                : 'Ancient Eastern I Ching wisdom and Western Tarot symbolism unite in modern synchronicity.'}
            </p>
          </div>

          {/* 阶段 2 文案：两仪交相呼应 */}
          <div
            ref={title2Ref}
            className="absolute -top-10 sm:-top-16 text-center max-w-lg mx-auto pointer-events-none px-4"
          >
            <span className="text-xs font-serif tracking-widest text-[#E8CF86] uppercase block mb-1">
              DUAL ARCHETYPES
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#FFFDF9]">
              {lang === 'zh' ? '东方以数起爻 · 西方以象明心' : 'Eastern Hexagrams · Western Archetypes'}
            </h2>
          </div>

          {/* 阶段 2 & 3：铜钱与塔罗牌破空并列组 */}
          <div
            ref={cardsGroupRef}
            className="absolute w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14"
          >
            {/* 东方代表：乾隆通宝 3D 铜钱 */}
            <div
              ref={heroCoinRef}
              className="w-36 h-36 sm:w-48 sm:h-48 rounded-full border-3 border-[#B8860B] bg-gradient-to-tr from-[#996515] via-[#DAA520] to-[#FFD700] p-2 sm:p-2.5 shadow-2xl flex items-center justify-center text-center transform-style-3d"
            >
              <div className="w-full h-full rounded-full border border-[#8B6508]/60 flex items-center justify-center relative bg-[#C59B27]/90 shadow-inner">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFFDF9] border border-[#8B6508] shadow-inner" />
                <span className="absolute top-1.5 sm:top-2 text-[11px] sm:text-xs font-serif font-black text-[#4A3B18]">乾</span>
                <span className="absolute bottom-1.5 sm:bottom-2 text-[11px] sm:text-xs font-serif font-black text-[#4A3B18]">隆</span>
                <span className="absolute left-1.5 sm:left-2 text-[11px] sm:text-xs font-serif font-black text-[#4A3B18]">通</span>
                <span className="absolute right-1.5 sm:right-2 text-[11px] sm:text-xs font-serif font-black text-[#4A3B18]">宝</span>
              </div>
            </div>

            {/* 西方代表：韦特命运之轮立体金卡 */}
            <div
              ref={heroTarotRef}
              className="w-32 h-50 sm:w-44 sm:h-64 rounded-3xl bg-[#FFFDF9] ring-2 ring-[#E8CF86] p-4 shadow-2xl flex flex-col justify-between text-[#111111]"
            >
              <div className="flex justify-between items-center text-xs text-[#8C6D23] font-serif">
                <span>X</span>
                <span>ROTA</span>
              </div>
              <div className="text-center my-auto">
                <span className="text-3xl sm:text-4xl block mb-2">🎡</span>
                <span className="font-serif font-black text-xs sm:text-sm block">WHEEL OF FORTUNE</span>
                <span className="text-[10px] text-[#736B5E] block mt-1">
                  {lang === 'zh' ? '命运之轮' : 'The Destiny'}
                </span>
              </div>
              <div className="text-center text-[9px] text-[#8C6D23] font-serif">
                T-A-R-O
              </div>
            </div>
          </div>

          {/* 阶段 4 & 5：双门现世定格入口 (Final Portals Settle) */}
          <div
            ref={portalsFinalRef}
            className="absolute w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
          >
            {/* 东方周易门 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/12 shadow-xl flex flex-col justify-between text-left hover:scale-102 transition-transform">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">☯️</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#111111] text-[#FFFDF9]">
                    {lang === 'zh' ? '东方系统' : 'Eastern'}
                  </span>
                </div>
                <span className="text-[11px] font-serif font-semibold text-[#8C6D23] uppercase">
                  FATEMASTER.AI
                </span>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[#111111] mb-2">
                  {lang === 'zh' ? '周易 · 四柱八字 · 六爻神谕' : 'I Ching & BaZi Oracle'}
                </h3>
                <p className="text-xs text-[#5C5549] leading-relaxed">
                  {lang === 'zh'
                    ? '24 节气换月柱精准排盘，乾隆通宝 3D 物理掷币，五行能量雷达调候与日主元神剖析。'
                    : 'Authentic 24 solar terms Four Pillars BaZi, Qianlong antique 3D coin toss, and Five Elements balance.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#111111]/8">
                <Link
                  href={`/${lang}/fatemaster`}
                  className="w-full py-3.5 rounded-2xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>{lang === 'zh' ? '叩启东方周易之门' : 'Enter Eastern Metaphysics'}</span>
                  <ArrowRight className="w-4 h-4 text-[#FFE59A]" />
                </Link>
              </div>
            </div>

            {/* 西方塔罗门 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] ring-1 ring-[#111111]/12 shadow-xl flex flex-col justify-between text-left hover:scale-102 transition-transform">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">🔮</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#8C6D23] text-[#FFFDF9]">
                    {lang === 'zh' ? '西方系统' : 'Western'}
                  </span>
                </div>
                <span className="text-[11px] font-serif font-semibold text-[#8C6D23] uppercase">
                  TAROTIP.COM
                </span>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[#111111] mb-2">
                  {lang === 'zh' ? '经典韦特塔罗 · 3D 洗牌' : 'Classic Waite Tarot 3D'}
                </h3>
                <p className="text-xs text-[#5C5549] leading-relaxed">
                  {lang === 'zh'
                    ? '78 张经典大阿卡纳与小阿卡纳，GSAP 3D 切牌抽牌，三位 AI 导师沉浸式陪伴流式解牌。'
                    : 'Full 78 Rider-Waite cards, GSAP 3D deck shuffler, and 3 AI Reader personas with SSE streaming.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#111111]/8">
                <Link
                  href={`/${lang}/reading`}
                  className="w-full py-3.5 rounded-2xl bg-[#8C6D23] hover:bg-[#A37F29] text-[#FFFDF9] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>{lang === 'zh' ? '叩启西方塔罗之门' : 'Enter Western Tarot'}</span>
                  <ArrowRight className="w-4 h-4 text-[#FFFDF9]" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 底部微信息与步骤计数 */}
        <div className="relative z-30 max-w-7xl mx-auto w-full px-5 pb-5 flex justify-between items-center text-[11px] opacity-60">
          <span>{lang === 'zh' ? '双门合一 · 荣格共时性驱动' : 'Dual Portals · Powered by Synchronicity'}</span>
          <span>{lang === 'zh' ? `步骤 ${activeStep} / 5` : `Step ${activeStep} / 5`}</span>
        </div>
      </div>
    </section>
  );
}
