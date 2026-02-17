import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#06091a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <div style={{ fontSize: 90, fontWeight: 900, color: '#cc2200', lineHeight: 1 }}>T</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#5ba3d4', letterSpacing: 6 }}>HOCKEY</div>
      </div>
    ),
    { ...size }
  );
}
