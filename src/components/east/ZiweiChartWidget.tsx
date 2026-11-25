'use client';

import React, { useState } from 'react';
import {
  BRANCH_NAMES_EN,
  calculateZiwei,
  STAR_NAMES_EN,
  ZiweiChartResult,
  ZiweiGender,
  ZiweiPalace
} from '@/lib/metaphysics/ziwei';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

function parseStrictInt(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^-?\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

export function ZiweiChartWidget({ lang = 'zh' }: { lang?: string }) {
  const isEn = lang === 'en';
  const [year, setYear] = useState('1996');
  const [month, setMonth] = useState('8');
  const [day, setDay] = useState('18');
  const [hour, setHour] = useState('12');
  const [gender, setGender] = useState<ZiweiGender>('male');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [chart, setChart] = useState<ZiweiChartResult>(() =>
    calculateZiwei(1996, 8, 18, 12, 'male')
  );

  const [activePalaceIndex, setActivePalaceIndex] = useState<number>(
    () => chart.palaces.find(p => p.isLifePalace)?.index ?? 0
  );

  const [mobileView, setMobileView] = useState<'cards' | 'grid'>('cards');

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const y = parseStrictInt(year);
    const m = parseStrictInt(month);
    const d = parseStrictInt(day);
    const h = parseStrictInt(hour);

    if (y === null || m === null || d === null || h === null) {
      setErrorMessage(
        isEn
          ? 'Please enter complete integer values for year, month, day, and hour (0–23).'
          : '请完整填写公历年、月、日与时辰（0–23 整数）。'
      );
      return;
    }

    try {
      const res = calculateZiwei(y, m, d, h, gender);
      setChart(res);
      const lifeIdx = res.palaces.find(p => p.isLifePalace)?.index ?? 0;
      setActivePalaceIndex(lifeIdx);
      setErrorMessage(null);
    } catch {
      setErrorMessage(
        isEn
          ? 'Please enter a valid Gregorian date (1920–2035) and hour (0–23).'
          : '请输入 1920–2035 年间有效的公历日期及 0–23 时辰。'
      );
    }
  };

  const selectedPalace: ZiweiPalace =
    chart.palaces.find(p => p.index === activePalaceIndex) || chart.palaces[0];

  // 12 宫在 4x4 盘面中的经典分布 (围绕周边 12 格排布)
  const gridPositions: Record<number, { col: number; row: number }> = {
    5: { col: 1, row: 1 }, // 巳
    6: { col: 2, row: 1 }, // 午
    7: { col: 3, row: 1 }, // 未
    8: { col: 4, row: 1 }, // 申
    9: { col: 4, row: 2 }, // 酉
    10: { col: 4, row: 3 }, // 戌
    11: { col: 4, row: 4 }, // 亥
    0: { col: 3, row: 4 }, // 子
    1: { col: 2, row: 4 }, // 丑
    2: { col: 1, row: 4 }, // 寅
    3: { col: 1, row: 3 }, // 卯
    4: { col: 1, row: 2 }  // 辰
  };

  const getTransformationBadge = (transformation?: string) => {
    if (!transformation) return '';
    const t = transformation.replace('化', '');
    if (t === '忌' || t === 'Ji') {
      return 'bg-[#171717] text-white border-[#171717]';
    }
    return 'bg-[#F5F5F6] text-[#171717] border-[#D4D4D8]';
  };

  const renderPalaceStarsSummary = (palace: ZiweiPalace, compact = false) => {
    const transformedMinors = palace.minorStars.filter(m => m.transformation);
    return (
      <div className={`space-y-0.5 my-1 ${compact ? 'min-h-[30px]' : 'min-h-[38px]'}`}>
        {palace.majorStars.map((st, sIdx) => (
          <div key={`maj-${sIdx}`} className={`flex items-center justify-between ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
            <span className="font-medium text-[#171717]">
              {isEn ? (st.nameEn || st.name) : st.name}
            </span>
            <div className="flex items-center gap-1">
              {st.brightness && (
                <span className="text-[10px] text-[#71717A]">
                  {isEn ? (st.brightnessEn || st.brightness) : st.brightness}
                </span>
              )}
              {st.transformation && (
                <span
                  className={`px-1 py-0.2 rounded-xs ${compact ? 'text-[8px]' : 'text-[9px]'} font-medium border ${getTransformationBadge(
                    st.transformation
                  )}`}
                >
                  {isEn ? (st.transformationEn || st.transformation) : st.transformation}
                </span>
              )}
            </div>
          </div>
        ))}
        {transformedMinors.map((st, mIdx) => (
          <div key={`min-tr-${mIdx}`} className={`flex items-center justify-between ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
            <span className="text-[#52525B]">
              {isEn ? (st.nameEn || st.name) : st.name}
            </span>
            <span
              className={`px-1 py-0.2 rounded-xs ${compact ? 'text-[8px]' : 'text-[9px]'} font-medium border ${getTransformationBadge(
                st.transformation
              )}`}
            >
              {isEn ? (st.transformationEn || st.transformation) : st.transformation}
            </span>
          </div>
        ))}
        {palace.majorStars.length === 0 && (
          <span className="text-[10px] text-[#71717A] italic font-serif">
            {isEn ? 'Empty Palace' : '空宫（无主星）'}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* 生辰调参框 */}
      <div className="w-full rounded-sm bg-white border border-[#E4E4E7] p-5 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-serif text-[16px] sm:text-[17px] font-normal text-[#171717]">
            {isEn ? 'Birth Timing & Gender' : '生辰历法与性别'}
          </h2>
          <span className="text-[12px] text-[#52525B]">
            {isEn
              ? `Solar: ${chart.solarDate.year}-${String(chart.solarDate.month).padStart(2, '0')}-${String(chart.solarDate.day).padStart(2, '0')} ${String(chart.solarDate.hour).padStart(2, '0')}:00 · ${chart.bureau.nameEn} · ${chart.decadalDirectionEn}`
              : `农历：${chart.lunarDate.yearGanZhi}年 ${chart.lunarDate.monthZh}${chart.lunarDate.dayZh} ${chart.lunarDate.hourBranch} · 【${chart.bureau.nameZh}】· ${chart.decadalDirectionZh}`}
          </span>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <div>
            <label htmlFor="ziwei-year" className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Year' : '公历年'}
            </label>
            <input
              id="ziwei-year"
              type="number"
              value={year}
              onChange={e => {
                setYear(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              min={1920}
              max={2035}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>
          <div>
            <label htmlFor="ziwei-month" className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Month' : '月份'}
            </label>
            <input
              id="ziwei-month"
              type="number"
              value={month}
              onChange={e => {
                setMonth(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              min={1}
              max={12}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>
          <div>
            <label htmlFor="ziwei-day" className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Day' : '日期'}
            </label>
            <input
              id="ziwei-day"
              type="number"
              value={day}
              onChange={e => {
                setDay(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              min={1}
              max={31}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>
          <div>
            <label htmlFor="ziwei-hour" className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Hour (0-23)' : '时辰（0-23点）'}
            </label>
            <input
              id="ziwei-hour"
              type="number"
              value={hour}
              onChange={e => {
                setHour(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              min={0}
              max={23}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            />
          </div>
          <div>
            <label htmlFor="ziwei-gender" className="block text-[11px] font-medium text-[#52525B] mb-1">
              {isEn ? 'Gender' : '排盘性别'}
            </label>
            <select
              id="ziwei-gender"
              value={gender}
              onChange={e => {
                setGender(e.target.value === 'female' ? 'female' : 'male');
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full min-h-[40px] px-3 py-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[13px] text-[#171717] transition-colors focus:bg-white focus:border-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            >
              <option value="male">{isEn ? 'Male' : '男（乾造）'}</option>
              <option value="female">{isEn ? 'Female' : '女（坤造）'}</option>
            </select>
          </div>
          <div className="flex items-end col-span-2 sm:col-span-1">
            <button
              type="submit"
              className="w-full min-h-[40px] rounded-sm bg-[#171717] hover:bg-[#333333] text-white text-[13px] font-medium tracking-wide transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
            >
              {isEn ? 'Recalculate' : '开始排盘'}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div
            role="alert"
            className="mt-3 p-3 rounded-sm border border-[#D4D4D8] bg-[#F5F5F6] text-[12px] text-[#171717]"
          >
            {errorMessage}
          </div>
        )}
      </div>

      {/* 紫微斗数十二宫盘面 */}
      <div className="w-full mb-8">
        {/* 桌面端/平板端 4x4 方形大盘面 (带横向局部包含，防止小视口溢出) */}
        <div className="hidden md:block overflow-x-auto pb-2">
          <div className="min-w-[680px] grid grid-cols-4 grid-rows-4 gap-2.5 p-3 rounded-sm bg-[#FAFAFA] border border-[#E4E4E7]">
            {/* 中间 2x2 天心盘面 */}
            <div className="col-start-2 col-span-2 row-start-2 row-span-2 rounded-sm bg-white border border-[#E4E4E7] p-5 flex flex-col justify-between text-center">
              <div>
                <span className="text-[11px] font-medium tracking-[0.2em] text-[#52525B] uppercase block mb-1">
                  Z I W E I · D O U S H U
                </span>
                <h3 className="font-serif text-[18px] sm:text-[20px] font-normal text-[#171717]">
                  {isEn ? 'Twelve Palaces Chart' : '天盘十二宫实盘'}
                </h3>
                <p className="text-[12px] text-[#52525B] mt-1">
                  {isEn
                    ? `${chart.bureau.nameEn} · Life [${chart.lifePalaceStem}${chart.lifePalaceBranch}] · Body [${BRANCH_NAMES_EN[chart.bodyPalaceBranch] || chart.bodyPalaceBranch}]`
                    : `${chart.bureau.nameZh} · 命宫【${chart.lifePalaceStem}${chart.lifePalaceBranch}】 · 身宫【${chart.bodyPalaceBranch}】`}
                </p>
                <p className="text-[11px] text-[#71717A] mt-0.5">
                  {isEn ? chart.decadalDirectionEn : `大限顺逆：${chart.decadalDirectionZh}`}
                </p>
              </div>

              <div className="p-3 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[12px] text-left">
                <span className="font-medium text-[#171717] block mb-0.5">
                  {isEn ? `Life Palace Stars: ${chart.dayMasterStarEn}` : `命宫主星：${chart.dayMasterStar}`}
                </span>
                <p className="text-[11px] text-[#52525B] leading-relaxed line-clamp-3">
                  {isEn ? chart.overallProfileEn.personality : chart.overallProfileZh.personality}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#E4E4E7] text-[11px] text-[#52525B] text-left">
                {chart.transformationLocations.map(item => (
                  <div key={item.key} className="flex items-center gap-1 truncate">
                    <span className={`px-1 py-0.2 rounded-xs text-[9px] font-medium border ${getTransformationBadge(item.labelZh)}`}>
                      {isEn ? item.labelEn : item.labelZh.replace('化', '')}
                    </span>
                    <span className="truncate">
                      {isEn
                        ? `${item.starEn} · ${item.palaceNameEn}`
                        : `${item.starZh}·${item.palaceNameZh}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 周边 12 个宫位 */}
            {chart.palaces.map(palace => {
              const pos = gridPositions[palace.index];
              const isSelected = palace.index === activePalaceIndex;
              return (
                <button
                  key={palace.index}
                  type="button"
                  onClick={() => setActivePalaceIndex(palace.index)}
                  style={{
                    gridColumnStart: pos.col,
                    gridRowStart: pos.row
                  }}
                  className={`p-3 rounded-sm border text-left cursor-pointer transition-colors flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] ${
                    isSelected
                      ? 'bg-white border-[#171717] ring-1 ring-[#171717]'
                      : palace.isLifePalace
                      ? 'bg-white border-[#171717]/40 hover:border-[#171717]'
                      : 'bg-white border-[#E4E4E7] hover:border-[#A1A1AA]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[12px] font-serif font-semibold text-[#171717]">
                          {isEn ? palace.nameEn : palace.name}
                        </span>
                        {palace.isLifePalace && (
                          <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#171717] text-white font-medium">
                            {isEn ? 'Life' : '命'}
                          </span>
                        )}
                        {palace.isBodyPalace && !palace.isLifePalace && (
                          <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#F5F5F6] text-[#52525B] border border-[#E4E4E7] font-medium">
                            {isEn ? 'Body' : '身'}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#52525B] font-mono">
                        {palace.stem}{palace.branch}
                      </span>
                    </div>

                    {renderPalaceStarsSummary(palace, false)}
                  </div>

                  <div className="pt-1.5 border-t border-[#E4E4E7] flex justify-between items-center text-[10px] text-[#52525B]">
                    <span>{isEn ? `Age ${palace.decadalRange}` : `${palace.decadalRange} 岁`}</span>
                    <span className="text-[9px] text-[#71717A]">
                      {isEn
                        ? (palace.isLifePalace ? 'Life' : palace.isBodyPalace ? 'Body' : '')
                        : (palace.isLifePalace ? '本命' : palace.isBodyPalace ? '身宫' : '')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 移动端十二宫视图与控制 */}
        <div className="md:hidden space-y-4">
          {/* 移动端天心简况卡片 */}
          <div className="p-4 rounded-sm bg-white border border-[#E4E4E7] text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium tracking-[0.15em] text-[#52525B] uppercase">
                {isEn ? 'Chart Core' : '天盘核心'}
              </span>
              <span className="text-[11px] text-[#52525B]">
                {isEn ? `${chart.bureau.nameEn} · ${chart.decadalDirectionEn}` : `${chart.bureau.nameZh} · ${chart.decadalDirectionZh}`}
              </span>
            </div>
            <div className="text-[13px] font-medium text-[#171717] mb-1">
              {isEn
                ? `Life [${chart.lifePalaceStem}${chart.lifePalaceBranch}] · Body [${BRANCH_NAMES_EN[chart.bodyPalaceBranch] || chart.bodyPalaceBranch}] · ${chart.dayMasterStarEn}`
                : `命宫【${chart.lifePalaceStem}${chart.lifePalaceBranch}】 · 身宫【${chart.bodyPalaceBranch}】 · ${chart.dayMasterStar}`}
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E4E4E7] text-[10px]">
              {chart.transformationLocations.map(item => (
                <span key={item.key} className="flex items-center gap-1">
                  <span className={`px-1 py-0.2 rounded-xs border ${getTransformationBadge(item.labelZh)}`}>
                    {isEn ? item.labelEn : item.labelZh.replace('化', '')}
                  </span>
                  <span>
                    {isEn
                      ? `${item.starEn} (${item.palaceNameEn})`
                      : `${item.starZh}·${item.palaceNameZh}`}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* 移动端视图切换控件 */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#52525B]">
              {isEn ? 'Palaces Navigation' : '十二宫位切换'}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setMobileView('cards')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-sm border transition-colors cursor-pointer ${
                  mobileView === 'cards'
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-[#F5F5F6] text-[#52525B] border-[#E4E4E7]'
                }`}
              >
                {isEn ? 'Cards' : '卡片列表'}
              </button>
              <button
                type="button"
                onClick={() => setMobileView('grid')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-sm border transition-colors cursor-pointer ${
                  mobileView === 'grid'
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-[#F5F5F6] text-[#52525B] border-[#E4E4E7]'
                }`}
              >
                {isEn ? '4x4 Grid' : '全盘方阵'}
              </button>
            </div>
          </div>

          {mobileView === 'cards' ? (
            /* 移动端卡片列表 */
            <div className="grid grid-cols-2 gap-2">
              {chart.palaces.map(palace => {
                const isSelected = palace.index === activePalaceIndex;
                return (
                  <button
                    key={palace.index}
                    type="button"
                    onClick={() => setActivePalaceIndex(palace.index)}
                    className={`p-3 rounded-sm border text-left cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-white border-[#171717] ring-1 ring-[#171717]'
                        : palace.isLifePalace
                        ? 'bg-white border-[#171717]/40'
                        : 'bg-white border-[#E4E4E7]'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[12px] font-medium mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[#171717] font-serif">
                          {isEn ? palace.nameEn : palace.name}
                        </span>
                        {palace.isLifePalace && (
                          <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#171717] text-white font-medium">
                            {isEn ? 'Life' : '命'}
                          </span>
                        )}
                        {palace.isBodyPalace && !palace.isLifePalace && (
                          <span className="text-[9px] px-1 py-0.2 rounded-xs bg-[#F5F5F6] text-[#52525B] border border-[#E4E4E7] font-medium">
                            {isEn ? 'Body' : '身'}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#52525B] font-mono">
                        {palace.stem}{palace.branch}
                      </span>
                    </div>

                    {renderPalaceStarsSummary(palace, true)}

                    <div className="pt-1 border-t border-[#E4E4E7] flex justify-between items-center text-[10px] text-[#52525B]">
                      <span>{isEn ? `Age ${palace.decadalRange}` : `${palace.decadalRange} 岁`}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* 移动端横向滑动 4x4 方阵包含器 */
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[620px] grid grid-cols-4 grid-rows-4 gap-2 p-2.5 rounded-sm bg-[#FAFAFA] border border-[#E4E4E7]">
                <div className="col-start-2 col-span-2 row-start-2 row-span-2 rounded-sm bg-white border border-[#E4E4E7] p-3 flex flex-col justify-between text-center">
                  <div>
                    <span className="text-[10px] font-medium text-[#52525B] uppercase block">
                      Z I W E I
                    </span>
                    <h3 className="font-serif text-[15px] font-normal text-[#171717]">
                      {isEn ? 'Twelve Palaces' : '天盘十二宫'}
                    </h3>
                    <p className="text-[11px] text-[#52525B] mt-0.5">
                      {isEn
                        ? `${chart.bureau.nameEn} · Life [${chart.lifePalaceStem}${chart.lifePalaceBranch}]`
                        : `${chart.bureau.nameZh} · 命【${chart.lifePalaceStem}${chart.lifePalaceBranch}】 身【${chart.bodyPalaceBranch}】`}
                    </p>
                  </div>
                  <div className="p-2 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7] text-[11px] text-left">
                    <span className="font-medium text-[#171717] block">
                      {isEn ? `Life: ${chart.dayMasterStarEn}` : `主星：${chart.dayMasterStar}`}
                    </span>
                  </div>
                </div>

                {chart.palaces.map(palace => {
                  const pos = gridPositions[palace.index];
                  const isSelected = palace.index === activePalaceIndex;
                  return (
                    <button
                      key={palace.index}
                      type="button"
                      onClick={() => setActivePalaceIndex(palace.index)}
                      style={{
                        gridColumnStart: pos.col,
                        gridRowStart: pos.row
                      }}
                      className={`p-2 rounded-sm border text-left cursor-pointer transition-colors flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-[#171717] ring-1 ring-[#171717]'
                          : palace.isLifePalace
                          ? 'bg-white border-[#171717]/40'
                          : 'bg-white border-[#E4E4E7]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-serif font-semibold text-[#171717]">
                            {isEn ? palace.nameEn : palace.name}
                          </span>
                          <span className="text-[9px] text-[#52525B] font-mono">
                            {palace.stem}{palace.branch}
                          </span>
                        </div>
                        {renderPalaceStarsSummary(palace, true)}
                      </div>
                      <div className="pt-1 border-t border-[#E4E4E7] text-[9px] text-[#52525B]">
                        {isEn ? `Age ${palace.decadalRange}` : `${palace.decadalRange} 岁`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 选中宫位实盘详情 */}
      <div className="w-full rounded-sm bg-white border border-[#E4E4E7] p-5 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-4 border-b border-[#E4E4E7] pb-3 flex-wrap gap-2">
          <div>
            <span className="text-[11px] font-medium tracking-[0.15em] text-[#52525B] uppercase block">
              {isEn ? 'Palace Inspection' : '当前宫位实况'}
            </span>
            <h3 className="font-serif text-[18px] sm:text-[20px] font-normal text-[#171717] mt-0.5">
              {isEn
                ? `【${selectedPalace.nameEn}】 · ${selectedPalace.stem}${selectedPalace.branch} (${BRANCH_NAMES_EN[selectedPalace.branch] || selectedPalace.branch})`
                : `【${selectedPalace.name}】 · ${selectedPalace.stem}${selectedPalace.branch}宫`}
            </h3>
          </div>
          <span className="text-[12px] font-medium text-[#171717] bg-[#F5F5F6] px-2.5 py-1 rounded-sm border border-[#E4E4E7]">
            {isEn ? `Decadal Range: Age ${selectedPalace.decadalRange}` : `大限区间：${selectedPalace.decadalRange} 岁`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="p-3.5 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7]">
            <span className="text-[11px] font-medium text-[#52525B] block mb-1">
              {isEn ? 'Major Stars' : '本宫主星'}
            </span>
            <span className="font-serif font-medium text-[13px] sm:text-[14px] text-[#171717] block">
              {selectedPalace.majorStars.length > 0
                ? (isEn
                    ? selectedPalace.majorStars.map(s => `${s.nameEn || s.name}${s.brightnessEn ? ` (${s.brightnessEn})` : ''}`).join(', ')
                    : selectedPalace.majorStars.map(s => `${s.name}${s.brightness ? `(${s.brightness})` : ''}`).join('、'))
                : (isEn
                    ? `Empty Palace (no major stars; opposite ${BRANCH_NAMES_EN[selectedPalace.oppositeBranch]}: ${selectedPalace.oppositeMajorStarNamesEn.join(', ') || 'Empty'})`
                    : `空宫（无主星；对宫${selectedPalace.oppositeBranch}有：${selectedPalace.oppositeMajorStarNames.join('、') || '亦无主星'}）`)}
            </span>
          </div>

          <div className="p-3.5 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7]">
            <span className="text-[11px] font-medium text-[#52525B] block mb-1">
              {isEn ? 'Natal Four Transformations' : '生年四化落宫'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              {selectedPalace.transformations.length > 0 ? (
                selectedPalace.transformations.map((t, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded-xs text-[11px] font-medium border ${getTransformationBadge(
                      t
                    )}`}
                  >
                    {isEn ? (selectedPalace.transformationsEn[idx] || t) : t}
                  </span>
                ))
              ) : (
                <span className="text-[12px] text-[#71717A]">
                  {isEn ? 'None in this palace' : '本宫无生年四化'}
                </span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-sm bg-[#F5F5F6] border border-[#E4E4E7]">
            <span className="text-[11px] font-medium text-[#52525B] block mb-1">
              {isEn ? 'Auxiliary Stars (Kui/Yue/Chang/Qu/Fu/Bi)' : '辅星（魁钺昌曲辅弼）'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5 font-serif font-medium text-[13px] sm:text-[14px] text-[#171717]">
              {selectedPalace.minorStars.length > 0 ? (
                selectedPalace.minorStars.map((m, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1">
                    <span>{isEn ? (m.nameEn || m.name) : m.name}</span>
                    {m.transformation && (
                      <span
                        className={`px-1 py-0.2 rounded-xs text-[10px] font-sans border ${getTransformationBadge(
                          m.transformation
                        )}`}
                      >
                        {isEn ? (m.transformationEn || m.transformation) : `化${m.transformation}`}
                      </span>
                    )}
                    {idx < selectedPalace.minorStars.length - 1 && (
                      <span className="text-[#A1A1AA]">{isEn ? ',' : '、'}</span>
                    )}
                  </span>
                ))
              ) : (
                <span className="text-[12px] font-sans font-normal text-[#71717A]">
                  {isEn ? 'None in this palace' : '本宫无辅星'}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#52525B] bg-[#FAFAFA] p-4 rounded-sm border border-[#E4E4E7]">
          {isEn ? selectedPalace.summaryEn : selectedPalace.summaryZh}
        </p>

        {/* 口径、四化落宫全表与流派边界（折叠说明） */}
        <details className="mt-4 rounded-sm border border-[#E4E4E7] bg-[#FAFAFA] px-4 py-3 text-[12px] text-[#52525B]">
          <summary className="cursor-pointer font-medium text-[#171717] select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]">
            {isEn
              ? 'Chart Convention, Transformation Placement & Scope Boundary'
              : '排盘口径、生年四化落宫与流派边界说明'}
          </summary>
          <div className="mt-3 pt-3 border-t border-[#E4E4E7] space-y-2 leading-relaxed">
            <div className="font-mono text-[11px] text-[#171717]">
              {isEn ? 'Four Transformations: ' : '生年四化落宫：'}
              {chart.transformationLocations
                .map(t =>
                  isEn
                    ? `${t.labelEn} ${t.starEn} -> ${t.palaceNameEn} (${t.palaceStem}${t.palaceBranch})`
                    : `${t.labelZh}${t.starZh}→${t.palaceNameZh}(${t.palaceStem}${t.palaceBranch})`
                )
                .join(isEn ? ' · ' : ' ｜ ')}
            </div>
            <p>{isEn ? chart.convention.rulesEn : chart.convention.rulesZh}</p>
            <p className="text-[#71717A]">{isEn ? chart.convention.unsupportedEn : chart.convention.unsupportedZh}</p>
            <p className="text-[11px] text-[#71717A]">
              {isEn
                ? `Four Transformations Key (Year Stem ${chart.lunarDate.yearGanZhi[0]}): Lu=${STAR_NAMES_EN[chart.fourTransformations.lu] || chart.fourTransformations.lu}, Quan=${STAR_NAMES_EN[chart.fourTransformations.quan] || chart.fourTransformations.quan}, Ke=${STAR_NAMES_EN[chart.fourTransformations.ke] || chart.fourTransformations.ke}, Ji=${STAR_NAMES_EN[chart.fourTransformations.ji] || chart.fourTransformations.ji}`
                : `年干【${chart.lunarDate.yearGanZhi[0]}】四化：化禄${chart.fourTransformations.lu}、化权${chart.fourTransformations.quan}、化科${chart.fourTransformations.ke}、化忌${chart.fourTransformations.ji}`}
            </p>
          </div>
        </details>

        <div className="pt-4 mt-5 border-t border-[#E4E4E7] flex justify-end">
          <Link
            href={`/${lang}/east/ziwei-marriage`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#171717] hover:text-[#52525B] transition-colors"
          >
            <span>{isEn ? 'Compare two charts? Open Ziwei Synastry' : '想对照两张紫微命盘？进入【紫微合盘】'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
