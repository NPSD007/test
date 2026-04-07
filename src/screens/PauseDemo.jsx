import React from 'react'
import { useStore } from '../data/store'

const merchants = [
  { name: 'Myntra', amount: 2499, items: 3, category: 'Fashion', emoji: '👗' },
  { name: 'Amazon', amount: 5999, items: 1, category: 'Electronics', emoji: '📦' },
  { name: 'Swiggy', amount: 649, items: 4, category: 'Food', emoji: '🍕' },
  { name: 'Meesho', amount: 1299, items: 5, category: 'Fashion', emoji: '🛍️' },
  { name: 'Nykaa', amount: 3200, items: 2, category: 'Beauty', emoji: '💄' },
  { name: 'Blinkit', amount: 420, items: 8, category: 'Grocery', emoji: '🛒' },
]

export default function PauseDemo() {
  const { triggerPause, riskScore } = useStore()
  const riskColor = riskScore >= 70 ? 'var(--rose)' : riskScore >= 40 ? 'var(--amber)' : 'var(--sage)'

  return (
    <div style={{ padding: '32px 36px', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
          Pause <span className="text-gradient">Demo</span>
        </div>
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>
          Simulate the 10-second pause intervention — click any merchant to trigger
        </div>
      </div>

      {/* Current risk banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px',
        borderRadius: 'var(--r-lg)', marginBottom: 28,
        background: riskScore >= 70 ? 'var(--rose-dim)' : riskScore >= 40 ? 'var(--amber-dim)' : 'var(--sage-dim)',
        border: `0.5px solid ${riskColor}40`,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: riskColor }}>{riskScore}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
            {riskScore >= 70 ? '⚠️ Pause will trigger on checkout' : riskScore >= 40 ? '⚡ Monitoring active — elevated risk' : '✓ No intervention — risk is low'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>
            Tune signals in the Insights tab to change this score
          </div>
        </div>
        {riskScore >= 70 && (
          <div style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 100, background: 'var(--rose)', color: '#fff', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            PAUSE ARMED
          </div>
        )}
      </div>

      {/* Merchant cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {merchants.map((m, i) => (
          <div
            key={i}
            onClick={() => triggerPause(m)}
            style={{
              padding: '24px', borderRadius: 'var(--r-lg)', cursor: 'pointer',
              background: 'rgba(255,255,255,0.02)', border: '0.5px solid var(--border)',
              transition: 'all 0.2s ease', userSelect: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(124,106,247,0.08)'
              e.currentTarget.style.borderColor = 'rgba(124,106,247,0.4)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 14 }}>{m.emoji}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>{m.category} · {m.items} items</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 500, color: 'var(--neon)' }}>
                ₹{m.amount.toLocaleString()}
              </div>
              <div style={{
                padding: '6px 14px', borderRadius: 100, fontSize: 12,
                background: 'var(--violet-dim)', color: 'var(--violet-light)',
                border: '0.5px solid rgba(124,106,247,0.3)',
                fontFamily: 'var(--font-mono)',
              }}>
                Pay →
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="glass" style={{ padding: 24, marginTop: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.14em', marginBottom: 20 }}>HOW THE PAUSE WORKS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { step: '01', icon: '📡', title: 'Signal capture', desc: 'Behavioral SDK collects app usage, switches, time patterns' },
            { step: '02', icon: '🤖', title: 'AI scores risk', desc: 'XGBoost model runs on-device in &lt;50ms, outputs 0–100 score' },
            { step: '03', icon: '⏸', title: '10-sec pause', desc: 'If score ≥ 70, a friction timer fires before payment clears' },
            { step: '04', icon: '💡', title: 'SHAP insight', desc: 'Model explains exactly why you\'re being paused in plain language' },
          ].map(s => (
            <div key={s.step} style={{ textAlign: 'center', padding: '16px 12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', marginBottom: 10 }}>STEP {s.step}</div>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: s.desc }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
