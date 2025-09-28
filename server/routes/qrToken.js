const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../db');

// Utility: cleanup expired tokens
async function cleanupExpiredTokens() {
  await pool.query("DELETE FROM qr_tokens WHERE valid_to < CURRENT_DATE");
}

// Utility: get or create today’s token
async function getDailyToken() {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  await cleanupExpiredTokens();

  const existing = await pool.query(
    "SELECT token FROM qr_tokens WHERE valid_from=$1 AND valid_to=$2",
    [today, tomorrow]
  );

  if (existing.rows.length > 0) return existing.rows[0].token;

  const token = crypto.randomBytes(16).toString("hex");
  await pool.query(
    "INSERT INTO qr_tokens (token, valid_from, valid_to) VALUES ($1, $2, $3)",
    [token, today, tomorrow]
  );

  return token;
}

// ✅ GET today’s token
router.get('/api/qr-token', async (req, res) => {
  try {
    const token = await getDailyToken();
    res.json({ token });
  } catch (err) {
    console.error('Error generating daily token:', err);
    res.status(500).send('Server Error');
  }
});

// ✅ Validate token
router.post('/api/qr-token/validate', async (req, res) => {
  const { token } = req.body;
  const today = new Date().toISOString().split("T")[0];

  try {
    const result = await pool.query(
      "SELECT * FROM qr_tokens WHERE token=$1 AND valid_from <= $2 AND valid_to > $2",
      [token, today]
    );

    if (result.rows.length > 0) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ valid: false });
    }
  } catch (err) {
    console.error('Error validating token:', err);
    res.status(500).send('Server Error');
  }
});

// ✅ QR entry redirect
router.get('/entry', async (req, res) => {
  try {
    const token = await getDailyToken();
    const redirectUrl = `https://www.room237bar.com/?token=${token}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error('Error in /entry route:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;



