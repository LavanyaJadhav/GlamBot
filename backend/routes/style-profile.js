const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Test endpoint to verify route registration
router.get('/test-style-route', (req, res) => {
  res.json({ message: 'Style profile route is working' });
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get user's style profile
router.get('/users/:userId/styles', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT style_name, percentage 
      FROM style_preferences 
      WHERE user_id = ? 
      ORDER BY percentage DESC
    `, [userId]);

    if (!rows.length) {
      // If no data, return default values
      return res.json([
        { style_name: 'Casual', percentage: 45 },
        { style_name: 'Minimalist', percentage: 25 },
        { style_name: 'Streetwear', percentage: 20 },
        { style_name: 'Bohemian', percentage: 10 }
      ]);
    }

    res.json(rows);
  } catch (error) {
    console.error('Error fetching style profile:', error);
    res.status(500).json({ error: 'Failed to fetch style profile' });
  }
});

// Update user's style profile
router.post('/users/:userId/styles', async (req, res) => {
  try {
    const { userId } = req.params;
    const { styles } = req.body;

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Delete existing preferences
      await connection.execute(
        'DELETE FROM style_preferences WHERE user_id = ?',
        [userId]
      );

      // Insert new preferences
      for (const style of styles) {
        await connection.execute(
          'INSERT INTO style_preferences (user_id, style_name, percentage) VALUES (?, ?, ?)',
          [userId, style.style_name, style.percentage]
        );
      }

      await connection.commit();
      res.json({ message: 'Style preferences updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating style profile:', error);
    res.status(500).json({ error: 'Failed to update style profile' });
  }
});

module.exports = router; 