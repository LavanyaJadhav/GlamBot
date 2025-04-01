const express = require('express');
const router = express.Router();
const { getFashionResponse } = require('../utils/fashionbot');

// POST /api/chat/message endpoint
router.post('/message', async (req, res) => {
  try {
    console.log('Received message:', req.body.message);
    
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get personalized response using database context
    const { response, context } = await getFashionResponse(message);
    
    console.log('AI Response with context:', { response, context });
    res.json({ response, context });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

module.exports = router; 