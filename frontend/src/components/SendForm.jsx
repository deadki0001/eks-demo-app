import { Send, User, FileText } from 'lucide-react'

export default function SendForm({ onSend }) {
  return (
    <div className="desktop-send-cta">
      <button className="send-btn" onClick={onSend}>
        <Send size={16} /> Send a payment
      </button>
    </div>
  )
}
