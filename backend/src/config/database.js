const mysql = require('mysql2');
require('dotenv').config();

let connection = null;

function initializeConnection() {
  return new Promise((resolve, reject) => {
    // First create a connection without specifying the database
    const initialConnection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    // Create the database if it doesn't exist
    initialConnection.query('CREATE DATABASE IF NOT EXISTS fashion_ai', (err) => {
      if (err) {
        console.error('Error creating database:', err);
        reject(err);
        return;
      }
      
      // Close the initial connection
      initialConnection.end();

      // Create the main connection with the database specified
      connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'fashion_ai'
      });

      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to database:', err);
          reject(err);
          return;
        }
        console.log('Connected to MySQL database');
        resolve(connection);
      });
    });
  });
}

// Initialize connection immediately
initializeConnection()
  .catch(err => {
    console.error('Failed to initialize database connection:', err);
    process.exit(1);
  });

// Export a function that returns the connection
module.exports = () => {
  if (!connection) {
    throw new Error('Database connection not established');
  }
  return connection;
}; 