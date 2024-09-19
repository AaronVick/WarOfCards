import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  const playerCard = searchParams.get('playerCard');
  const opponentCard = searchParams.get('opponentCard');
  const round = searchParams.get('round') || '1';
  const playerWins = searchParams.get('playerWins') || '0';
  const opponentWins = searchParams.get('opponentWins') || '0';

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
        <h1 style={{ fontSize: 60, marginBottom: 20 }}>Round {round}</h1>
        <h2 style={{ fontSize: 48, marginBottom: 40 }}>{text}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={playerCard} alt="Player's card" width="200" height="280" />
            <p style={{ fontSize: 32, marginTop: 20 }}>Your Card</p>
            <p style={{ fontSize: 24, marginTop: 10 }}>Wins: {playerWins}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={opponentCard} alt="Opponent's card" width="200" height="280" />
            <p style={{ fontSize: 32, marginTop: 20 }}>Opponent's Card</p>
            <p style={{ fontSize: 24, marginTop: 10 }}>Wins: {opponentWins}</p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}