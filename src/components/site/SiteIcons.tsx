import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/** 西方塔罗：单张牌线形图标（牌面 + 星芒） */
export function IconTarotCard({ size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="4.2" y="2.6" width="15.6" height="18.8" rx="2.4" />
      <rect x="7" y="5.4" width="10" height="13.2" rx="1.2" strokeOpacity={0.4} />
      <path d="M12 8.4l1.15 2.45L15.6 12l-2.45 1.15L12 15.6l-1.15-2.45L8.4 12l2.45-1.15L12 8.4z" />
      <path d="M8.4 17.4h7.2" strokeOpacity={0.4} />
    </svg>
  );
}

/** 向上箭头（用于首屏上滑提示） */
export function IconArrowUp({ size = 12, className = '', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M12 19V5" />
      <path d="M5.5 11.5L12 5l6.5 6.5" />
    </svg>
  );
}
