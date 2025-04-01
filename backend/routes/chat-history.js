const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'fashion_db'
};

// Test connection on startup
async function testConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connection successful');
    await connection.end();
  } catch (error) {
    console.error('Initial database connection failed:', {
      message: error.message,
      code: error.code,
      state: error.sqlState,
      config: {
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database
      }
    });
  }
}

testConnection();

// Save chat history
router.post('/', async (req, res) => {
  // Enable CORS for all responses
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('POST request headers:', req.headers);
  console.log('POST request body:', req.body);

  try {
    const { userId, query, response } = req.body;
    
    console.log('Saving chat:', { userId, query, response });
    
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'INSERT INTO chat_history (user_id, query, response) VALUES (?, ?, ?)',
      [userId, query, response]
    );
    
    await connection.end();
    
    console.log('Chat saved successfully');
    res.json({ message: 'Chat history saved' });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Failed to save chat history',
      details: error.message 
    });
  }
});

// Test route at root path
router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT 1');
    await connection.end();
    res.json({ 
      message: 'Chat history API is working',
      dbConnection: 'successful',
      test: rows[0]
    });
  } catch (error) {
    console.error('API test failed:', error);
    res.status(500).json({ 
      error: 'API test failed',
      details: error.message 
    });
  }
});

// Get chat history
router.get('/:userId', async (req, res) => {
  console.log('\n=== Chat History Request ===');
  console.log('Headers:', req.headers);
  console.log('Params:', req.params);
  console.log('Query:', req.query);
  console.log('=========================\n');

  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('Getting chat history for user:', req.params.userId);
  try {
    const { userId } = req.params;
    
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('Executing query for user:', userId);
    const [rows] = await connection.execute(
      'SELECT * FROM chat_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50',
      [userId]
    );
    
    await connection.end();
    
    console.log(`Found ${rows.length} chat messages for user ${userId}`);
    console.log('First row sample:', rows[0]);
    
    // Ensure we're sending an array
    if (!Array.isArray(rows)) {
      throw new Error('Database returned invalid format');
    }
    
    res.json(rows);
  } catch (error) {
    console.error('Error getting chat history:', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      state: error.sqlState
    });
    res.status(500).json({ 
      error: 'Failed to get chat history',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test database connection
router.get('/test', async (req, res) => {
  try {
    console.log('Testing database connection with config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connection established');
    await connection.execute('SELECT 1');
    console.log('Test query successful');
    await connection.end();
    res.json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection test failed:', {
      message: error.message,
      code: error.code,
      state: error.sqlState
    });
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

module.exports = router; 