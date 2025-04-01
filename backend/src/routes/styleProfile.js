const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'fashion_ai'
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Test route
router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Style profile router is working' });
});

// Get user's style profile
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log('=== Style Profile Request ===');
  console.log('Received request for user ID:', userId);
  console.log('Request URL:', req.originalUrl);
  console.log('Request method:', req.method);
  
  try {
    console.log('Executing SQL query...');
    const query = 'SELECT * FROM Style_Profile WHERE user_id = ?';
    console.log('Query:', query);
    console.log('Parameters:', [userId]);

    const [styleProfile] = await pool.promise().query(query, [userId]);
    console.log('Query executed successfully');
    console.log('Results:', styleProfile);

    if (styleProfile.length === 0) {
      console.log('No style profile found for user:', userId);
      return res.status(404).json({ error: 'Style profile not found' });
    }

    console.log('Sending style profile data:', styleProfile[0]);
    res.json(styleProfile[0]);
  } catch (error) {
    console.error('Database error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch style profile' });
  }
});

module.exports = router; 