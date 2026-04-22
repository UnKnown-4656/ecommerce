const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db } = require('../db/database');

router.get('/track', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const orders = await db.prepare('SELECT * FROM orders WHERE email = ? ORDER BY created_at DESC').all(email.trim().toLowerCase());
    const orderList = Array.isArray(orders) ? orders : [];
    res.json(orderList.map(o => ({ ...o, items: JSON.parse(o.items || '[]') })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/',
  [
    body('customer_name').notEmpty().trim(),
    body('phone').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('address_line1').notEmpty().trim(),
    body('city').notEmpty().trim(),
    body('state').notEmpty().trim(),
    body('pincode').notEmpty().trim(),
    body('items').isArray({ min: 1 }),
    body('total').isFloat({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customer_name, phone, email, address_line1, address_line2, city, state, pincode, items, total } = req.body;

    let orderItems = items;
    if (typeof items === 'string') {
      try {
        orderItems = JSON.parse(items);
      } catch {
        return res.status(400).json({ error: 'Invalid items format' });
      }
    }

    for (const item of orderItems) {
      const productId = item.product_id || item.id;
      const product = await db.prepare('SELECT stock FROM products WHERE id = ?').get(productId);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${item.name}. Only ${product.stock} left.` });
      }
    }

    const result = await db.prepare(`
      INSERT INTO orders (customer_name, phone, email, address_line1, address_line2, city, state, pincode, items, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      customer_name,
      phone,
      email,
      address_line1,
      address_line2 || '',
      city,
      state,
      pincode,
      JSON.stringify(orderItems),
      total
    );

    for (const item of orderItems) {
      const productId = item.product_id || item.id;
      await db.prepare(
        'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?'
      ).run(item.quantity, productId, item.quantity);
    }

    res.status(201).json({ id: result.lastInsertRowid, message: 'Order placed successfully' });
  }
);

router.get('/:id', async (req, res) => {
  try {
    const order = await db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;