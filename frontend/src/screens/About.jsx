import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Zap, Shield, Globe, TrendingUp, Users, ChevronLeft, ChevronRight } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Nomvula Dlamini',
    role: 'Informal trader, Soweto',
    quote: 'I used to travel to the bank every week to send money to my mother in Limpopo. With LSD Payments I send it in seconds from my phone.',
    initials: 'ND',
    color: '#7c5cfc'
  },
  {
    name: 'Sipho Khumalo',
    role: 'Small business owner, Durban',
    quote: 'Paying suppliers used to take days. Now I generate an Instant Money voucher and they collect cash at Shoprite the same day.',
    initials: 'SK',
    color: '#00d4aa'
  },
  {
    name: 'Priya Naidoo',
    role: 'Freelance designer, Cape Town',
    quote: 'International clients pay me in USD. LSD Payments shows me the live exchange rate and I send ZAR to anyone instantly.',
    initials: 'PN',
    color: '#f0b429'
  },
  {
    name: 'Thabo Molefe',
    role: 'University student, Pretoria',
    quote: 'My parents send me money via Instant Money. No bank account needed. The PIN arrives instantly and I collect at the nearest ATM.',
    initials: 'TM',
    color: '#ff4d6a'
  },
  {
    name: 'Fatima Adams',
    role: 'NGO coordinator, Cape Flats',
    quote: 'We distribute emergency funds to beneficiaries without bank accounts using vouchers. It has changed everything for our organisation.',
    initials: 'FA',
    color: '#3b82f6'
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
  const [slide, setSlide] = useState(0)

  const prev = () => setSlide(s => (s - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setSlide(s => (s + 1) % TESTIMONIALS.length)

  const t = TESTIMONIALS[slide]

  return (
    <div className="about-page">
      <div className="about-nav">
        <button className="about-back" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back to app
        </button>
        <div className="about-logo">
          <div className="brand-mark-lg">L<Zap size={16} /></div>
          <span>LSD Payments</span>
        </div>
      </div>

      <section className="about-hero">
        <div className="about-hero-tag">
          <Zap size={12} /> Fintech Infrastructure
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
          <button className="about-cta-secondary">
            Request investor deck
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

      <section className="about-mission">
        <h2 className="about-h2">Our mission</h2>
        <p className="about-body">
          South Africa has one of the highest rates of financial exclusion on
          the continent. 11 million adults have no bank account. They cannot
          receive salaries electronically, cannot pay bills online, cannot
          access credit. They are excluded from the digital economy entirely.
        </p>
        <p className="about-body">
          LSD Payments bridges this gap through Instant Money — a voucher-based
          cash transfer system that requires no bank account, no smartphone, and
          no data. A sender generates a voucher in seconds. The recipient
          collects cash at any of 3,000+ Shoprite, Checkers, and FNB ATM
          locations nationwide.
        </p>
        <p className="about-body">
          For the banked market, we provide enterprise-grade payment
          infrastructure running on Kubernetes — with zero-downtime deployments,
          automated security enforcement, real-time observability, and
          multi-currency support across ZAR, USD, EUR, and GBP.
        </p>
      </section>

      <section className="about-pillars">
        <h2 className="about-h2">Built for scale</h2>
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background: 'rgba(124,92,252,0.15)', color: '#7c5cfc' }}>
              <Shield size={22} />
            </div>
            <div className="pillar-title">Enterprise security</div>
            <div className="pillar-body">
              OPA Gatekeeper policy enforcement, zero-trust networking, secrets
              management through AWS Secrets Manager, and Dynatrace full-stack
              observability.
            </div>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background: 'rgba(0,212,170,0.15)', color: '#00d4aa' }}>
              <TrendingUp size={22} />
            </div>
            <div className="pillar-title">Infinite scale</div>
            <div className="pillar-body">
              Horizontal pod autoscaling on EKS handles any transaction volume.
              PostgreSQL RDS with automated backups. Multi-region ready
              architecture from day one.
            </div>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background: 'rgba(240,180,41,0.15)', color: '#f0b429' }}>
              <Globe size={22} />
            </div>
            <div className="pillar-title">Financial inclusion</div>
            <div className="pillar-body">
              Instant Money vouchers reach the unbanked. No smartphone required.
              No data required. Just a voucher code and a PIN — redeemable at
              3,000+ locations nationwide.
            </div>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
              <Users size={22} />
            </div>
            <div className="pillar-title">Community first</div>
            <div className="pillar-body">
              Built by an AWS Community Builder and Kubestronaut. Open source
              infrastructure. Transparent architecture. Community-driven
              development.
            </div>
          </div>
        </div>
      </section>

      <section className="about-testimonials">
        <h2 className="about-h2">What people say</h2>
        <div className="testimonial-carousel">
          <button className="carousel-btn" onClick={prev}>
            <ChevronLeft size={20} />
          </button>
          <div className="testimonial-card">
            <div className="testimonial-avatar" style={{ background: `${t.color}22`, color: t.color }}>
              {t.initials}
            </div>
            <blockquote className="testimonial-quote">
              "{t.quote}"
            </blockquote>
            <div className="testimonial-name">{t.name}</div>
            <div className="testimonial-role">{t.role}</div>
            <div className="carousel-dots">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot ${i === slide ? 'active' : ''}`}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>
          </div>
          <button className="carousel-btn" onClick={next}>
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      <section className="about-tech">
        <h2 className="about-h2">Technology stack</h2>
        <div className="tech-grid">
          {['AWS EKS','PostgreSQL RDS','ArgoCD GitOps','OPA Gatekeeper','Dynatrace APM',
            'External Secrets','GitHub Actions','Terraform IaC','React + Vite','Node.js Express'].map(t => (
            <div key={t} className="tech-pill">{t}</div>
          ))}
        </div>
      </section>

      <section className="about-footer">
        <div className="about-logo footer-logo">
          <div className="brand-mark-lg">L<Zap size={16} /></div>
          <div>
            <div className="footer-brand">LSD Payments</div>
            <div className="footer-tag">Light Speed Division</div>
          </div>
        </div>
        <p className="footer-copy">
          Built by Devon Adkins · AWS Community Builder · Kubestronaut<br />
          Platform Engineering Demo · 2026
        </p>
      </section>
    </div>
  )
}
