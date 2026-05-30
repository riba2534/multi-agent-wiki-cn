import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

export const dynamic = 'force-static';
export const alt = 'Multi-Agent Wiki';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 72,
          background: 'linear-gradient(135deg, #0f1218 0%, #1a1d23 55%, #2a3142 100%)',
          color: '#f4f4f5',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6d4aff, #b84dff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Hub-and-spoke network mark — matches the app logo (orchestration
                / fan-out). Inline SVG so the OG image stays self-contained. */}
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
                <line x1="16" y1="16" x2="16" y2="6" />
                <line x1="16" y1="16" x2="16" y2="26" />
                <line x1="16" y1="16" x2="6" y2="16" />
                <line x1="16" y1="16" x2="26" y2="16" />
                <line x1="16" y1="16" x2="9" y2="9" />
                <line x1="16" y1="16" x2="23" y2="9" />
                <line x1="16" y1="16" x2="9" y2="23" />
                <line x1="16" y1="16" x2="23" y2="23" />
              </g>
              <circle cx="16" cy="6" r="2" fill="#fff" />
              <circle cx="16" cy="26" r="2" fill="#fff" />
              <circle cx="6" cy="16" r="2" fill="#fff" />
              <circle cx="26" cy="16" r="2" fill="#fff" />
              <circle cx="9" cy="9" r="2" fill="#fff" />
              <circle cx="23" cy="9" r="2" fill="#fff" />
              <circle cx="9" cy="23" r="2" fill="#fff" />
              <circle cx="23" cy="23" r="2" fill="#fff" />
              <circle cx="16" cy="16" r="3.4" fill="#fff" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>{SITE_NAME}</div>
            <div style={{ fontSize: 13, opacity: 0.55, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              patterns · runtime · references
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              maxWidth: 1000,
            }}
          >
            Multi-Agent Wiki
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              opacity: 0.72,
              maxWidth: 920,
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>

        {/* Footer chips */}
        <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
          {['30 patterns', '6 runtime guides', 'glossary', 'live diagrams'].map(t => (
            <div
              key={t}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.14)',
                fontSize: 16,
                opacity: 0.85,
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
