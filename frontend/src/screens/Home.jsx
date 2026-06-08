import { useState } from 'react'
import { TrendingUp, Send, ArrowDownLeft, ArrowUpRight, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TxFeed from '../components/TxFeed'
import ReceiveSheet from '../components/ReceiveSheet'
import MoreSheet from '../components/MoreSheet'

export default function Home({ payments, loading, onSend }) {
  const [receiveOpen, setReceiveOpen] = useState(false)
  const [moreOpen, setMoreOpen]       = useState(false)
  const navigate = useNavigate()

  const total = payments.reduce((s, p) => s + parseFloat(p.amount || 0), 0)
  const todayCount = payments.filter(p =>
    new Date(p.created_at).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="screen">
      <div className="balance-card">
        <div className="balance-top">
          <div>
            <div className="balance-label">Total Volume</div>
            <div className="balance-amount">
              R {total.toLocaleString('en-ZA', { minimumFractionDigits:2, maximumFractionDigits:2 })}
            </div>
            <div className="balance-meta">
              <span>{payments.length} transactions</span>
              <span className="meta-dot" />
              <span className="meta-today">{todayCount} today</span>
            </div>
          </div>
          <div className="balance-icon-wrap">
            <TrendingUp size={20} color="rgba(255,255,255,0.6)" />
          </div>
        </div>
        <div className="quick-actions">
          <button className="qa-btn qa-primary" onClick={onSend}>
            <Send size={16} /><span>Send</span>
          </button>
          <button className="qa-btn qa-secondary" onClick={() => setReceiveOpen(true)}>
            <ArrowDownLeft size={16} /><span>Receive</span>
          </button>
          <button className="qa-btn qa-secondary" onClick={() => navigate('/beneficiaries')}>
            <ArrowUpRight size={16} /><span>Pay</span>
          </button>
          <button className="qa-btn qa-secondary" onClick={() => setMoreOpen(true)}>
            <MoreHorizontal size={16} /><span>More</span>
          </button>
        </div>
      </div>

      <div className="feed-section">
        <div className="feed-header">
          <span className="feed-title">Recent transactions</span>
          <span className="feed-count">{payments.length}</span>
        </div>
        <TxFeed payments={payments} loading={loading} />
      </div>

      <ReceiveSheet open={receiveOpen} onClose={() => setReceiveOpen(false)} />
      <MoreSheet    open={moreOpen}    onClose={() => setMoreOpen(false)} />
    </div>
  )
}
