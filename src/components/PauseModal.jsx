import React, { useEffect, useState, useRef } from 'react'
import { useStore, getExplanations } from '../data/store'

export default function PauseModal() {
  const { pauseVisible, pauseMerchant, dismissPause, signals } = useStore()
  const [seconds, setSeconds] = useState(10)
  const [phase, setPhase] = useState('counting') // counting | ready | dismissed
  const [breathPhase, setBreathPhase] = useState(0) // for breathing animation
  const intervalRef = useRef(null)
  const breathRef = useRef(null)

  const explanations = getExplanations(signals)
  const colorMap = { violet: 'var(--violet)', amber: 'var(--amber)', rose: 'var(--rose)', neon: 'var(--neon)' }

  useEffect(() => {
    if (!pauseVisible) {
      setSeconds(10)
      setPhase('counting')
      clearInterval(intervalRef.current)
      clearInterval(breathRef.current)
      return
    }

    // Countdown
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setPhase('ready')
          return 0
        }
        return s - 1
      })
    }, 1000)

    // Breathing animation cycle
    let b = 0
    breathRef.current = setInterval(() => {
      b = (b + 1) % 4
      setBreathPhase(b)
    }, 1000)

    return () => {
      clearInterval(intervalRef.current)
      clearInterval(breathRef.current)
    }
  }, [pauseVisible])

  if (!pauseVisible) return null

  const progress = ((10 - seconds) / 10) * 100
  const r = 58
  const circ = 2 * Math.PI * r
  const strokeDash = circ - (circ * progress) / 100

  const breathSize = 1 + (breathPhase % 2 === 0 ? 0.06 : 0)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(6,6,8,0.88)',
      backdropFilter: 'blur(16px)',
    }}>
      <div style={{
        width: 480, borderRadius: 28,
        background: 'var(--ink-2)',
        border: '0.5px solid var(--border-bright)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
        overflow: 'hidden',
        animation: 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(30px) scale(0.96); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
          }
          @keyframes pulseRing {
            0%, 100% { opacity: 0.15; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.08); }
          }
        `}</style>

        {/* Top violet accent bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, var(--violet), var(--neon))' }} />

        <div style={{ padding: '32px 36px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.14em', marginBottom: 6 }}>
                IMPULSE GUARD ACTIVATED
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
                Hold on a sec...
              </div>
            </div>
            {/* Merchant chip */}
            <div style={{
              padding: '8px 16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border)',
              textAlign: 'right',
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{pauseMerchant?.name || 'Myntra'}</div>
              <div style={{ fontSize: 13, color: 'var(--neon)', fontFamily: 'var(--font-mono)' }}>
                ₹{(pauseMerchant?.amount || 2499).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Countdown circle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ position: 'relative', width: 140, height: 140 }}>
              {/* Pulse rings */}
              {phase === 'counting' && [1, 2].map(i => (
                <div key={i} style={{
                  position: 'absolute', inset: i * -16,
                  borderRadius: '50%',
                  border: '1px solid var(--violet)',
                  animation: `pulseRing ${1.5 + i * 0.5}s ease-in-out infinite ${i * 0.4}s`,
                }} />
              ))}

              <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(124,106,247,0.12)" strokeWidth={8} />
                <circle cx={70} cy={70} r={r} fill="none"
                  stroke={phase === 'ready' ? 'var(--neon)' : 'var(--violet)'}
                  strokeWidth={8} strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={strokeDash}
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease', filter: `drop-shadow(0 0 8px ${phase === 'ready' ? 'var(--neon)' : 'var(--violet)'})` }}
                />
              </svg>

              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                {phase === 'counting' ? (
                  <>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800,
                      color: 'var(--violet-light)', lineHeight: 1,
                      transform: `scale(${breathSize})`, transition: 'transform 0.8s ease',
                    }}>{seconds}</span>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-4)', letterSpacing: '0.1em', marginTop: 4 }}>BREATHE</span>
                  </>
                ) : (
                  <span style={{ fontSize: 36 }}>✓</span>
                )}
              </div>
            </div>
          </div>

          {/* Why you're being paused */}
          <div style={{
            marginBottom: 20, padding: '16px 18px', borderRadius: 'var(--r-md)',
            background: 'var(--violet-dim)', border: '0.5px solid rgba(124,106,247,0.25)',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--violet-light)', letterSpacing: '0.12em', marginBottom: 12 }}>
              WHY YOU'RE BEING PAUSED — AI ANALYSIS
            </div>
            {explanations.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < explanations.length - 1 ? 10 : 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.05)', flexShrink: 0,
                }}>{e.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{e.text}</div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 5 }}>
                    <div style={{
                      height: '100%', width: `${e.weight * 100}%`, borderRadius: 2,
                      background: colorMap[e.color], boxShadow: `0 0 4px ${colorMap[e.color]}`,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', minWidth: 28, textAlign: 'right' }}>
                  +{Math.round(e.weight * 30)}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'grid', gap: 10 }}>
            <button
              disabled={phase === 'counting'}
              onClick={dismissPause}
              style={{
                padding: '14px', borderRadius: 'var(--r-md)',
                background: phase === 'ready' ? 'var(--violet)' : 'rgba(255,255,255,0.04)',
                color: phase === 'ready' ? '#fff' : 'var(--text-4)',
                fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-body)',
                border: `0.5px solid ${phase === 'ready' ? 'var(--violet)' : 'var(--border)'}`,
                cursor: phase === 'ready' ? 'pointer' : 'default',
                transition: 'all 0.4s ease',
                boxShadow: phase === 'ready' ? '0 0 24px var(--violet-glow)' : 'none',
              }}
            >
              {phase === 'counting' ? `Wait ${seconds}s to proceed...` : `Proceed with payment →`}
            </button>
            <button
              onClick={dismissPause}
              style={{
                padding: '14px', borderRadius: 'var(--r-md)',
                background: 'var(--neon-dim)',
                color: 'var(--neon)', fontSize: 15, fontWeight: 500,
                fontFamily: 'var(--font-body)',
                border: '0.5px solid rgba(0,229,195,0.25)',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,195,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--neon-dim)'}
            >
              💡 Save to wishlist instead
            </button>
          </div>

          {/* Tip */}
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-4)', fontStyle: 'italic' }}>
            Research shows 10-second delays reduce impulse spending by 47%
          </div>
        </div>
      </div>
    </div>
  )
}
