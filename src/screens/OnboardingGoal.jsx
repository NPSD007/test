import React, { useState } from 'react'
import { useStore } from '../data/store'

export default function OnboardingGoal() {
  const { setGoal, setPhase } = useStore()
  const [value, setValue] = useState('')

  const handleContinue = () => {
    setGoal(Number(value) || 12500)
    setPhase('main')
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#000', minHeight:'100vh' }}>
      {/* Progress bar — matches your screenshot exactly */}
      <div className="progress-bar-top" style={{ '--progress': '60%' }}>
        <div style={{ height:'100%', width:'60%', background:'#00E676', borderRadius:'0 2px 2px 0', transition:'width 0.4s' }} />
      </div>

      {/* Gold image area */}
      <div style={{
        display:'flex', justifyContent:'center', alignItems:'center',
        padding: '32px 24px 0',
      }}>
        <div style={{
          width: 220, height: 220, borderRadius: 24,
          background: 'linear-gradient(145deg, #0D2420, #091A16)',
          display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative', overflow:'hidden',
        }}>
          {/* Gold bars emoji art */}
          <div style={{ fontSize: 80, filter: 'drop-shadow(0 8px 24px rgba(255,184,0,0.4))' }}>🪙</div>
          <div style={{ position:'absolute', bottom:20, fontSize:32 }}>💰</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:'32px 28px', display:'flex', flexDirection:'column' }}>
        {/* Heading — matches screenshot typography */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:38, fontWeight:700, lineHeight:1.1, letterSpacing:'-0.02em' }}>
            <span style={{ color:'#fff' }}>What is your </span>
            <span style={{ color:'#00E676', fontStyle:'italic' }}>savings</span>
          </div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:38, fontWeight:700, lineHeight:1.1, letterSpacing:'-0.02em' }}>
            <span style={{ color:'#00E676', fontStyle:'italic' }}>goal</span>
            <span style={{ color:'#fff' }}> for this month?</span>
          </div>
          <p style={{ fontSize:15, color:'#888', marginTop:14, lineHeight:1.6 }}>
            Precision in planning leads to acceleration in results. Define your mindful target.
          </p>
        </div>

        {/* Input — matches screenshot */}
        <div style={{ marginBottom:32 }}>
          <div className="label-green" style={{ marginBottom:16 }}>MONTHLY TARGET</div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:36, fontWeight:700, color:'#fff' }}>₹</span>
            <input
              className="input-line"
              type="number"
              placeholder="e.g., 1,000"
              value={value}
              onChange={e => setValue(e.target.value)}
              inputMode="numeric"
            />
          </div>
        </div>

        {/* Stats row — matches screenshot */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'#1A1A1A', borderRadius:16, overflow:'hidden', marginBottom:'auto' }}>
          <div style={{ padding:'20px', background:'#000' }}>
            <div style={{ fontSize:20, marginBottom:6 }}>📈</div>
            <div className="label-green" style={{ fontSize:10, marginBottom:6 }}>RECOMMENDED</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:'#fff' }}>₹12,500</div>
          </div>
          <div style={{ padding:'20px', background:'#000' }}>
            <div style={{ fontSize:20, marginBottom:6 }}>🕐</div>
            <div style={{ fontSize:10, fontWeight:700, color:'#888', letterSpacing:'0.1em', marginBottom:6 }}>LAST MONTH</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:'#fff' }}>₹8,000</div>
          </div>
        </div>

        {/* CTA — matches screenshot */}
        <div style={{ paddingTop:28 }}>
          <button className="btn-green" onClick={handleContinue} style={{ fontSize:18 }}>
            Continue <span style={{ fontSize:20 }}>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
