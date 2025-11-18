-- Create database if not exists
CREATE DATABASE IF NOT EXISTS movie_list;

USE movie_list;

-- Drop table if exists (to fix schema issues)
DROP TABLE IF EXISTS movies;

-- Create movies table
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  director VARCHAR(255),
  year INT,
  genre VARCHAR(100),
  rating DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

