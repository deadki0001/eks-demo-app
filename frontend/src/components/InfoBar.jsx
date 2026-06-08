import { useState, useEffect, useRef } from 'react'

const CLOCKS = [
  { city: 'JHB',    tz: 'Africa/Johannesburg',   flag: '🇿🇦' },
  { city: 'London', tz: 'Europe/London',          flag: '🇬🇧' },
  { city: 'NY',     tz: 'America/New_York',       flag: '🇺🇸' },
  { city: 'Tokyo',  tz: 'Asia/Tokyo',             flag: '🇯🇵' },
  { city: 'Sydney', tz: 'Australia/Sydney',       flag: '🇦🇺' },
]

const CURRENCY_LABELS = [
  { label: 'USD/ZAR', from: 'USD', to: 'ZAR', base: 'USD' },
  { label: 'EUR/ZAR', from: 'EUR', to: 'ZAR', base: 'EUR' },
  { label: 'GBP/ZAR', from: 'GBP', to: 'ZAR', base: 'GBP' },
  { label: 'EUR/USD', from: 'EUR', to: 'USD', base: 'EUR' },
  { label: 'GBP/USD', from: 'GBP', to: 'USD', base: 'GBP' },
  { label: 'JPY/USD', from: 'JPY', to: 'USD', base: 'USD' },
  { label: 'AUD/USD', from: 'AUD', to: 'USD', base: 'AUD' },
]

function getTime(tz) {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
    timeZone: tz, hour12: false
  })
}

export default function InfoBar() {
  const [rates, setRates]   = useState({})
  const [times, setTimes]   = useState({})
  const [date, setDate]     = useState('')
  const tickerRef           = useRef(null)

  useEffect(() => {
    const updateTimes = () => {
      const t = {}
      CLOCKS.forEach(c => { t[c.city] = getTime(c.tz) })
      setTimes(t)
      setDate(new Date().toLocaleDateString('en-ZA', {
        day: 'numeric', month: 'short', year: 'numeric',
        timeZone: 'Africa/Johannesburg'
      }))
    }
    updateTimes()
    const id = setInterval(updateTimes, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(r => r.json())
      .then(data => {
        const r = data.rates
        setRates({
          'USD/ZAR': r.ZAR?.toFixed(2),
          'EUR/ZAR': (r.ZAR / r.EUR)?.toFixed(2),
          'GBP/ZAR': (r.ZAR / r.GBP)?.toFixed(2),
          'EUR/USD': (1 / r.EUR)?.toFixed(4),
          'GBP/USD': (1 / r.GBP)?.toFixed(4),
          'JPY/USD': (1 / r.JPY)?.toFixed(6),
          'AUD/USD': (1 / r.AUD)?.toFixed(4),
        })
      })
      .catch(() => {})
  }, [])

  const currencyItems = CURRENCY_LABELS.map(c => ({
    label: c.label,
    value: rates[c.label] || '--'
  }))

  const tickerItems = [...currencyItems, ...currencyItems]

  return (
    <div className="infobar-wrap">
      <div className="ticker-bar">
        <div className="ticker-track" ref={tickerRef}>
          <div className="ticker-inner">
            {tickerItems.map((item, i) => (
              <div key={i} className="ticker-item">
                <span className="ticker-label">{item.label}</span>
                <span className="ticker-value">{item.value}</span>
                <span className="ticker-sep">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="clocks-bar">
        <span className="clocks-date">{date}</span>
        <div className="clocks-divider" />
        {CLOCKS.map(c => (
          <div key={c.city} className="clock-item">
            <span className="clock-city">{c.city}</span>
            <span className="clock-time">{times[c.city] || '--:--'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
