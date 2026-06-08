import { X, Copy, Check, QrCode } from 'lucide-react'
import { useState } from 'react'

const ACCOUNT = {
  name: 'Devon Adkins',
  bank: 'LSD Payments',
  account: '4001002500',
  branch: '250655',
  type: 'Current',
  ref: 'LSD-DA-001'
}

export default function ReceiveSheet({ open, onClose }) {
  const [copied, setCopied] = useState(null)

  const copy = (val, key) => {
    navigator.clipboard.writeText(val)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!open) return null

  return (
    <div className="sheet-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-head">
          <span className="sheet-title">Receive money</span>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="receive-qr-wrap">
          <div className="receive-qr">
            <QrCode size={80} color="var(--purple2)" />
            <div className="receive-qr-label">Scan to pay</div>
          </div>
        </div>

        <div className="receive-details">
          {Object.entries({
            'Account name': ACCOUNT.name,
            'Bank': ACCOUNT.bank,
            'Account number': ACCOUNT.account,
            'Branch code': ACCOUNT.branch,
            'Account type': ACCOUNT.type,
            'Reference': ACCOUNT.ref,
          }).map(([label, value]) => (
            <div key={label} className="receive-row">
              <div className="receive-row-label">{label}</div>
              <div className="receive-row-right">
                <span className="receive-row-value">{value}</span>
                <button className="copy-btn" onClick={() => copy(value, label)}>
                  {copied === label ? <Check size={13} color="var(--teal)" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="send-btn" style={{marginTop:16}} onClick={() => copy(
          `Bank: ${ACCOUNT.bank}\nAccount: ${ACCOUNT.account}\nBranch: ${ACCOUNT.branch}\nRef: ${ACCOUNT.ref}`,
          'all'
        )}>
          {copied === 'all' ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy all details</>}
        </button>
      </div>
    </div>
  )
}
