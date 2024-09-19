import Head from 'next/head';

export default function Home() {
  const shareText = encodeURIComponent('Play the classic card game War!\n\nFrame by @aaronv.eth\n\n');
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL)}`;

  return (
    <div>
      <Head>
        <title>Card War Game</title>
        <meta property="og:title" content="Card War Game" />
        <meta property="og:image" content="/cardwar.png" /> {/* Updated to use public folder */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="/cardwar.png" /> {/* Updated to use public folder */}
        <meta property="fc:frame:button:1" content="Play War" />
        <meta property="fc:frame:post_url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/api/playWarFrame`} />
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
