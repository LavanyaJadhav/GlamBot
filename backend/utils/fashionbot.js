const { GoogleGenerativeAI } = require("@google/generative-ai");
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function getFashionResponse(userInput) {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // Get user preferences from database
    const [styles] = await connection.execute(
      'SELECT style_name FROM user_styles WHERE user_id = 1'
    );
    
    const [colors] = await connection.execute(
      'SELECT color_name FROM user_colors WHERE user_id = 1'
    );

    // Create context from database
    const userContext = {
      preferredStyles: styles.map(s => s.style_name).join(', '),
      preferredColors: colors.map(c => c.color_name).join(', ')
    };

    // Create enhanced prompt with user context
    const prompt = `
    As a fashion AI assistant named Glambot, help with: ${userInput}
    
    User's Style Context:
    - Preferred Styles: ${userContext.preferredStyles || 'Not specified'}
    - Preferred Colors: ${userContext.preferredColors || 'Not specified'}
    
    Focus on:
    1. Current fashion trends
    2. Specific style advice incorporating user preferences
    3. Practical recommendations
    4. Personal styling tips
    
    Please provide a detailed but concise response.`;

    // Get response from Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Store interaction in database
    await connection.execute(
      'INSERT INTO chat_history (user_id, query, response) VALUES (?, ?, ?)',
      [1, userInput, response.text()]
    );

    return {
      response: response.text(),
      context: userContext
    };

  } catch (error) {
    console.error('Fashion bot error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = { getFashionResponse }; 