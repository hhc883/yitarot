import React from 'react';

interface TaijiMarkProps {
  /** 直径（px），传 '100%' 时跟随父容器宽度 */
  size?: number | string;
  className?: string;
  ink?: string;
  paper?: string;
  strokeWidth?: number;
}

/**
 * 纯黑白太极（标准 S 曲线，含鱼眼）
 * 用于首页首屏与东 / 西入口，不含任何金色描线或渐变，便于黑白中性版面。
 */
export function TaijiMark({
  size = 120,
  className = '',
  ink = '#0A0A0A',
  paper = '#FFFFFF',
  strokeWidth = 1.6
}: TaijiMarkProps) {
  return (
    <svg
      viewBox="-100 -100 200 200"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* 阳鱼底盘 */}
      <circle cx="0" cy="0" r="100" fill={paper} />
      {/* 阴鱼（严谨 S 曲线闭合路径） */}
      <path
        d="M 0,-100 A 100,100 0 0,1 0,100 A 50,50 0 0,1 0,0 A 50,50 0 0,0 0,-100 Z"
        fill={ink}
      />
      {/* 阳中之阴眼 */}
      <circle cx="0" cy="-50" r="12" fill={ink} />
      {/* 阴中之阳眼 */}
      <circle cx="0" cy="50" r="12" fill={paper} />
      {/* 外廓收口 */}
      <circle cx="0" cy="0" r="100" fill="none" stroke={ink} strokeWidth={strokeWidth} />
    </svg>
  );
}
