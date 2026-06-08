import { useState, useEffect } from 'react'
import axios from 'axios'
import Home from './screens/Home'
import SendSheet from './components/SendSheet'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function App() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [sheet, setSheet]       = useState(false)
  const [weather, setWeather]   = useState(null)
  const [rates, setRates]       = useState(null)

  useEffect(() => {
    axios.get(`${API_URL}/payments`)
      .then(r => setPayments(r.data))
      .finally(() => setLoading(false))

    axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: -26.2041, longitude: 28.0473,
        current_weather: true, timezone: 'Africa/Johannesburg', forecast_days: 1
      }
    }).then(r => {
      const cw = r.data.current_weather
      const icons = {0:'Sun',1:'CloudSun',2:'Cloud',3:'Cloud',45:'CloudFog',61:'CloudRain',80:'CloudDrizzle',95:'CloudLightning'}
      setWeather({ temp: Math.round(cw.temperature), wind: Math.round(cw.windspeed), code: cw.weathercode, iconName: icons[cw.weathercode] || 'Thermometer' })
    }).catch(() => setWeather({ temp: '--', wind: '--', iconName: 'Thermometer' }))

    axios.get(`${API_URL}/market/rates`)
      .then(r => setRates(r.data))
      .catch(() => setRates(null))
  }, [])

  const onSent = (p) => {
    setPayments(prev => [p, ...prev])
    setSheet(false)
  }

  return (
    <div className="app">
      <Home
        payments={payments}
        loading={loading}
        weather={weather}
        rates={rates}
        onSend={() => setSheet(true)}
      />
      <SendSheet
        open={sheet}
        onClose={() => setSheet(false)}
        apiUrl={API_URL}
        onSent={onSent}
      />
    </div>
  )
}
