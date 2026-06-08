import { useState, useEffect } from 'react'
import axios from 'axios'

const WMO_CODES = {
  0:  { label: 'Clear sky',     icon: '☀️' },
  1:  { label: 'Mainly clear',  icon: '🌤️' },
  2:  { label: 'Partly cloudy', icon: '⛅' },
  3:  { label: 'Overcast',      icon: '☁️' },
  45: { label: 'Foggy',         icon: '🌫️' },
  48: { label: 'Icy fog',       icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Drizzle',       icon: '🌦️' },
  55: { label: 'Heavy drizzle', icon: '🌧️' },
  61: { label: 'Light rain',    icon: '🌧️' },
  63: { label: 'Rain',          icon: '🌧️' },
  65: { label: 'Heavy rain',    icon: '🌧️' },
  80: { label: 'Showers',       icon: '🌦️' },
  95: { label: 'Thunderstorm',  icon: '⛈️' },
}

export default function InfoBar() {
  const [weather, setWeather]   = useState(null)
  const [rates,   setRates]     = useState(null)
  const [tick,    setTick]      = useState(0)
  const [time,    setTime]      = useState('')

  // Clock
  useEffect(() => {
    const update = () => setTime(
      new Date().toLocaleTimeString('en-ZA', {
        hour: '2-digit', minute: '2-digit',
        timeZone: 'Africa/Johannesburg'
      })
    )
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // Weather - Johannesburg (-26.2041, 28.0473)
  useEffect(() => {
    axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: -26.2041,
        longitude: 28.0473,
        current_weather: true,
        timezone: 'Africa/Johannesburg',
        forecast_days: 1
      }
    }).then(res => {
      const cw  = res.data.current_weather
      const meta = WMO_CODES[cw.weathercode] || { label: 'Unknown', icon: '🌡️' }
      setWeather({
        temp: Math.round(cw.temperature),
        wind: Math.round(cw.windspeed),
        icon: meta.icon,
        label: meta.label
      })
    }).catch(() => {
      setWeather({ temp: '--', wind: '--', icon: '🌡️', label: 'Unavailable' })
    })
  }, [])

  // FX Rates - USD base, get ZAR rate directly
  useEffect(() => {
    axios.get('https://api.frankfurter.dev/v2/latest', {
      params: { base: 'USD', currencies: 'ZAR,EUR,GBP' }
    }).then(res => {
      const r = res.data.rates
      setRates({
        pairs: [
          { label: 'USD/ZAR', value: r.ZAR?.toFixed(2) },
          { label: 'EUR/ZAR', value: (r.ZAR / r.EUR)?.toFixed(2) },
          { label: 'GBP/ZAR', value: (r.ZAR / r.GBP)?.toFixed(2) },
        ],
        date: res.data.date
      })
    }).catch(() => {
      setRates({ pairs: [{ label: 'FX', value: 'Unavailable' }], date: '' })
    })
  }, [])

  // Rotate ticker
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 3), 3000)
    return () => clearInterval(id)
  }, [])

  const activePair = rates?.pairs?.[tick % (rates?.pairs?.length || 1)]

  return (
    <div className="info-bar">
      <div className="info-bar-inner">

        <div className="info-item">
          <span className="info-icon">{weather?.icon || '⏳'}</span>
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

        <div className="info-item">
          <span className="info-icon">💱</span>
          <div className="info-text">
            <span className="info-label">
              FX Rates{rates?.date ? ` · ${rates.date}` : ''}
            </span>
            <span className="info-value">
              {activePair
                ? <><strong style={{color:'var(--accent-teal)'}}>{activePair.label}</strong> {activePair.value}</>
                : 'Loading...'}
            </span>
          </div>
        </div>

        <div className="info-divider" />

        <div className="info-item">
          <span className="info-icon">🕐</span>
          <div className="info-text">
            <span className="info-label">JSE · SAST</span>
            <span className="info-value">{time || '--:--'}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
