import { useState } from 'react'
import axios from 'axios'

function PaymentForm({ apiUrl, onPaymentCreated }) {
  const [form, setForm] = useState({
    amount: '',
    currency: 'ZAR',
    sender: '',
    recipient: '',
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const response = await axios.post(`${apiUrl}/payments`, form)
      onPaymentCreated(response.data)
      setForm({ amount: '', currency: 'ZAR', sender: '', recipient: '', description: '' })
      setMessage({ type: 'success', text: '⚡ Transmission successful — signal delivered at light speed' })
    } catch (err) {
      setMessage({ type: 'error', text: `✕ Transmission failed — ${err.response?.data?.error || 'signal lost'}` })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
      <div className="input-group">
        <label className="input-label">Signal Strength (Amount)</label>
        <div className="input-row">
          <input
            className="form-input amount-input"
            type="number"
            name="amount"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
          />
          <select
            className="currency-select"
            name="currency"
            value={form.currency}
            onChange={handleChange}
          >
            <option value="ZAR">ZAR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>
      <div className="input-group">
        <label className="input-label">Origin Node (Sender)</label>
        <input
          className="form-input"
          type="text"
          name="sender"
          placeholder="Your name"
          value={form.sender}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-group">
        <label className="input-label">Destination Node (Recipient)</label>
        <input
          className="form-input"
          type="text"
          name="recipient"
          placeholder="Recipient name"
          value={form.recipient}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-group">
        <label className="input-label">Transmission Note</label>
        <input
          className="form-input"
          type="text"
          name="description"
          placeholder="What is this for? (optional)"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="launch-button" disabled={submitting}>
        {submitting ? (
          <><span>Transmitting</span><span>···</span></>
        ) : (
          <><span>⚡</span><span>Launch Transmission</span></>
        )}
      </button>
    </form>
  )
}

export default PaymentForm
