function PaymentList({ payments, loading, error }) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-dots">
          <span></span><span></span><span></span>
        </div>
        Scanning transmission log...
      </div>
    )
  }

  if (error) {
    return <div className="error-state">✕ {error}</div>
  }

  if (payments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🛸</div>
        <p>No transmissions yet.</p>
        <p>Launch your first payment to begin.</p>
      </div>
    )
  }

  const statusLabel = {
    pending: 'Transmitting',
    completed: 'Delivered',
    failed: 'Signal Lost'
  }

  return (
    <div className="payments-scroll">
      {payments.map((payment) => (
        <div key={payment.id} className="payment-card">
          <div className="payment-card-top">
            <div className="payment-amount-block">
              <span className="payment-amount">
                {parseFloat(payment.amount).toLocaleString('en-ZA', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
              <span className="payment-currency">{payment.currency}</span>
            </div>
            <span className={`payment-status status-${payment.status}`}>
              {statusLabel[payment.status] || payment.status}
            </span>
          </div>
          <div className="transmission-beam">
            <span className="node">{payment.sender}</span>
            <div className="beam"></div>
            <span className="node">{payment.recipient}</span>
          </div>
          <div className="payment-meta">
            <span className="payment-description">
              {payment.description || 'No note'}
            </span>
            <span className="payment-timestamp">
              {new Date(payment.created_at).toLocaleTimeString('en-ZA', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PaymentList
