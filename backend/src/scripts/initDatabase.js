const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'fashion_ai'
};

async function initializeDatabase() {
  let connection;
  try {
    // Create connection without database
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    // Drop existing database if it exists
    await connection.query(`DROP DATABASE IF EXISTS ${dbConfig.database}`);
    
    // Create new database
    await connection.query(`CREATE DATABASE ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);

    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        gender ENUM('male', 'female', 'other') NOT NULL,
        fashion_preference VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create User_Images table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_images (
        image_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    // Create AI_Analysis table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ai_analysis (
        analysis_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        image_id INT NOT NULL,
        style_type VARCHAR(100),
        confidence_score FLOAT,
        analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (image_id) REFERENCES user_images(image_id)
      )
    `);

    // Create Products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        product_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        brand VARCHAR(100),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create User_Favorites table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        favorite_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      )
    `);

    // Create color_palette_matching table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS color_palette_matching (
        palette_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        color_1 VARCHAR(7) NOT NULL,
        color_1_percentage DECIMAL(5,2) NOT NULL,
        color_2 VARCHAR(7) NOT NULL,
        color_2_percentage DECIMAL(5,2) NOT NULL,
        color_3 VARCHAR(7) NOT NULL,
        color_3_percentage DECIMAL(5,2) NOT NULL,
        color_4 VARCHAR(7) NOT NULL,
        color_4_percentage DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    // Create brand_preferences table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS brand_preferences (
        preference_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        brand_name VARCHAR(100) NOT NULL,
        preference_score DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    // Create Chat_History table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        chat_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    // Create Favorites table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        favorite_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        item_type VARCHAR(100),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    // Create Recommendations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recommendations (
        recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        item_type VARCHAR(100),
        confidence_score DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    // Create Upload_History table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS upload_history (
        upload_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(100),
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    // Create style_profile table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS style_profile (
        profile_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        style_1 VARCHAR(50) NOT NULL,
        style_1_percentage DECIMAL(5,2) NOT NULL,
        style_2 VARCHAR(50) NOT NULL,
        style_2_percentage DECIMAL(5,2) NOT NULL,
        style_3 VARCHAR(50) NOT NULL,
        style_3_percentage DECIMAL(5,2) NOT NULL,
        style_4 VARCHAR(50) NOT NULL,
        style_4_percentage DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    // Insert sample users
    await connection.query(`
      INSERT INTO users (name, email, password, gender, fashion_preference)
      VALUES 
        ('John Doe', 'root1@gmail.com', 'root1', 'male', 'casual'),
        ('Jane Smith', 'root2@gmail.com', 'root1', 'female', 'formal'),
        ('Mike Johnson', 'root3@gmail.com', 'root1', 'male', 'sporty'),
        ('Sarah Williams', 'root4@gmail.com', 'root1', 'female', 'bohemian')
    `);

    // Insert sample products
    await connection.query(`
      INSERT INTO products (name, description, price, category, brand, image_url)
      VALUES 
        ('Classic White T-Shirt', 'A comfortable cotton t-shirt', 29.99, 'Tops', 'BasicWear', 'https://example.com/tshirt.jpg'),
        ('Denim Jeans', 'Classic fit denim jeans', 59.99, 'Bottoms', 'DenimCo', 'https://example.com/jeans.jpg'),
        ('Leather Jacket', 'Genuine leather jacket', 199.99, 'Outerwear', 'LeatherLux', 'https://example.com/jacket.jpg'),
        ('Running Shoes', 'Comfortable running shoes', 89.99, 'Footwear', 'SportFit', 'https://example.com/shoes.jpg')
    `);

    // Insert sample user images
    await connection.query(`
      INSERT INTO user_images (user_id, image_url)
      VALUES 
        (1, 'https://example.com/user1-image1.jpg'),
        (1, 'https://example.com/user1-image2.jpg'),
        (2, 'https://example.com/user2-image1.jpg')
    `);

    // Insert sample AI analysis
    await connection.query(`
      INSERT INTO ai_analysis (user_id, image_id, style_type, confidence_score)
      VALUES 
        (1, 1, 'Casual', 0.85),
        (1, 2, 'Streetwear', 0.92),
        (2, 3, 'Business', 0.88)
    `);

    // Insert sample color palettes
    await connection.query(`
      INSERT INTO color_palette_matching (user_id, color_1, color_1_percentage, color_2, color_2_percentage, color_3, color_3_percentage, color_4, color_4_percentage)
      VALUES 
        (1, '#0000FF', 70.00, '#FFD700', 15.00, '#FF69B4', 10.00, '#32CD32', 5.00),
        (2, '#FF0000', 60.00, '#000000', 20.00, '#FFFFFF', 15.00, '#808080', 5.00),
        (3, '#00FF00', 50.00, '#FFA500', 25.00, '#800080', 15.00, '#FFC0CB', 10.00),
        (4, '#FFD700', 40.00, '#FF69B4', 30.00, '#4169E1', 20.00, '#32CD32', 10.00)
    `);

    // Insert sample brand preferences
    await connection.query(`
      INSERT INTO brand_preferences (user_id, brand_name, preference_score)
      VALUES 
        (1, 'Nike', 85.00),
        (1, 'Adidas', 75.00),
        (2, 'Gucci', 90.00),
        (2, 'Louis Vuitton', 80.00),
        (3, 'Puma', 85.00),
        (3, 'Under Armour', 75.00),
        (4, 'Zara', 80.00),
        (4, 'H&M', 70.00)
    `);

    // Insert sample chat history
    await connection.query(`
      INSERT INTO chat_history (user_id, message, response)
      VALUES 
        (1, 'What should I wear for a casual dinner?', 'Based on your style preferences, I recommend a blue denim jacket with black jeans and white sneakers.'),
        (2, 'Suggest formal attire for a wedding', 'Given your formal style preference, I suggest a classic black suit with a white shirt and pink tie.')
    `);

    // Insert sample style profiles
    await connection.query(`
      INSERT INTO style_profile (user_id, style_1, style_1_percentage, style_2, style_2_percentage, style_3, style_3_percentage, style_4, style_4_percentage)
      VALUES 
        (1, 'Casual', 45.00, 'Minimalist', 25.00, 'Streetwear', 20.00, 'Bohemian', 10.00),
        (2, 'Formal', 40.00, 'Classic', 30.00, 'Business', 20.00, 'Preppy', 10.00),
        (3, 'Athleisure', 35.00, 'Sporty', 25.00, 'Urban', 25.00, 'Techwear', 15.00),
        (4, 'Vintage', 30.00, 'Retro', 25.00, 'Artistic', 25.00, 'Eclectic', 20.00)
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase(); 