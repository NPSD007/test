import React, { useState } from 'react'
import { useStore } from '../data/store'

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const riskColor = (v) => {
  if (v < 0.2) return `rgba(52,211,153,${0.15 + v * 0.5})`
  if (v < 0.45) return `rgba(245,158,11,${0.2 + v * 0.5})`
  if (v < 0.7) return `rgba(124,106,247,${0.3 + v * 0.4})`
  return `rgba(244,63,94,${0.4 + v * 0.4})`
}

export default function Heatmap() {
  const { heatmapData } = useStore()
  const [hovered, setHovered] = useState(null)

  const cellFor = (day, hour) =>
    heatmapData.find(d => d.day === day && d.hour === hour)

  const insights = [
    { icon: '🌙', title: 'Peak risk window', desc: '10 PM – 1 AM every night', color: 'var(--rose)', bg: 'var(--rose-dim)' },
    { icon: '☀️', title: 'Safest window', desc: '7 AM – 11 AM (avg score: 18)', color: 'var(--sage)', bg: 'var(--sage-dim)' },
    { icon: '📅', title: 'Riskiest day', desc: 'Saturday nights (score peaks at 94)', color: 'var(--amber)', bg: 'var(--amber-dim)' },
    { icon: '📱', title: 'Trigger pattern', desc: 'Social → Shopping in 87% of cases', color: 'var(--violet)', bg: 'var(--violet-dim)' },
  ]

  return (
    <div style={{ padding: '32px 36px', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
          Trigger <span className="text-gradient">Heatmap</span>
        </div>
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>
          Your impulse risk patterns across time — 7 days × 24 hours
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="glass" style={{ padding: '24px 28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Day labels */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingTop: 28 }}>
            {DAYS.map(d => (
              <div key={d} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', width: 28, textAlign: 'right', lineHeight: '22px' }}>{d}</div>
            ))}
          </div>

          <div style={{ flex: 1 }}>
            {/* Hour labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', marginBottom: 6, paddingRight: 1 }}>
              {HOURS.map(h => (
                <div key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: h % 6 === 0 ? 'var(--text-3)' : 'transparent', textAlign: 'center' }}>
                  {h === 0 ? '12a' : h === 12 ? '12p' : h < 12 ? `${h}a` : `${h - 12}p`}
                </div>
              ))}
            </div>

            {/* Grid */}
            {DAYS.map(day => (
              <div key={day} style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: 3, marginBottom: 3 }}>
                {HOURS.map(hour => {
                  const cell = cellFor(day, hour)
                  const v = cell?.risk || 0
                  const isHovered = hovered?.day === day && hovered?.hour === hour
                  return (
                    <div
                      key={hour}
                      onMouseEnter={() => setHovered({ day, hour, risk: v })}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        height: 22, borderRadius: 4,
                        background: riskColor(v),
                        border: isHovered ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
                        transition: 'transform 0.1s, border-color 0.1s',
                        transform: isHovered ? 'scale(1.4)' : 'scale(1)',
                        cursor: 'default',
                        position: 'relative',
                        zIndex: isHovered ? 10 : 1,
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hovered && (
          <div style={{
            marginTop: 12, padding: '8px 14px', borderRadius: 10,
            background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-bright)',
            display: 'flex', gap: 20, alignItems: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}>
              {hovered.day} {hovered.hour}:00
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>
              Risk: <span style={{ color: riskColor(1) }}>{Math.round(hovered.risk * 100)}</span>/100
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              {hovered.risk >= 0.7 ? '⚠️ High impulse zone' : hovered.risk >= 0.4 ? '⚡ Elevated risk' : '✓ Safe spending window'}
            </span>
          </div>
        )}

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)' }}>LOW RISK</span>
          {[0.05, 0.2, 0.4, 0.6, 0.8, 0.95].map(v => (
            <div key={v} style={{ width: 24, height: 14, borderRadius: 3, background: riskColor(v) }} />
          ))}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)' }}>HIGH RISK</span>
        </div>
      </div>

      {/* Insight cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{
            padding: '18px 20px', borderRadius: 'var(--r-lg)',
            background: ins.bg, border: `0.5px solid ${ins.color}30`,
          }}>
            <span style={{ fontSize: 24, display: 'block', marginBottom: 10 }}>{ins.icon}</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: ins.color, marginBottom: 4 }}>{ins.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>{ins.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
