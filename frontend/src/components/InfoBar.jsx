import { useState, useEffect } from 'react'
import { Wind, Clock } from 'lucide-react'

const CURRENCY_FLAGS = {
  'USD/ZAR': '🇺🇸',
  'EUR/ZAR': '🇪🇺',
  'GBP/ZAR': '🇬🇧',
}

export default function InfoBar({ weather, rates, WeatherIcon }) {
  const [time, setTime] = useState('')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const upd = () => setTime(new Date().toLocaleTimeString('en-ZA', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Johannesburg'
    }))
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

  return (
    <div className="infobar">
      <div className="ib-seg">
        <div className="ib-ico">
          {weather ? <WeatherIcon size={15} /> : <span style={{fontSize:14}}>🌡️</span>}
        </div>
        <div>
          <div className="ib-label">Johannesburg</div>
          <div className="ib-value">
            {weather
              ? <>{weather.temp}°C{weather.wind !== '--' && <span className="ib-muted"> <Wind size={10} style={{verticalAlign:'middle'}} /> {weather.wind} km/h</span>}</>
              : 'Loading...'}
          </div>
        </div>
      </div>

      <div className="ib-divider" />

      <div className="ib-seg">
        <div className="ib-ico" style={{fontSize:16}}>
          {pair ? CURRENCY_FLAGS[pair.label] || '💱' : '💱'}
        </div>
        <div>
          <div className="ib-label">
            {pair ? pair.label : 'FX Rates'}
            {rates?.date ? <span className="ib-date"> · {rates.date}</span> : ''}
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
          <div className="ib-label">JSE · SAST</div>
          <div className="ib-value">{time || '--:--'}</div>
        </div>
      </div>
    </div>
  )
}
