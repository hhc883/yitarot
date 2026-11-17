import React from 'react';

interface TaijiMarkProps {
  /** 直径（px），传 '100%' 时跟随父容器宽度 */
  size?: number | string;
  className?: string;
  ink?: string;
  paper?: string;
  /** 外圈细环宽度（默认 1.6，与原有描边视觉一致） */
  strokeWidth?: number;
}

/**
 * 纯黑白太极（标准 S 曲线，含鱼眼）
 * 用于首页首屏与东 / 西入口，不含任何金色描线或渐变，便于黑白中性版面。
 *
 * 几何要点：外圈用「实心黑盘 + 半径小一圈的白色底盘」形成均匀圆环，
 * 避免 stroke 的一半被裁掉、另一半被黑色阴鱼吞掉造成左右不对称；
 * viewBox 留出余量，保证上下左右四个极点是完整圆弧，旋转时始终是正圆。
 */
export function TaijiMark({
  size = 120,
  className = '',
  ink = '#171717',
  paper = '#FFFFFF',
  strokeWidth = 1.6
}: TaijiMarkProps) {
  const outer = 100;
  const inner = outer - strokeWidth;
  // 阴鱼大弧略大于白底盘，直接盖住底盘右半边缘，
  // 避免两条同半径边界相叠时抗锯齿产生的一圈淡线
  const fishR = inner + strokeWidth * 0.6;
  const half = fishR / 2;
  const view = outer + Math.max(2, strokeWidth);

  return (
    <svg
      viewBox={`${-view} ${-view} ${view * 2} ${view * 2}`}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* 均匀外环：先铺实心黑盘，再由缩小的白底盘让出等宽圆环 */}
      <circle cx="0" cy="0" r={outer} fill={ink} />
      {/* 阳鱼底盘 */}
      <circle cx="0" cy="0" r={inner} fill={paper} />
      {/* 阴鱼（严谨 S 曲线闭合路径） */}
      <path
        d={`M 0,${-fishR} A ${fishR},${fishR} 0 0,1 0,${fishR} A ${half},${half} 0 0,1 0,0 A ${half},${half} 0 0,0 0,${-fishR} Z`}
        fill={ink}
      />
      {/* 阳中之阴眼 */}
      <circle cx="0" cy={-half} r="12" fill={ink} />
      {/* 阴中之阳眼 */}
      <circle cx="0" cy={half} r="12" fill={paper} />
    </svg>
  );
}
