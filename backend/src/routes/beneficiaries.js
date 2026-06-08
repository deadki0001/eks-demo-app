const express = require('express')
const router = express.Router()
const { query } = require('../db')

async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS beneficiaries (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(100) NOT NULL,
      bank        VARCHAR(50),
      account_no  VARCHAR(30),
      account_type VARCHAR(20) DEFAULT 'current',
      category    VARCHAR(30) DEFAULT 'private',
      is_public   BOOLEAN DEFAULT false,
      created_at  TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `)

  const existing = await query('SELECT COUNT(*) FROM beneficiaries WHERE is_public = true')
  if (parseInt(existing.rows[0].count) === 0) {
    const publicBeneficiaries = [
      ['SARS eFiling', 'ABSA', '4048686391', 'current', 'government'],
      ['Eskom', 'Standard Bank', '011011011', 'current', 'utilities'],
      ['City of Joburg Water', 'Nedbank', '1196284546', 'current', 'utilities'],
      ['DStv', 'Standard Bank', '000000001', 'current', 'entertainment'],
      ['Telkom', 'Standard Bank', '000000002', 'current', 'telecoms'],
      ['Vodacom Airtime', 'Nedbank', '000000003', 'current', 'telecoms'],
      ['MTN Airtime', 'FNB', '000000004', 'current', 'telecoms'],
      ['MultiChoice', 'FNB', '000000005', 'current', 'entertainment'],
      ['Netflix SA', 'ABSA', '000000006', 'current', 'entertainment'],
      ['City Power Joburg', 'Nedbank', '000000007', 'current', 'utilities'],
    ]
    for (const [name, bank, account_no, account_type, category] of publicBeneficiaries) {
      await query(
        'INSERT INTO beneficiaries (name, bank, account_no, account_type, category, is_public) VALUES ($1,$2,$3,$4,$5,true)',
        [name, bank, account_no, account_type, category]
      )
    }
    console.log('Public beneficiaries seeded')
  }
}

initDb().catch(console.error)

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM beneficiaries ORDER BY is_public DESC, name ASC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const { name, bank, account_no, account_type } = req.body
  if (!name || !bank || !account_no) {
    return res.status(400).json({ error: 'name, bank and account_no are required' })
  }
  try {
    const result = await query(
      'INSERT INTO beneficiaries (name, bank, account_no, account_type) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, bank, account_no, account_type || 'current']
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM beneficiaries WHERE id = $1 AND is_public = false', [req.params.id])
    res.json({ deleted: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
