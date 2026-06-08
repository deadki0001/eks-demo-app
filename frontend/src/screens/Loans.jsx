import { useState } from 'react'
import { Calculator, CheckCircle, AlertCircle } from 'lucide-react'

const LOAN_TYPES = [
  { name: 'Personal Loan', min: 1000, max: 50000, rate: 18.5, term: 12, icon: '👤' },
  { name: 'Business Loan', min: 5000, max: 250000, rate: 15.5, term: 24, icon: '🏢' },
  { name: 'Emergency Loan', min: 500, max: 10000, rate: 24.0, term: 6, icon: '⚡' },
  { name: 'Education Loan', min: 2000, max: 100000, rate: 12.5, term: 48, icon: '🎓' },
]

function calcMonthly(amount, rate, months) {
  const r = rate / 100 / 12
  return (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

export default function Loans() {
  const [selected, setSelected] = useState(LOAN_TYPES[0])
  const [amount, setAmount]     = useState('')
  const [income, setIncome]     = useState('')
  const [expenses, setExpenses] = useState('')
  const [term, setTerm]         = useState(selected.term)
  const [result, setResult]     = useState(null)

  const selectLoan = (loan) => {
    setSelected(loan)
    setTerm(loan.term)
    setResult(null)
  }

  const calculate = (e) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    const inc = parseFloat(income)
    const exp = parseFloat(expenses)
    if (!amt || !inc) return

    const monthly = calcMonthly(amt, selected.rate, term)
    const disposable = inc - (exp || 0)
    const affordable = monthly <= disposable * 0.3
    const total = monthly * term
    const interest = total - amt

    setResult({ monthly, total, interest, affordable, disposable })
  }

  const fmt = (n) => 'R ' + parseFloat(n).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="screen loans-screen">
      <div className="screen-topbar">
        <h1 className="screen-title">Loans</h1>
      </div>

      <div className="loan-types">
        {LOAN_TYPES.map(l => (
          <button
            key={l.name}
            className={`loan-type-btn ${selected.name === l.name ? 'active' : ''}`}
            onClick={() => selectLoan(l)}
          >
            <span className="loan-type-icon">{l.icon}</span>
            <span className="loan-type-name">{l.name}</span>
            <span className="loan-type-rate">{l.rate}% p.a.</span>
          </button>
        ))}
      </div>

      <div className="loan-calc-card">
        <div className="loan-calc-header">
          <Calculator size={16} color="var(--purple2)" />
          <span>Loan Calculator</span>
          <span className="loan-range">
            {fmt(selected.min)} - {fmt(selected.max)}
          </span>
        </div>

        <form onSubmit={calculate}>
          <div className="loan-field-group">
            <div className="loan-field">
              <label className="loan-label">Loan Amount</label>
              <div className="loan-input-wrap">
                <span className="loan-prefix">R</span>
                <input
                  className="loan-input"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min={selected.min}
                  max={selected.max}
                  required
                />
              </div>
            </div>
            <div className="loan-field">
              <label className="loan-label">Monthly Income</label>
              <div className="loan-input-wrap">
                <span className="loan-prefix">R</span>
                <input
                  className="loan-input"
                  type="number"
                  placeholder="0.00"
                  value={income}
                  onChange={e => setIncome(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="loan-field-group">
            <div className="loan-field">
              <label className="loan-label">Monthly Expenses</label>
              <div className="loan-input-wrap">
                <span className="loan-prefix">R</span>
                <input
                  className="loan-input"
                  type="number"
                  placeholder="0.00"
                  value={expenses}
                  onChange={e => setExpenses(e.target.value)}
                />
              </div>
            </div>
            <div className="loan-field">
              <label className="loan-label">Term: {term} months</label>
              <input
                className="loan-range-input"
                type="range"
                min="1"
                max={selected.term * 2}
                value={term}
                onChange={e => setTerm(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="loan-rate-display">
            <span>Interest rate</span>
            <span className="loan-rate-value">{selected.rate}% per annum</span>
          </div>

          <button type="submit" className="send-btn">
            <Calculator size={15} /> Calculate
          </button>
        </form>

        {result && (
          <div className="loan-result">
            <div className={`loan-afford ${result.affordable ? 'afford-yes' : 'afford-no'}`}>
              {result.affordable
                ? <><CheckCircle size={16} /> Within affordability criteria</>
                : <><AlertCircle size={16} /> Exceeds 30% of disposable income</>}
            </div>
            <div className="loan-result-grid">
              <div className="loan-result-item">
                <div className="loan-result-label">Monthly instalment</div>
                <div className="loan-result-value">{fmt(result.monthly)}</div>
              </div>
              <div className="loan-result-item">
                <div className="loan-result-label">Total repayment</div>
                <div className="loan-result-value">{fmt(result.total)}</div>
              </div>
              <div className="loan-result-item">
                <div className="loan-result-label">Total interest</div>
                <div className="loan-result-value" style={{color:'var(--gold)'}}>{fmt(result.interest)}</div>
              </div>
              <div className="loan-result-item">
                <div className="loan-result-label">Disposable income</div>
                <div className="loan-result-value">{fmt(result.disposable)}</div>
              </div>
            </div>
            <p className="loan-disclaimer">
              * The fees, costs and interest rate may change at any time prior to concluding the credit agreement.
              LSD Payments does not warrant the accuracy of the calculations. This does not constitute a credit offer.
              Subject to National Credit Act (NCA) affordability assessment. FSP Registered.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
