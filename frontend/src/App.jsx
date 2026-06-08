import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import axios from 'axios'
import usePayments from './hooks/usePayments'
import Home from './screens/Home'
import Analytics from './screens/Analytics'
import Beneficiaries from './screens/Beneficiaries'
import InstantMoney from './screens/InstantMoney'
import About from './screens/About'
import SendSheet from './components/SendSheet'
import NavBar from './components/NavBar'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function App() {
  const { payments, loading, add } = usePayments(API_URL)
  const [sheet, setSheet]         = useState(false)
  const [weather, setWeather]     = useState(null)
  const [rates, setRates]         = useState(null)
  const location = useLocation()
  const isAbout  = location.pathname === '/about'

  useEffect(() => {
    axios.get('https://api.open-meteo.com/v1/forecast', {
      params: { latitude:-26.2041, longitude:28.0473, current_weather:true, timezone:'Africa/Johannesburg', forecast_days:1 }
    }).then(r => {
      const cw = r.data.current_weather
      const icons = {0:'Sun',1:'CloudSun',2:'Cloud',3:'Cloud',45:'CloudFog',61:'CloudRain',80:'CloudDrizzle',95:'CloudLightning'}
      setWeather({ temp:Math.round(cw.temperature), wind:Math.round(cw.windspeed), iconName:icons[cw.weathercode]||'Thermometer' })
    }).catch(() => setWeather({ temp:'--', wind:'--', iconName:'Thermometer' }))

    axios.get(`${API_URL}/market/rates`)
      .then(r => setRates(r.data))
      .catch(() => setRates(null))
  }, [])

  const onSent = (p) => { add(p); setSheet(false) }

  return (
    <div className="app">
      {!isAbout && (
        <NavBar
          weather={weather}
          rates={rates}
          onSend={() => setSheet(true)}
        />
      )}

      <Routes>
        <Route path="/" element={
          <Home payments={payments} loading={loading} onSend={() => setSheet(true)} />
        } />
        <Route path="/analytics" element={<Analytics payments={payments} />} />
        <Route path="/beneficiaries" element={<Beneficiaries apiUrl={API_URL} onSend={() => setSheet(true)} />} />
        <Route path="/instant-money" element={<InstantMoney apiUrl={API_URL} />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {!isAbout && (
        <SendSheet
          open={sheet}
          onClose={() => setSheet(false)}
          apiUrl={API_URL}
          onSent={onSent}
        />
      )}
    </div>
  )
}
