'use client';

import React, { useState } from 'react';

export interface CelticCrossPositionItem {
  number: number;
  name: string;
  group: 'Cross' | 'Staff';
  description: string;
}

interface CelticCrossDiagramProps {
  positions: CelticCrossPositionItem[];
}

export function CelticCrossDiagram({ positions }: CelticCrossDiagramProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = positions[selectedIndex] || positions[0];

  const byNum = (num: number) => positions[num - 1];

  const renderPositionButton = (item: CelticCrossPositionItem, compact = false) => {
    const idx = item.number - 1;
    const isSelected = selectedIndex === idx;
    return (
      <button
        key={item.number}
        type="button"
        aria-pressed={isSelected}
        onClick={() => setSelectedIndex(idx)}
        className={`w-full min-h-[44px] rounded-lg border p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 ${
          isSelected
            ? 'border-[#171717] bg-[#171717] text-white'
            : 'border-[#E4E4E7] bg-white text-[#171717] hover:border-[#171717]/60'
        }`}
      >
        <div className="flex items-center justify-between gap-1.5">
          <span
            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[11px] font-semibold ${
              isSelected ? 'bg-white text-[#171717]' : 'bg-[#F5F5F6] text-[#171717]'
            }`}
          >
            {item.number}
          </span>
          <span
            className={`font-mono text-[10px] uppercase tracking-wider ${
              isSelected ? 'text-white/75' : 'text-[#52525B]'
            }`}
          >
            {item.group}
          </span>
        </div>
        <div
          className={`mt-1.5 font-serif leading-snug ${
            compact ? 'text-xs' : 'text-xs sm:text-sm'
          } font-medium`}
        >
          {item.name}
        </div>
      </button>
    );
  };

  return (
    <section
      aria-label="Interactive 10-position Celtic Cross spread diagram"
      className="rounded-xl border border-[#E4E4E7] bg-white p-4 sm:p-6 space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E4E7] pb-3">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-normal text-[#171717]">
            Interactive 10-Position Diagram
          </h2>
          <p className="text-xs text-[#52525B]">
            Select any position in the Cross (1–6) or Staff (7–10) to inspect its role.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedIndex((prev) => (prev - 1 + positions.length) % positions.length)}
            className="inline-flex min-h-[44px] items-center rounded-md border border-[#E4E4E7] px-3 py-1.5 text-xs font-medium text-[#171717] hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => setSelectedIndex((prev) => (prev + 1) % positions.length)}
            className="inline-flex min-h-[44px] items-center rounded-md border border-[#E4E4E7] px-3 py-1.5 text-xs font-medium text-[#171717] hover:border-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Desktop / Tablet Spatial Celtic Cross Layout (md+) */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-6 md:items-center">
        {/* Left: 6 Cross Positions */}
        <div className="md:col-span-8 rounded-lg border border-[#E4E4E7] bg-[#F5F5F6]/50 p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-[#52525B]">
            The Cross (Positions 1–6)
          </p>
          <div className="grid grid-cols-3 gap-3 items-center">
            {/* Row 1: Position 5 Above */}
            <div />
            <div>{renderPositionButton(byNum(5), true)}</div>
            <div />

            {/* Row 2: 4 Left, 1+2 Center, 6 Right */}
            <div>{renderPositionButton(byNum(4), true)}</div>
            <div className="space-y-2 rounded-lg border border-dashed border-[#171717]/25 bg-white/70 p-2">
              {renderPositionButton(byNum(1), true)}
              {renderPositionButton(byNum(2), true)}
            </div>
            <div>{renderPositionButton(byNum(6), true)}</div>

            {/* Row 3: Position 3 Below */}
            <div />
            <div>{renderPositionButton(byNum(3), true)}</div>
            <div />
          </div>
        </div>

        {/* Right: 4 Staff Positions (10 at top down to 7 at bottom) */}
        <div className="md:col-span-4 rounded-lg border border-[#E4E4E7] bg-[#F5F5F6]/50 p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-[#52525B]">
            The Staff (Positions 7–10)
          </p>
          <div className="flex flex-col gap-2.5">
            {renderPositionButton(byNum(10), true)}
            {renderPositionButton(byNum(9), true)}
            {renderPositionButton(byNum(8), true)}
            {renderPositionButton(byNum(7), true)}
          </div>
        </div>
      </div>

      {/* Narrow Screen Accessible Layout (< md) */}
      <div className="space-y-4 md:hidden">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-[#52525B]">
            The Cross (Positions 1–6)
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {positions.slice(0, 6).map((item) => renderPositionButton(item, true))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-[#52525B]">
            The Staff (Positions 7–10)
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {positions.slice(6, 10).map((item) => renderPositionButton(item, true))}
          </div>
        </div>
      </div>

      {/* Selected Position Explanation Panel */}
      {selected && (
        <div
          aria-live="polite"
          className="rounded-lg border border-[#171717]/20 bg-[#F5F5F6] p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="rounded bg-[#171717] px-2 py-0.5 font-mono text-xs font-medium text-white">
              Position {selected.number}
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#52525B]">
              {selected.group}
            </span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-medium text-[#171717]">
            {selected.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[#171717]">
            {selected.description}
          </p>
        </div>
      )}
    </section>
  );
}
