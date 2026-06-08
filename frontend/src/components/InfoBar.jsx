import { useState, useEffect } from 'react'
import axios from 'axios'

const WMO_CODES = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Icy fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy drizzle', icon: '🌧️' },
  61: { label: 'Light rain', icon: '🌧️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  71: { label: 'Light snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '❄️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  80: { label: 'Showers', icon: '🌦️' },
  81: { label: 'Showers', icon: '🌧️' },
  82: { label: 'Heavy showers', icon: '🌧️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  99: { label: 'Thunderstorm', icon: '⛈️' },
}

const PAIRS = [
  { from: 'USD', label: 'USD/ZAR' },
  { from: 'EUR', label: 'EUR/ZAR' },
  { from: 'GBP', label: 'GBP/ZAR' },
]

export default function InfoBar() {
  const [weather, setWeather] = useState(null)
  const [rates, setRates] = useState(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    // Weather - Johannesburg
    axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: -26.2041,
        longitude: 28.0473,
        current_weather: true,
        hourly: 'relativehumidity_2m',
        forecast_days: 1,
        timezone: 'Africa/Johannesburg'
      }
    }).then(res => {
      const cw = res.data.current_weather
      const code = WMO_CODES[cw.weathercode] || { label: 'Unknown', icon: '🌡️' }
      setWeather({
        temp: Math.round(cw.temperature),
        wind: Math.round(cw.windspeed),
        icon: code.icon,
        label: code.label,
        isDay: cw.is_day
      })
    }).catch(() => setWeather({ temp: '--', icon: '🌡️', label: 'Unavailable', wind: '--' }))

    // Exchange rates - ZAR base
    axios.get('https://api.frankfurter.dev/v2/rates', {
      params: { base: 'ZAR', symbols: 'USD,EUR,GBP' }
    }).then(res => {
      const r = res.data.rates
      // Invert to get how many ZAR per foreign currency
      setRates({
        'USD/ZAR': (1 / r.USD).toFixed(2),
        'EUR/ZAR': (1 / r.EUR).toFixed(2),
        'GBP/ZAR': (1 / r.GBP).toFixed(2),
        date: res.data.date
      })
    }).catch(() => setRates(null))
  }, [])

  // Ticker scroll animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => (t + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="info-bar">
      <div className="info-bar-inner">

        {/* Weather */}
        <div className="info-item weather-item">
          <span className="info-icon">
            {weather ? weather.icon : '⏳'}
          </span>
          <div className="info-text">
            <span className="info-label">Johannesburg</span>
            <span className="info-value">
              {weather
                ? `${weather.temp}°C · ${weather.label} · ${weather.wind} km/h`
                : 'Loading...'}
            </span>
          </div>
        </div>

        <div className="info-divider" />

        {/* Exchange rates */}
        <div className="info-item rates-item">
          <span className="info-icon">💱</span>
          <div className="info-text">
            <span className="info-label">
              FX Rates {rates ? `· ${rates.date}` : ''}
            </span>
            <div className="rates-ticker">
              {rates ? (
                PAIRS.map((p, i) => (
                  <span
                    key={p.label}
                    className={`rate-pair ${i === tick ? 'rate-active' : ''}`}
                  >
                    {p.label} <strong>{rates[p.label]}</strong>
                  </span>
                ))
              ) : (
                <span className="rate-pair rate-active">Loading rates...</span>
              )}
            </div>
          </div>
        </div>

        <div className="info-divider" />

        {/* Market time */}
        <div className="info-item">
          <span className="info-icon">🕐</span>
          <div className="info-text">
            <span className="info-label">JSE</span>
            <span className="info-value">
              {new Date().toLocaleTimeString('en-ZA', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Africa/Johannesburg'
              })} SAST
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
