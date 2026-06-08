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
import Background from './components/Background'
import TxFeed from './components/TxFeed'
import { Monitor, Smartphone, Send } from 'lucide-react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function App() {
  const { payments, loading, add } = usePayments(API_URL)
  const [sheet, setSheet]   = useState(false)
  const [weather, setWeather] = useState(null)
  const [rates, setRates]   = useState(null)
  const [desktop, setDesktop] = useState(
    () => localStorage.getItem('lsd-view') === 'desktop'
  )
  const location = useLocation()
  const isAbout  = location.pathname === '/about'

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current_weather=true&timezone=Africa%2FJohannesburg&forecast_days=1')
      .then(r => r.json())
      .then(data => {
        const cw = data.current_weather
        if (!cw) return
        const iconMap = {
          0:'Sun', 1:'CloudSun', 2:'CloudSun', 3:'Cloud',
          45:'CloudFog', 48:'CloudFog',
          51:'CloudDrizzle', 53:'CloudDrizzle', 55:'CloudDrizzle',
          61:'CloudRain', 63:'CloudRain', 65:'CloudRain',
          71:'CloudSnow', 73:'CloudSnow', 75:'CloudSnow',
          80:'CloudRain', 81:'CloudRain', 82:'CloudRain',
          95:'CloudLightning', 99:'CloudLightning'
        }
        setWeather({
          temp: Math.round(cw.temperature),
          wind: Math.round(cw.windspeed),
          iconName: iconMap[cw.weathercode] || 'Thermometer',
          isDay: cw.is_day === 1
        })
      })
      .catch(() => setWeather({ temp: '--', wind: '--', iconName: 'Thermometer', isDay: true }))

    axios.get(`${API_URL}/market/rates`)
      .then(r => setRates(r.data))
      .catch(() => setRates(null))
  }, [])

  const onSent = (p) => { add(p); setSheet(false) }

  const toggleView = () => {
    const next = !desktop
    setDesktop(next)
    localStorage.setItem('lsd-view', next ? 'desktop' : 'mobile')
  }

  const appRoutes = (
    <Routes>
      <Route path="/" element={
        <Home payments={payments} loading={loading} onSend={() => setSheet(true)} />
      } />
      <Route path="/analytics" element={<Analytics payments={payments} />} />
      <Route path="/beneficiaries" element={
        <Beneficiaries apiUrl={API_URL} onSend={() => setSheet(true)} />
      } />
      <Route path="/instant-money" element={<InstantMoney apiUrl={API_URL} />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )

  return (
    <div className={`app ${desktop ? 'view-desktop' : ''}`}>
      <Background />

      {!isAbout && (
        <NavBar
          weather={weather}
          rates={rates}
          onSend={() => setSheet(true)}
          desktop={desktop}
        />
      )}

      {isAbout ? appRoutes : desktop ? (
        <div className="desktop-layout">
          <div className="desktop-main">
            {appRoutes}
          </div>
          <div className="desktop-sidebar">
            <div className="sidebar-header">
              <span className="feed-title">Live transactions</span>
              <span className="feed-count">{payments.length}</span>
            </div>
            <div className="sidebar-feed">
              <TxFeed payments={payments} loading={loading} />
            </div>
            <button className="send-btn sidebar-send" onClick={() => setSheet(true)}>
              <Send size={16} /> Send payment
            </button>
          </div>
        </div>
      ) : (
        <div className="mobile-layout">
          {appRoutes}
        </div>
      )}

      {!isAbout && (
        <SendSheet
          open={sheet}
          onClose={() => setSheet(false)}
          apiUrl={API_URL}
          onSent={onSent}
        />
      )}

      {!isAbout && (
        <button className="view-toggle" onClick={toggleView}>
          {desktop ? <Smartphone size={13} /> : <Monitor size={13} />}
          {desktop ? 'Mobile' : 'Desktop'}
        </button>
      )}
    </div>
  )
}
