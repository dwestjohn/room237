const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * Get all recipes (default cocktail list)
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.recipe_id, r.recipe_name, r.motto, r.description, rt.type_name AS recipe_type
       FROM recipe r
       JOIN recipe_type rt ON r.recipe_type_id = rt.recipe_type_id
       WHERE NOT EXISTS (
         SELECT 1
         FROM recipe_ingredient ri
         JOIN type t ON t.type_id = ri.type_id
         WHERE ri.recipe_id = r.recipe_id
           AND NOT EXISTS (
             SELECT 1 FROM inventory i2 WHERE i2.type_id = t.type_id AND i2.is_active = true
           )
       )
       ORDER BY r.recipe_name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).send('Server Error');
  }
});

/**
 * Get recipes by type (Cocktail, Mocktail, Shot, etc.)
 */
router.get('/type/:typeName', async (req, res) => {
  const { typeName } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.recipe_id, r.recipe_name, r.motto, r.description, rt.type_name AS recipe_type
       FROM recipe r
       JOIN recipe_type rt ON r.recipe_type_id = rt.recipe_type_id
       WHERE rt.type_name ILIKE $1
         AND NOT EXISTS (
           SELECT 1
           FROM recipe_ingredient ri
           JOIN type t ON t.type_id = ri.type_id
           WHERE ri.recipe_id = r.recipe_id
             AND NOT EXISTS (
               SELECT 1
               FROM inventory i WHERE i.type_id = t.type_id AND i.is_active = true
             )
         )
       ORDER BY r.recipe_name ASC`,
      [typeName]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recipes by type:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * Get available recipe types
 */
router.get('/types', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT recipe_type_id, type_name
       FROM recipe_type
       ORDER BY type_name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recipe types:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * Create new recipe
 */
router.post('/', async (req, res) => {
  const { recipe_name, motto, vessel_id, description, recipe_type_id } = req.body;

  try {
    await pool.query(
      `INSERT INTO recipe (recipe_name, motto, vessel_id, description, recipe_type_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [recipe_name, motto, vessel_id, description, recipe_type_id]
    );
    res.status(201).send('Recipe created');
  } catch (err) {
    console.error('❌ SQL Error creating recipe:', err.message);
    res.status(500).send(err.message);
  }
});

/**
 * Top Shelf
 */
router.get('/topshelf', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.inventory_name
      FROM inventory i
      JOIN type t ON i.type_id = t.type_id
      WHERE t.type_name ILIKE 'top shelf' AND i.is_active = true
      ORDER BY i.inventory_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching top shelf items:', err);
    res.status(500).send('Server Error');
  }
});

/**
 * Beer
 */
router.get('/beers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.inventory_name
      FROM inventory i
      JOIN type t ON i.type_id = t.type_id
      WHERE t.type_name ILIKE 'Beer' AND i.is_active = true
      ORDER BY i.inventory_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching beers:', err);
    res.status(500).send('Server Error');
  }
});

/**
 * Wine
 */
router.get('/wines', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.inventory_name
      FROM inventory i
      JOIN type t ON i.type_id = t.type_id
      WHERE t.type_name ILIKE 'wine' AND i.is_active = true
      ORDER BY i.inventory_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching wines:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * Seltzers
 */
router.get('/seltzers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.inventory_name
      FROM inventory i
      JOIN type t ON i.type_id = t.type_id
      WHERE t.type_name ILIKE 'seltzer' AND i.is_active = true
      ORDER BY i.inventory_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching seltzers:', err);
    res.status(500).send('Server Error');
  }
});

/**
 * Non-alcoholic
 */
router.get('/nonalcoholic', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.inventory_name
      FROM inventory i
      JOIN type t ON i.type_id = t.type_id
      WHERE t.type_name ILIKE 'n/a' AND i.is_active = true
      ORDER BY i.inventory_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching non-alcoholic items:', err);
    res.status(500).send('Server Error');
  }
});

/**
 * Get all recipes (minimal)
 */
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT recipe_id, recipe_name
      FROM recipe
      ORDER BY recipe_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all recipes:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * Create vessel
 */
router.post('/vessels', async (req, res) => {
  const { method, glassware } = req.body;
  try {
    await pool.query(
      `INSERT INTO vessel (method, glassware)
       VALUES ($1, $2)`,
      [method, glassware]
    );
    res.status(201).send('Vessel pairing created');
  } catch (err) {
    console.error('Error creating vessel:', err);
    res.status(500).send('Server Error');
  }
});

/**
 * Get vessels
 */
router.get('/vessels', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT vessel_id, method, glassware
      FROM vessel
      ORDER BY method, glassware
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching vessels:', err);
    res.status(500).send('Server Error');
  }
});

/**
 * Add recipe ingredient
 */
router.post('/ingredients', async (req, res) => {
  const { recipe_id, quantity, type_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO recipe_ingredient (recipe_id, quantity, type_id)
       VALUES ($1, $2, $3)`,
      [recipe_id, quantity, type_id]
    );
    res.status(201).send('Recipe ingredient created');
  } catch (err) {
    console.error('Error creating recipe ingredient:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * Delete a recipe and its ingredients
 */
router.delete('/:id', async (req, res) => {
  const recipeId = req.params.id;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`DELETE FROM recipe_ingredient WHERE recipe_id = $1`, [recipeId]);
    await client.query(`DELETE FROM recipe WHERE recipe_id = $1`, [recipeId]);

    await client.query('COMMIT');
    res.status(200).send('Recipe and its ingredients deleted');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting recipe:', err.message);
    res.status(500).send('Server Error');
  } finally {
    client.release();
  }
});

module.exports = router;
