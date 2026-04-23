const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

router.get('/', async (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';
  const products = await db.prepare(query).all(...params);
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Get all reviews for a product
router.get('/:id/reviews', async (req, res) => {
  const reviews = await db.prepare(`
    SELECT * FROM reviews 
    WHERE product_id = ? 
    ORDER BY created_at DESC
  `).all(req.params.id);
  res.json(reviews);
});

// Add a new review for a product
router.post('/:id/reviews', async (req, res) => {
  try {
    const { reviewer_name, rating, comment } = req.body;
    
    // Validate input
    if (!reviewer_name || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if product exists
    const product = await db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Insert review
    const result = await db.prepare(`
      INSERT INTO reviews (product_id, reviewer_name, rating, comment)
      VALUES (?, ?, ?, ?)
    `).run(req.params.id, reviewer_name, rating, comment);
    
    // Return the created review
    const review = await db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
});

module.exports = router;