'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sparkles, ArrowRight, Compass, Layers, ShieldCheck, Flame } from 'lucide-react';
import { YinYangFish } from '@/components/common/YinYangFish';

gsap.registerPlugin(useGSAP);

export function MasterPortalHero({ lang = 'zh' }: { lang?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const portalEastRef = useRef<HTMLDivElement>(null);
  const portalWestRef = useRef<HTMLDivElement>(null);
  const centerSymbolRef = useRef<HTMLDivElement>(null);

  // GSAP 进场动画与中心八卦太极自转
  useGSAP(() => {
    // 进场时间轴
    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.5)', duration: 0.85 } });

    tl.from([portalEastRef.current, portalWestRef.current], {
      y: 50,
      scale: 0.92,
      autoAlpha: 0,
      stagger: 0.15
    }).from(
      centerSymbolRef.current,
      {
        scale: 0,
        rotation: -180,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'back.out(2)'
      },
      '-=0.5'
    );

    // 中心太极图腾柔和慢速自转
    gsap.to(centerSymbolRef.current, {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: 'none'
    });
  }, { scope: containerRef });

  // 鼠标悬浮两极时动态伸展与微聚焦
  const handleHoverEast = () => {
    gsap.to(portalEastRef.current, { scale: 1.02, y: -6, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(portalWestRef.current, { scale: 0.98, opacity: 0.8, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
  };

  const handleHoverWest = () => {
    gsap.to(portalWestRef.current, { scale: 1.02, y: -6, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(portalEastRef.current, { scale: 0.98, opacity: 0.8, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
  };

  const handleMouseLeave = () => {
    gsap.to([portalEastRef.current, portalWestRef.current], {
      scale: 1,
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto px-4 pt-10 pb-20 text-center">
      {/* 顶部标语 */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#FFFDF9] px-4 py-1.5 text-xs font-medium ring-1 ring-[#111111]/10 shadow-xs mb-4">
          <span className="text-[#8C6D23]">✦ 东西融通 · 现代自我探索体系 ✦</span>
        </div>

        <h1 className="font-serif font-black text-4xl sm:text-6xl text-[#111111] tracking-tight leading-tight mb-4">
          心有所念，<br />
          <span className="italic text-[#8C6D23]">天地自有镜像。</span>
        </h1>

        <p className="text-sm sm:text-base text-[#5C5549] max-w-xl mx-auto leading-relaxed">
          东方周易六爻之生克、西方韦特塔罗之原型。两套跨越千年的智慧体系，在此刻由现代 AI 与心理学共时性重新唤醒。
        </p>
      </div>

      {/* 双门对立展示区 (Dual Portals) */}
      <div
        onMouseLeave={handleMouseLeave}
        className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto"
      >
        {/* 中心阴阳连结标牌 (纯矢量清晰阴阳鱼) */}
        <div
          ref={centerSymbolRef}
          className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none select-none filter drop-shadow-xl"
        >
          <YinYangFish size={58} spin={false} glow={true} />
        </div>

        {/* 东方门：FateMaster (周易 / 八字 / 六爻) */}
        <div
          ref={portalEastRef}
          onMouseEnter={handleHoverEast}
          className="group relative rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EC] ring-1 ring-[#111111]/12 p-8 sm:p-10 shadow-sm flex flex-col justify-between text-left overflow-hidden transition-shadow hover:shadow-xl"
        >
          {/* 东方水墨淡金色漫反射背景 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8CF86]/20 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl">☯️</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#111111] text-[#FFFDF9]">
                东方智慧系统
              </span>
            </div>

            <span className="text-xs font-serif font-semibold text-[#8C6D23] uppercase tracking-wider block mb-1">
              FATEMASTER.AI
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#111111] mb-3">
              周易 · 四柱八字 · 六爻神谕
            </h2>

            <p className="text-xs sm:text-sm text-[#5C5549] leading-relaxed mb-6">
              严谨遵循二十四节气与真太阳时推演。融合乾隆通宝 3D 铜钱抛掷、五行生克雷达与大运流年，由 AI 提供客观深邃的落地策略。
            </p>

            <ul className="space-y-2 text-xs text-[#111111] mb-8 font-medium">
              <li className="flex items-center gap-2">
                <span className="text-[#8C6D23]">✦</span>
                <span>八字四柱排盘 & 五行生克能量分布</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8C6D23]">✦</span>
                <span>乾隆通宝 3D 物理掷币 · 周易六十四卦六爻起卦</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8C6D23]">✦</span>
                <span>日主元神（Day Master）性格天赋剖析</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-[#111111]/10">
            <Link
              href={`/${lang}/fatemaster`}
              className="w-full py-4 rounded-2xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-md group-hover:scale-102"
            >
              <span>进入东方周易命理系统</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 西方门：Tarotip (AI 塔罗占卜) */}
        <div
          ref={portalWestRef}
          onMouseEnter={handleHoverWest}
          className="group relative rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-[#F4EEFA] ring-1 ring-[#111111]/12 p-8 sm:p-10 shadow-sm flex flex-col justify-between text-left overflow-hidden transition-shadow hover:shadow-xl"
        >
          {/* 西方星辉紫粉漫反射背景 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A9D3FF]/20 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl">🔮</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#8C6D23] text-[#FFFDF9]">
                西方神秘原型
              </span>
            </div>

            <span className="text-xs font-serif font-semibold text-[#8C6D23] uppercase tracking-wider block mb-1">
              TAROTIP AI
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#111111] mb-3">
              经典韦特塔罗 · 3D 洗牌抽牌
            </h2>

            <p className="text-xs sm:text-sm text-[#5C5549] leading-relaxed mb-6">
              78 张经典韦特塔罗全套图解。支持沉浸式洗牌切牌与 3D 翻牌，多位专属 AI 导师（月影魔女、明镜学者、林间行者）为你即时流式解惑。
            </p>

            <ul className="space-y-2 text-xs text-[#111111] mb-8 font-medium">
              <li className="flex items-center gap-2">
                <span className="text-[#8C6D23]">✦</span>
                <span>圣三角、二选一与凯尔特十字深度牌阵</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8C6D23]">✦</span>
                <span>是否塔罗快速决断（Yes or No）</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8C6D23]">✦</span>
                <span>78 张塔罗牌全义大全与每日运势日签</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-[#111111]/10">
            <Link
              href={`/${lang}/reading`}
              className="w-full py-4 rounded-2xl bg-[#8C6D23] hover:bg-[#A37F29] text-[#FFFDF9] text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-md group-hover:scale-102"
            >
              <span>进入西方 AI 塔罗空间</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
