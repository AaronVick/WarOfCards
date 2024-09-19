import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text') || 'Game Over';
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
          }}
        >
          <div style={{ fontSize: '60px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
            Round {round}
          </div>
          <div style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>
            {text}
          </div>
          <div style={{ fontSize: '36px', textAlign: 'center', marginBottom: '20px' }}>Game Over</div>
          <div style={{ fontSize: '30px', textAlign: 'center' }}>
            Final Score: You {playerWins} - {opponentWins} Opponent
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating end game image:', error);
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
}