import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  const round = searchParams.get('round') || 'Final';
  const playerWins = searchParams.get('playerWins') || '0';
  const opponentWins = searchParams.get('opponentWins') || '0';

  console.log('OG image generation started for End Game with text:', text);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #4b6cb7, #182848)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '20px',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          Round {round}
        </div>
        <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>
          {text}
        </div>
        <div style={{ fontSize: 36, textAlign: 'center', marginBottom: '20px' }}>Game Over</div>
        <div style={{ fontSize: 30, textAlign: 'center' }}>
          Final Score: You {playerWins} - {opponentWins} Opponent
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}