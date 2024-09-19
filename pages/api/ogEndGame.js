import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: 'lightblue',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'sans-serif',
          padding: '20px',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          {text}
        </div>
        <div style={{ fontSize: 30, textAlign: 'center' }}>
          Game Over
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
