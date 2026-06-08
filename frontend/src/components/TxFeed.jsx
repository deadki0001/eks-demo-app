import { ArrowUpRight } from 'lucide-react'

const COLORS = [
  ['#7c5cfc','#5b3fd4'],['#00c9a7','#00957d'],['#fc5c7d','#d43f5f'],
  ['#f0b429','#c8941a'],['#3b82f6','#2563eb'],['#8b5cf6','#7c3aed'],
]

const SYM = { ZAR:'R', USD:'$', EUR:'€', GBP:'£' }

function initials(n) {
  if (!n) return '??'
  const p = n.trim().split(' ')
  return p.length === 1 ? p[0].slice(0,2).toUpperCase() : (p[0][0]+p[p.length-1][0]).toUpperCase()
}

function avatarBg(n) {
  const [c1,c2] = COLORS[(n||'').charCodeAt(0) % COLORS.length]
  return `linear-gradient(135deg,${c1},${c2})`
}

function fmtAmt(amount, currency) {
  const s = SYM[currency] || currency+' '
  return s + parseFloat(amount).toLocaleString('en-ZA', { minimumFractionDigits:2, maximumFractionDigits:2 })
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString('en-ZA', { hour:'2-digit', minute:'2-digit' })
}

const STATUS = {
  pending:   ['badge-pending',   'Pending'],
  completed: ['badge-completed', 'Sent'],
  failed:    ['badge-failed',    'Failed'],
}

export default function TxFeed({ payments, loading }) {
  if (loading) {
    return (
      <div className="feed-loading">
        <div className="spinner" />
        <span>Loading transactions...</span>
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="feed-empty">
        <ArrowUpRight size={32} className="feed-empty-icon" />
        <p>No transactions yet</p>
        <span>Tap Send to make your first payment</span>
      </div>
    )
  }

  return (
    <div className="tx-list">
      {payments.map(p => {
        const [cls, lbl] = STATUS[p.status] || STATUS.pending
        return (
          <div key={p.id} className="tx-row">
            <div className="tx-av" style={{ background: avatarBg(p.recipient) }}>
              {initials(p.recipient)}
            </div>
            <div className="tx-body">
              <div className="tx-name">{p.recipient}</div>
              <div className="tx-sub">
                {p.sender}{p.description ? ` · ${p.description}` : ''}
                <span className="tx-time"> · {fmtTime(p.created_at)}</span>
              </div>
            </div>
            <div className="tx-right">
              <div className="tx-amt">{fmtAmt(p.amount, p.currency)}</div>
              <span className={`tx-badge ${cls}`}>{lbl}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
