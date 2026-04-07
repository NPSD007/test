import React, { useEffect, useState } from 'react'

export default function RiskGauge({ score }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    let start = 0
    const step = () => {
      start += 2
      if (start >= score) { setDisplayed(score); return }
      setDisplayed(start)
      requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [score])

  const level = score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW'
  const color = score >= 70 ? 'var(--rose)' : score >= 40 ? 'var(--amber)' : 'var(--sage)'
  const glowColor = score >= 70 ? 'rgba(244,63,94,0.4)' : score >= 40 ? 'rgba(245,158,11,0.4)' : 'rgba(52,211,153,0.3)'

  // Arc math
  const R = 80
  const cx = 110, cy = 110
  const startAngle = -210
  const sweepDeg = 240
  const pct = displayed / 100
  const toRad = d => (d * Math.PI) / 180
  const arcX = (ang) => cx + R * Math.cos(toRad(ang))
  const arcY = (ang) => cy + R * Math.sin(toRad(ang))

  const describeArc = (from, to) => {
    const s = { x: arcX(from), y: arcY(from) }
    const e = { x: arcX(to), y: arcY(to) }
    const large = (to - from) > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`
  }

  const endAngle = startAngle + sweepDeg
  const fillEnd = startAngle + sweepDeg * pct

  // Tick marks
  const ticks = [0, 25, 50, 75, 100].map(v => {
    const ang = startAngle + (sweepDeg * v / 100)
    return {
      x1: cx + (R - 8) * Math.cos(toRad(ang)),
      y1: cy + (R - 8) * Math.sin(toRad(ang)),
      x2: cx + (R + 2) * Math.cos(toRad(ang)),
      y2: cy + (R + 2) * Math.sin(toRad(ang)),
      label: v,
      lx: cx + (R + 18) * Math.cos(toRad(ang)),
      ly: cy + (R + 18) * Math.sin(toRad(ang)),
    }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={220} height={180} viewBox="0 0 220 180">
        <defs>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path d={describeArc(startAngle, endAngle)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} strokeLinecap="round" />

        {/* Fill */}
        {displayed > 0 && (
          <path d={describeArc(startAngle, fillEnd)} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${glowColor})`, transition: 'stroke 0.4s ease' }} />
        )}

        {/* Ticks */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
            <text x={t.lx} y={t.ly} textAnchor="middle" dominantBaseline="central"
              fontSize={9} fill="rgba(255,255,255,0.3)" fontFamily="var(--font-mono)">{t.label}</text>
          </g>
        ))}

        {/* Center score */}
        <text x={cx} y={cy - 10} textAnchor="middle" fontSize={48} fontWeight={700}
          fontFamily="var(--font-display)" fill={color}
          style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}>
          {displayed}
        </text>
        <text x={cx} y={cy + 22} textAnchor="middle" fontSize={11}
          fontFamily="var(--font-mono)" fill="rgba(255,255,255,0.35)" letterSpacing="3">
          RISK SCORE
        </text>
      </svg>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 18px', borderRadius: 100,
        background: score >= 70 ? 'var(--rose-dim)' : score >= 40 ? 'var(--amber-dim)' : 'var(--sage-dim)',
        border: `0.5px solid ${color}40`,
        marginTop: -16,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, display: 'inline-block' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color, letterSpacing: '0.1em' }}>{level} IMPULSE RISK</span>
      </div>
    </div>
  )
}
