const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// Get all products
router.get('/', async (req, res) => {
  try {
    const [products] = await connection.promise().query('SELECT * FROM Products');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const [products] = await connection.promise().query(
      'SELECT * FROM Products WHERE product_id = ?',
      [req.params.id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(products[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Get products by style
router.get('/style/:style', async (req, res) => {
  try {
    const [products] = await connection.promise().query(
      'SELECT * FROM Products WHERE style = ?',
      [req.params.style]
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching products by style' });
  }
});

// Get products by color
router.get('/color/:color', async (req, res) => {
  try {
    const [products] = await connection.promise().query(
      'SELECT * FROM Products WHERE JSON_CONTAINS(colors, ?)',
      [JSON.stringify(req.params.color)]
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching products by color' });
  }
});

module.exports = router; 