import { useState } from 'react'
import axios from 'axios'

const CURRENCIES = ['ZAR', 'USD', 'EUR', 'GBP', 'NGN', 'KES']

export default function SendForm({ apiUrl, onSent }) {
  const [form, setForm] = useState({
    amount: '',
    currency: 'ZAR',
    sender: '',
    recipient: '',
    description: ''
  })
  const [busy, setBusy] = useState(false)
  const [alert, setAlert] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setAlert(null)
    try {
      const res = await axios.post(`${apiUrl}/payments`, form)
      onSent(res.data)
      setForm({ amount: '', currency: form.currency, sender: '', recipient: '', description: '' })
      setAlert({ type: 'success', text: 'Payment sent successfully' })
    } catch (err) {
      setAlert({ type: 'error', text: err.response?.data?.error || 'Payment failed. Try again.' })
    } finally {
      setBusy(false)
    }
  }

  const symbol = { ZAR: 'R', USD: '$', EUR: '€', GBP: '£' }[form.currency] || ''

  return (
    <>
      <h2 className="panel-heading">Send <span>Money</span></h2>
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✓' : '✕'} {alert.text}
        </div>
      )}
      <form onSubmit={submit}>
        <div className="amount-card">
          <div className="amount-card-label">You send</div>
          <div className="amount-input-row">
            <span className="amount-symbol">{symbol}</span>
            <input
              className="amount-input"
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              min="0.01"
              step="0.01"
              required
            />
            <select
              className="currency-pill"
              value={form.currency}
              onChange={e => set('currency', e.target.value)}
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">From</label>
          <div className="field-input-wrap">
            <span className="field-icon">👤</span>
            <input
              className="field-input"
              type="text"
              placeholder="Your full name"
              value={form.sender}
              onChange={e => set('sender', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">To</label>
          <div className="field-input-wrap">
            <span className="field-icon">👤</span>
            <input
              className="field-input"
              type="text"
              placeholder="Recipient full name"
              value={form.recipient}
              onChange={e => set('recipient', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Reference</label>
          <div className="field-input-wrap">
            <span className="field-icon">📝</span>
            <input
              className="field-input"
              type="text"
              placeholder="What is this payment for?"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="send-button" disabled={busy}>
          {busy ? (
            <><div className="spinner" style={{width:18,height:18,borderTopColor:'white'}}></div> Processing...</>
          ) : (
            <><span className="send-icon">↗</span> Send Payment</>
          )}
        </button>
      </form>
    </>
  )
}
