import axios from 'axios';

const deckApiUrl = 'https://deckofcardsapi.com/api/deck';

async function drawCards(deckId, count = 1) {
  const response = await axios.get(`${deckApiUrl}/${deckId}/draw/?count=${count}`);
  return response.data.cards;
}

async function createNewDeck() {
  const response = await axios.get(`${deckApiUrl}/new/shuffle/?deck_count=1`);
  return response.data.deck_id;
}

export default async function handler(req, res) {
  try {
    // Correctly parse the incoming state data
    const bodyJson = JSON.parse(req.body);
    const stateJson = JSON.parse(decodeURIComponent(bodyJson.untrustedData.state));
    const { deckId, gameState, roundNumber = 1 } = stateJson;

    let newDeckId = deckId;

    if (gameState === 'start' || !newDeckId) {
      newDeckId = await createNewDeck();
      const drawImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/ogDraw?round=1`;
      
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${drawImageUrl}" />
            <meta property="fc:frame:button:1" content="Draw Card" />
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/playWarFrame" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ deckId: newDeckId, gameState: 'draw', roundNumber: 1 }))}" />
          </head>
        </html>
      `);
    }

    if (gameState === 'draw') {
      const [playerCard, computerCard] = await drawCards(newDeckId, 2);
      const playerValue = cardValue(playerCard.value);
      const computerValue = cardValue(computerCard.value);

      let result;
      if (playerValue > computerValue) {
        result = 'You win!';
      } else if (playerValue < computerValue) {
        result = 'You lose!';
      } else {
        result = "It's a tie! War!";
      }

      const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/warOgImage?text=${encodeURIComponent(result)}&playerCard=${encodeURIComponent(playerCard.image)}&computerCard=${encodeURIComponent(computerCard.image)}`;

      const remainingCards = await axios.get(`${deckApiUrl}/${newDeckId}`);
      
      if (remainingCards.data.remaining <= 2) {
        const finalResult = 'Game Over!';
        const endGameImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/ogEndGame?text=${encodeURIComponent(finalResult)}`;

        return res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${endGameImageUrl}" />
              <meta property="fc:frame:button:1" content="Play Again" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/playWarFrame" />
              <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ gameState: 'start' }))}" />
            </head>
          </html>
        `);
      }

      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${ogImageUrl}" />
            <meta property="fc:frame:button:1" content="Next Round" />
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/playWarFrame" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ deckId: newDeckId, gameState: 'draw', roundNumber: parseInt(roundNumber) + 1 }))}" />
          </head>
        </html>
      `);
    }

  } catch (error) {
    console.error('Error in playWarFrame:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

function cardValue(value) {
  const values = { 'ACE': 14, 'KING': 13, 'QUEEN': 12, 'JACK': 11 };
  return values[value] || parseInt(value);
}