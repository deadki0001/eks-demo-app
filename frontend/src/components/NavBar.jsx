import { NavLink, useNavigate } from 'react-router-dom'
import { Home, BarChart2, Send, Users, Zap, Info } from 'lucide-react'
import InfoBar from './InfoBar'
import {
  Sun, Cloud, CloudRain, CloudLightning,
  CloudDrizzle, CloudFog, CloudSun, Thermometer
} from 'lucide-react'

const WEATHER_ICONS = { Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, CloudFog, CloudSun, Thermometer }

export default function NavBar({ weather, rates, onSend }) {
  const navigate = useNavigate()
  const WeatherIcon = weather ? (WEATHER_ICONS[weather.iconName] || Thermometer) : Thermometer

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
          <button className="about-btn" onClick={() => navigate('/about')}>
            <Info size={14} />
            About us
          </button>
        </div>
      </header>

      <InfoBar weather={weather} rates={rates} WeatherIcon={WeatherIcon} />

      <nav className="bottom-nav">
        <NavLink to="/" className={({isActive}) => `bn-item ${isActive ? 'active' : ''}`}>
          <Home size={20} /><span>Home</span>
        </NavLink>
        <NavLink to="/analytics" className={({isActive}) => `bn-item ${isActive ? 'active' : ''}`}>
          <BarChart2 size={20} /><span>Analytics</span>
        </NavLink>
        <button className="bn-send" onClick={onSend}>
          <Send size={22} />
        </button>
        <NavLink to="/beneficiaries" className={({isActive}) => `bn-item ${isActive ? 'active' : ''}`}>
          <Users size={20} /><span>Pay</span>
        </NavLink>
        <NavLink to="/instant-money" className={({isActive}) => `bn-item ${isActive ? 'active' : ''}`}>
          <Zap size={20} /><span>Voucher</span>
        </NavLink>
      </nav>
    </>
  )
}
