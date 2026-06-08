import { NavLink, useNavigate } from 'react-router-dom'
import { Home, BarChart2, Send, Users, Zap, Info } from 'lucide-react'
import InfoBar from './InfoBar'

export default function NavBar({ onSend, desktop }) {
  const navigate = useNavigate()

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="user-avatar">DA</div>
          <div>
            <div className="greeting">Good day</div>
            <div className="username">Devon Adkins</div>
          </div>
        </div>
        <div className="topbar-right">
          {desktop && (
            <nav className="desktop-nav-links">
              <NavLink to="/" className={({isActive}) => `dnl ${isActive?'dnl-active':''}`}>Home</NavLink>
              <NavLink to="/analytics" className={({isActive}) => `dnl ${isActive?'dnl-active':''}`}>Analytics</NavLink>
              <NavLink to="/beneficiaries" className={({isActive}) => `dnl ${isActive?'dnl-active':''}`}>Beneficiaries</NavLink>
              <NavLink to="/instant-money" className={({isActive}) => `dnl ${isActive?'dnl-active':''}`}>Instant Money</NavLink>
            </nav>
          )}
          <button className="about-btn" onClick={() => navigate('/about')}>
            <Info size={14} /> About us
          </button>
        </div>
      </header>

      <InfoBar />

      {!desktop && (
        <nav className="bottom-nav">
          <NavLink to="/" className={({isActive}) => `bn-item ${isActive?'active':''}`}>
            <Home size={20} /><span>Home</span>
          </NavLink>
          <NavLink to="/analytics" className={({isActive}) => `bn-item ${isActive?'active':''}`}>
            <BarChart2 size={20} /><span>Analytics</span>
          </NavLink>
          <button className="bn-send" onClick={onSend}>
            <Send size={22} />
          </button>
          <NavLink to="/beneficiaries" className={({isActive}) => `bn-item ${isActive?'active':''}`}>
            <Users size={20} /><span>Pay</span>
          </NavLink>
          <NavLink to="/instant-money" className={({isActive}) => `bn-item ${isActive?'active':''}`}>
            <Zap size={20} /><span>Voucher</span>
          </NavLink>
        </nav>
      )}
    </>
  )
}
