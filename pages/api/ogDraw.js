import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const roundNumber = searchParams.get('round') || '1';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #4b6cb7, #182848)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        <h1 style={{ fontSize: 60, marginBottom: 40 }}>War: Round {roundNumber}</h1>
        <div style={{ fontSize: 36, textAlign: 'center' }}>
          Click "Draw Card" to play!
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}