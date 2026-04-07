import React, { useState } from 'react'
import { useStore } from '../data/store'

const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const HOURS=Array.from({length:24},(_,i)=>i)

const rCol = v => {
  if(v<0.2) return `rgba(0,230,118,${0.15+v})`
  if(v<0.5) return `rgba(255,184,0,${0.2+v*0.5})`
  return `rgba(255,68,68,${0.3+v*0.5})`
}

export default function Heatmap() {
  const { heatmapData } = useStore()
  const [hov, setHov] = useState(null)
  const cell = (d,h) => heatmapData.find(x=>x.day===d&&x.hour===h)

  return (
    <div className="screen" style={{ padding:'20px' }}>
      <div className="label-green" style={{ marginBottom:8 }}>RISK PATTERNS</div>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, marginBottom:4 }}>Trigger Heatmap</div>
      <div style={{ fontSize:14, color:'#555', marginBottom:20 }}>Your high-risk spending windows</div>

      {/* Heatmap */}
      <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:20, padding:'16px 12px', marginBottom:16 }}>
        {/* Hour labels */}
        <div style={{ display:'flex', marginLeft:34, marginBottom:6 }}>
          {[0,6,12,18,23].map(h => (
            <div key={h} style={{ fontSize:9, color:'#444', flex: h===23?1:'', width: h<23?`${(6/24)*100}%`:'' }}>
              {h===0?'12a':h===6?'6a':h===12?'12p':h===18?'6p':'11p'}
            </div>
          ))}
        </div>

        {DAYS.map(day => (
          <div key={day} style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}>
            <div style={{ fontSize:9, color:'#444', width:30, textAlign:'right', flexShrink:0 }}>{day}</div>
            <div style={{ flex:1, display:'grid', gridTemplateColumns:'repeat(24,1fr)', gap:2 }}>
              {HOURS.map(h => {
                const c = cell(day,h)
                const v = c?.risk||0
                const isH = hov?.day===day&&hov?.hour===h
                return (
                  <div key={h}
                    onMouseEnter={()=>setHov({day,hour:h,risk:v})}
                    onMouseLeave={()=>setHov(null)}
                    onTouchStart={()=>setHov({day,hour:h,risk:v})}
                    style={{
                      height:18, borderRadius:3,
                      background: rCol(v),
                      border: isH?'1px solid #fff':'1px solid transparent',
                      transform: isH?'scale(1.3)':'scale(1)',
                      transition:'transform 0.1s',
                      cursor:'default', zIndex: isH?10:1, position:'relative',
                    }}
                  />
                )
              })}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:12, marginLeft:34 }}>
          <span style={{ fontSize:10, color:'#444' }}>Low</span>
          {[0.05,0.2,0.4,0.65,0.9].map(v => (
            <div key={v} style={{ width:20, height:10, borderRadius:2, background:rCol(v) }}/>
          ))}
          <span style={{ fontSize:10, color:'#444' }}>High</span>
        </div>
      </div>

      {/* Tooltip */}
      {hov && (
        <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:14, padding:'14px 16px', marginBottom:12 }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:700 }}>{hov.day} · {hov.hour}:00</div>
          <div style={{ display:'flex', gap:16, marginTop:8 }}>
            <div>
              <div style={{ fontSize:11, color:'#555' }}>Risk Score</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:700, color: hov.risk>=0.7?'#FF4444':hov.risk>=0.4?'#FFB800':'#00E676' }}>
                {Math.round(hov.risk*100)}
              </div>
            </div>
            <div>
              <div style={{ fontSize:11, color:'#555' }}>Zone</div>
              <div style={{ fontSize:14, fontWeight:600, marginTop:4, color:'#ccc' }}>
                {hov.risk>=0.7?'⚠️ Danger':hov.risk>=0.4?'⚡ Caution':'✓ Safe'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="label-green" style={{ marginBottom:12 }}>KEY PATTERNS</div>
      {[
        { emoji:'🌙', t:'Peak risk: 10 PM – 1 AM', d:'Your highest impulse window every night', col:'#FF4444' },
        { emoji:'☀️', t:'Safest: 7 AM – 11 AM', d:'Morning purchases are 3× more considered', col:'#00E676' },
        { emoji:'📱', t:'Social → Shopping pattern', d:'Instagram to Meesho in 87% of cases', col:'#FFB800' },
        { emoji:'📅', t:'Riskiest day: Saturday night', d:'Score peaks at 94 after 10 PM weekends', col:'#4488FF' },
      ].map((ins,i) => (
        <div key={i} style={{
          display:'flex', gap:14, padding:'16px', borderRadius:16, marginBottom:10,
          background:'#0A0A0A', border:`0.5px solid ${ins.col}20`,
        }}>
          <span style={{ fontSize:24 }}>{ins.emoji}</span>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:ins.col, marginBottom:2 }}>{ins.t}</div>
            <div style={{ fontSize:13, color:'#555' }}>{ins.d}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
