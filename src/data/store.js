import { create } from 'zustand'

export function computeRiskScore(s) {
  let score = 0
  const h = s.hourOfDay
  if (h >= 22 || h <= 4) score += 30
  else if (h >= 20) score += 14
  score += Math.min(s.appSwitchCount * 2, 20)
  score += Math.min(s.appUsageMinutes / 6, 14)
  score += Math.min(s.txFrequencyLastHour * 5, 20)
  if (s.isLateNight) score += 10
  return Math.min(Math.round(score), 100)
}

export function getExplanations(s) {
  const list = []
  if (s.isLateNight || s.hourOfDay >= 22)
    list.push({ icon: '🌙', text: 'Late-night browsing', weight: 0.88, col: '#00E676' })
  if (s.appSwitchCount >= 8)
    list.push({ icon: '📱', text: `${s.appSwitchCount} app switches/hr`, weight: 0.71, col: '#FFB800' })
  if (s.txFrequencyLastHour >= 2)
    list.push({ icon: '⚡', text: `${s.txFrequencyLastHour} purchase attempts`, weight: 0.64, col: '#FF4444' })
  if (s.appUsageMinutes >= 60)
    list.push({ icon: '⏱', text: `${s.appUsageMinutes}m session`, weight: 0.42, col: '#4488FF' })
  return list.slice(0, 3)
}

export function generateHeatmap() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const data = []
  const risk = h => {
    if (h >= 22 || h <= 3) return 0.7 + Math.random() * 0.3
    if (h >= 6 && h <= 9)  return 0.05 + Math.random() * 0.1
    if (h >= 12 && h <= 14) return 0.3 + Math.random() * 0.2
    return 0.15 + Math.random() * 0.25
  }
  for (let d = 0; d < 7; d++)
    for (let h = 0; h < 24; h++)
      data.push({ day: days[d], hour: h, risk: Math.min(risk(h) + (d >= 5 ? 0.1 : 0), 1) })
  return data
}

export const savingsHistory = [
  { date: 'Mar 1', saved: 340 }, { date: 'Mar 4', saved: 890 },
  { date: 'Mar 7', saved: 1240 }, { date: 'Mar 10', saved: 1800 },
  { date: 'Mar 13', saved: 940 }, { date: 'Mar 16', saved: 2100 },
  { date: 'Mar 19', saved: 1520 }, { date: 'Mar 22', saved: 2400 },
  { date: 'Mar 25', saved: 1100 }, { date: 'Today', saved: 840 },
]

export const recentPauses = [
  { id:1, time:'11:47 PM', merchant:'Myntra', amount:2499, category:'Fashion', action:'cancelled', score:82 },
  { id:2, time:'10:23 PM', merchant:'Swiggy', amount:649,  category:'Food',    action:'proceeded', score:71 },
  { id:3, time:'09:15 PM', merchant:'Amazon', amount:3899, category:'Gadgets', action:'cancelled', score:76 },
  { id:4, time:'02:12 PM', merchant:'Zomato', amount:428,  category:'Food',    action:'proceeded', score:44 },
  { id:5, time:'01:08 AM', merchant:'Meesho', amount:1299, category:'Fashion', action:'cancelled', score:91 },
]

export const useStore = create((set, get) => ({
  appPhase: 'splash', // splash | onboarding | main
  setPhase: p => set({ appPhase: p }),

  activeScreen: 'home',
  setScreen: s => set({ activeScreen: s }),

  monthlyGoal: 0,
  setGoal: g => set({ monthlyGoal: g }),

  signals: { hourOfDay:23, appUsageMinutes:94, appSwitchCount:14, txFrequencyLastHour:3, isLateNight:true, daysSinceLastPurchase:0 },
  get riskScore() { return computeRiskScore(get().signals) },
  updateSignals: signals => set({ signals }),

  pauseVisible: false,
  pauseMerchant: null,
  triggerPause: m => set({ pauseVisible:true, pauseMerchant:m }),
  dismissPause: () => set({ pauseVisible:false, pauseMerchant:null }),

  totalSaved: 18420,
  savedToday: 840,
  savedThisWeek: 3240,
  pausesToday: 3,
  pausesThisWeek: 11,
  streak: 7,

  heatmapData: generateHeatmap(),
}))
