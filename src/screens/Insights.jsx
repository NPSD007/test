import React from 'react'
import { useStore, computeRiskScore, getExplanations } from '../data/store'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

export default function Insights() {
  const { signals, updateSignals, riskScore } = useStore()
  const explanations = getExplanations(signals)

  const sliders = [
    { key: 'hourOfDay', label: 'Hour of day', min: 0, max: 23, format: v => `${v}:00`, icon: '🕐' },
    { key: 'appUsageMinutes', label: 'App session (min)', min: 0, max: 180, format: v => `${v}m`, icon: '📱' },
    { key: 'appSwitchCount', label: 'App switches/hr', min: 0, max: 30, format: v => `${v}×`, icon: '🔀' },
    { key: 'txFrequencyLastHour', label: 'Tx attempts/hr', min: 0, max: 10, format: v => `${v}×`, icon: '💳' },
  ]

  const radarData = [
    { subject: 'Late night', A: signals.isLateNight ? 90 : signals.hourOfDay >= 20 ? 55 : 15 },
    { subject: 'App sessions', A: Math.min(signals.appUsageMinutes / 1.8, 100) },
    { subject: 'Switching', A: Math.min(signals.appSwitchCount / 0.3, 100) },
    { subject: 'Tx freq.', A: Math.min(signals.txFrequencyLastHour * 10, 100) },
    { subject: 'Impulsivity', A: riskScore },
  ]

  const barData = explanations.map(e => ({
    name: e.text.split(' ').slice(0, 2).join(' '),
    value: Math.round(e.weight * 100),
    color: e.color === 'violet' ? '#7c6af7' : e.color === 'amber' ? '#f59e0b' : e.color === 'rose' ? '#f43f5e' : '#00e5c3',
  }))

  const riskColor = riskScore >= 70 ? 'var(--rose)' : riskScore >= 40 ? 'var(--amber)' : 'var(--sage)'

  return (
    <div style={{ padding: '32px 36px', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
          AI <span className="text-gradient">Insights</span>
        </div>
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>
          Tune behavioral signals and see how the XGBoost model responds in real-time
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Signal Tuner */}
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.14em', marginBottom: 20 }}>
            BEHAVIORAL SIGNAL TUNER — LIVE
          </div>

          {sliders.map(({ key, label, min, max, format, icon }) => (
            <div key={key} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--violet-light)' }}>
                  {format(signals[key])}
                </span>
              </div>
              <input
                type="range" min={min} max={max} value={signals[key]}
                onChange={e => {
                  const val = Number(e.target.value)
                  const newSignals = { ...signals, [key]: val }
                  if (key === 'hourOfDay') newSignals.isLateNight = val >= 22 || val <= 4
                  updateSignals(newSignals)
                }}
                style={{
                  width: '100%', height: 4,
                  background: `linear-gradient(to right, var(--violet) ${((signals[key] - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) 0%)`,
                  borderRadius: 2, outline: 'none', cursor: 'pointer', appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              />
              <style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--violet);border:2px solid var(--ink);cursor:pointer;box-shadow:0 0 8px var(--violet-glow)}`}</style>
            </div>
          ))}

          {/* Late night toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 10, background: signals.isLateNight ? 'var(--violet-dim)' : 'rgba(255,255,255,0.03)', border: `0.5px solid ${signals.isLateNight ? 'rgba(124,106,247,0.3)' : 'var(--border)'}`, transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🌙</span>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Late-night mode</span>
            </div>
            <button
              onClick={() => updateSignals({ ...signals, isLateNight: !signals.isLateNight })}
              style={{
                width: 40, height: 22, borderRadius: 11, padding: 3, border: 'none',
                background: signals.isLateNight ? 'var(--violet)' : 'rgba(255,255,255,0.1)',
                cursor: 'pointer', position: 'relative', transition: 'background 0.3s',
              }}
            >
              <div style={{
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                transform: signals.isLateNight ? 'translateX(18px)' : 'translateX(0)',
                transition: 'transform 0.3s',
              }} />
            </button>
          </div>

          {/* Live score */}
          <div style={{
            marginTop: 20, padding: '16px', borderRadius: 12, textAlign: 'center',
            background: riskScore >= 70 ? 'var(--rose-dim)' : riskScore >= 40 ? 'var(--amber-dim)' : 'var(--sage-dim)',
            border: `0.5px solid ${riskColor}40`,
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em' }}>LIVE RISK SCORE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, color: riskColor, lineHeight: 1.1 }}>{riskScore}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
              {riskScore >= 70 ? '⚠️ Pause would trigger' : riskScore >= 40 ? '⚡ Elevated risk — monitoring' : '✓ No intervention needed'}
            </div>
          </div>
        </div>

        {/* Visualizations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Radar */}
          <div className="glass" style={{ padding: 24 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.14em', marginBottom: 12 }}>SIGNAL RADAR</div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-4)', fontSize: 10, fontFamily: 'DM Mono' }} />
                <Radar name="Risk" dataKey="A" stroke="#7c6af7" fill="#7c6af7" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* SHAP bar */}
          <div className="glass" style={{ padding: 24, flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.14em', marginBottom: 12 }}>SHAP FEATURE IMPORTANCE</div>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={barData} layout="vertical" margin={{ left: 0 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-4)', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-2)', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip formatter={(v) => [`${v}% contribution`, 'SHAP value']} contentStyle={{ background: 'var(--ink-3)', border: '0.5px solid var(--border-bright)', borderRadius: 10, fontFamily: 'DM Mono', fontSize: 12 }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                    {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)', fontSize: 13 }}>
                Lower signals to see SHAP breakdown
              </div>
            )}

            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'var(--violet-dim)', border: '0.5px solid rgba(124,106,247,0.2)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--violet-light)', marginBottom: 4 }}>AI EXPLANATION</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
                {explanations.length > 0
                  ? `Primary trigger: ${explanations[0]?.text}. ${explanations[1] ? `Secondary: ${explanations[1]?.text}.` : ''} Model confidence: 94%`
                  : 'Risk signals are below intervention threshold. Spending pattern appears considered.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
