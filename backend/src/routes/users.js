const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const getConnection = require('../config/database');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

const pool = mysql.createPool(dbConfig);

// Debug route should come first
router.get('/debug/users', (req, res) => {
  const connection = getConnection();
  connection.query('SELECT * FROM Users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Failed to fetch users' });
      return;
    }
    console.log('All users in database:', results);
    res.json(results);
  });
});

// Get user's color palette - specific routes should come before generic ones
router.get('/:userId/colors', (req, res) => {
  const connection = getConnection();
  connection.query(
    'SELECT * FROM Color_Palette_Matching WHERE user_id = ?',
    [req.params.userId],
    (err, results) => {
      if (err) {
        console.error('Error fetching color palette:', err);
        return res.status(500).json({ error: 'Failed to fetch color palette' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Color palette not found' });
      }

      res.json(results[0]);
    }
  );
});

// Get all users
router.get('/', (req, res) => {
  const connection = getConnection();
  connection.query(
    'SELECT user_id, name, email, gender FROM Users',
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching users' });
        return;
      }
      res.json(results);
    }
  );
});

// Get user by ID - generic ID route should come after specific routes
router.get('/:id', (req, res) => {
  const connection = getConnection();
  connection.query(
    'SELECT user_id, name, email, gender FROM Users WHERE user_id = ?',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user' });
        return;
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(results[0]);
    }
  );
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, gender, fashion_preference } = req.body;
    
    const connection = getConnection();
    const [result] = await connection.promise().query(
      'INSERT INTO Users (name, email, password, gender, fashion_preference) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, gender, fashion_preference]
    );
    
    res.status(201).json({
      user_id: result.insertId,
      name,
      email,
      gender,
      fashion_preference
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { name, email, gender, fashion_preference } = req.body;
    const userId = req.params.id;
    
    const connection = getConnection();
    const [result] = await connection.promise().query(
      'UPDATE Users SET name = ?, email = ?, gender = ?, fashion_preference = ? WHERE user_id = ?',
      [name, email, gender, fashion_preference, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const connection = getConnection();
    const [result] = await connection.promise().query(
      'DELETE FROM Users WHERE user_id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  const { username, password, name, gender, fashion_preference } = req.body;
  console.log('Registration attempt:', { username, name, gender, fashion_preference });

  try {
    // Check if user already exists
    const connection = getConnection();
    const [existingUsers] = await connection.promise().query(
      'SELECT * FROM Users WHERE email = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      console.log('User already exists:', username);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Insert new user
    const [result] = await connection.promise().query(
      'INSERT INTO Users (email, password, name, gender, fashion_preference) VALUES (?, ?, ?, ?, ?)',
      [username, password, name, gender, fashion_preference]
    );

    console.log('User registered successfully:', result.insertId);
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login route
router.post('/login', (req, res) => {
  const connection = getConnection();
  const { email, password } = req.body;

  console.log('Login attempt:', { email });

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check user credentials
  connection.query(
    'SELECT user_id, name, email, gender FROM Users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Error during login' });
      }

      console.log('Query results:', results);

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Login successful
      res.json({
        message: 'Login successful',
        user: results[0]
      });
    }
  );
});

// Signup route
router.post('/signup', (req, res) => {
  const connection = getConnection();
  
  try {
    const { name, email, password, gender } = req.body;

    // Validate input
    if (!name || !email || !password || !gender) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    connection.query(
      'SELECT * FROM Users WHERE email = ?',
      [email],
      (err, existingUsers) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Error checking existing user' });
        }

        if (existingUsers.length > 0) {
          return res.status(400).json({ error: 'Email already registered' });
        }

        // Insert new user
        connection.query(
          'INSERT INTO Users (name, email, password, gender) VALUES (?, ?, ?, ?)',
          [name, email, password, gender],
          (err, result) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Error creating user' });
            }

            res.status(201).json({
              message: 'User created successfully',
              userId: result.insertId
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

module.exports = router; 