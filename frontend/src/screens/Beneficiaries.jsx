import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Send, Trash2, Building2, User } from 'lucide-react'

const BANKS = ['ABSA','FNB','Standard Bank','Nedbank','Capitec','TymeBank','Discovery Bank','African Bank']

const CATEGORY_COLORS = {
  government: '#f0b429', utilities: '#00d4aa', telecoms: '#7c5cfc',
  entertainment: '#ff4d6a', private: '#9090b0'
}

export default function Beneficiaries({ apiUrl, onSend }) {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [showAdd, setShowAdd]             = useState(false)
  const [form, setForm]                   = useState({ name:'', bank:'FNB', account_no:'', account_type:'current' })
  const [busy, setBusy]                   = useState(false)
  const [search, setSearch]               = useState('')

  useEffect(() => {
    axios.get(`${apiUrl}/beneficiaries`).then(r => setBeneficiaries(r.data))
  }, [apiUrl])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addBeneficiary = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await axios.post(`${apiUrl}/beneficiaries`, form)
      setBeneficiaries(prev => [...prev, res.data])
      setForm({ name:'', bank:'FNB', account_no:'', account_type:'current' })
      setShowAdd(false)
    } finally {
      setBusy(false)
    }
  }

  const deleteBeneficiary = async (id) => {
    await axios.delete(`${apiUrl}/beneficiaries/${id}`)
    setBeneficiaries(prev => prev.filter(b => b.id !== id))
  }

  const filtered = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.bank?.toLowerCase().includes(search.toLowerCase())
  )

  const publicBens  = filtered.filter(b => b.is_public)
  const privateBens = filtered.filter(b => !b.is_public)

  return (
    <div className="screen bens-screen">
      <div className="screen-topbar">
        <h1 className="screen-title">Beneficiaries</h1>
        <button className="icon-btn-purple" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={18} />
        </button>
      </div>

      <div className="search-bar">
        <input
          className="search-input"
          placeholder="Search beneficiaries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {showAdd && (
        <form className="add-ben-form" onSubmit={addBeneficiary}>
          <div className="add-ben-title">Add beneficiary</div>
          <div className="sheet-field">
            <User size={16} className="field-ico" />
            <input type="text" placeholder="Full name" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="sheet-field">
            <Building2 size={16} className="field-ico" />
            <select value={form.bank} onChange={e => set('bank', e.target.value)} style={{background:'transparent',border:'none',color:'var(--t1)',flex:1,fontSize:14,fontWeight:500,fontFamily:'inherit',outline:'none'}}>
              {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="sheet-field">
            <input type="text" placeholder="Account number" value={form.account_no} onChange={e => set('account_no', e.target.value)} required style={{paddingLeft:0}} />
          </div>
          <div className="add-ben-actions">
            <button type="button" className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className="btn-purple" disabled={busy}>Save</button>
          </div>
        </form>
      )}

      {privateBens.length > 0 && (
        <div className="ben-section">
          <div className="ben-section-label">My beneficiaries</div>
          {privateBens.map(b => (
            <BenRow key={b.id} b={b} onSend={onSend} onDelete={() => deleteBeneficiary(b.id)} showDelete />
          ))}
        </div>
      )}

      <div className="ben-section">
        <div className="ben-section-label">Public beneficiaries</div>
        {publicBens.map(b => (
          <BenRow key={b.id} b={b} onSend={onSend} />
        ))}
      </div>
    </div>
  )
}

function BenRow({ b, onSend, onDelete, showDelete }) {
  const color = CATEGORY_COLORS[b.category] || '#9090b0'
  const initials = b.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

  return (
    <div className="ben-row">
      <div className="ben-avatar" style={{ background: `${color}22`, color }}>
        {initials}
      </div>
      <div className="ben-body">
        <div className="ben-name">{b.name}</div>
        <div className="ben-detail">{b.bank} · {b.account_no}</div>
      </div>
      <div className="ben-actions">
        <button className="ben-send-btn" onClick={onSend}>
          <Send size={14} />
        </button>
        {showDelete && (
          <button className="ben-delete-btn" onClick={onDelete}>
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
