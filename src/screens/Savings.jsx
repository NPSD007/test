import React from 'react'
import { useStore, savingsHistory } from '../data/store'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'

export default function Savings() {
  const { totalSaved, streak, pausesThisWeek } = useStore()

  const goals = [
    { label: 'New iPhone 16', target: 79999, saved: 18420, emoji: '📱' },
    { label: 'Goa Trip', target: 35000, saved: 18420, emoji: '✈️' },
    { label: 'Emergency Fund', target: 100000, saved: 18420, emoji: '🛡️' },
  ]

  const monthlySavings = [
    { month: 'Oct', amount: 8200 },
    { month: 'Nov', amount: 11400 },
    { month: 'Dec', amount: 6800 },
    { month: 'Jan', amount: 14200 },
    { month: 'Feb', amount: 9600 },
    { month: 'Mar', amount: 18420 },
  ]

  const barColors = ['#534AB7', '#534AB7', '#534AB7', '#534AB7', '#534AB7', '#7c6af7']

  return (
    <div style={{ padding: '32px 36px', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
          Savings <span className="text-gradient">Tracker</span>
        </div>
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>
          Money you kept by choosing not to spend
        </div>
      </div>

      {/* Hero savings number */}
      <div className="glass glow-violet" style={{ padding: '32px 36px', marginBottom: 20, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'var(--violet-dim)', filter: 'blur(40px)' }} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.16em', marginBottom: 12 }}>TOTAL MONEY SAVED SINCE ONBOARDING</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>
          <span className="text-gradient">₹{totalSaved.toLocaleString()}</span>
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-3)' }}>
          Across 47 pause interventions • {streak}-day mindful streak 🔥
        </div>

        {/* Mini stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 24, paddingTop: 24, borderTop: '0.5px solid var(--border)' }}>
          {[
            { label: 'Pauses this week', value: pausesThisWeek },
            { label: 'Avg saved/pause', value: `₹${Math.round(totalSaved / 47).toLocaleString()}` },
            { label: 'Days active', value: 63 },
            { label: 'Override rate', value: '23%' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--violet-light)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Daily chart */}
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.14em', marginBottom: 16 }}>DAILY SAVINGS — LAST 15 DAYS</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={savingsHistory}>
              <defs>
                <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5c3" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00e5c3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: 'var(--text-4)', fontSize: 9, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: 'var(--text-4)', fontSize: 9, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
              <Tooltip contentStyle={{ background: 'var(--ink-3)', border: '0.5px solid var(--border-bright)', borderRadius: 10, fontFamily: 'DM Mono', fontSize: 12 }} formatter={v => [`₹${v}`, 'Saved']} />
              <Area type="monotone" dataKey="saved" stroke="var(--neon)" strokeWidth={2} fill="url(#sg2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly bar chart */}
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.14em', marginBottom: 16 }}>MONTHLY SAVINGS TREND</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlySavings}>
              <XAxis dataKey="month" tick={{ fill: 'var(--text-4)', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-4)', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: 'var(--ink-3)', border: '0.5px solid var(--border-bright)', borderRadius: 10, fontFamily: 'DM Mono', fontSize: 12 }} formatter={v => [`₹${v.toLocaleString()}`, 'Saved']} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={36}>
                {monthlySavings.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings goals */}
      <div className="glass" style={{ padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.14em', marginBottom: 20 }}>SAVINGS GOALS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {goals.map((g, i) => {
            const pct = Math.min((g.saved / g.target) * 100, 100)
            return (
              <div key={i} style={{ padding: '20px', borderRadius: 'var(--r-lg)', background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--border)' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{g.emoji}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{g.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
                  <span style={{ color: 'var(--neon)' }}>₹{g.saved.toLocaleString()}</span> of ₹{g.target.toLocaleString()}
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: `linear-gradient(90deg, var(--violet), var(--neon))`, boxShadow: '0 0 8px var(--violet-glow)', transition: 'width 1s ease' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>{Math.round(pct)}% funded</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
