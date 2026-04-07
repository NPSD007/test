import React from 'react'
import { useStore, getExplanations, recentPauses } from '../data/store'
import RiskGauge from '../components/RiskGauge'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { savingsHistory } from '../data/store'

const Tip = ({ children }) => (
  <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:16, padding:'16px' }}>
    {children}
  </div>
)

export default function Dashboard() {
  const { signals, totalSaved, savedToday, streak, pausesToday, triggerPause } = useStore()
  const score = useStore(s => computeRiskScoreLocal(s.signals))
  const explanations = getExplanations(signals)

  function computeRiskScoreLocal(s) {
    let v = 0
    const h = s.hourOfDay
    if (h >= 22 || h <= 4) v += 30
    else if (h >= 20) v += 14
    v += Math.min(s.appSwitchCount * 2, 20)
    v += Math.min(s.appUsageMinutes / 6, 14)
    v += Math.min(s.txFrequencyLastHour * 5, 20)
    if (s.isLateNight) v += 10
    return Math.min(Math.round(v), 100)
  }

  const riskColor = score >= 70 ? '#FF4444' : score >= 40 ? '#FFB800' : '#00E676'

  return (
    <div className="screen" style={{ background:'#000' }}>
      {/* Header */}
      <div style={{ padding:'20px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:13, color:'#555', marginBottom:2 }}>Good evening 👋</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:700 }}>Arjun Sharma</div>
        </div>
        <div style={{ width:42, height:42, borderRadius:'50%', background:'#111', border:'0.5px solid #222', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
          🧘
        </div>
      </div>

      {/* Risk card */}
      <div style={{ margin:'16px 20px 0', padding:'24px 20px', background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:24, textAlign:'center' }}>
        <div className="label-green" style={{ marginBottom:16 }}>IMPULSE RISK SCORE · LIVE</div>
        <RiskGauge score={score} />

        {/* SHAP reasons */}
        {explanations.length > 0 && (
          <div style={{ marginTop:20, borderTop:'0.5px solid #1A1A1A', paddingTop:16, textAlign:'left' }}>
            <div style={{ fontSize:11, color:'#444', fontWeight:600, letterSpacing:'0.1em', marginBottom:12 }}>WHY THIS SCORE</div>
            {explanations.map((e, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <span style={{ fontSize:16 }}>{e.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:'#ccc', marginBottom:3 }}>{e.text}</div>
                  <div style={{ height:3, background:'#1A1A1A', borderRadius:2 }}>
                    <div style={{ height:'100%', width:`${e.weight*100}%`, background:e.col, borderRadius:2, boxShadow:`0 0 6px ${e.col}60`, transition:'width 1s ease' }}/>
                  </div>
                </div>
                <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:'#444' }}>{Math.round(e.weight*100)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, margin:'12px 20px 0' }}>
        <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:18, padding:'18px 16px' }}>
          <div style={{ fontSize:11, color:'#555', fontWeight:600, letterSpacing:'0.08em', marginBottom:6 }}>SAVED TODAY</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:'#00E676' }}>₹{savedToday.toLocaleString()}</div>
          <div style={{ fontSize:12, color:'#444', marginTop:4 }}>{pausesToday} pauses triggered</div>
        </div>
        <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:18, padding:'18px 16px' }}>
          <div style={{ fontSize:11, color:'#555', fontWeight:600, letterSpacing:'0.08em', marginBottom:6 }}>TOTAL SAVED</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:'#fff' }}>₹{totalSaved.toLocaleString()}</div>
          <div style={{ fontSize:12, color:'#444', marginTop:4 }}>🔥 {streak}-day streak</div>
        </div>
      </div>

      {/* Savings chart */}
      <div style={{ margin:'12px 20px 0', background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:20, padding:'18px 12px 12px' }}>
        <div style={{ paddingLeft:8, marginBottom:12 }}>
          <div style={{ fontSize:11, color:'#555', fontWeight:600, letterSpacing:'0.08em' }}>SAVINGS TREND</div>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={savingsHistory} margin={{top:0,right:4,left:-24,bottom:0}}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E676" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{fill:'#333',fontSize:9}} axisLine={false} tickLine={false} interval={2}/>
            <YAxis tick={{fill:'#333',fontSize:9}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:'#111',border:'0.5px solid #222',borderRadius:10,fontFamily:'Inter',fontSize:12}} formatter={v=>[`₹${v}`,'Saved']}/>
            <Area type="monotone" dataKey="saved" stroke="#00E676" strokeWidth={2} fill="url(#g1)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Demo trigger */}
      <div style={{ margin:'12px 20px 0' }}>
        <button className="btn-green" onClick={() => triggerPause({ name:'Myntra', amount:2499, items:3 })}>
          ⏸ Trigger Pause Demo
        </button>
      </div>

      {/* Recent pauses */}
      <div style={{ margin:'16px 20px 0' }}>
        <div style={{ fontSize:11, color:'#555', fontWeight:600, letterSpacing:'0.08em', marginBottom:12 }}>RECENT PAUSES</div>
        {recentPauses.map(p => (
          <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 0', borderBottom:'0.5px solid #111' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'#111', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
              {p.category==='Fashion'?'👗':p.category==='Food'?'🍕':p.category==='Gadgets'?'📱':'🛍️'}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600 }}>{p.merchant}</div>
              <div style={{ fontSize:12, color:'#555', marginTop:2 }}>{p.time} · {p.category}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:700, color: p.action==='cancelled'?'#00E676':'#555' }}>
                {p.action==='cancelled'?'+':'-'}₹{p.amount.toLocaleString()}
              </div>
              <div style={{
                fontSize:10, fontWeight:700, letterSpacing:'0.06em',
                color: p.action==='cancelled'?'#00E676':'#FF4444',
                marginTop:2,
              }}>{p.action==='cancelled'?'SAVED':'SPENT'}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height:8 }}/>
    </div>
  )
}
