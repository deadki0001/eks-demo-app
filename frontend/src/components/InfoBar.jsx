import { useState, useEffect } from 'react'
import { Wind, TrendingUp, Clock } from 'lucide-react'

export default function InfoBar({ weather, rates, WeatherIcon }) {
  const [time, setTime]   = useState('')
  const [tick, setTick]   = useState(0)

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
        <div className="ib-icon"><WeatherIcon size={16} /></div>
        <div>
          <div className="ib-label">Johannesburg</div>
          <div className="ib-value">
            {weather ? `${weather.temp}°C` : '—'}
            {weather?.wind ? <span className="ib-muted"> · <Wind size={11} style={{verticalAlign:'middle'}} /> {weather.wind} km/h</span> : null}
          </div>
        </div>
      </div>

      <div className="ib-divider" />

      <div className="ib-seg">
        <div className="ib-icon"><TrendingUp size={16} /></div>
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
        <div className="ib-icon"><Clock size={16} /></div>
        <div>
          <div className="ib-label">JSE · SAST</div>
          <div className="ib-value">{time || '--:--'}</div>
        </div>
      </div>
    </div>
  )
}
