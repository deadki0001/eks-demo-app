import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Zap, Shield, Globe, TrendingUp, Users,
  ChevronLeft, ChevronRight, MessageCircle, X,
  Facebook, Twitter, Linkedin, Instagram, Youtube
} from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Nomvula Dlamini',
    role: 'Informal trader, Soweto',
    quote: 'I used to travel to the bank every week to send money to my mother in Limpopo. With LSD Payments I send it in seconds from my phone.',
    initials: 'ND', color: '#7c5cfc'
  },
  {
    name: 'Sipho Khumalo',
    role: 'Small business owner, Durban',
    quote: 'Paying suppliers used to take days. Now I generate an Instant Money voucher and they collect cash at Shoprite the same day.',
    initials: 'SK', color: '#00d4aa'
  },
  {
    name: 'Priya Naidoo',
    role: 'Freelance designer, Cape Town',
    quote: 'International clients pay me in USD. LSD Payments shows me the live exchange rate and I send ZAR to anyone instantly.',
    initials: 'PN', color: '#f0b429'
  },
  {
    name: 'Thabo Molefe',
    role: 'University student, Pretoria',
    quote: 'My parents send me money via Instant Money. No bank account needed. The PIN arrives instantly and I collect at the nearest ATM.',
    initials: 'TM', color: '#ff4d6a'
  },
  {
    name: 'Fatima Adams',
    role: 'NGO coordinator, Cape Flats',
    quote: 'We distribute emergency funds to beneficiaries without bank accounts using vouchers. It has changed everything for our organisation.',
    initials: 'FA', color: '#3b82f6'
  },
]

const STATS = [
  { value: '11M+', label: 'Unbanked South Africans', color: '#7c5cfc' },
  { value: 'R2.1T', label: 'Annual payment volume in SA', color: '#00d4aa' },
  { value: '67%', label: 'Mobile money adoption growth YoY', color: '#f0b429' },
  { value: '<1ms', label: 'Transaction processing latency', color: '#ff4d6a' },
]

export default function About() {
  const navigate = useNavigate()
  const [slide, setSlide]   = useState(0)
  const [chat, setChat]     = useState(false)
  const [chatMsg, setChatMsg] = useState('')
  const [chatLog, setChatLog] = useState([
    { from: 'agent', text: 'Hi! Welcome to LSD Payments. How can I help you today?' }
  ])

  useEffect(() => {
    const id = setInterval(() => {
      setSlide(s => (s + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const prev = () => setSlide(s => (s - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setSlide(s => (s + 1) % TESTIMONIALS.length)

  const sendChat = () => {
    if (!chatMsg.trim()) return
    setChatLog(l => [...l,
      { from: 'user', text: chatMsg },
      { from: 'agent', text: 'Thanks for your message. A consultant will be with you shortly. In the meantime, you can explore our demo app.' }
    ])
    setChatMsg('')
  }

  const t = TESTIMONIALS[slide]

  return (
    <div className="about-page">
      <div className="about-nav">
        <button className="about-back" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to app
        </button>
        <div className="about-logo">
          <div className="brand-mark-lg"><Zap size={14} /></div>
          <span>LSD Payments</span>
        </div>
        <nav className="about-nav-links">
          <a href="#about">About</a>
          <a href="#mission">Mission</a>
          <a href="#testimonials">Reviews</a>
          <a href="#tech">Technology</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      <section className="about-hero" id="about">
        <div className="about-hero-tag">
          <Zap size={11} /> Fintech Infrastructure - FSP Registered
        </div>
        <h1 className="about-h1">
          Moving money at<br />
          <span className="about-gradient">light speed</span>
        </h1>
        <p className="about-sub">
          LSD Payments is a cloud-native payments infrastructure platform
          targeting the 11 million unbanked South Africans through Instant Money
          vouchers, while serving the banked market through real-time EFT with
          full beneficiary management.
        </p>
        <div className="about-cta-row">
          <button className="about-cta-primary" onClick={() => navigate('/')}>
            Try the demo
          </button>
          <button className="about-cta-secondary" onClick={() => setChat(true)}>
            <MessageCircle size={15} /> Chat to us
          </button>
        </div>
      </section>

      <section className="about-stats">
        {STATS.map(s => (
          <div key={s.label} className="about-stat">
            <div className="about-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="about-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="about-mission" id="mission">
        <h2 className="about-h2">Our mission</h2>
        <p className="about-body">
          South Africa has one of the highest rates of financial exclusion on
          the continent. 11 million adults have no bank account. They cannot
          receive salaries electronically, cannot pay bills online, cannot
          access credit. They are excluded from the digital economy entirely.
        </p>
        <p className="about-body">
          LSD Payments bridges this gap through Instant Money - a voucher-based
          cash transfer system that requires no bank account, no smartphone, and
          no data. A sender generates a voucher in seconds. The recipient
          collects cash at any of 3,000+ Shoprite, Checkers, and FNB ATM
          locations nationwide.
        </p>
        <p className="about-body">
          For the banked market, we provide enterprise-grade payment
          infrastructure running on Kubernetes - with zero-downtime deployments,
          automated security enforcement, real-time observability, and
          multi-currency support across ZAR, USD, EUR, and GBP.
        </p>
      </section>

      <section className="about-pillars">
        <h2 className="about-h2">Built for scale</h2>
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background:'rgba(124,92,252,0.15)', color:'#7c5cfc' }}>
              <Shield size={20} />
            </div>
            <div className="pillar-title">Enterprise security</div>
            <div className="pillar-body">OPA Gatekeeper policy enforcement, zero-trust networking, secrets management through AWS Secrets Manager, and Dynatrace full-stack observability.</div>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background:'rgba(0,212,170,0.15)', color:'#00d4aa' }}>
              <TrendingUp size={20} />
            </div>
            <div className="pillar-title">Infinite scale</div>
            <div className="pillar-body">Horizontal pod autoscaling on EKS handles any transaction volume. PostgreSQL RDS with automated backups. Multi-region ready architecture from day one.</div>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background:'rgba(240,180,41,0.15)', color:'#f0b429' }}>
              <Globe size={20} />
            </div>
            <div className="pillar-title">Financial inclusion</div>
            <div className="pillar-body">Instant Money vouchers reach the unbanked. No smartphone required. No data required. Just a voucher code and a PIN - redeemable at 3,000+ locations nationwide.</div>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background:'rgba(59,130,246,0.15)', color:'#3b82f6' }}>
              <Users size={20} />
            </div>
            <div className="pillar-title">Community first</div>
            <div className="pillar-body">Built by an AWS Community Builder and Kubestronaut. Open source infrastructure. Transparent architecture. Community-driven development.</div>
          </div>
        </div>
      </section>

      <section className="about-testimonials" id="testimonials">
        <h2 className="about-h2">What people say</h2>
        <div className="testimonial-carousel">
          <button className="carousel-btn" onClick={prev}>
            <ChevronLeft size={18} />
          </button>
          <div className="testimonial-card">
            <div className="testimonial-avatar" style={{ background:`${t.color}22`, color:t.color }}>
              {t.initials}
            </div>
            <blockquote className="testimonial-quote">"{t.quote}"</blockquote>
            <div className="testimonial-name">{t.name}</div>
            <div className="testimonial-role">{t.role}</div>
            <div className="carousel-dots">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} className={`carousel-dot ${i===slide?'active':''}`} onClick={() => setSlide(i)} />
              ))}
            </div>
          </div>
          <button className="carousel-btn" onClick={next}>
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <section className="about-tech" id="tech">
        <h2 className="about-h2">Technology stack</h2>
        <div className="tech-grid">
          {['AWS EKS','PostgreSQL RDS','ArgoCD GitOps','OPA Gatekeeper','Dynatrace APM',
            'External Secrets','GitHub Actions','Terraform IaC','React + Vite','Node.js Express'].map(t => (
            <div key={t} className="tech-pill">{t}</div>
          ))}
        </div>
      </section>

      <section className="about-contact" id="contact">
        <h2 className="about-h2">Get in touch</h2>
        <p className="about-body">Interested in investing, partnering, or learning more about LSD Payments? Reach out to our team.</p>
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-label">General enquiries</div>
            <div className="contact-value">info@lsdpayments.co.za</div>
          </div>
          <div className="contact-card">
            <div className="contact-label">Investor relations</div>
            <div className="contact-value">invest@lsdpayments.co.za</div>
          </div>
          <div className="contact-card">
            <div className="contact-label">Support</div>
            <div className="contact-value">support@lsdpayments.co.za</div>
          </div>
          <div className="contact-card">
            <div className="contact-label">Headquarters</div>
            <div className="contact-value">Sandton, Johannesburg, ZA</div>
          </div>
        </div>
      </section>

      <footer className="about-footer-full">
        <div className="footer-top">
          <div className="footer-brand-col">
            <div className="footer-logo-wrap">
              <div className="brand-mark-lg"><Zap size={14} /></div>
              <div>
                <div className="footer-brand">LSD Payments</div>
                <div className="footer-tag">Light Speed Division</div>
              </div>
            </div>
            <p className="footer-desc">
              Moving money at the speed of light across South Africa and beyond.
            </p>
            <div className="social-links">
              <a href="#" className="social-btn"><Facebook size={16} /></a>
              <a href="#" className="social-btn"><Twitter size={16} /></a>
              <a href="#" className="social-btn"><Linkedin size={16} /></a>
              <a href="#" className="social-btn"><Instagram size={16} /></a>
              <a href="#" className="social-btn"><Youtube size={16} /></a>
            </div>
          </div>
          <div className="footer-links-col">
            <div className="footer-col-title">Products</div>
            <a href="#" className="footer-link">Send Money</a>
            <a href="#" className="footer-link">Instant Money</a>
            <a href="#" className="footer-link">Beneficiaries</a>
            <a href="#" className="footer-link">Analytics</a>
          </div>
          <div className="footer-links-col">
            <div className="footer-col-title">Company</div>
            <a href="#" className="footer-link">About Us</a>
            <a href="#" className="footer-link">Careers</a>
            <a href="#" className="footer-link">Press</a>
            <a href="#" className="footer-link">Blog</a>
          </div>
          <div className="footer-links-col">
            <div className="footer-col-title">Legal</div>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">POPIA Compliance</a>
            <a href="#" className="footer-link">FICA Requirements</a>
          </div>
        </div>

        <div className="footer-regulatory">
          <div className="reg-badges">
            <span className="reg-badge">FSP Registered</span>
            <span className="reg-badge">NCR Compliant</span>
            <span className="reg-badge">POPIA Compliant</span>
            <span className="reg-badge">PCI DSS</span>
          </div>
          <p className="reg-text">
            LSD Payments (Pty) Ltd is an authorised Financial Services Provider (FSP XXXXX) registered
            with the Financial Sector Conduct Authority (FSCA). Registered in South Africa.
            Company Registration: 2026/XXXXXX/07. This is a technology demonstration platform.
            All financial services require appropriate licensing before commercial deployment.
          </p>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2026 LSD Payments (Pty) Ltd. All rights reserved.</span>
          <span>Built by Devon Adkins - AWS Community Builder - Kubestronaut</span>
        </div>
      </footer>

      <button className="chat-fab" onClick={() => setChat(true)}>
        <MessageCircle size={22} />
        <span>Chat to an agent</span>
      </button>

      {chat && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar">LSD</div>
              <div>
                <div className="chat-name">LSD Support</div>
                <div className="chat-status">Online</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setChat(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="chat-messages">
            {chatLog.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from === 'user' ? 'chat-msg-user' : 'chat-msg-agent'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Type a message..."
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
            />
            <button className="chat-send" onClick={sendChat}>
              <Zap size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
