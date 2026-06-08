import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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
  const [sheet, setSheet]         = useState(false)
  const [desktop, setDesktop]     = useState(
    () => localStorage.getItem('lsd-view') === 'desktop'
  )
  const location = useLocation()
  const isAbout  = location.pathname === '/about'

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
