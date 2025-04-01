-- Create the database
CREATE DATABASE IF NOT EXISTS glambot_db;
USE glambot_db;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female', 'non-binary', 'prefer not to say'),
    fashion_preference VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User_Images table
CREATE TABLE IF NOT EXISTS User_Images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    color_palette JSON,
    style_category VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Create AI_Analysis table
CREATE TABLE IF NOT EXISTS AI_Analysis (
    analysis_id INT AUTO_INCREMENT PRIMARY KEY,
    image_id INT NOT NULL,
    dominant_colors JSON,
    pattern_analysis VARCHAR(100),
    suggested_style VARCHAR(100),
    FOREIGN KEY (image_id) REFERENCES User_Images(image_id) ON DELETE CASCADE
);

-- Create Fashion_Products table
CREATE TABLE IF NOT EXISTS Fashion_Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    color VARCHAR(50),
    brand VARCHAR(100),
    price DECIMAL(10,2),
    stock_status BOOLEAN DEFAULT TRUE,
    product_url VARCHAR(255)
);

-- Create Recommendations table
CREATE TABLE IF NOT EXISTS Recommendations (
    rec_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    recommended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recommendation_type VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Fashion_Products(product_id) ON DELETE CASCADE
);

-- Create Chatbot_History table
CREATE TABLE IF NOT EXISTS Chatbot_History (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT,
    response TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Insert sample fashion products
INSERT INTO Fashion_Products (product_name, category, color, brand, price, product_url) VALUES
('Classic White T-Shirt', 'Shirt', 'White', 'Zara', 19.99, 'https://www.zara.com/classic-white-tshirt'),
('Black Skinny Jeans', 'Pants', 'Black', 'H&M', 39.99, 'https://www.hm.com/black-skinny-jeans'),
('Floral Summer Dress', 'Dress', 'Multicolor', 'Zara', 59.99, 'https://www.zara.com/floral-summer-dress'),
('Navy Blue Blazer', 'Jacket', 'Blue', 'Massimo Dutti', 129.99, 'https://www.massimodutti.com/navy-blazer'),
('Red Pleated Skirt', 'Skirt', 'Red', 'Mango', 45.99, 'https://www.mango.com/red-pleated-skirt'),
('Striped Cotton Shirt', 'Shirt', 'Blue/White', 'Uniqlo', 29.99, 'https://www.uniqlo.com/striped-cotton-shirt'),
('Beige Trench Coat', 'Coat', 'Beige', 'Burberry', 299.99, 'https://www.burberry.com/beige-trench-coat'),
('Knit Sweater', 'Sweater', 'Gray', 'H&M', 34.99, 'https://www.hm.com/knit-sweater');

-- Insert a sample user (password is hashed version of 'password123')
INSERT INTO Users (name, email, password, gender, fashion_preference) VALUES
('Test User', 'test@example.com', '$2a$10$6KqMR.5nxCKVXyMD9EyVzOO5wPqxBw9toPz8M5qF5QYqFPvXPsJTy', 'prefer not to say', 'casual');

-- You can now use these credentials to log in:
-- Email: test@example.com
-- Password: password123 