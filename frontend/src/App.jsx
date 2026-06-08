import { useState, useEffect } from 'react'
import axios from 'axios'
import SendForm from './components/SendForm'
import TxFeed from './components/TxFeed'
import InfoBar from './components/InfoBar'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/payments`)
      setPayments(res.data)
      setError(null)
    } catch {
      setError('Could not load transactions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPayments() }, [])

  const onSent = (p) => setPayments([p, ...payments])

  const totalVolume = payments
    .reduce((s, p) => s + parseFloat(p.amount || 0), 0)

  const todayCount = payments.filter(p => {
    const d = new Date(p.created_at)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }).length

  return (
    <div className="app">
      <nav className="topnav">
        <div className="nav-brand">
          <div className="brand-mark">L⚡</div>
          <div>
            <div className="brand-name">LSD Payments</div>
            <div className="brand-tag">Light Speed Division</div>
          </div>
        </div>
        <div className="nav-status">
          <div className="status-pulse"></div>
          All systems go
        </div>
      </nav>

      <InfoBar />

      <div className="hero-stats">
        <div className="stat-card">
          <div className="stat-card-label">Total Sent</div>
          <div className="stat-card-value teal">{payments.length}</div>
          <div className="stat-card-sub">transactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Volume</div>
          <div className="stat-card-value purple">
            {totalVolume.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="stat-card-sub">across all currencies</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Today</div>
          <div className="stat-card-value gold">{todayCount}</div>
          <div className="stat-card-sub">transactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Speed</div>
          <div className="stat-card-value teal">{'<'}1ms</div>
          <div className="stat-card-sub">avg latency</div>
        </div>
      </div>

      <div className="main-layout">
        <div className="send-panel">
          <SendForm apiUrl={API_URL} onSent={onSent} />
        </div>
        <div className="feed-panel">
          <TxFeed payments={payments} loading={loading} error={error} />
        </div>
      </div>
    </div>
  )
}

export default App
