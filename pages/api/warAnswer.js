export default async function handler(req, res) {
    try {
      const { deckId } = req.body;
  
      if (!deckId) {
        return res.status(400).json({ error: 'Deck ID is required' });
      }
  
      // Check for winner logic here (can be extended as needed)
  
      // Send response for the next turn
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:button:1" content="Next Turn" />
            <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/playWarFrame" />
          </head>
          <body>
            <p>Prepare for the next turn!</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error in warAnswer:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  