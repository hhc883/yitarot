import React from 'react';

export type ToolIconName =
  | 'east-liuyao'
  | 'east-bazi'
  | 'east-ziwei'
  | 'east-meihua'
  | 'east-compatibility'
  | 'east-bazi-daily'
  | 'east-qimen'
  | 'east-almanac'
  | 'east-relationship'
  | 'west-draw'
  | 'west-reading'
  | 'west-daily'
  | 'west-spreads'
  | 'west-cards'
  | 'west-yes-no'
  | 'west-love'
  | 'west-weekly';

export interface ToolIconProps {
  name: ToolIconName;
  size?: number;
  className?: string;
}

const ICON_SHAPES: Record<ToolIconName, React.ReactNode> = {
  'east-liuyao': (
    <>
      <path d="M4 4h16" />
      <path d="M4 7.2h6M14 7.2h6" />
      <path d="M4 10.4h16" />
      <path d="M4 13.6h6M14 13.6h6" />
      <path d="M4 16.8h16" />
      <path d="M4 20h6M14 20h6" />
    </>
  ),
  'east-bazi': (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.6" />
      <path d="M7.5 5v14M12 5v14M16.5 5v14M3 12h18" />
    </>
  ),
  'east-ziwei': (
    <>
      <rect x="3" y="3" width="18" height="18" rx="1.8" />
      <path d="M7.5 3v1.8M12 3v1.8M16.5 3v1.8" />
      <path d="M7.5 19.2V21M12 19.2V21M16.5 19.2V21" />
      <path d="M3 7.5h1.8M3 12h1.8M3 16.5h1.8" />
      <path d="M19.2 7.5H21M19.2 12H21M19.2 16.5H21" />
      <path d="M12 8.2l1.1 2.7L15.8 12l-2.7 1.1L12 15.8l-1.1-2.7L8.2 12l2.7-1.1Z" />
    </>
  ),
  'east-meihua': (
    <>
      <path d="M6.5 4h11" />
      <path d="M6.5 6.2h11" />
      <path d="M6.5 8.4h4M13.5 8.4h4" />
      <path d="M6.5 15.6h4M13.5 15.6h4" />
      <path d="M6.5 17.8h11" />
      <path d="M6.5 20h11" />
    </>
  ),
  'east-compatibility': (
    <>
      <path d="M5.4 11.4L4.6 5.4c-.1-1 1.4-1.1 1.7-.1l.9 5.3" />
      <path d="M7.3 10.6l.9-5.4c.2-1 1.7-.8 1.6.2l-.7 5.8c1 .7 1.7 1.6 1.8 2.6.1.8-.4 1.4-1.2 1.6l-1.2.3c-.2 1-.2 2 0 2.8" />
      <path d="M5.4 11.4c-1.3 1.1-1.6 3.3-.6 4.8.4.7.6 1.5.6 2.3" />
      <circle cx="8.2" cy="13" r="0.7" fill="currentColor" stroke="none" />
      <path d="M15.2 10.2c-1.1-.8-1.8-2.2-1.7-3.8" />
      <path d="M18.4 10.2c1.2-.8 2-2.2 2-3.8" />
      <path d="M15.2 10.2c-1.1.7-1.9 1.8-2.3 3.1-.2.8.1 1.7.8 2.1.6.3 1.2.4 1.8.4.2.9.2 1.8 0 2.7" />
      <path d="M18.4 10.2c1.4 1.2 1.8 3.6.9 5.5-.3.8-.5 1.8-.4 2.8" />
      <circle cx="15.9" cy="12.8" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  'east-bazi-daily': (
    <>
      <path d="M8 2.8v2.4M16 2.8v2.4" />
      <rect x="3.5" y="4.2" width="17" height="16.8" rx="2" />
      <path d="M3.5 8.5h17" />
      <rect x="9.5" y="10.5" width="5" height="8.5" rx="1" />
      <path d="M9.5 14.75h5" />
    </>
  ),
  'east-qimen': (
    <>
      <rect x="3" y="3" width="18" height="18" rx="1.8" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </>
  ),
  'east-almanac': (
    <>
      <path d="M8 2.8v2.4M16 2.8v2.4" />
      <rect x="3.5" y="4.2" width="17" height="16.8" rx="2" />
      <path d="M3.5 8.5h17" />
      <circle cx="12" cy="14.75" r="3.4" />
      <circle cx="12" cy="14.75" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  'east-relationship': (
    <>
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="6" cy="5.5" r="1.6" />
      <circle cx="18.5" cy="6" r="1.6" />
      <circle cx="5.5" cy="17.5" r="1.6" />
      <circle cx="18" cy="18.5" r="1.6" />
      <path d="M10.4 10.2L7.1 6.7M13.8 10.4l3.5-3.3M10.2 13.6l-3.5 2.9M13.6 13.8l3.3 3.5" />
    </>
  ),
  'west-draw': (
    <>
      <rect x="10.5" y="3.5" width="9.5" height="13.5" rx="1.4" />
      <path d="M15.25 8.8l1.2 1.45-1.2 1.45-1.2-1.45Z" />
      <path d="M10.5 7H7.9A1.4 1.4 0 0 0 6.5 8.4v10.7a1.4 1.4 0 0 0 1.4 1.4h6.7a1.4 1.4 0 0 0 1.4-1.4V17" />
      <path d="M4.2 9.5v9.8a1.4 1.4 0 0 0 1.4 1.4h7.5" />
    </>
  ),
  'west-reading': (
    <>
      <rect x="3.5" y="4.5" width="8.5" height="15" rx="1.4" />
      <path d="M7.75 10.3l1.15 1.7-1.15 1.7-1.15-1.7Z" />
      <path d="M14.5 7.5h6M14.5 11h5M14.5 14.5h6M14.5 18h4" />
    </>
  ),
  'west-daily': (
    <>
      <rect x="7.5" y="9" width="9" height="12" rx="1.4" />
      <path d="M8.8 9a3.2 3.2 0 0 1 6.4 0" />
      <path d="M12 3.2v1.6M7 5.2l1.1 1.1M17 5.2l-1.1 1.1" />
      <circle cx="12" cy="15" r="0.85" fill="currentColor" stroke="none" />
    </>
  ),
  'west-spreads': (
    <>
      <rect x="9.5" y="3.5" width="5" height="7.2" rx="1" />
      <rect x="3.5" y="13.3" width="5" height="7.2" rx="1" />
      <rect x="15.5" y="13.3" width="5" height="7.2" rx="1" />
    </>
  ),
  'west-cards': (
    <>
      <path d="M12 6.5c-1.8-1.3-4.5-1.8-8-1.5v13c3.5-.3 6.2.2 8 1.5 1.8-1.3 4.5-1.8 8-1.5V5c-3.5-.3-6.2.2-8 1.5Z" />
      <path d="M12 6.5v13" />
      <path d="M6 9.8h3.5M6 12.8h3.5" />
      <rect x="14.2" y="8.2" width="3.8" height="6" rx="0.6" />
    </>
  ),
  'west-yes-no': (
    <>
      <path d="M12 20.5V13c0-1.5-.8-2.8-2-3.8L5.5 5.5" />
      <path d="M12 13c0-1.5.8-2.8 2-3.8L18.5 5.5" />
      <path d="M5.5 9V5.5H9" />
      <path d="M15 5.5h3.5V9" />
    </>
  ),
  'west-love': (
    <>
      <rect
        x="3.2"
        y="6.25"
        width="6.2"
        height="11.5"
        rx="1.2"
        transform="rotate(8 6.3 12)"
      />
      <rect
        x="14.6"
        y="6.25"
        width="6.2"
        height="11.5"
        rx="1.2"
        transform="rotate(-8 17.7 12)"
      />
      <circle cx="6.3" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="17.7" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  'west-weekly': (
    <>
      <rect x="3.5" y="4" width="4.4" height="6.8" rx="0.8" />
      <rect x="9.8" y="4" width="4.4" height="6.8" rx="0.8" />
      <rect x="16.1" y="4" width="4.4" height="6.8" rx="0.8" />
      <rect x="6.65" y="13.2" width="4.4" height="6.8" rx="0.8" />
      <rect x="12.95" y="13.2" width="4.4" height="6.8" rx="0.8" />
    </>
  )
};

export function ToolIcon({ name, size = 24, className }: ToolIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-tool-icon={name}
      className={className}
    >
      {ICON_SHAPES[name]}
    </svg>
  );
}
