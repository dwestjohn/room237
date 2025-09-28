const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust the path if your db.js file is in a different location

// GET all inventory items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT inventory_id, inventory_name, is_active
      FROM inventory
      ORDER BY inventory_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).send('Server Error');
  }
});

// TOGGLE is_active status
router.put('/:id/toggle', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query(`
      UPDATE inventory
      SET is_active = NOT is_active
      WHERE inventory_id = $1
    `, [id]);
    res.status(200).send('Status toggled');
  } catch (err) {
    console.error('Error toggling inventory status:', err);
    res.status(500).send('Server Error');
  }
});

// DELETE inventory item
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM inventory WHERE inventory_id = $1', [id]);
    res.status(200).send('Inventory item deleted');
  } catch (err) {
    console.error('Error deleting inventory:', err);
    res.status(500).send('Server Error');
  }
});


router.get('/types', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT type_id, type_name, is_active
        FROM type
        ORDER BY type_name
      `);
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching types:', err);
      res.status(500).send('Server Error');
    }
  });

  
  router.post('/types', async (req, res) => {
    const { type_name, is_active } = req.body;
    try {
      await pool.query(`
        INSERT INTO type (type_name, is_active)
        VALUES ($1, $2)
      `, [type_name, is_active]);
      res.status(201).send('Type created');
    } catch (err) {
      console.error('Error creating type:', err);
      res.status(500).send('Server Error');
    }
  });

  
  router.get('/locations', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT location_id, location_name
        FROM location
        ORDER BY location_name
      `);
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching locations:', err);
      res.status(500).send('Server Error');
    }
  });

  
  router.post('/', async (req, res) => {
    const { inventory_name, is_active, type_id, location_id } = req.body;
    try {
      await pool.query(`
        INSERT INTO inventory (inventory_name, is_active, type_id, location_id)
        VALUES ($1, $2, $3, $4)
      `, [inventory_name, is_active, type_id, location_id]);
      res.status(201).send('Inventory item created');
    } catch (err) {
      console.error('Error creating inventory item:', err);
      res.status(500).send('Server Error');
    }
  });


  router.delete('/types/:id', async (req, res) => {
    const typeId = req.params.id;
    const client = await pool.connect();
  
    try {
      // Check if any inventory items still reference this type
      const check = await client.query(
        `SELECT COUNT(*) FROM inventory WHERE type_id = $1`,
        [typeId]
      );
  
      if (parseInt(check.rows[0].count) > 0) {
        return res.status(400).send('Cannot delete: This type is still used by inventory items.');
      }
  
      // Safe to delete
      await client.query(`DELETE FROM type WHERE type_id = $1`, [typeId]);
      res.status(200).send('Type deleted');
    } catch (err) {
      console.error('Error deleting type:', err.message);
      res.status(500).send('Server Error');
    } finally {
      client.release();
    }
  });
  


module.exports = router;


  