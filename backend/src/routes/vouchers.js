const express = require('express')
const router = express.Router()
const { query } = require('../db')

async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS vouchers (
      id          SERIAL PRIMARY KEY,
      code        VARCHAR(16) NOT NULL UNIQUE,
      pin         VARCHAR(6)  NOT NULL,
      amount      NUMERIC(12,2) NOT NULL,
      currency    VARCHAR(3) NOT NULL DEFAULT 'ZAR',
      sender      VARCHAR(100),
      message     TEXT,
      status      VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
      redeemed_at TIMESTAMP
    )
  `)
}

initDb().catch(console.error)

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 12; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code.slice(0, 4) + '-' + code.slice(4, 8) + '-' + code.slice(8, 12)
}

function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM vouchers ORDER BY created_at DESC LIMIT 50')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { amount, currency, sender, message } = req.body
  if (!amount) return res.status(400).json({ error: 'amount is required' })
  try {
    const code = generateCode()
    const pin  = generatePin()
    const result = await query(
      'INSERT INTO vouchers (code, pin, amount, currency, sender, message) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [code, pin, amount, currency || 'ZAR', sender, message]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/:id/redeem', async (req, res) => {
  try {
    const result = await query(
      `UPDATE vouchers SET status='redeemed', redeemed_at=NOW()
       WHERE id=$1 AND status='active' RETURNING *`,
      [req.params.id]
    )
    if (!result.rows.length) return res.status(404).json({ error: 'Voucher not found or already redeemed' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
