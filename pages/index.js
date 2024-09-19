import Head from 'next/head';

export default function Home() {
  const shareText = encodeURIComponent('Play the classic card game War!\n\nFrame by @aaronv.eth\n\n');
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL)}`;

  // Use the existing cardwar.png image for the initial frame
  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cardwar.png`;

  return (
    <div>
      <Head>
        <title>Card War Game</title>
        <meta property="og:title" content="Card War Game" />
        <meta property="og:image" content={imageUrl} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={imageUrl} />
        <meta property="fc:frame:button:1" content="Play War" />
        <meta property="fc:frame:post_url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/api/playWarFrame`} />
        <meta property="fc:frame:state" content={encodeURIComponent(JSON.stringify({ gameState: 'start' }))} />
        <meta property="fc:frame:button:2" content="Share" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content={shareLink} />
      </Head>
      <main>
        <h1>Welcome to War!</h1>
        <p>Let's see who can win all the cards!</p>
      </main>
    </div>
  );
}