import { useState, useEffect } from 'react'
import axios from 'axios'
import { Zap, Copy, Check, Clock, CheckCircle } from 'lucide-react'

const SYM = { ZAR:'R', USD:'$', EUR:'€', GBP:'£' }

export default function InstantMoney({ apiUrl }) {
  const [vouchers, setVouchers]   = useState([])
  const [form, setForm]           = useState({ amount:'', currency:'ZAR', sender:'', message:'' })
  const [created, setCreated]     = useState(null)
  const [busy, setBusy]           = useState(false)
  const [copied, setCopied]       = useState(false)

  useEffect(() => {
    axios.get(`${apiUrl}/vouchers`).then(r => setVouchers(r.data))
  }, [apiUrl])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const createVoucher = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await axios.post(`${apiUrl}/vouchers`, form)
      setCreated(res.data)
      setVouchers(prev => [res.data, ...prev])
      setForm({ amount:'', currency:'ZAR', sender:'', message:'' })
    } finally {
      setBusy(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(created.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="screen im-screen">
      <div className="screen-topbar">
        <h1 className="screen-title">Instant Money</h1>
      </div>

      <div className="im-explainer">
        <Zap size={18} color="#f0b429" />
        <p>Generate a voucher. Recipient redeems at any Shoprite, Checkers or FNB ATM. No bank account needed.</p>
      </div>

      {created ? (
        <div className="voucher-created">
          <div className="voucher-success-icon">
            <Zap size={32} color="#f0b429" />
          </div>
          <div className="voucher-amount">{SYM[created.currency]}{parseFloat(created.amount).toLocaleString('en-ZA', { minimumFractionDigits:2 })}</div>
          <div className="voucher-label">Voucher code</div>
          <div className="voucher-code-wrap">
            <div className="voucher-code">{created.code}</div>
            <button className="copy-btn" onClick={copyCode}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div className="voucher-label" style={{marginTop:12}}>PIN</div>
          <div className="voucher-pin">{created.pin}</div>
          {created.message && <div className="voucher-message">"{created.message}"</div>}
          <button className="send-btn" style={{marginTop:20}} onClick={() => setCreated(null)}>
            Create another
          </button>
        </div>
      ) : (
        <form className="im-form" onSubmit={createVoucher}>
          <div className="amount-block">
            <div className="amount-block-label">Voucher amount</div>
            <div className="amount-row">
              <span className="amount-sym">{SYM[form.currency] || ''}</span>
              <input
                className="amount-inp"
                type="number" placeholder="0.00"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                min="10" step="0.01" required
              />
              <select className="curr-select" value={form.currency} onChange={e => set('currency', e.target.value)}>
                <option value="ZAR">ZAR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div className="sheet-field">
            <Zap size={16} className="field-ico" />
            <input type="text" placeholder="Your name (optional)" value={form.sender} onChange={e => set('sender', e.target.value)} />
          </div>
          <div className="sheet-field">
            <Zap size={16} className="field-ico" />
            <input type="text" placeholder="Message to recipient (optional)" value={form.message} onChange={e => set('message', e.target.value)} />
          </div>

          <button type="submit" className="send-btn" disabled={busy}>
            <Zap size={16} /> Generate voucher
          </button>
        </form>
      )}

      {vouchers.length > 0 && (
        <div className="voucher-history">
          <div className="feed-header">
            <span className="feed-title">Your vouchers</span>
            <span className="feed-count">{vouchers.length}</span>
          </div>
          {vouchers.map(v => (
            <div key={v.id} className="voucher-row">
              <div className="voucher-row-icon">
                {v.status === 'redeemed'
                  ? <CheckCircle size={18} color="#00d4aa" />
                  : <Clock size={18} color="#f0b429" />}
              </div>
              <div className="voucher-row-body">
                <div className="voucher-row-code">{v.code}</div>
                <div className="voucher-row-meta">{new Date(v.created_at).toLocaleDateString('en-ZA')}</div>
              </div>
              <div className="voucher-row-amount">
                {SYM[v.currency]}{parseFloat(v.amount).toLocaleString('en-ZA', { minimumFractionDigits:2 })}
                <span className={`tx-badge ${v.status === 'redeemed' ? 'badge-completed' : 'badge-pending'}`} style={{display:'block',marginTop:3}}>
                  {v.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
