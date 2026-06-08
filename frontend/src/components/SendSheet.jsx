import { useState } from 'react'
import axios from 'axios'
import { X, Send, User, FileText, CheckCircle } from 'lucide-react'

const CURRENCIES = ['ZAR','USD','EUR','GBP','NGN','KES']
const SYM = { ZAR:'R', USD:'$', EUR:'€', GBP:'£' }

export default function SendSheet({ open, onClose, apiUrl, onSent }) {
  const [form, setForm]     = useState({ amount:'', currency:'ZAR', sender:'', recipient:'', description:'' })
  const [busy, setBusy]     = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError]   = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await axios.post(`${apiUrl}/payments`, form)
      setSuccess(res.data)
      onSent(res.data)
      setForm({ amount:'', currency:'ZAR', sender:'', recipient:'', description:'' })
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed.')
    } finally {
      setBusy(false)
    }
  }

  const handleClose = () => {
    setSuccess(null)
    setError(null)
    onClose()
  }

  if (!open) return null

  return (
    <div className="sheet-backdrop" onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="sheet">
        <div className="sheet-handle" />

        <div className="sheet-head">
          <span className="sheet-title">
            {success ? 'Payment sent' : 'Send money'}
          </span>
          <button className="icon-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="success-state">
            <div className="success-ring">
              <CheckCircle size={40} color="var(--teal)" />
            </div>
            <div className="success-amount">
              {SYM[success.currency] || ''}{parseFloat(success.amount).toLocaleString('en-ZA', { minimumFractionDigits:2 })}
            </div>
            <div className="success-to">to {success.recipient}</div>
            <div className="success-ref">{success.description || 'No reference'}</div>
            <button className="send-btn" onClick={handleClose}>Done</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            {error && <div className="sheet-error">{error}</div>}

            <div className="amount-block">
              <div className="amount-block-label">Amount</div>
              <div className="amount-row">
                <span className="amount-sym">{SYM[form.currency] || ''}</span>
                <input
                  className="amount-inp"
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={e => set('amount', e.target.value)}
                  min="0.01" step="0.01" required
                />
                <select
                  className="curr-select"
                  value={form.currency}
                  onChange={e => set('currency', e.target.value)}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="sheet-field">
              <User size={16} className="field-ico" />
              <input
                type="text" placeholder="Your name"
                value={form.sender}
                onChange={e => set('sender', e.target.value)}
                required
              />
            </div>

            <div className="sheet-field">
              <User size={16} className="field-ico" />
              <input
                type="text" placeholder="Recipient name"
                value={form.recipient}
                onChange={e => set('recipient', e.target.value)}
                required
              />
            </div>

            <div className="sheet-field">
              <FileText size={16} className="field-ico" />
              <input
                type="text" placeholder="Reference (optional)"
                value={form.description}
                onChange={e => set('description', e.target.value)}
              />
            </div>

            <button type="submit" className="send-btn" disabled={busy}>
              {busy ? (
                <span className="btn-spinner" />
              ) : (
                <><Send size={16} /> Send payment</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
