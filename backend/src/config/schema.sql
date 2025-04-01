-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Color_Palette_Matching table
CREATE TABLE IF NOT EXISTS Color_Palette_Matching (
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
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create Brand_Preferences table
CREATE TABLE IF NOT EXISTS Brand_Preferences (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    brand_name VARCHAR(100) NOT NULL,
    preference_score DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create Style_Profile table
CREATE TABLE IF NOT EXISTS Style_Profile (
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
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Insert sample users
INSERT INTO Users (name, email, password, gender)
VALUES 
    ('John Doe', 'root1@gmail.com', 'root1', 'male'),
    ('Jane Smith', 'root2@gmail.com', 'root1', 'female'),
    ('Mike Johnson', 'root3@gmail.com', 'root1', 'male'),
    ('Sarah Williams', 'root4@gmail.com', 'root1', 'female');

-- Insert sample color palettes
INSERT INTO Color_Palette_Matching (user_id, color_1, color_1_percentage, color_2, color_2_percentage, color_3, color_3_percentage, color_4, color_4_percentage)
VALUES 
    (1, '#0000FF', 70.00, '#FFD700', 15.00, '#FF69B4', 10.00, '#32CD32', 5.00),
    (2, '#FF0000', 60.00, '#000000', 20.00, '#FFFFFF', 15.00, '#808080', 5.00),
    (3, '#00FF00', 50.00, '#FFA500', 25.00, '#800080', 15.00, '#FFC0CB', 10.00),
    (4, '#FFD700', 40.00, '#FF69B4', 30.00, '#4169E1', 20.00, '#32CD32', 10.00);

-- Insert sample brand preferences
INSERT INTO Brand_Preferences (user_id, brand_name, preference_score)
VALUES 
    (1, 'Nike', 85.00),
    (1, 'Adidas', 75.00),
    (2, 'Gucci', 90.00),
    (2, 'Louis Vuitton', 80.00),
    (3, 'Puma', 85.00),
    (3, 'Under Armour', 75.00),
    (4, 'Zara', 80.00),
    (4, 'H&M', 70.00);

-- Insert sample style profiles
INSERT INTO Style_Profile (user_id, style_1, style_1_percentage, style_2, style_2_percentage, style_3, style_3_percentage, style_4, style_4_percentage)
VALUES 
    (1, 'Casual', 45.00, 'Minimalist', 25.00, 'Streetwear', 20.00, 'Bohemian', 10.00),
    (2, 'Formal', 40.00, 'Classic', 30.00, 'Business', 20.00, 'Preppy', 10.00),
    (3, 'Athleisure', 35.00, 'Sporty', 25.00, 'Urban', 25.00, 'Techwear', 15.00),
    (4, 'Vintage', 30.00, 'Retro', 25.00, 'Artistic', 25.00, 'Eclectic', 20.00); 