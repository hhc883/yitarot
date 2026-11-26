import { ImageResponse } from 'next/og';

export const alt = 'YiTatro — 东方周易与西方塔罗 AI 命理';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          color: '#171717',
          padding: '64px 76px',
          border: '1px solid #E4E4E7'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            fontSize: 24,
            letterSpacing: '0.18em',
            color: '#52525B'
          }}
        >
          <span>YITATRO</span>
          <span>EASTERN WISDOM &amp; WESTERN TAROT</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '52px'
          }}
        >
          {/* Minimalist Taiji Circle */}
          <svg
            width="160"
            height="160"
            viewBox="0 0 100 100"
            style={{ flexShrink: 0 }}
          >
            <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#171717" strokeWidth="2.5" />
            <path
              d="M 50 2 A 48 48 0 0 1 50 98 A 24 24 0 0 1 50 50 A 24 24 0 0 0 50 2 Z"
              fill="#171717"
            />
            <circle cx="50" cy="26" r="7" fill="#171717" />
            <circle cx="50" cy="74" r="7" fill="#FFFFFF" />
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              起卦 · 排八字 · 抽塔罗
            </div>
            <div style={{ fontSize: 30, color: '#52525B', lineHeight: 1.4 }}>
              I Ching, BaZi, Ziwei &amp; Rider-Waite Tarot AI Sanctuary
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            borderTop: '1px solid #E4E4E7',
            paddingTop: '24px',
            fontSize: 22,
            color: '#71717A'
          }}
        >
          <span>不做宿命判决，只作内心镜像</span>
          <span>yitarot.net</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
