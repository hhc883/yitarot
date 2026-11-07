'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, ChevronDown, SkipForward } from 'lucide-react';
import Link from 'next/link';
import { YinYangFish } from '@/components/common/YinYangFish';
import { IconCrystalBall } from '@/components/icons/QiIcons';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface MasterScrollytellingHeroProps {
  lang?: string;
}

export function MasterScrollytellingHero({ lang = 'zh' }: MasterScrollytellingHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);

  // 动画图层与节点
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const centralSymbolRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);
  const cardsGroupRef = useRef<HTMLDivElement>(null);
  const heroCoinRef = useRef<HTMLDivElement>(null);
  const heroTarotRef = useRef<HTMLDivElement>(null);
  const portalsFinalRef = useRef<HTMLDivElement>(null);

  // 4 步步进状态
  const [activeStep, setActiveStep] = useState<number>(1);

  // 跳过交互：不展示任何中间交互动画，瞬间直达下方内容专区
  const handleSkip = () => {
    const target = document.getElementById('portal-content');
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top);
      try {
        window.scrollTo({ top, behavior: 'instant' });
      } catch {
        window.scrollTo(0, top);
      }
    } else if (scrollTriggerInstanceRef.current) {
      const top = scrollTriggerInstanceRef.current.end + 20;
      window.scrollTo(0, top);
      try {
        window.scrollTo({ top, behavior: 'instant' });
      } catch {
        window.scrollTo(0, top);
      }
    } else if (containerRef.current) {
      const top = containerRef.current.offsetTop + containerRef.current.offsetHeight;
      window.scrollTo(0, top);
    }
  };

  useGSAP(() => {
    if (!pinStageRef.current || !containerRef.current) return;

    // 响应式滚动配置 (Desktop +=500%, Mobile +=380%)
    const isMobile = window.innerWidth < 768;
    const endDistance = isMobile ? '+=380%' : '+=500%';
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
          scrollTriggerInstanceRef.current = self;
          const p = self.progress;
          const step = p < 0.25 ? 1 : p < 0.5 ? 2 : p < 0.75 ? 3 : 4;
          setActiveStep(step);
        }
      }
    });

    scrollTriggerInstanceRef.current = tl.scrollTrigger ?? null;

    // 1. 阶段一：太极图腾极速巨幅推进 (scale: 1 -> 6.8)，背景自暖纸色嬗变为深夜星空
    tl.fromTo(
      centralSymbolRef.current,
      { scale: 1, rotation: 0, opacity: 1 },
      { scale: zoomScale, rotation: 90, opacity: 0, ease: 'power2.inOut', duration: 2 }
    )
      .fromTo(
        bgLayerRef.current,
        { backgroundColor: '#F7F3EF', color: '#111111' },
        { backgroundColor: '#080B11', color: '#FFFDF9', ease: 'power2.inOut', duration: 2 },
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
        { backgroundColor: '#131118', duration: 2, ease: 'power2.inOut' },
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

    // 4. 阶段四（终幕开门）：铜钱与塔罗牌退场，背景归于澄澈暖纸色，双门端然落定
    tl.to(cardsGroupRef.current, {
      yPercent: -120,
      opacity: 0,
      scale: 0.8,
      duration: 1.8,
      ease: 'power2.in'
    })
      .to(
        bgLayerRef.current,
        { backgroundColor: '#F7F3EF', color: '#111111', duration: 2, ease: 'power2.inOut' },
        '<'
      )
      .fromTo(
        portalsFinalRef.current,
        { yPercent: 60, opacity: 0, scale: 0.85 },
        { yPercent: 0, opacity: 1, scale: 1, duration: 2.2, ease: 'back.out(1.4)' },
        '-=1.2'
      );
  }, { scope: containerRef });

  const stepsData = [
    { step: 1, nameZh: '混沌初开', nameEn: 'The Void' },
    { step: 2, nameZh: '两仪显化', nameEn: 'Dual Archetypes' },
    { step: 3, nameZh: '数象相生', nameEn: 'Oracle Resonance' },
    { step: 4, nameZh: '双门齐开', nameEn: 'Dual Portals' }
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

        {/* 顶部简明标识 */}
        <div className="relative z-30 max-w-7xl mx-auto w-full px-5 pt-6 flex items-center justify-between">
          <span className="text-xs font-serif font-bold tracking-widest uppercase opacity-70">
            QiCosmos
          </span>
          <button
            onClick={handleSkip}
            className="text-xs font-serif tracking-wider text-[#6E675B] hover:text-[#111111] transition-colors"
          >
            {lang === 'en' ? 'Skip to Content ↓' : '跳过开幕 ↓'}
          </button>
        </div>

        {/* 侧边步骤进度胶囊指示器 (progress-bullet 1 到 5) */}
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
          {/* 阶段 1：中心高精度清晰阴阳鱼 (纯矢量自生成，温润宣纸与浓淡墨韵) */}
          <div
            ref={centralSymbolRef}
            className="absolute flex items-center justify-center select-none filter drop-shadow-2xl"
          >
            <YinYangFish size={150} spin={true} glow={true} accentColor="#8C6D23" />
          </div>

          {/* 阶段 1 文案：混沌无极 */}
          <div
            ref={title1Ref}
            className="absolute text-center max-w-xl mx-auto pointer-events-none px-4"
          >
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

            {/* 西方代表：韦特命运之轮立体金卡 (真实高清艺术插画) */}
            <div
              ref={heroTarotRef}
              className="w-34 h-54 sm:w-46 sm:h-72 rounded-3xl bg-[#FFFDF9] ring-2 ring-[#E8CF86] p-2.5 sm:p-3 shadow-2xl flex flex-col justify-between text-[#111111] overflow-hidden"
            >
              <div className="flex justify-between items-center text-[10px] sm:text-xs text-[#8C6D23] font-serif font-bold pb-1 border-b border-[#E8CF86]/40">
                <span>X · ROTA</span>
                <span>WHEEL OF FORTUNE</span>
              </div>

              {/* 核心真实塔罗插画 */}
              <div className="relative my-1 flex-1 w-full rounded-xl overflow-hidden border border-[#C29026]/30 shadow-inner bg-[#FAF6ED]">
                <Image
                  src="/cards/major-arcana/wheel-of-fortune.webp"
                  alt="Wheel of Fortune"
                  fill
                  sizes="(max-width: 640px) 140px, 200px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 via-transparent to-white/10" />
              </div>

              <div className="pt-1 border-t border-[#E8CF86]/40 flex justify-between items-center px-1 text-[9px] sm:text-[10px] font-serif text-[#8C6D23]">
                <span className="font-bold">{lang === 'zh' ? '命运之轮' : 'The Destiny'}</span>
                <span className="tracking-widest">T-A-R-O</span>
              </div>
            </div>
          </div>

          {/* 阶段 4：双门现世定格入口 (Final Portals Settle) */}
          <div
            ref={portalsFinalRef}
            className="relative z-20 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
          >
            {/* 东方周易门 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 shadow-sm flex flex-col justify-between text-left hover:border-[#111111]/30 transition-all duration-300">
              <div>
                <div className="mb-3">
                  <YinYangFish size={26} />
                </div>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[#111111] mb-2">
                  {lang === 'zh' ? '周易 · 八字 · 六爻' : 'I Ching & BaZi'}
                </h3>
                <p className="text-xs text-[#524B40] leading-relaxed">
                  {lang === 'zh'
                    ? '24 节气换月柱精准排盘，乾隆通宝 3D 物理掷币，五行能量雷达调候与日主元神剖析。'
                    : 'Authentic 24 solar terms Four Pillars BaZi, Qianlong antique 3D coin toss, and Five Elements balance.'}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-[#111111]/8">
                <Link
                  href={`/${lang}/fatemaster`}
                  className="w-full py-3 rounded-xl bg-[#111111] hover:bg-[#2B261F] text-[#FFFDF9] text-xs font-serif tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span>{lang === 'zh' ? '进入周易专厅' : 'Enter Eastern Metaphysics'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C8A858]" />
                </Link>
              </div>
            </div>

            {/* 西方塔罗门 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 shadow-sm flex flex-col justify-between text-left hover:border-[#111111]/30 transition-all duration-300">
              <div>
                <div className="mb-3">
                  <IconCrystalBall size={26} className="text-[#8C6D23]" />
                </div>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[#111111] mb-2">
                  {lang === 'zh' ? '韦特塔罗 · 78 牌' : 'Waite Tarot 78 Cards'}
                </h3>
                <p className="text-xs text-[#5C5549] leading-relaxed">
                  {lang === 'zh'
                    ? '78 张经典大阿卡纳与小阿卡纳，GSAP 3D 切牌抽牌，三位 AI 导师沉浸式陪伴流式解牌。'
                    : 'Full 78 Rider-Waite cards, GSAP 3D deck shuffler, and 3 AI Reader personas with SSE streaming.'}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-[#111111]/8">
                <Link
                  href={`/${lang}/reading`}
                  className="w-full py-3 rounded-xl bg-[#8C6D23] hover:bg-[#A37F29] text-[#FFFDF9] text-xs font-serif tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span>{lang === 'zh' ? '进入塔罗专厅' : 'Enter Western Tarot'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FFFDF9]" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 底部步骤计数 */}
        <div className="relative z-30 max-w-7xl mx-auto w-full px-5 pb-5 flex justify-end items-center text-[11px] opacity-60">
          <span className="font-serif">
            {lang === 'zh' ? `第 ${activeStep} 幕 / 共 4 幕` : `Step ${activeStep} / 4`}
          </span>
        </div>

        {/* 右下角跳过交互按钮 */}
        {activeStep < 4 && (
          <button
            type="button"
            onClick={handleSkip}
            className="pointer-events-auto absolute bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111111]/90 hover:bg-[#111111] text-[#FFFDF9] text-xs font-serif transition-all hover:scale-102 cursor-pointer border border-white/20"
            title={lang === 'zh' ? '跳过开幕' : 'Skip intro'}
          >
            <span>{lang === 'zh' ? '跳过' : 'Skip'}</span>
            <SkipForward className="w-3 h-3 text-[#E8CF86]" />
          </button>
        )}
      </div>
    </section>
  );
}
