import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#7c5cfc','#00d4aa','#f0b429','#ff4d6a','#3b82f6','#8b5cf6']

export default function Analytics({ payments }) {
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toDateString()
    const label = d.toLocaleDateString('en-ZA', { weekday: 'short' })
    const dayPayments = payments.filter(p => new Date(p.created_at).toDateString() === key)
    const volume = dayPayments.reduce((s, p) => s + parseFloat(p.amount || 0), 0)
    return { label, volume: parseFloat(volume.toFixed(2)), count: dayPayments.length }
  })

  const byCurrency = Object.entries(
    payments.reduce((acc, p) => {
      acc[p.currency] = (acc[p.currency] || 0) + parseFloat(p.amount || 0)
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))

  const total = payments.reduce((s, p) => s + parseFloat(p.amount || 0), 0)
  const completed = payments.filter(p => p.status === 'completed').length
  const successRate = payments.length ? Math.round((completed / payments.length) * 100) : 0
  const avg = payments.length ? (total / payments.length).toFixed(2) : '0.00'

  return (
    <div className="screen analytics-screen">
      <div className="analytics-header">
        <h1 className="screen-title">Analytics</h1>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Volume</div>
          <div className="metric-value">R {total.toLocaleString('en-ZA', { minimumFractionDigits:2 })}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Transactions</div>
          <div className="metric-value">{payments.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Success Rate</div>
          <div className="metric-value metric-teal">{successRate}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Value</div>
          <div className="metric-value">R {parseFloat(avg).toLocaleString('en-ZA', { minimumFractionDigits:2 })}</div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-title">7-day volume</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={last7} margin={{ top:8, right:8, left:-20, bottom:0 }}>
            <XAxis dataKey="label" tick={{ fill:'#9090b0', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'#9090b0', fontSize:10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background:'#18181f', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, fontSize:12 }}
              labelStyle={{ color:'#fff' }}
              itemStyle={{ color:'#00d4aa' }}
            />
            <Bar dataKey="volume" fill="#7c5cfc" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {byCurrency.length > 0 && (
        <div className="chart-card">
          <div className="chart-title">Currency breakdown</div>
          <div className="pie-wrap">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={byCurrency} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {byCurrency.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background:'#18181f', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, fontSize:12 }}
                  itemStyle={{ color:'#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {byCurrency.map((c, i) => (
                <div key={c.name} className="legend-item">
                  <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="legend-label">{c.name}</span>
                  <span className="legend-value">R {c.value.toLocaleString('en-ZA', { minimumFractionDigits:2 })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
