import { useState, useEffect } from 'react'
import { Wind, Clock, Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, CloudFog, CloudSun, Thermometer } from 'lucide-react'

const WEATHER_ICONS = { Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, CloudFog, CloudSun, Thermometer }

const CURRENCY_BADGE = {
  'USD/ZAR': { code: 'USD', bg: '#1a3a6e', color: '#60a5fa', country: 'US' },
  'EUR/ZAR': { code: 'EUR', bg: '#1a3a2e', color: '#34d399', country: 'EU' },
  'GBP/ZAR': { code: 'GBP', bg: '#3a1a2e', color: '#f472b6', country: 'GB' },
}

export default function InfoBar({ weather, rates }) {
  const [time, setTime] = useState('')
  const [tick, setTick] = useState(0)

  const WeatherIcon = weather
    ? (WEATHER_ICONS[weather.iconName] || Thermometer)
    : Thermometer

  useEffect(() => {
    const upd = () => setTime(
      new Date().toLocaleTimeString('en-ZA', {
        hour: '2-digit', minute: '2-digit',
        timeZone: 'Africa/Johannesburg'
      })
    )
    upd()
    const id = setInterval(upd, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!rates?.pairs?.length) return
    const id = setInterval(() => setTick(t => (t + 1) % rates.pairs.length), 3000)
    return () => clearInterval(id)
  }, [rates])

  const pair = rates?.pairs?.[tick]
  const badge = pair ? CURRENCY_BADGE[pair.label] : null

  return (
    <div className="infobar">
      <div className="ib-seg">
        <div className="ib-ico">
          <WeatherIcon size={15} />
        </div>
        <div>
          <div className="ib-label">Johannesburg</div>
          <div className="ib-value">
            {weather && weather.temp !== '--'
              ? <>{weather.temp}&deg;C <span className="ib-muted">
                  <Wind size={10} style={{verticalAlign:'middle'}} /> {weather.wind} km/h
                </span></>
              : weather === null ? 'Loading...' : '--&deg;C'}
          </div>
        </div>
      </div>

      <div className="ib-divider" />

      <div className="ib-seg">
        {badge && (
          <div className="currency-badge" style={{background: badge.bg, color: badge.color}}>
            {badge.code}
          </div>
        )}
        <div>
          <div className="ib-label">
            {pair ? pair.label : 'FX Rates'}
            {rates?.date ? <span className="ib-date"> - {rates.date}</span> : ''}
          </div>
          <div className="ib-value ib-teal">
            {pair ? pair.value : (rates === null ? 'Loading...' : 'Unavailable')}
          </div>
        </div>
      </div>

      <div className="ib-divider" />

      <div className="ib-seg">
        <div className="ib-ico"><Clock size={15} /></div>
        <div>
          <div className="ib-label">JSE - SAST</div>
          <div className="ib-value">{time || '--:--'}</div>
        </div>
      </div>
    </div>
  )
}
