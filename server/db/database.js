const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbPath = path.join(__dirname, 'noirco.db');

let db;

const dbWrapper = {
  prepare: (sql) => ({
    run: (...params) => {
      db.run(sql, params);
      saveDb();
      return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] };
    },
    get: (...params) => {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row;
      }
      stmt.free();
      return undefined;
    },
    all: (...params) => {
      const stmt = db.prepare(sql);
      if (params.length > 0) stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    }
  }),
  exec: (sql) => {
    db.run(sql);
    saveDb();
  }
};

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

const initDb = async () => {
  const SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  dbWrapper.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  dbWrapper.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      stock INTEGER DEFAULT 0,
      sizes TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  dbWrapper.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const adminExists = dbWrapper.prepare('SELECT id FROM users WHERE email = ?').get(process.env.ADMIN_EMAIL);
  if (!adminExists) {
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12);
    dbWrapper.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)').run(
      process.env.ADMIN_EMAIL,
      hash,
      'admin'
    );
    console.log('Admin user created');
  }

  const productCount = dbWrapper.prepare('SELECT COUNT(*) as count FROM products').get();
  if (productCount.count === 0) {
    const sampleProducts = [
      {
        name: 'Obsidian Wool Blazer',
        category: 'Outerwear',
        price: 289,
        description: 'A timeless double-breasted wool blazer with satin lining. Perfect for formal occasions.',
        stock: 15,
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        image_url: '/uploads/sample1.jpg'
      },
      {
        name: 'Midnight Silk Shirt',
        category: 'Tops',
        price: 145,
        description: 'Pure silk button-down shirt with mother-of-pearl buttons. Elegant and comfortable.',
        stock: 20,
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
        image_url: '/uploads/sample2.jpg'
      },
      {
        name: 'Charcoal Pleated Trousers',
        category: 'Bottoms',
        price: 175,
        description: 'Tailored wool trousers with double pleats and adjustable waistband.',
        stock: 12,
        sizes: JSON.stringify(['28', '30', '32', '34', '36']),
        image_url: '/uploads/sample3.jpg'
      },
      {
        name: 'Noir Cashmere Sweater',
        category: 'Tops',
        price: 320,
        description: '100% cashmere crewneck sweater. Incredibly soft and warm.',
        stock: 8,
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        image_url: '/uploads/sample4.jpg'
      },
      {
        name: 'Onyx Leather Belt',
        category: 'Accessories',
        price: 89,
        description: 'Full-grain leather belt with brushed silver buckle.',
        stock: 25,
        sizes: JSON.stringify(['32', '34', '36', '38']),
        image_url: '/uploads/sample5.jpg'
      },
      {
        name: 'Shadow Cotton T-Shirt',
        category: 'Tops',
        price: 65,
        description: 'Premium organic cotton t-shirt with a relaxed fit.',
        stock: 30,
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
        image_url: '/uploads/sample6.jpg'
      }
    ];

    for (const product of sampleProducts) {
      dbWrapper.prepare(`
        INSERT INTO products (name, category, price, description, stock, sizes, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(product.name, product.category, product.price, product.description, product.stock, product.sizes, product.image_url);
    }
    console.log('Sample products seeded');
  }
};

module.exports = { db: dbWrapper, initDb };