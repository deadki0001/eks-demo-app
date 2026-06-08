import { X, Settings, FileText, HelpCircle, LogOut, Bell, Shield, Moon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MENU_ITEMS = [
  { icon: Bell,      label: 'Notifications',    sub: 'Manage alerts and push notifications' },
  { icon: Shield,    label: 'Security',          sub: 'PIN, biometrics, two-factor auth' },
  { icon: FileText,  label: 'Statements',        sub: 'Download transaction history' },
  { icon: Moon,      label: 'Appearance',        sub: 'Dark mode, font size, language' },
  { icon: HelpCircle,label: 'Help & support',    sub: 'FAQs, contact us, live chat' },
  { icon: Settings,  label: 'Settings',          sub: 'Account, preferences, limits' },
]

export default function MoreSheet({ open, onClose }) {
  const navigate = useNavigate()

  if (!open) return null

  return (
    <div className="sheet-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-head">
          <span className="sheet-title">More options</span>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="more-menu">
          {MENU_ITEMS.map(item => (
            <button key={item.label} className="more-item" onClick={onClose}>
              <div className="more-item-icon">
                <item.icon size={18} />
              </div>
              <div className="more-item-body">
                <div className="more-item-label">{item.label}</div>
                <div className="more-item-sub">{item.sub}</div>
              </div>
              <span className="more-item-arrow">›</span>
            </button>
          ))}
        </div>

        <div className="more-divider" />

        <button className="more-item more-logout" onClick={onClose}>
          <div className="more-item-icon more-logout-icon">
            <LogOut size={18} />
          </div>
          <div className="more-item-body">
            <div className="more-item-label" style={{color:'var(--danger)'}}>Sign out</div>
          </div>
        </button>
      </div>
    </div>
  )
}
