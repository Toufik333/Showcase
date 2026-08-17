-- Complete Database Schema for Dashboard Main Website & Money Tracker

-- 1. Create Users Table (Money Tracker Users)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create Transactions Table (Money Tracker Income & Expenses)
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` ENUM('deposit', 'withdraw') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `note` TEXT,
  `transaction_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create Products Table (E-Commerce Storefront Products)
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create Orders Table (Customer E-Commerce Orders)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `location` TEXT NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `payment_method` VARCHAR(50) DEFAULT 'Cash on Delivery',
  `status` ENUM('pending', 'shipped', 'done', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create Order Items Table (Line Items for Customer Orders)
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price_at_purchase` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Create Admins Table (Shop Admin Accounts)
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` VARCHAR(50) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Insert Default Admin Accounts (Default password for all is: admin123)
INSERT IGNORE INTO `admins` (`admin_id`, `password_hash`) VALUES
('admin1', '$2a$12$R.32P2iIe71N1u6hO3wY9.s54X0R597Z562yXw38/54508494191.'),
('admin2', '$2a$12$R.32P2iIe71N1u6hO3wY9.s54X0R597Z562yXw38/54508494191.'),
('admin3', '$2a$12$R.32P2iIe71N1u6hO3wY9.s54X0R597Z562yXw38/54508494191.');

-- 8. Insert Initial Sample Products
INSERT IGNORE INTO `products` (`id`, `title`, `price`, `image_url`, `description`) VALUES
(1, 'Minimalist Wireless Keyboard', 129.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', 'Sleek aluminum chassis, low-profile mechanical switches, and seamless multi-device Bluetooth connectivity.'),
(2, 'Precision Ergonomic Mouse', 89.99, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80', 'Ergonomic thumb rest, silent magnetic scrolling, and high-precision optical tracking for endless workflow efficiency.'),
(3, 'Studio Noise-Canceling Headphones', 249.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 'Immersive spatial audio, custom 40mm acoustic drivers, active noise cancellation, and up to 40 hours battery life.'),
(4, 'Ultra-Wide Curved Display 34"', 599.99, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', 'WQHD 144Hz curved display with 99% sRGB color accuracy, integrated USB-C 90W power hub, and ultra-thin bezels.'),
(5, 'Elevated Aluminum Laptop Stand', 49.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80', 'Machined aerospace-grade aluminum stand optimized for posture alignment and passive thermal heat dissipation.'),
(6, 'Handcrafted Leather Desk Mat', 39.99, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', 'Premium water-resistant vegan leather desk pad with soft microfiber backing and stitched anti-fray border.');
