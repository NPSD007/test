import React from 'react'
import { useStore } from '../data/store'

const merchants = [
  { name:'Myntra', amount:2499, items:3, cat:'Fashion', emoji:'👗' },
  { name:'Amazon', amount:5999, items:1, cat:'Electronics', emoji:'📦' },
  { name:'Swiggy', amount:649, items:4, cat:'Food', emoji:'🍕' },
  { name:'Meesho', amount:1299, items:5, cat:'Fashion', emoji:'🛍️' },
  { name:'Nykaa', amount:3200, items:2, cat:'Beauty', emoji:'💄' },
  { name:'Blinkit', amount:420, items:8, cat:'Grocery', emoji:'🛒' },
]

export default function PauseDemo() {
  const { triggerPause, signals } = useStore()

  function score(s) {
    let v=0; const h=s.hourOfDay
    if(h>=22||h<=4)v+=30; else if(h>=20)v+=14
    v+=Math.min(s.appSwitchCount*2,20); v+=Math.min(s.appUsageMinutes/6,14)
    v+=Math.min(s.txFrequencyLastHour*5,20); if(s.isLateNight)v+=10
    return Math.min(Math.round(v),100)
  }
  const s = score(signals)
  const riskColor = s>=70?'#FF4444':s>=40?'#FFB800':'#00E676'

  return (
    <div className="screen" style={{ padding:'20px' }}>
      <div style={{ marginBottom:20 }}>
        <div className="label-green" style={{ marginBottom:8 }}>DEMO MODE</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700 }}>
          Tap to pay → Watch AI pause
        </div>
        <div style={{ fontSize:14, color:'#555', marginTop:8 }}>
          Simulates real checkout interception
        </div>
      </div>

      {/* Risk banner */}
      <div style={{
        padding:'14px 18px', borderRadius:16, marginBottom:20,
        background: s>=70?'rgba(255,68,68,0.08)':s>=40?'rgba(255,184,0,0.08)':'rgba(0,230,118,0.08)',
        border:`0.5px solid ${riskColor}30`,
        display:'flex', alignItems:'center', gap:12,
      }}>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:32, fontWeight:800, color:riskColor }}>{s}</div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>
            {s>=70?'⚠️ Pause will fire on checkout':s>=40?'⚡ Elevated — monitoring':'✓ Safe window — no intervention'}
          </div>
          <div style={{ fontSize:12, color:'#555', marginTop:2 }}>Tune signals in AI tab</div>
        </div>
      </div>

      {/* Merchant grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {merchants.map((m,i) => (
          <button key={i} onClick={() => triggerPause(m)} style={{
            padding:'20px 16px', borderRadius:20,
            background:'#0A0A0A', border:'0.5px solid #1A1A1A',
            textAlign:'left', cursor:'pointer', transition:'all 0.15s',
            fontFamily:"'Inter',sans-serif",
          }}
            onTouchStart={e => e.currentTarget.style.background='#111'}
            onTouchEnd={e => e.currentTarget.style.background='#0A0A0A'}
            onMouseEnter={e => e.currentTarget.style.borderColor='#00E676'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#1A1A1A'}
          >
            <div style={{ fontSize:32, marginBottom:12 }}>{m.emoji}</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:2 }}>{m.name}</div>
            <div style={{ fontSize:12, color:'#555', marginBottom:12 }}>{m.cat}</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:17, fontWeight:700, color:'#00E676' }}>
                ₹{m.amount.toLocaleString()}
              </span>
              <span style={{ fontSize:12, color:'#333' }}>Pay →</span>
            </div>
          </button>
        ))}
      </div>

      {/* How it works */}
      <div style={{ marginTop:24, background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:20, padding:'20px' }}>
        <div className="label-green" style={{ marginBottom:16 }}>HOW IT WORKS</div>
        {[
          { n:'01', t:'Signal capture', d:'App usage, switches, time of day tracked locally' },
          { n:'02', t:'AI scores risk', d:'XGBoost model runs on-device in under 50ms' },
          { n:'03', t:'10-sec pause fires', d:'Friction timer before any high-risk checkout' },
          { n:'04', t:'SHAP explains why', d:'You see exactly what triggered the pause' },
        ].map(s => (
          <div key={s.n} style={{ display:'flex', gap:14, marginBottom:16 }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:13, fontWeight:700, color:'#00E676', minWidth:28 }}>{s.n}</div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:'#fff', marginBottom:2 }}>{s.t}</div>
              <div style={{ fontSize:12, color:'#555' }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
