const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { Configuration, OpenAIApi } = require('openai');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'fashion_ai'
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Import routes
const favoritesRouter = require('./routes/favorites');
const chatbotRouter = require('./routes/chatbot');
const usersRouter = require('./routes/users');
const styleProfileRouter = require('./routes/styleProfile');

// Register routes
app.use('/api/users', usersRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/style-profile', styleProfileRouter);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Fashion AI API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    details: err.message 
  });
});

module.exports = app; 