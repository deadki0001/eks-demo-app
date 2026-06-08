const express = require('express')
const router = express.Router()

// Proxy FX rates through backend to avoid CORS issues in the browser.
// Frankfurter API: free, no key, ECB rates daily.
router.get('/rates', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.frankfurter.dev/v2/latest?base=USD&currencies=ZAR,EUR,GBP'
    )
    const data = await response.json()
    const r = data.rates
    res.json({
      date: data.date,
      pairs: [
        { label: 'USD/ZAR', value: r.ZAR?.toFixed(2) },
        { label: 'EUR/ZAR', value: (r.ZAR / r.EUR)?.toFixed(2) },
        { label: 'GBP/ZAR', value: (r.ZAR / r.GBP)?.toFixed(2) },
      ]
    })
  } catch (err) {
    res.status(503).json({ error: 'FX rates unavailable' })
  }
})

module.exports = router
