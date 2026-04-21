const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db } = require('../db/database');

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customer_name, phone, email, address_line1, address_line2, city, state, pincode, items, total } = req.body;

    const stmt = db.prepare(`
      INSERT INTO orders (customer_name, phone, email, address_line1, address_line2, city, state, pincode, items, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      customer_name,
      phone,
      email,
      address_line1,
      address_line2 || '',
      city,
      state,
      pincode,
      JSON.stringify(items),
      total
    );

    res.status(201).json({ id: result.lastInsertRowid, message: 'Order placed successfully' });
  }
);

router.get('/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

router.get('/track', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const orders = db.prepare('SELECT * FROM orders WHERE email = ? ORDER BY created_at DESC').all(email);
  res.json(orders);
});

module.exports = router;