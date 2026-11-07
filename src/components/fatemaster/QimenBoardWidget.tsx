'use client';

import React, { useState } from 'react';
import { calculateQimen, QimenChartResult, QimenPalace } from '@/lib/metaphysics/qimen';
import { Compass, Sparkles } from 'lucide-react';

export function QimenBoardWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const [chart, setChart] = useState<QimenChartResult>(() => calculateQimen());
  const [selectedPalaceId, setSelectedPalaceId] = useState<number>(8); // 默认艮八宫 (常逢生门)

  const handleRefreshTime = () => {
    setChart(calculateQimen(new Date()));
  };

  const selectedPalace = chart.palaces.find(p => p.palaceId === selectedPalaceId) || chart.palaces[0];

  // 经典九宫格视觉排布顺序（洛书排布）：
  // 第一行：巽4, 离9, 坤2
  // 第二行：震3, 中5, 兑7
  // 第三行：艮8, 坎1, 乾6
  const visualOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* 标题 */}
      <div className="w-full text-center mb-6">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {isEn ? 'AI Qimen Dunjia' : 'AI 奇门遁甲'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-1.5 max-w-lg mx-auto">
          {isEn
            ? 'Imperial Strategy Oracle · 9 Palaces · 8 Gates · 9 Stars · 8 Deities · Tactical Timing'
            : '帝王绝学 · 九宫八门九星八神 · 时家奇门局象排演 · 运筹帷幄决断先机'}
        </p>
      </div>

      {/* 局象概览条 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-serif font-bold text-[#111111]">
                {isEn ? `Current Board: ${chart.dunTypeEn} · Ju ${chart.juNumber}` : `当前盘面：${chart.dunType} · 第 ${chart.juNumber} 局`}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF6ED] text-[#8C6D23] font-serif border border-[#8C6D23]/20">
                {isEn ? chart.solarTermEn : chart.solarTermZh}
              </span>
            </div>
            <p className="text-xs font-serif text-[#736B5E]">
              {isEn
                ? `Four Pillars: Year ${chart.ganzhi.year} · Month ${chart.ganzhi.month} · Day ${chart.ganzhi.day} · Hour ${chart.ganzhi.hour}`
                : `时辰四柱：${chart.ganzhi.year}年 · ${chart.ganzhi.month}月 · ${chart.ganzhi.day}日 · ${chart.ganzhi.hour}时`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefreshTime}
            className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-serif tracking-wider transition-colors cursor-pointer"
          >
            {isEn ? 'Calibrate Timing' : '校准即时盘面'}
          </button>
        </div>
      </div>

      {/* 3x3 奇门遁甲九宫全息盘面 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* 左侧：九宫格盘面 */}
        <div className="md:col-span-8 rounded-2xl bg-[#F7F3EF] border border-[#111111]/10 p-3 sm:p-4 shadow-2xs">
          <div className="grid grid-cols-3 gap-2.5">
            {visualOrder.map(palaceId => {
              const palace = chart.palaces.find(p => p.palaceId === palaceId)!;
              const isSelected = palace.palaceId === selectedPalaceId;
              const isSanJi = palace.isAuspiciousGate;

              return (
                <div
                  key={palaceId}
                  onClick={() => setSelectedPalaceId(palaceId)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between min-h-[110px] sm:min-h-[125px] ${
                    isSelected
                      ? 'bg-[#FFFDF9] border-[#8C6D23] ring-2 ring-[#8C6D23]/30 shadow-md'
                      : isSanJi
                      ? 'bg-[#FFFDF9] border-[#8C6D23]/30 shadow-xs hover:border-[#8C6D23]'
                      : 'bg-[#FFFDF9]/85 border-[#111111]/8 hover:border-[#111111]/25'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-serif">
                    <span className="font-bold text-[#111111]">
                      {isEn ? `${palace.directionEn} · ${palace.bagua}` : `${palace.directionZh} · ${palace.bagua}`}
                    </span>
                    <span className="text-[10px] text-[#736B5E]">
                      {isEn ? (palace.currentDeityEn || palace.currentDeity) : palace.currentDeity}
                    </span>
                  </div>

                  {/* 核心九星与八门 */}
                  <div className="my-1.5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-serif text-[#524B40] block">
                        {isEn ? (palace.currentStarEn || palace.currentStar) : palace.currentStar}
                      </span>
                      <span className={`font-serif font-black text-sm sm:text-base block ${
                        isSanJi ? 'text-[#8C6D23]' : 'text-[#111111]'
                      }`}>
                        {isEn ? (palace.currentGateEn || palace.currentGate) : palace.currentGate}
                      </span>
                    </div>

                    <div className="text-right text-xs font-serif">
                      <span className="text-[#8C6D23] font-bold block">{palace.heavenStem}</span>
                      <span className="text-[#736B5E] block">{palace.earthStem}</span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-[#111111]/6 flex justify-between items-center text-[9px] font-serif text-[#736B5E]">
                    <span>{isEn ? palace.elementEn : `${palace.elementZh}行`}</span>
                    <span className={isSanJi ? 'font-bold text-[#8C6D23]' : ''}>
                      {isEn ? (palace.qualityLevelEn || palace.qualityLevel) : palace.qualityLevel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧：选中宫位实战决策解析 */}
        <div className="md:col-span-4 rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#111111]/6 pb-2">
              <div>
                <span className="text-[11px] font-serif text-[#736B5E]">
                  {isEn ? 'Selected Palace' : '当前宫位'}
                </span>
                <h3 className="font-serif font-black text-xl text-[#111111] mt-0.5">
                  {isEn ? `${selectedPalace.directionEn} · ${selectedPalace.bagua} Palace` : `${selectedPalace.directionZh} · ${selectedPalace.bagua}宫`}
                </h3>
              </div>
              <span className={`text-xs font-serif font-bold ${
                selectedPalace.isAuspiciousGate ? 'text-[#8C6D23]' : 'text-[#736B5E]'
              }`}>
                {isEn ? (selectedPalace.qualityLevelEn || selectedPalace.qualityLevel) : selectedPalace.qualityLevel}
              </span>
            </div>

            <div className="space-y-3 text-xs font-serif text-[#524B40] mb-4">
              <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#111111]/5">
                <span className="font-bold text-[#111111] block mb-1">
                  {isEn ? `Configuration: ${selectedPalace.currentGateEn} × ${selectedPalace.currentStarEn}` : `门星配置：${selectedPalace.currentGate} × ${selectedPalace.currentStar}`}
                </span>
                <p className="leading-relaxed">
                  {isEn
                    ? `Deity: [${selectedPalace.currentDeityEn}]; Heaven Stem [${selectedPalace.heavenStem}] over Earth Stem [${selectedPalace.earthStem}].`
                    : `神助：逢【${selectedPalace.currentDeity}】护佑；天盘【${selectedPalace.heavenStem}】加临地盘【${selectedPalace.earthStem}】。`}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#111111] block mb-1">
                  {isEn ? 'Tactical Action Guidance' : '运筹实战策略'}
                </span>
                <p className="leading-relaxed">
                  {isEn ? selectedPalace.domainAdviceEn : `${selectedPalace.domainAdviceZh}。若在此方位开展事务或面朝此方洽谈，事半功倍。`}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF6ED] border border-[#8C6D23]/20 text-[11px] font-serif text-[#8C6D23]">
            <span>
              {isEn
                ? 'Qimen Axiom: When urgent rely on Deities; when steady rely on Gates.'
                : '奇门心法：急则从神缓从门，动静之间全在机变。'}
            </span>
          </div>
        </div>
      </div>

      {/* 三吉门黄金方位指引 */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <span className="text-[11px] font-serif font-bold text-amber-800 block mb-1">
            {isEn ? '【Life Gate · Wealth & Enterprise】' : '【生门 · 求财吉方】'}
          </span>
          <p className="text-xs font-serif text-[#111111] font-bold">
            {isEn ? (chart.bestDirections.wealthEn || chart.bestDirections.wealthZh) : chart.bestDirections.wealthZh}
          </p>
          <p className="text-[11px] font-serif text-[#736B5E] mt-1">
            {isEn
              ? 'Ideal for commercial pitches, deal closings, product debuts, and capital allocation.'
              : '适合商务拜访、产品发布、投资洽谈与资本运作。'}
          </p>
        </div>

        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <span className="text-[11px] font-serif font-bold text-emerald-800 block mb-1">
            {isEn ? '【Open Gate · Career & Initiative】' : '【开门 · 谋事吉方】'}
          </span>
          <p className="text-xs font-serif text-[#111111] font-bold">
            {isEn ? (chart.bestDirections.careerEn || chart.bestDirections.careerZh) : chart.bestDirections.careerZh}
          </p>
          <p className="text-[11px] font-serif text-[#736B5E] mt-1">
            {isEn
              ? 'Ideal for launching new projects, public keynotes, executive approvals, and signing covenants.'
              : '适合开业立项、公开演讲、官务汇报与签署契约。'}
          </p>
        </div>

        <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
          <span className="text-[11px] font-serif font-bold text-cyan-800 block mb-1">
            {isEn ? '【Rest Gate · Harmony & Dialogue】' : '【休门 · 和谈吉方】'}
          </span>
          <p className="text-xs font-serif text-[#111111] font-bold">
            {isEn ? (chart.bestDirections.negotiationEn || chart.bestDirections.negotiationZh) : chart.bestDirections.negotiationZh}
          </p>
          <p className="text-[11px] font-serif text-[#736B5E] mt-1">
            {isEn
              ? 'Ideal for conflict resolution, confidential diplomacy, mental restoration, and mentor counsel.'
              : '适合调解纷争、私密会晤、休养调理与向师长请益。'}
          </p>
        </div>
      </div>
    </div>
  );
}