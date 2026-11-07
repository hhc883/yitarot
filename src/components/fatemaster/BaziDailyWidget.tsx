'use client';

import React, { useState } from 'react';
import { calculateDailyBaziFortune, DailyBaziFortuneResult } from '@/lib/metaphysics/daily-bazi';
import { ArrowRight, RotateCcw, Compass } from 'lucide-react';

interface BaziDailyWidgetProps {
  lang?: string;
}

export function BaziDailyWidget({ lang = 'zh' }: BaziDailyWidgetProps) {
  const [year, setYear] = useState(1996);
  const [month, setMonth] = useState(8);
  const [day, setDay] = useState(18);
  const [hour, setHour] = useState(12);

  const [fortune, setFortune] = useState<DailyBaziFortuneResult>(() =>
    calculateDailyBaziFortune(1996, 8, 18, 12)
  );

  const handleRecalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateDailyBaziFortune(year, month, day, hour);
    setFortune(res);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* 头部日期信息 */}
      <div className="w-full mb-8 text-center">
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
          {lang === 'en' ? 'Daily BaZi Fortune' : '八字每日运势'}
        </h1>
        <p className="text-xs sm:text-sm font-serif text-[#736B5E] mt-1.5">
          {fortune.queryDate.year} 年 {fortune.queryDate.month} 月 {fortune.queryDate.day} 日 · {fortune.queryDate.dayOfWeekZh} · 节气【{fortune.queryDate.solarTerms}】 · 今日【{fortune.todayGanZhi.day}】
        </p>
      </div>

      {/* 生辰快速调参输入栏 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-serif font-bold text-[#111111]">
            {lang === 'en' ? 'Birth Profile' : '推演生辰'}
          </span>
          <span className="text-[11px] font-serif text-[#736B5E]">
            日主元神：{fortune.userDayMaster.nameZh}
          </span>
        </div>

        <form onSubmit={handleRecalculate} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-serif text-[#736B5E] mb-1">出生年</label>
            <input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              min={1920}
              max={2035}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-serif text-[#736B5E] mb-1">月</label>
            <input
              type="number"
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              min={1}
              max={12}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-serif text-[#736B5E] mb-1">日</label>
            <input
              type="number"
              value={day}
              onChange={e => setDay(Number(e.target.value))}
              min={1}
              max={31}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-serif text-[#736B5E] mb-1">时辰 (点)</label>
            <input
              type="number"
              value={hour}
              onChange={e => setHour(Number(e.target.value))}
              min={0}
              max={23}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6ED] border border-[#111111]/10 text-xs text-[#111111]"
            />
          </div>

          <div className="flex items-end col-span-2 sm:col-span-1">
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-[#111111] hover:bg-[#333333] text-[#FFFDF9] text-xs font-serif tracking-wider transition-colors cursor-pointer"
            >
              更新运势
            </button>
          </div>
        </form>
      </div>

      {/* 核心气象展板 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* 左侧：今日核心指数与十神 */}
        <div className="md:col-span-7 rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-[#111111]/6 pb-3">
              <div>
                <span className="text-xs font-serif text-[#736B5E]">流日十神</span>
                <h3 className="font-serif font-black text-2xl text-[#111111] mt-0.5">
                  {fortune.dailyTenGod.nameZh} · {fortune.dailyTenGod.cosmicThemeZh}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-serif text-[#736B5E]">综合能量</span>
                <div className="font-serif font-black text-3xl text-[#8C6D23]">
                  {fortune.scores.overall} <span className="text-xs text-[#736B5E] font-normal">/ 100</span>
                </div>
              </div>
            </div>

            <p className="text-xs font-serif text-[#524B40] leading-relaxed mb-4">
              {fortune.dailyTenGod.descZh}
            </p>

            <div className="p-3.5 rounded-xl bg-[#FAF6ED] border border-[#111111]/6 text-xs font-serif text-[#524B40] mb-4">
              <span className="font-bold text-[#111111] block mb-1">五行交互 · {fortune.elementSynergy.labelZh}</span>
              {fortune.elementSynergy.descZh}
            </div>
          </div>

          {/* 维度评分条 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#111111]/6">
            <div>
              <span className="text-[11px] font-serif text-[#736B5E] block mb-1">事业指数</span>
              <span className="text-sm font-serif font-bold text-[#111111]">{fortune.scores.career}分</span>
            </div>
            <div>
              <span className="text-[11px] font-serif text-[#736B5E] block mb-1">财富商机</span>
              <span className="text-sm font-serif font-bold text-[#111111]">{fortune.scores.wealth}分</span>
            </div>
            <div>
              <span className="text-[11px] font-serif text-[#736B5E] block mb-1">情感共振</span>
              <span className="text-sm font-serif font-bold text-[#111111]">{fortune.scores.romance}分</span>
            </div>
            <div>
              <span className="text-[11px] font-serif text-[#736B5E] block mb-1">心境活力</span>
              <span className="text-sm font-serif font-bold text-[#111111]">{fortune.scores.wellness}分</span>
            </div>
          </div>
        </div>

        {/* 右侧：宜忌与开运指南 */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* 宜忌清单 */}
          <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
            <h4 className="text-xs font-serif font-bold text-[#111111] mb-3 border-b border-[#111111]/6 pb-2">
              今日决策宜忌
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-serif font-bold text-emerald-800 block mb-1.5">【宜】</span>
                <div className="flex flex-wrap gap-1.5">
                  {fortune.dosAndDonts.dos.map((d, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-serif border border-emerald-100">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-serif font-bold text-rose-800 block mb-1.5">【忌】</span>
                <div className="flex flex-wrap gap-1.5">
                  {fortune.dosAndDonts.donts.map((d, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 font-serif border border-rose-100">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 吉色与方位 */}
          <div className="rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-5 shadow-2xs">
            <h4 className="text-xs font-serif font-bold text-[#111111] mb-2.5 border-b border-[#111111]/6 pb-2">
              天时调候
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs font-serif">
              <div>
                <span className="text-[11px] text-[#736B5E] block">贵人吉方</span>
                <span className="font-bold text-[#111111]">{fortune.luckyGuides.directionZh}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#736B5E] block">开运色系</span>
                <span className="font-bold text-[#111111]">{fortune.luckyGuides.colorZh}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#736B5E] block">黄金时段</span>
                <span className="font-bold text-[#111111]">{fortune.luckyGuides.timeWindowZh}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#736B5E] block">心法箴言</span>
                <span className="text-[11px] text-[#524B40] block truncate" title={fortune.luckyGuides.mindsetZh}>
                  {fortune.luckyGuides.mindsetZh}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 十二时辰时序曲线 */}
      <div className="w-full rounded-2xl bg-[#FFFDF9] border border-[#111111]/10 p-6 shadow-2xs">
        <h4 className="font-serif font-bold text-sm text-[#111111] mb-4">
          十二时辰能量流转
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {fortune.hourlyTimeline.map((h, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-center transition-all ${
                h.isFavorable
                  ? 'bg-[#FAF6ED] border-[#8C6D23]/40 shadow-xs'
                  : 'bg-[#FFFDF9] border-[#111111]/8'
              }`}
            >
              <span className="text-[10px] text-[#736B5E] block font-serif">{h.timeRange}</span>
              <span className="text-xs font-serif font-black text-[#111111] block my-0.5">{h.branchName}</span>
              <span className={`text-[11px] font-serif font-bold block ${h.isFavorable ? 'text-[#8C6D23]' : 'text-[#736B5E]'}`}>
                {h.score}分
              </span>
              <span className="text-[10px] text-[#524B40] block font-serif mt-0.5 truncate" title={h.verdict}>
                {h.verdict.split('·')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
