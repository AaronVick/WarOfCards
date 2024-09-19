import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  const playerCard = searchParams.get('playerCard');
  const computerCard = searchParams.get('computerCard');

  console.log('OG image generation started for War Round with text:', text);

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
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <img src={playerCard} alt="Player's card" style={{ width: '200px', height: 'auto' }} />
          <img src={computerCard} alt="Computer's card" style={{ width: '200px', height: 'auto' }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}