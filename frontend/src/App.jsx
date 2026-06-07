import { useState, useEffect } from 'react'
import axios from 'axios'
import PaymentList from './components/PaymentList'
import PaymentForm from './components/PaymentForm'
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
    } catch (err) {
      setError('Failed to fetch payments. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const handlePaymentCreated = (newPayment) => {
    setPayments([newPayment, ...payments])
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>LSD Payments</h1>
          <p>Light Speed Payments - Instant transfers at the speed of light</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <section className="form-section">
            <h2>New Payment</h2>
            <PaymentForm
              apiUrl={API_URL}
              onPaymentCreated={handlePaymentCreated}
            />
          </section>

          <section className="list-section">
            <h2>Recent Payments</h2>
            {loading && <div className="loading">Loading payments...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && (
              <PaymentList payments={payments} />
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
