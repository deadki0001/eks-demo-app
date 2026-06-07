function PaymentList({ payments }) {
  if (payments.length === 0) {
    return <div className="empty">No payments yet. Create your first payment above.</div>
  }

  return (
    <div className="payment-list">
      {payments.map((payment) => (
        <div key={payment.id} className="payment-card">
          <div className="payment-header">
            <span className="payment-amount">
              {payment.currency} {parseFloat(payment.amount).toFixed(2)}
            </span>
            <span className={`payment-status status-${payment.status}`}>
              {payment.status}
            </span>
          </div>
          <div className="payment-parties">
            <span className="sender">{payment.sender}</span>
            <span className="arrow">→</span>
            <span className="recipient">{payment.recipient}</span>
          </div>
          {payment.description && (
            <div className="payment-description">{payment.description}</div>
          )}
          <div className="payment-date">
            {new Date(payment.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PaymentList
