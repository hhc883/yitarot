'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Solar } from 'lunar-typescript';

interface DateTimePickerPopoverProps {
  year: number;
  month: number;
  day: number;
  hour: number;
  isEn?: boolean;
  onChange: (y: number, m: number, d: number, h: number) => void;
}

const WEEKDAYS_ZH = ['一', '二', '三', '四', '五', '六', '日'];
const WEEKDAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function DateTimePickerPopover({
  year,
  month,
  day,
  hour,
  isEn = false,
  onChange,
}: DateTimePickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(year);
  const [viewMonth, setViewMonth] = useState(month);
  const [prevYear, setPrevYear] = useState(year);
  const [previousSelectedMonth, setPreviousSelectedMonth] = useState(month);
  const containerRef = useRef<HTMLDivElement>(null);

  if (year !== prevYear || month !== previousSelectedMonth) {
    setPrevYear(year);
    setPreviousSelectedMonth(month);
    setViewYear(year);
    setViewMonth(month);
  }

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDayDow = (new Date(viewYear, viewMonth - 1, 1).getDay() + 6) % 7; // Monday = 0

  const prevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((y) => Math.max(1900, y - 1));
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 12) {
      setViewYear((y) => Math.min(2100, y + 1));
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const formattedLabel = isEn
    ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00`
    : `${year}年${String(month).padStart(2, '0')}月${String(day).padStart(2, '0')}日 ${String(hour).padStart(2, '0')}:00`;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#F5F5F6] hover:bg-[#EAEAEB] border border-[#E4E4E7] text-[12px] text-[#171717] transition-colors cursor-pointer"
      >
        <Calendar className="w-3.5 h-3.5 text-[#52525B]" />
        <span className="font-mono tabular-nums">{formattedLabel}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 w-[320px] sm:w-[360px] rounded-xl bg-white border border-[#E4E4E7] shadow-xl p-4 space-y-3">
          {/* 年月切换头 */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-md hover:bg-[#F5F5F6] text-[#52525B] cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              <select
                value={viewYear}
                onChange={(e) => {
                  const ny = Number(e.target.value);
                  setViewYear(ny);
                  const maxD = new Date(ny, viewMonth, 0).getDate();
                  onChange(ny, viewMonth, Math.min(day, maxD), hour);
                }}
                className="rounded-md border border-[#E4E4E7] bg-[#F5F5F6] px-2 py-1 text-xs font-medium text-[#171717] focus:outline-hidden"
              >
                {Array.from({ length: 201 }, (_, i) => 1900 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}{isEn ? '' : '年'}
                  </option>
                ))}
              </select>
              <select
                value={viewMonth}
                onChange={(e) => {
                  const nm = Number(e.target.value);
                  setViewMonth(nm);
                  const maxD = new Date(viewYear, nm, 0).getDate();
                  onChange(viewYear, nm, Math.min(day, maxD), hour);
                }}
                className="rounded-md border border-[#E4E4E7] bg-[#F5F5F6] px-2 py-1 text-xs font-medium text-[#171717] focus:outline-hidden"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}{isEn ? '' : '月'}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-md hover:bg-[#F5F5F6] text-[#52525B] cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 星期表头 */}
          <div className="grid grid-cols-7 text-center text-[11px] text-[#71717A] pb-1 border-b border-[#F4F4F5]">
            {(isEn ? WEEKDAYS_EN : WEEKDAYS_ZH).map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>

          {/* 日期网格（带农历/节气提示） */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayDow }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
              const selected = viewYear === year && viewMonth === month && d === day;
              const lunar = Solar.fromYmd(viewYear, viewMonth, d).getLunar();
              const jieQi = lunar.getJieQi();
              const subLabel = jieQi || (lunar.getDay() === 1 ? `${lunar.getMonthInChinese()}月` : lunar.getDayInChinese());

              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChange(viewYear, viewMonth, d, hour)}
                  className={`flex flex-col items-center justify-center rounded-lg py-1 transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#171717] text-white'
                      : 'hover:bg-[#F5F5F6] text-[#171717]'
                  }`}
                >
                  <span className="text-xs font-medium leading-tight">{d}</span>
                  <span
                    className={`text-[9px] leading-tight mt-0.5 ${
                      selected
                        ? 'text-neutral-300'
                        : jieQi
                          ? 'text-red-600 font-medium'
                          : 'text-[#71717A]'
                    }`}
                  >
                    {subLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 时辰快捷选择（0-23点） */}
          <div className="pt-2 border-t border-[#F4F4F5]">
            <div className="text-[11px] text-[#71717A] mb-1.5">
              {isEn ? 'Hour (0–23)' : '选择时辰（0–23点）'}
            </div>
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 24 }, (_, h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => onChange(year, month, day, h)}
                  className={`rounded py-1 text-[11px] font-mono transition-colors cursor-pointer ${
                    hour === h
                      ? 'bg-[#171717] text-white font-medium'
                      : 'bg-[#F5F5F6] text-[#52525B] hover:bg-[#E4E4E7] hover:text-[#171717]'
                  }`}
                >
                  {String(h).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          {/* 底部操作 */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F4F4F5] text-xs">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth() + 1);
                onChange(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours());
              }}
              className="text-[#52525B] hover:text-[#171717] cursor-pointer"
            >
              {isEn ? 'Today' : '今天'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1 rounded-md bg-[#171717] text-white hover:bg-[#333333] cursor-pointer"
            >
              {isEn ? 'Done' : '确定'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
