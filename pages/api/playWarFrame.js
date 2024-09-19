import axios from 'axios';

// Updated War card game logic with logging
const deckApiUrl = 'https://deckofcardsapi.com/api/deck';

async function drawCards(deckId, count = 1) {
  console.log(`Drawing ${count} card(s) from deck ${deckId}`);
  const response = await axios.get(`${deckApiUrl}/${deckId}/draw/?count=${count}`);
  console.log('Draw response:', response.data);
  return response.data.cards;
}

async function createNewDeck() {
  console.log('Creating new deck');
  const response = await axios.get(`${deckApiUrl}/new/shuffle/?deck_count=1`);
  console.log('New deck response:', response.data);
  return response.data.deck_id;
}

export default async function handler(req, res) {
  try {
    console.log('Request body:', req.body);
    const deckId = req.body?.deckId || await createNewDeck();
    console.log('Using deck ID:', deckId);

    const [playerCard, computerCard] = await drawCards(deckId, 2);
    console.log('Player card:', playerCard);
    console.log('Computer card:', computerCard);

    const playerValue = cardValue(playerCard.value);
    const computerValue = cardValue(computerCard.value);

    let result;
    if (playerValue > computerValue) {
      result = 'You win!';
    } else if (playerValue < computerValue) {
      result = 'You lose!';
    } else {
      result = "It's a tie! War!";  // Fixed: Changed single quotes to double quotes
    }

    const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/warOgImage?text=${encodeURIComponent(result)}&playerCard=${encodeURIComponent(playerCard.image)}&computerCard=${encodeURIComponent(computerCard.image)}`;

    const remainingCards = await axios.get(`${deckApiUrl}/${deckId}`);
    
    if (remainingCards.data.remaining === 0) {
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
          <meta property="fc:frame:button:1" content="Next Turn" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/playWarFrame" />
          <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ deckId }))}" />
        </head>
      </html>
    `);
  } catch (error) {
    console.error('Error in playWarFrame:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

function cardValue(value) {
  const values = { 'ACE': 14, 'KING': 13, 'QUEEN': 12, 'JACK': 11 };
  return values[value] || parseInt(value);
}