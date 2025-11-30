const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/drink-orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ol.order_id,
        ol.person_name,
        r.recipe_name,
        STRING_AGG(ri.quantity || ' ' || t.type_name, ', ' ORDER BY t.type_name) AS ingredients,
        v.method,
        v.glassware,
        ol.order_time
      FROM order_log ol
      JOIN recipe_ingredient ri ON ri.recipe_id = ol.recipe_id
      JOIN type t ON t.type_id = ri.type_id
      JOIN recipe r ON ri.recipe_id = r.recipe_id
      JOIN vessel v ON r.vessel_id = v.vessel_id
      GROUP BY ol.order_id, ol.person_name, r.recipe_name, v.method, v.glassware, ol.order_time
      ORDER BY ol.order_time;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching drink orders:', err);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/drink-orders/:id
router.delete('/:id', async (req, res) => {
  const orderId = req.params.id;
  try {
    await pool.query('DELETE FROM order_log WHERE order_id = $1', [orderId]);
    res.status(200).send('Order marked as done');
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).send('Failed to delete order');
  }
});

module.exports = router;
