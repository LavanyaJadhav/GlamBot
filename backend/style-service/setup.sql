CREATE TABLE IF NOT EXISTS style_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  style_name VARCHAR(100) NOT NULL,
  percentage INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_style (user_id, style_name),
  CONSTRAINT style_percentage_range CHECK (percentage >= 0 AND percentage <= 100)
); 