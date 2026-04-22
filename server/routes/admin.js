const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { db } = require('../db/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpg, png, webp) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  const totalProductsRow = await db.prepare('SELECT COUNT(*) as count FROM products').get();
  const totalOrdersRow = await db.prepare('SELECT COUNT(*) as count FROM orders').get();
  const pendingOrdersRow = await db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'").get();
  const revenueRow = await db.prepare('SELECT COALESCE(SUM(total), 0) as total FROM orders').get();

  res.json({
    totalProducts: totalProductsRow.count,
    totalOrders: totalOrdersRow.count,
    pendingOrders: pendingOrdersRow.count,
    revenue: revenueRow.total
  });
});

router.get('/products', authenticateToken, requireAdmin, async (req, res) => {
  const products = await db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(products);
});

router.post('/products', authenticateToken, requireAdmin, upload.single('image'), [
  body('name').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('description').optional().trim(),
  body('stock').toInt().isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    console.error('req.body:', req.body);
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, category, price, description, stock, sizes } = req.body;
  const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes || [];
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const result = await db.prepare(`
    INSERT INTO products (name, category, price, description, stock, sizes, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, category, parseFloat(price), description || '', parseInt(stock), JSON.stringify(parsedSizes), image_url);

  res.status(201).json({ id: result.lastInsertRowid, message: 'Product created' });
});

router.put('/products/:id', authenticateToken, requireAdmin, upload.single('image'), [
  body('name').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('description').optional().trim(),
  body('stock').isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, category, price, description, stock, sizes } = req.body;
  const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes || [];
  const product = await db.prepare('SELECT image_url FROM products WHERE id = ?').get(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const image_url = req.file ? `/uploads/${req.file.filename}` : product.image_url;

  await db.prepare(`
    UPDATE products SET name = ?, category = ?, price = ?, description = ?, stock = ?, sizes = ?, image_url = ?
    WHERE id = ?
  `).run(name, category, parseFloat(price), description || '', parseInt(stock), JSON.stringify(parsedSizes), image_url, req.params.id);

  res.json({ message: 'Product updated' });
});

router.delete('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  const result = await db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (!result.lastInsertRowid && result.lastInsertRowid !== 0) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ message: 'Product deleted' });
});

router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
  const orders = await db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(orders);
});

router.put('/orders/:id', authenticateToken, requireAdmin, [
  body('status').isIn(['Pending', 'Shipped', 'Delivered'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { status } = req.body;
  await db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: 'Order status updated' });
});

module.exports = router;