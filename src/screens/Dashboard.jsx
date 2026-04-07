import React from 'react'
import { useStore, getExplanations, savingsHistory, recentPauses } from '../data/store'
import RiskGauge from '../components/RiskGauge'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const Card = ({ children, style = {} }) => (
  <div className="glass" style={{ padding: 24, position: 'relative', overflow: 'hidden', ...style }}>
    {children}
  </div>
)

const Label = ({ children }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.14em', marginBottom: 8, textTransform: 'uppercase' }}>
    {children}
  </div>
)

const Metric = ({ label, value, sub, color = 'var(--text-1)', big = false }) => (
  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--r-md)', padding: '16px 18px', border: '0.5px solid var(--border)' }}>
    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-4)', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: big ? 28 : 22, fontFamily: 'var(--font-display)', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>{sub}</div>}
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--ink-3)', border: '0.5px solid var(--border-bright)', borderRadius: 10, padding: '10px 14px', fontFamily: 'var(--font-body)' }}>
      <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--neon)' }}>₹{payload[0].value.toLocaleString()}</div>
      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>saved</div>
    </div>
  )
}

export default function Dashboard() {
  const { riskScore, signals, triggerPause, streak, totalSaved, savedToday, savedThisWeek, pausesToday, pausesThisWeek } = useStore()
  const explanations = getExplanations(signals)

  const colorMap = { violet: 'var(--violet)', amber: 'var(--amber)', rose: 'var(--rose)', neon: 'var(--neon)' }

  return (
    <div style={{ padding: '32px 36px', flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Good evening, <span className="text-gradient">Arjun</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-3)', marginTop: 6 }}>
            Your behavioral AI is active — {pausesToday} pauses triggered today
          </div>
        </div>
        <button
          onClick={() => triggerPause({ name: 'Myntra', amount: 2499, items: 3 })}
          style={{
            padding: '12px 22px', borderRadius: 'var(--r-md)',
            background: 'var(--violet)', color: '#fff',
            fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-body)',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 0 24px var(--violet-glow)',
            transition: 'transform 0.1s ease',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ⏸ Demo Pause
        </button>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, marginBottom: 20 }}>

        {/* Risk gauge card */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <Label>Impulse risk · live</Label>
          <RiskGauge score={riskScore} />

          {/* SHAP reasons */}
          <div style={{ width: '100%', borderTop: '0.5px solid var(--border)', paddingTop: 16 }}>
            <Label>Top risk factors (SHAP)</Label>
            {explanations.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>{e.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 3 }}>{e.text}</div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${e.weight * 100}%`,
                      background: colorMap[e.color] || 'var(--violet)',
                      borderRadius: 2,
                      boxShadow: `0 0 6px ${colorMap[e.color] || 'var(--violet)'}80`,
                    }} />
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
                  {Math.round(e.weight * 100)}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Metrics row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <Metric label="Saved today" value={`₹${savedToday.toLocaleString()}`} sub={`${pausesToday} pauses`} color="var(--neon)" />
            <Metric label="Saved this week" value={`₹${savedThisWeek.toLocaleString()}`} sub={`${pausesThisWeek} pauses`} color="var(--neon)" />
            <Metric label="Total saved" value={`₹${totalSaved.toLocaleString()}`} sub="Since onboarding" color="var(--violet-light)" big />
          </div>

          {/* Streak + chart */}
          <Card style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <Label>Savings over time</Label>
                <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700 }}>₹{totalSaved.toLocaleString()} total</div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 100,
                background: 'rgba(245,158,11,0.1)', border: '0.5px solid rgba(245,158,11,0.3)',
              }}>
                <span style={{ fontSize: 18 }}>🔥</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--amber)' }}>{streak} day streak</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={savingsHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c6af7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c6af7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: 'var(--text-4)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={{ fill: 'var(--text-4)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="saved" stroke="var(--violet)" strokeWidth={2} fill="url(#savingsGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Recent pauses */}
      <Card>
        <Label>Recent pause events</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {recentPauses.map(p => (
            <div key={p.id} style={{
              padding: '14px 16px', borderRadius: 'var(--r-md)',
              background: 'rgba(255,255,255,0.025)', border: '0.5px solid var(--border)',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{
                  fontSize: 10, fontFamily: 'var(--font-mono)',
                  padding: '2px 8px', borderRadius: 100,
                  background: p.action === 'cancelled' ? 'var(--sage-dim)' : 'var(--rose-dim)',
                  color: p.action === 'cancelled' ? 'var(--sage)' : 'var(--rose)',
                  border: `0.5px solid ${p.action === 'cancelled' ? 'rgba(52,211,153,0.3)' : 'rgba(244,63,94,0.3)'}`,
                }}>
                  {p.action === 'cancelled' ? '✓ SAVED' : '✗ SPENT'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)' }}>{p.time}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 2 }}>{p.merchant}</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 8 }}>₹{p.amount.toLocaleString()}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{p.category}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: p.score >= 70 ? 'var(--rose)' : p.score >= 40 ? 'var(--amber)' : 'var(--sage)',
                }}>⚡{p.score}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
