const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// Get user's favorites
router.get('/user/:userId', async (req, res) => {
  try {
    const [favorites] = await connection.promise().query(
      `SELECT p.*, uf.created_at as favorited_at 
       FROM User_Favorites uf 
       JOIN Products p ON uf.product_id = p.product_id 
       WHERE uf.user_id = ? 
       ORDER BY uf.created_at DESC`,
      [req.params.userId]
    );
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching favorites' });
  }
});

// Add a favorite
router.post('/', async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    
    const [result] = await connection.promise().query(
      'INSERT INTO User_Favorites (user_id, product_id) VALUES (?, ?)',
      [user_id, product_id]
    );
    
    res.status(201).json({
      favorite_id: result.insertId,
      user_id,
      product_id
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Product already in favorites' });
    }
    res.status(500).json({ error: 'Error adding favorite' });
  }
});

// Remove a favorite
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const [result] = await connection.promise().query(
      'DELETE FROM User_Favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error removing favorite' });
  }
});

module.exports = router; 