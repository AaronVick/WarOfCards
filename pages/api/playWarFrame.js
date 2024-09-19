import axios from 'axios';

const deckApiUrl = 'https://deckofcardsapi.com/api/deck';

async function drawCards(deckId, pile) {
  const response = await axios.get(`${deckApiUrl}/${deckId}/pile/${pile}/draw/?count=1`);
  return response.data.cards[0];
}

async function createNewDeck() {
  const deckResponse = await axios.get(`${deckApiUrl}/new/shuffle/?deck_count=1`);
  const deckId = deckResponse.data.deck_id;

  // Split deck into two piles: player and computer
  const drawResponse = await axios.get(`${deckApiUrl}/${deckId}/draw/?count=52`);
  const cards = drawResponse.data.cards;

  const playerPile = cards.slice(0, 26).map(card => card.code).join(',');
  const computerPile = cards.slice(26).map(card => card.code).join(',');

  await axios.get(`${deckApiUrl}/${deckId}/pile/player/add/?cards=${playerPile}`);
  await axios.get(`${deckApiUrl}/${deckId}/pile/computer/add/?cards=${computerPile}`);

  return deckId;
}

export default async function handler(req, res) {
  try {
    const deckId = req.body?.deckId || await createNewDeck();
    const playerCard = await drawCards(deckId, 'player');
    const computerCard = await drawCards(deckId, 'computer');

    const playerValue = cardValue(playerCard.value);
    const computerValue = cardValue(computerCard.value);

    let result;
    if (playerValue > computerValue) {
      result = 'You win!';
    } else if (playerValue < computerValue) {
      result = 'You lose!';
    } else {
      result = 'It’s a tie! War!';
    }

    const pileResponse = await axios.get(`${deckApiUrl}/${deckId}/pile/player/list/`);
    if (pileResponse.data.piles.player.remaining === 0) {
      const finalResult = playerValue > computerValue ? 'Game Over: You Won!' : 'Game Over: You Lost!';

      const shareText = encodeURIComponent('Play the classic card game War!\n\nFrame by @aaronv.eth\n\n');
      const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL)}`;

      const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}api/ogEndGame?text=${encodeURIComponent(finalResult)}`;

      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${ogImageUrl}" />
            <meta property="fc:frame:button:1" content="Play Again" />
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}api/playWarFrame" />
            <meta property="fc:frame:button:2" content="Share" />
            <meta property="fc:frame:button:2:action" content="link" />
            <meta property="fc:frame:button:2:target" content="${shareLink}" />
          </head>
          <body>
            <p>${finalResult}</p>
          </body>
        </html>
      `);
    }

    const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}api/warOgImage?text=${encodeURIComponent(result)}&playerCard=${playerCard.image}&computerCard=${computerCard.image}`;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Card War Game</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${ogImageUrl}" />
          <meta property="fc:frame:button:1" content="Next Turn" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}api/playWarFrame" />
          <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ deckId }))}" />
        </head>
        <body>
          <p>${result}</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error in playWarFrame:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

function cardValue(value) {
  switch (value) {
    case 'ACE': return 14;
    case 'KING': return 13;
    case 'QUEEN': return 12;
    case 'JACK': return 11;
    default: return parseInt(value);
  }
}
