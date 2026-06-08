const express = require('express')
const router = express.Router()
const { query } = require('../db')

async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS payments (
      id          SERIAL PRIMARY KEY,
      amount      NUMERIC(12,2) NOT NULL,
      currency    VARCHAR(3)    NOT NULL DEFAULT 'ZAR',
      sender      VARCHAR(100)  NOT NULL,
      recipient   VARCHAR(100)  NOT NULL,
      status      VARCHAR(20)   NOT NULL DEFAULT 'pending',
      description TEXT,
      created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
    )
  `)
  console.log('Payments table ready')
}

initDb().catch(console.error)

async function autoComplete(id) {
  setTimeout(async () => {
    try {
      await query(
        "UPDATE payments SET status='completed' WHERE id=$1 AND status='pending'",
        [id]
      )
    } catch (err) {
      console.error('Auto-complete error:', err.message)
    }
  }, 3000)
}

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM payments ORDER BY created_at DESC LIMIT 100')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM payments WHERE id=$1', [req.params.id])
    if (!result.rows.length) return res.status(404).json({ error: 'Payment not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { amount, currency, sender, recipient, description } = req.body
  if (!amount || !sender || !recipient) {
    return res.status(400).json({ error: 'amount, sender and recipient are required' })
  }
  try {
    const result = await query(
      `INSERT INTO payments (amount, currency, sender, recipient, description)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [amount, currency || 'ZAR', sender, recipient, description]
    )
    autoComplete(result.rows[0].id)
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
