const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/rates', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { timeout: 8000 }
    )
    const r = response.data.rates
    res.json({
      date: response.data.date,
      pairs: [
        { label: 'USD/ZAR', value: r.ZAR?.toFixed(2) },
        { label: 'EUR/ZAR', value: (r.ZAR / r.EUR)?.toFixed(2) },
        { label: 'GBP/ZAR', value: (r.ZAR / r.GBP)?.toFixed(2) },
      ]
    })
  } catch (err) {
    console.error('FX rates error:', err.message)
    res.status(503).json({ error: 'FX rates unavailable' })
  }
})

module.exports = router
