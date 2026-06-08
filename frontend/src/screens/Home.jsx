import {
  Bell, Send, ArrowDownLeft, ArrowUpRight,
  MoreHorizontal, Sun, Cloud, CloudRain, CloudLightning,
  CloudDrizzle, CloudFog, CloudSun, Thermometer, TrendingUp,
  Home as HomeIcon, BarChart2, User
} from 'lucide-react'
import TxFeed from '../components/TxFeed'
import InfoBar from '../components/InfoBar'
import SendForm from '../components/SendForm'

const WEATHER_ICONS = { Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, CloudFog, CloudSun, Thermometer }

export default function Home({ payments, loading, weather, rates, onSend, desktop }) {
  const total = payments.reduce((s, p) => s + parseFloat(p.amount || 0), 0)
  const todayCount = payments.filter(p =>
    new Date(p.created_at).toDateString() === new Date().toDateString()
  ).length
  const WeatherIcon = weather ? (WEATHER_ICONS[weather.iconName] || Thermometer) : Thermometer

  return (
    <div className="screen">
      <header className="topbar">
        <div className="topbar-left">
          <div className="user-avatar">DA</div>
          <div>
            <div className="greeting">Good day</div>
            <div className="username">Devon Adkins</div>
          </div>
        </div>
        <button className="icon-btn notif-btn">
          <Bell size={20} />
          <span className="notif-badge" />
        </button>
      </header>

      <InfoBar weather={weather} rates={rates} WeatherIcon={WeatherIcon} />

      {desktop ? (
        <div className="desktop-body">
          <div className="desktop-left">
            <div className="balance-card">
              <div className="balance-top">
                <div>
                  <div className="balance-label">Total Volume</div>
                  <div className="balance-amount">
                    R {total.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="balance-meta">
                    <span>{payments.length} transactions</span>
                    <span className="meta-dot" />
                    <span className="meta-today">{todayCount} today</span>
                  </div>
                </div>
                <div className="balance-icon-wrap">
                  <TrendingUp size={22} color="rgba(255,255,255,0.6)" />
                </div>
              </div>
              <div className="quick-actions">
                <button className="qa-btn qa-primary" onClick={onSend}>
                  <Send size={18} /><span>Send</span>
                </button>
                <button className="qa-btn qa-secondary">
                  <ArrowDownLeft size={18} /><span>Receive</span>
                </button>
                <button className="qa-btn qa-secondary">
                  <ArrowUpRight size={18} /><span>Pay</span>
                </button>
                <button className="qa-btn qa-secondary">
                  <MoreHorizontal size={18} /><span>More</span>
                </button>
              </div>
            </div>
            <SendForm onSend={onSend} />
          </div>

          <div className="desktop-right">
            <div className="feed-header">
              <span className="feed-title">Transaction history</span>
              <span className="feed-count">{payments.length}</span>
            </div>
            <TxFeed payments={payments} loading={loading} />
          </div>
        </div>
      ) : (
        <>
          <div className="balance-card">
            <div className="balance-top">
              <div>
                <div className="balance-label">Total Volume</div>
                <div className="balance-amount">
                  R {total.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="balance-meta">
                  <span>{payments.length} transactions</span>
                  <span className="meta-dot" />
                  <span className="meta-today">{todayCount} today</span>
                </div>
              </div>
              <div className="balance-icon-wrap">
                <TrendingUp size={22} color="rgba(255,255,255,0.6)" />
              </div>
            </div>
            <div className="quick-actions">
              <button className="qa-btn qa-primary" onClick={onSend}>
                <Send size={18} /><span>Send</span>
              </button>
              <button className="qa-btn qa-secondary">
                <ArrowDownLeft size={18} /><span>Receive</span>
              </button>
              <button className="qa-btn qa-secondary">
                <ArrowUpRight size={18} /><span>Pay</span>
              </button>
              <button className="qa-btn qa-secondary">
                <MoreHorizontal size={18} /><span>More</span>
              </button>
            </div>
          </div>

          <div className="feed-section">
            <div className="feed-header">
              <span className="feed-title">Recent</span>
              <span className="feed-count">{payments.length}</span>
            </div>
            <TxFeed payments={payments} loading={loading} />
          </div>

          <nav className="bottom-nav">
            <button className="bn-item active">
              <HomeIcon size={20} /><span>Home</span>
            </button>
            <button className="bn-item">
              <BarChart2 size={20} /><span>Analytics</span>
            </button>
            <button className="bn-send" onClick={onSend}>
              <Send size={22} />
            </button>
            <button className="bn-item">
              <Bell size={20} /><span>Alerts</span>
            </button>
            <button className="bn-item">
              <User size={20} /><span>Profile</span>
            </button>
          </nav>
        </>
      )}
    </div>
  )
}
