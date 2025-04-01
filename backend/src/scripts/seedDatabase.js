const connection = require('../config/database');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function seedDatabase() {
  try {
    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.promise().query(statement);
      }
    }
    
    // Insert sample user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await connection.promise().query(
      'INSERT INTO Users (name, email, password, gender, fashion_preference) VALUES (?, ?, ?, ?, ?)',
      ['Test User', 'test@example.com', hashedPassword, 'Female', 'Casual']
    );
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    connection.end();
  }
}

seedDatabase(); 