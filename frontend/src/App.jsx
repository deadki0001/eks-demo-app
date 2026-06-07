import { useState, useEffect } from 'react'
import axios from 'axios'
import PaymentForm from './components/PaymentForm'
import PaymentList from './components/PaymentList'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/payments`)
      setPayments(response.data)
      setError(null)
    } catch {
      setError('Signal lost. Could not retrieve transmissions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPayments() }, [])

  const handlePaymentCreated = (newPayment) => {
    setPayments([newPayment, ...payments])
  }

  const totalTransmitted = payments
    .filter(p => p.status !== 'failed')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <div className="logo-text">
              <h1>LSD Payments</h1>
              <p>Light Speed Division</p>
            </div>
          </div>
          <div className="signal-indicator">
            <div className="signal-dot"></div>
            NETWORK LIVE
          </div>
        </div>
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-label">Transmissions</span>
            <span className="stat-value">{payments.length.toString().padStart(4, '0')}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Volume</span>
            <span className="stat-value">{totalTransmitted.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Latency</span>
            <span className="stat-value">{'<'}1ms</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="layout">
          <div className="form-panel">
            <div className="section-header">
              <h2>New Transmission</h2>
              <div className="section-line"></div>
            </div>
            <PaymentForm
              apiUrl={API_URL}
              onPaymentCreated={handlePaymentCreated}
            />
          </div>

          <div className="list-panel">
            <div className="section-header">
              <h2>Transmission Log</h2>
              <div className="section-line"></div>
            </div>
            <PaymentList
              payments={payments}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
