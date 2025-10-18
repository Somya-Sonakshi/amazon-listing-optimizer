
CREATE DATABASE IF NOT EXISTS amazon_optimizer;
USE amazon_optimizer;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asin VARCHAR(20) NOT NULL UNIQUE,
    title TEXT,
    description TEXT,
    bullets JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS optimizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asin VARCHAR(20) NOT NULL,
    original_title TEXT,
    original_bullets JSON,
    original_description TEXT,
    optimized_title TEXT,
    optimized_bullets JSON,
    optimized_description TEXT,
    optimized_keywords JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asin) REFERENCES products(asin) ON DELETE CASCADE
);
