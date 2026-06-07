import { useState } from 'react'
import axios from 'axios'

function PaymentForm({ apiUrl, onPaymentCreated }) {
  const [form, setForm] = useState({
    amount: '',
    currency: 'USD',
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
      setForm({ amount: '', currency: 'USD', sender: '', recipient: '', description: '' })
      setMessage({ type: 'success', text: 'Payment created successfully' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Payment failed' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
      <div className="form-row">
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
          min="0.01"
          step="0.01"
        />
        <select name="currency" value={form.currency} onChange={handleChange}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="ZAR">ZAR</option>
        </select>
      </div>
      <input
        type="text"
        name="sender"
        placeholder="Sender"
        value={form.sender}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="recipient"
        placeholder="Recipient"
        value={form.recipient}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={handleChange}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Payment'}
      </button>
    </form>
  )
}

export default PaymentForm
