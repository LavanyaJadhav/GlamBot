const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const VALID_CATEGORIES = {
  'tshirt': 'T-Shirt – Navy Blue',
  'hoodie': 'Hoodie – Olive Green', 
  'jeans': 'Jeans – Dark Grey',
  'formalshirt': 'Formal Shirt – Sky Blue',
  'sweater': 'Sweater – Maroon',
  'jacket': 'Jacket – Mustard Yellow',
  'shorts': 'Shorts – Beige',
  'kurta': 'Kurta – White',
  'tracksuit': 'Tracksuit – Black',
  'blazer': 'Blazer – Burgundy'
};

// Ensure the Photos directory exists
const uploadDir = path.join(__dirname, '..', 'Photos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      // Keep original filename
      cb(null, file.originalname)
    }
  }),
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image');

// Debug route to test if the endpoint is accessible
router.get('/upload-test', (req, res) => {
  res.json({ message: 'Upload endpoint is working' });
});

// Simple upload endpoint
router.post('/upload', function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      success: true,
      imagePath: `/Photos/${req.file.filename}`
    });
  });
});

module.exports = router; 