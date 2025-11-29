

USE dio_db;

-- Drop tables if exists (to fix schema issues)
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS users;

-- Create movies table (Digital Ocean compatible)
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  director VARCHAR(255),
  year INT,
  genre VARCHAR(100),
  rating DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_title (title),
  INDEX idx_year (year),
  INDEX idx_genre (genre)
);

-- Create users table for authentication
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  password VARCHAR(255),
  role ENUM('admin', 'user') DEFAULT 'user',
  provider VARCHAR(50) DEFAULT 'credentials',
  provider_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Note: To create admin user, use the create-admin.js script:
-- node scripts/create-admin.js
-- Then run the generated SQL in your database

