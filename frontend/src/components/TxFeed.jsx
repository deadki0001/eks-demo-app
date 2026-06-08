const AVATAR_COLORS = [
  ['#7c5cfc','#5b3fd4'],
  ['#00c9a7','#00957d'],
  ['#fc5c7d','#d43f5f'],
  ['#f0b429','#c8941a'],
  ['#3b82f6','#2563eb'],
  ['#8b5cf6','#7c3aed'],
]

function initials(name) {
  if (!name) return '??'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function avatarColor(name) {
  if (!name) return AVATAR_COLORS[0]
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

function formatAmount(amount, currency) {
  const num = parseFloat(amount)
  const prefix = { ZAR: 'R', USD: '$', EUR: '€', GBP: '£' }[currency] || currency + ' '
  return `${prefix}${num.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(ts) {
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Today'
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
}

const BADGE = {
  pending:   ['badge-pending',   'Pending'],
  completed: ['badge-completed', 'Completed'],
  failed:    ['badge-failed',    'Failed'],
}

export default function TxFeed({ payments, loading, error }) {
  if (loading) {
    return (
      <div className="feed-loading">
        <div className="spinner"></div>
        Loading transactions...
      </div>
    )
  }

  if (error) return <div className="feed-error">{error}</div>

  if (payments.length === 0) {
    return (
      <div className="feed-empty">
        <div className="feed-empty-icon">💸</div>
        <h3>No transactions yet</h3>
        <p>Send your first payment to get started.</p>
      </div>
    )
  }

  const groups = {}
  payments.forEach(p => {
    const key = formatDate(p.created_at)
    if (!groups[key]) groups[key] = []
    groups[key].push(p)
  })

  return (
    <>
      <div className="feed-heading">
        Transaction History
        <span className="feed-count">{payments.length} total</span>
      </div>
      <div className="tx-list">
        {Object.entries(groups).map(([date, items]) => (
          <div key={date}>
            <div className="tx-date-divider">{date}</div>
            {items.map(p => {
              const [c1, c2] = avatarColor(p.recipient)
              const [badgeClass, badgeLabel] = BADGE[p.status] || ['badge-pending', p.status]
              return (
                <div key={p.id} className="tx-item">
                  <div
                    className="tx-avatar"
                    style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                  >
                    {initials(p.recipient)}
                  </div>
                  <div className="tx-body">
                    <div className="tx-title">{p.recipient}</div>
                    <div className="tx-subtitle">
                      From {p.sender}{p.description ? ` · ${p.description}` : ''}
                    </div>
                  </div>
                  <div className="tx-right">
                    <div className="tx-amount">{formatAmount(p.amount, p.currency)}</div>
                    <div className={`tx-badge ${badgeClass}`}>{badgeLabel}</div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}
