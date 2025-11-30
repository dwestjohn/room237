const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust path if your db.js is elsewhere

// POST /api/order
router.post('/', async (req, res) => {
  const { person_name, recipe_id, quantity } = req.body;

  try {
    await pool.query(
      'INSERT INTO order_log (person_name, recipe_id, quantity, order_time) VALUES ($1, $2, $3, NOW())',
      [person_name, recipe_id, quantity]
    );
    res.status(200).send('Order placed successfully');
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).send('Error placing order');
  }
});

module.exports = router;
