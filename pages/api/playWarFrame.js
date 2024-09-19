import axios from 'axios';

const deckApiUrl = 'https://deckofcardsapi.com/api/deck';

// Function to draw cards from a pile
async function drawCards(deckId, pile) {
  const response = await axios.get(`${deckApiUrl}/${deckId}/pile/${pile}/draw/?count=1`);
  return response.data.cards[0]; // Return a single card
}

// Function to create a new deck and split it into two piles (player and computer)
async function createNewDeck() {
  const deckResponse = await axios.get(`${deckApiUrl}/new/shuffle/?deck_count=1`);
  const deckId = deckResponse.data.deck_id;

  // Draw 26 cards for each player and split them into two piles
  const drawResponse = await axios.get(`${deckApiUrl}/${deckId}/draw/?count=52`);
  const cards = drawResponse.data.cards;
  
  const playerPile = cards.slice(0, 26).map(card => card.code).join(',');
  const computerPile = cards.slice(26).map(card => card.code).join(',');

  // Add the cards to piles for player and computer
  await axios.get(`${deckApiUrl}/${deckId}/pile/player/add/?cards=${playerPile}`);
  await axios.get(`${deckApiUrl}/${deckId}/pile/computer/add/?cards=${computerPile}`);

  return deckId;
}

// Main handler for the frame
export default async function handler(req, res) {
  try {
    // Get or create deck ID
    const deckId = req.body?.deckId || await createNewDeck();
    
    // Draw one card each from the player and computer piles
    const playerCard = await drawCards(deckId, 'player');
    const computerCard = await drawCards(deckId, 'computer');

    // Card values
    const playerValue = cardValue(playerCard.value);
    const computerValue = cardValue(computerCard.value);

    // Determine result
    let result;
    if (playerValue > computerValue) {
      result = 'You win!';
    } else if (playerValue < computerValue) {
      result = 'You lose!';
    } else {
      result = 'It’s a tie! War!';
    }

    // Check if one pile is empty to end the game
    const pileResponse = await axios.get(`${deckApiUrl}/${deckId}/pile/player/list/`);
    if (pileResponse.data.piles.player.remaining === 0) {
      result = playerValue > computerValue ? 'Game Over: You Won!' : 'Game Over: You Lost!';
    }

    // Dynamic image URL for Vercel OG
    const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/warOgImage?text=${encodeURIComponent(result)}&playerCard=${playerCard.image}&computerCard=${computerCard.image}`;

    // Return response for the frame
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Card War Game</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${ogImageUrl}" />
          <meta property="fc:frame:button:1" content="Next Turn" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/playWarFrame" />
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

// Function to convert card value to a numeric value for comparison
function cardValue(value) {
  switch (value) {
    case 'ACE': return 14;
    case 'KING': return 13;
    case 'QUEEN': return 12;
    case 'JACK': return 11;
    default: return parseInt(value);
  }
}
