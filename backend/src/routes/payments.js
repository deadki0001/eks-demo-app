const express = require('express');
const router = express.Router();
const { query } = require('../db');

async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS payments (
      id          SERIAL PRIMARY KEY,
      amount      NUMERIC(12,2) NOT NULL,
      currency    VARCHAR(3)    NOT NULL DEFAULT 'USD',
      sender      VARCHAR(100)  NOT NULL,
      recipient   VARCHAR(100)  NOT NULL,
      status      VARCHAR(20)   NOT NULL DEFAULT 'pending',
      description TEXT,
      created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
    )
  `);
  console.log('Payments table ready');
}

initDb().catch(console.error);

router.get('/', async (req, res) => {
  try {
    await query('BEGIN');
    const result = await query(
      'SELECT * FROM payments ORDER BY created_at DESC LIMIT 100'
    );
    await query('COMMIT');
    res.json(result.rows);
  } catch (err) {
    await query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await query('BEGIN');
    const result = await query(
      'SELECT * FROM payments WHERE id = $1',
      [req.params.id]
    );
    await query('COMMIT');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    await query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { amount, currency, sender, recipient, description } = req.body;

  if (!amount || !sender || !recipient) {
    return res.status(400).json({
      error: 'amount, sender, and recipient are required'
    });
  }

  try {
    await query('BEGIN');
    const result = await query(
      `INSERT INTO payments (amount, currency, sender, recipient, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [amount, currency || 'USD', sender, recipient, description]
    );
    await query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
