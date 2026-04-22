const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Wrapper to mimic your existing sql.js API so other files don't need changes
const dbWrapper = {
  prepare: (sql) => ({
    run: async (...params) => {
      const pgSql = convertToPostgres(sql);
      const result = await pool.query(pgSql + ' RETURNING id', params);
      return { lastInsertRowid: result.rows[0]?.id };
    },
    get: async (...params) => {
      const pgSql = convertToPostgres(sql);
      const result = await pool.query(pgSql, params);
      return result.rows[0];
    },
    all: async (...params) => {
      const pgSql = convertToPostgres(sql);
      const result = await pool.query(pgSql, params);
      return result.rows;
    }
  }),
  exec: async (sql) => {
    await pool.query(sql);
  },
  query: async (sql, params = []) => {
    const result = await pool.query(sql, params);
    return result.rows;
  }
};

// Convert SQLite ? placeholders to Postgres $1, $2, ...
function convertToPostgres(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      stock INTEGER DEFAULT 0,
      sizes TEXT,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      address_line1 TEXT NOT NULL,
      address_line2 TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed admin user if not exists
  const adminCheck = await pool.query('SELECT id FROM users WHERE email = $1', [process.env.ADMIN_EMAIL]);
  if (adminCheck.rows.length === 0) {
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12);
    await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
      [process.env.ADMIN_EMAIL, hash, 'admin']
    );
    console.log('Admin user created');
  }

  // Seed sample products if none exist
  const productCount = await pool.query('SELECT COUNT(*) as count FROM products');
  if (parseInt(productCount.rows[0].count) === 0) {
    const sampleProducts = [
      {
        name: 'Obsidian Wool Blazer', category: 'Outerwear', price: 289,
        description: 'A timeless double-breasted wool blazer with satin lining.',
        stock: 15, sizes: JSON.stringify(['S', 'M', 'L', 'XL']), image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'
      },
      {
        name: 'Midnight Silk Shirt', category: 'Tops', price: 145,
        description: 'Pure silk button-down shirt with mother-of-pearl buttons.',
        stock: 20, sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']), image_url: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400'
      },
      {
        name: 'Charcoal Pleated Trousers', category: 'Bottoms', price: 175,
        description: 'Tailored wool trousers with double pleats and adjustable waistband.',
        stock: 12, sizes: JSON.stringify(['28', '30', '32', '34', '36']), image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'
      },
      {
        name: 'Noir Cashmere Sweater', category: 'Tops', price: 320,
        description: '100% cashmere crewneck sweater. Incredibly soft and warm.',
        stock: 8, sizes: JSON.stringify(['S', 'M', 'L', 'XL']), image_url: 'https://images.unsplash.com/photo-1576566588028-4147f8942fe6?w=400'
      },
      {
        name: 'Onyx Leather Belt', category: 'Accessories', price: 89,
        description: 'Full-grain leather belt with brushed silver buckle.',
        stock: 25, sizes: JSON.stringify(['32', '34', '36', '38']), image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      },
      {
        name: 'Shadow Cotton T-Shirt', category: 'Tops', price: 65,
        description: 'Premium organic cotton t-shirt with a relaxed fit.',
        stock: 30, sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']), image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
      }
    ];

    for (const p of sampleProducts) {
      await pool.query(
        `INSERT INTO products (name, category, price, description, stock, sizes, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [p.name, p.category, p.price, p.description, p.stock, p.sizes, p.image_url]
      );
    }
    console.log('Sample products seeded');
  }

  console.log('Database initialized');
};

module.exports = { db: dbWrapper, initDb };