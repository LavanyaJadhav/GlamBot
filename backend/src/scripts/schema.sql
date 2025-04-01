-- Create database
CREATE DATABASE IF NOT EXISTS fashion_ai;
USE fashion_ai;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    fashion_preference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User_Images table
CREATE TABLE IF NOT EXISTS User_Images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    image_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create AI_Analysis table
CREATE TABLE IF NOT EXISTS AI_Analysis (
    analysis_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    image_id INT,
    style_type VARCHAR(100),
    confidence_score FLOAT,
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (image_id) REFERENCES User_Images(image_id)
);

-- Create Products table
CREATE TABLE IF NOT EXISTS Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User_Favorites table
CREATE TABLE IF NOT EXISTS User_Favorites (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Create User_Preferences table
CREATE TABLE IF NOT EXISTS User_Preferences (
    preference_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    preferred_colors VARCHAR(255),
    preferred_styles VARCHAR(255),
    disliked_styles VARCHAR(255),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create Color_Palette_Matching table
CREATE TABLE IF NOT EXISTS Color_Palette_Matching (
    palette_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    color_1 VARCHAR(100),
    color_1_percentage DECIMAL(5,2),
    color_2 VARCHAR(100),
    color_2_percentage DECIMAL(5,2),
    color_3 VARCHAR(100),
    color_3_percentage DECIMAL(5,2),
    color_4 VARCHAR(100),
    color_4_percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create Brand_Preferences table
CREATE TABLE IF NOT EXISTS Brand_Preferences (
    preference_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    brand_name VARCHAR(255),
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create Chat_History table
CREATE TABLE IF NOT EXISTS Chat_History (
    chat_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create Favorites table
CREATE TABLE IF NOT EXISTS Favorites (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    item_name VARCHAR(255) NOT NULL,
    item_type VARCHAR(100),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create Recommendations table
CREATE TABLE IF NOT EXISTS Recommendations (
    recommendation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    item_name VARCHAR(255) NOT NULL,
    item_type VARCHAR(100),
    confidence_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create Upload_History table
CREATE TABLE IF NOT EXISTS Upload_History (
    upload_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Insert sample data into Users table
INSERT INTO Users (email, password, name, gender, fashion_preference) VALUES
('root1@gmail.com', 'root1', 'John Doe', 'male', 'casual'),
('root2@gmail.com', 'root2', 'Jane Smith', 'female', 'formal'),
('root3@gmail.com', 'root3', 'Mike Johnson', 'male', 'sporty'),
('root4@gmail.com', 'root4', 'Sarah Williams', 'female', 'bohemian');

-- Insert sample products
INSERT INTO Products (name, description, price, category, brand, image_url) VALUES
('Classic White T-Shirt', 'A comfortable cotton t-shirt', 29.99, 'Tops', 'BasicWear', 'https://example.com/tshirt.jpg'),
('Denim Jeans', 'Classic fit denim jeans', 59.99, 'Bottoms', 'DenimCo', 'https://example.com/jeans.jpg'),
('Leather Jacket', 'Genuine leather jacket', 199.99, 'Outerwear', 'LeatherLux', 'https://example.com/jacket.jpg'),
('Running Shoes', 'Comfortable running shoes', 89.99, 'Footwear', 'SportFit', 'https://example.com/shoes.jpg');

-- Insert sample user images
INSERT INTO User_Images (user_id, image_url) VALUES
(1, 'https://example.com/user1-image1.jpg'),
(1, 'https://example.com/user1-image2.jpg'),
(2, 'https://example.com/user2-image1.jpg');

-- Insert sample AI analysis
INSERT INTO AI_Analysis (user_id, image_id, style_type, confidence_score) VALUES
(1, 1, 'Casual', 0.85),
(1, 2, 'Streetwear', 0.92),
(2, 3, 'Business', 0.88);

-- Insert sample user favorites
INSERT INTO User_Favorites (user_id, product_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4);

-- Insert sample data into User_Preferences table
INSERT INTO User_Preferences (user_id, preferred_colors, preferred_styles, disliked_styles) VALUES
(1, 'blue,black,white', 'casual,streetwear', 'formal,bohemian'),
(2, 'pink,purple,white', 'formal,preppy', 'streetwear,grunge'),
(3, 'red,black,grey', 'sporty,casual', 'formal,bohemian'),
(4, 'green,brown,cream', 'bohemian,vintage', 'formal,streetwear');

-- Insert sample data into Color_Palette_Matching table
INSERT INTO Color_Palette_Matching (user_id, color_1, color_1_percentage, color_2, color_2_percentage, color_3, color_3_percentage, color_4, color_4_percentage) VALUES
(1, '#0000FF', 70.00, '#FFD700', 15.00, '#FF69B4', 10.00, '#32CD32', 5.00),    -- Blue, Gold, Pink, Lime Green
(2, '#800080', 65.00, '#FFA500', 20.00, '#00CED1', 10.00, '#FF4500', 5.00),    -- Purple, Orange, Turquoise, Red-Orange
(3, '#FF0000', 60.00, '#4B0082', 25.00, '#00FF00', 10.00, '#FFB6C1', 5.00),    -- Red, Indigo, Green, Light Pink
(4, '#008000', 55.00, '#FF1493', 25.00, '#FFD700', 15.00, '#4169E1', 5.00);    -- Green, Deep Pink, Gold, Royal Blue

-- Insert sample data into Brand_Preferences table
INSERT INTO Brand_Preferences (user_id, brand_name) VALUES
(1, 'Nike'),
(1, 'Adidas'),
(2, 'Gucci'),
(2, 'Louis Vuitton'),
(3, 'Under Armour'),
(3, 'Puma'),
(4, 'Free People'),
(4, 'Anthropologie');

-- Insert sample data into Chat_History table
INSERT INTO Chat_History (user_id, message, response) VALUES
(1, 'What should I wear for a casual dinner?', 'Based on your style preferences, I recommend a blue denim jacket with black jeans and white sneakers.'),
(2, 'Suggest formal attire for a wedding', 'Given your formal style preference, I suggest a classic black suit with a white shirt and pink tie.'),
(3, 'What colors work well for a workout outfit?', 'Based on your sporty style, I recommend a red tank top with black shorts and grey sneakers.'),
(4, 'Suggest a bohemian outfit for a festival', 'Given your bohemian preference, I suggest a green maxi dress with brown leather accessories.');

-- Insert sample data into Favorites table
INSERT INTO Favorites (user_id, item_name, item_type) VALUES
(1, 'Blue Denim Jacket', 'outerwear'),
(1, 'Black Jeans', 'pants'),
(2, 'Black Suit', 'formal'),
(2, 'Pink Tie', 'accessories'),
(3, 'Red Tank Top', 'tops'),
(3, 'Black Shorts', 'pants'),
(4, 'Green Maxi Dress', 'dresses'),
(4, 'Brown Leather Bag', 'accessories');

-- Insert sample data into Recommendations table
INSERT INTO Recommendations (user_id, item_name, item_type, confidence_score) VALUES
(1, 'White Sneakers', 'shoes', 95.50),
(1, 'Grey Hoodie', 'tops', 88.75),
(2, 'Black Oxford Shoes', 'shoes', 92.25),
(2, 'White Blouse', 'tops', 89.00),
(3, 'Grey Athletic Shorts', 'pants', 94.50),
(3, 'Red Sports Bra', 'tops', 91.25),
(4, 'Cream Cardigan', 'outerwear', 93.75),
(4, 'Brown Sandals', 'shoes', 90.50);

-- Insert sample data into Upload_History table
INSERT INTO Upload_History (user_id, file_name, file_type) VALUES
(1, 'casual_outfit_1.jpg', 'image/jpeg'),
(1, 'streetwear_style.jpg', 'image/jpeg'),
(2, 'formal_suit.jpg', 'image/jpeg'),
(2, 'wedding_outfit.jpg', 'image/jpeg'),
(3, 'workout_set.jpg', 'image/jpeg'),
(3, 'sports_outfit.jpg', 'image/jpeg'),
(4, 'boho_dress.jpg', 'image/jpeg'),
(4, 'festival_look.jpg', 'image/jpeg'); 