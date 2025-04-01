const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const connection = require('../config/database');
const { analyzeImage } = require('../services/imageAnalysis');
const { extractDominantColors } = require('../services/colorExtraction');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Upload and analyze image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const userId = req.body.user_id;
    const imageUrl = `/uploads/${req.file.filename}`;
    const imagePath = req.file.path;

    // Analyze image using Ollama
    const aiAnalysis = await analyzeImage(imagePath);

    // Extract color palette
    const colorPalette = await extractDominantColors(imagePath);

    // Store image information
    const [imageResult] = await connection.promise().query(
      'INSERT INTO User_Images (user_id, image_url, color_palette, style_category) VALUES (?, ?, ?, ?)',
      [userId, imageUrl, JSON.stringify(colorPalette), aiAnalysis.style]
    );

    // Store AI analysis
    await connection.promise().query(
      'INSERT INTO AI_Analysis (image_id, dominant_colors, pattern_analysis, suggested_style) VALUES (?, ?, ?, ?)',
      [
        imageResult.insertId,
        JSON.stringify(aiAnalysis.colors),
        aiAnalysis.patterns,
        aiAnalysis.style
      ]
    );

    res.status(201).json({
      image_id: imageResult.insertId,
      image_url: imageUrl,
      analysis: aiAnalysis,
      color_palette: colorPalette
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing image' });
  }
});

// Get user's images
router.get('/user/:userId', async (req, res) => {
  try {
    const [images] = await connection.promise().query(
      `SELECT i.*, a.* 
       FROM User_Images i 
       LEFT JOIN AI_Analysis a ON i.image_id = a.image_id 
       WHERE i.user_id = ?
       ORDER BY i.uploaded_at DESC`,
      [req.params.userId]
    );
    
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching images' });
  }
});

// Delete image
router.delete('/:imageId', async (req, res) => {
  try {
    const [result] = await connection.promise().query(
      'DELETE FROM User_Images WHERE image_id = ?',
      [req.params.imageId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting image' });
  }
});

module.exports = router; 