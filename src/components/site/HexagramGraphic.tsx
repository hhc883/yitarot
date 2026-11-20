import React from 'react';

/** 六爻图形（Hexagram Graphic）：经典易经六爻矢量表现，与图稿 01、02、05 对齐 */
export function HexagramGraphic({ className = '' }: { className?: string }) {
  return (
    <svg
      width="72"
      height="56"
      viewBox="0 0 72 56"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* 上爻（六）：阳爻（整段） */}
      <rect x="0" y="0" width="72" height="5" fill="#171717" />
      {/* 五爻：阴爻（断两段） */}
      <rect x="0" y="10.2" width="31" height="5" fill="#171717" />
      <rect x="41" y="10.2" width="31" height="5" fill="#171717" />
      {/* 四爻：阴爻（断两段） */}
      <rect x="0" y="20.4" width="31" height="5" fill="#171717" />
      <rect x="41" y="20.4" width="31" height="5" fill="#171717" />
      {/* 三爻：阴爻（断两段） */}
      <rect x="0" y="30.6" width="31" height="5" fill="#171717" />
      <rect x="41" y="30.6" width="31" height="5" fill="#171717" />
      {/* 二爻：阴爻（断两段） */}
      <rect x="0" y="40.8" width="31" height="5" fill="#171717" />
      <rect x="41" y="40.8" width="31" height="5" fill="#171717" />
      {/* 初爻（一）：阳爻（整段） */}
      <rect x="0" y="51" width="72" height="5" fill="#171717" />
    </svg>
  );
}
