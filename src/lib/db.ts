import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import bcrypt from "bcryptjs";

let pool: Pool | null = null;

const DB_CONFIG = {
  host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306,
  user: process.env.DB_USER || process.env.MYSQLUSER || "root",
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "",
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || "money_tracker",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
};

async function ensureDatabase() {
  try {
    // Connect without database first to create it if needed (works on local root)
    const conn = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      ssl: DB_CONFIG.ssl,
    });

    await conn.execute(
      `CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await conn.end();
  } catch (err) {
    // On cPanel/cloud hosting, the database is already created in cPanel Wizard,
    // so non-root users lack global CREATE DATABASE privilege. Safely proceed.
    console.warn(
      `[db] Could not CREATE DATABASE "${DB_CONFIG.database}". ` +
      `If on shared hosting, ensure the database was created via cPanel MySQL Wizard. ` +
      `Error: ${err instanceof Error ? err.message : err}`
    );
  }
}

async function ensureTables(pool: Pool) {
  // Money tracker tables
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type ENUM('deposit', 'withdraw') NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(50) NOT NULL,
      note TEXT,
      transaction_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // E-Commerce Storefront & Admin tables
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(100) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      location TEXT NOT NULL,
      email VARCHAR(100) DEFAULT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      payment_method VARCHAR(50) DEFAULT 'Cash on Delivery',
      status ENUM('pending', 'shipped', 'done', 'cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price_at_purchase DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      admin_id VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await seedData(pool);
}

async function seedData(pool: Pool) {
  // Seed fixed admin accounts admin1, admin2, admin3 if missing
  const defaultAdmins = ["admin1", "admin2", "admin3"];

  // Check which admins are missing BEFORE hashing (avoid CPU-heavy bcrypt on every cold start)
  const missingAdmins: string[] = [];
  for (const adminId of defaultAdmins) {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(
      "SELECT id FROM admins WHERE admin_id = ?",
      [adminId]
    );
    if (rows.length === 0) {
      missingAdmins.push(adminId);
    }
  }

  // Only hash + insert if there are actually missing admins
  if (missingAdmins.length > 0) {
    const defaultPasswordHash = await bcrypt.hash("admin123", 12);
    for (const adminId of missingAdmins) {
      await pool.execute(
        "INSERT INTO admins (admin_id, password_hash) VALUES (?, ?)",
        [adminId, defaultPasswordHash]
      );
    }
  }

  // Seed mock products if products table is empty
  const [productRows] = await pool.execute<mysql.RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM products"
  );
  if (productRows[0].count === 0) {
    const sampleProducts = [
      {
        title: "Minimalist Wireless Keyboard",
        price: 129.99,
        image_url:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        description:
          "Sleek aluminum chassis, low-profile mechanical switches, and seamless multi-device Bluetooth connectivity.",
      },
      {
        title: "Precision Ergonomic Mouse",
        price: 89.99,
        image_url:
          "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
        description:
          "Ergonomic thumb rest, silent magnetic scrolling, and high-precision optical tracking for endless workflow efficiency.",
      },
      {
        title: "Studio Noise-Canceling Headphones",
        price: 249.99,
        image_url:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        description:
          "Immersive spatial audio, custom 40mm acoustic drivers, active noise cancellation, and up to 40 hours battery life.",
      },
      {
        title: "Ultra-Wide Curved Display 34\"",
        price: 599.99,
        image_url:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
        description:
          "WQHD 144Hz curved display with 99% sRGB color accuracy, integrated USB-C 90W power hub, and ultra-thin bezels.",
      },
      {
        title: "Elevated Aluminum Laptop Stand",
        price: 49.99,
        image_url:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
        description:
          "Machined aerospace-grade aluminum stand optimized for posture alignment and passive thermal heat dissipation.",
      },
      {
        title: "Handcrafted Leather Desk Mat",
        price: 39.99,
        image_url:
          "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
        description:
          "Premium water-resistant vegan leather desk pad with soft microfiber backing and stitched anti-fray border.",
      },
    ];

    for (const p of sampleProducts) {
      await pool.execute(
        "INSERT INTO products (title, price, image_url, description) VALUES (?, ?, ?, ?)",
        [p.title, p.price, p.image_url, p.description]
      );
    }
  }
}

export async function getPool(): Promise<Pool> {
  if (pool) return pool;

  await ensureDatabase();

  pool = mysql.createPool({
    ...DB_CONFIG,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  try {
    await ensureTables(pool);
  } catch (err) {
    console.error("ensureTables notice:", err);
  }
  return pool;
}
