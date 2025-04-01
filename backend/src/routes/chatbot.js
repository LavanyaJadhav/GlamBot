const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const getConnection = require('../config/database');

// Initialize Gemini API with error handling
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Helper function to execute database queries
async function executeQuery(query, params = []) {
  const connection = getConnection();
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

async function handleChatMessage(userMessage) {
  try {
    // Create a fashion-focused prompt
    const prompt = `As a fashion AI assistant, please provide a helpful response to: ${userMessage}
    Focus on current fashion trends, style advice, and personalized recommendations.
    Be specific, friendly, and concise.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in chat:", error);
    return "I'm sorry, I encountered an error processing your message.";
  }
}

// Add chat endpoint
router.post('/message', async (req, res) => {
  try {
    console.log('Received request:', {
      body: req.body,
      headers: req.headers,
    });
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log('Received message:', message);
    const response = await handleChatMessage(message);
    console.log('Generated response:', response);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Get user's chat history
router.get('/history/:userId', async (req, res) => {
  try {
    const [history] = await getConnection().promise().query(
      'SELECT * FROM Chatbot_History WHERE user_id = ? ORDER BY timestamp DESC',
      [req.params.userId]
    );
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching chat history' });
  }
});

// Export the router
module.exports = router; 