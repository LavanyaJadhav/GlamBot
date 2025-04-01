const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');

// Store recommendations in memory
let recommendations = [];

// Load CSV data on server start
fs.createReadStream('backend/Photos/clothing_recommendations_updated.csv')
  .pipe(csv())
  .on('data', (row) => {
    recommendations.push({
      category: row.Category,
      type: row['Recommendation Type'],
      item: row.Item,
      link: row.Link
    });
  })
  .on('end', () => {
    console.log('Successfully loaded recommendations CSV');
  });

// Add this array of valid categories
const validCategories = [
  'T-Shirt – Navy Blue',
  'Hoodie – Olive Green',
  'Jeans – Dark Grey',
  'Formal Shirt – Sky Blue',
  'Sweater – Maroon',
  'Jacket – Mustard Yellow',
  'Shorts – Beige',
  'Kurta – White',
  'Tracksuit – Black',
  'Blazer – Burgundy'
];

router.post('/api/recommendations', (req, res) => {
  try {
    const { clothingType, color } = req.body;
    const searchKey = `${clothingType} – ${color}`;
    
    // Validate against allowed categories
    if (!validCategories.includes(searchKey)) {
      return res.status(400).json({
        error: 'Invalid category-color combination',
        validCategories: validCategories.map(c => {
          const [type, col] = c.split(' – ');
          return { type, color: col }
        })
      });
    }

    const categoryRecommendations = recommendations
      .filter(r => r.category === searchKey)
      .reduce((acc, curr) => {
        acc[curr.type] = {
          item: curr.item,
          link: curr.link
        };
        return acc;
      }, {});

    if (Object.keys(categoryRecommendations).length === 0) {
      return res.status(404).json({ error: 'No recommendations found' });
    }

    res.json({
      recommendations: categoryRecommendations,
      originalCategory: searchKey
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 