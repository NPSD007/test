// ============================================================
//  PAUSEnPAY — Mock Data & Zustand Store
// ============================================================

import { create } from 'zustand'

// ---------- Mock behavioral signals ----------
export const mockBehaviorSignals = {
  hourOfDay: 23,
  appUsageMinutes: 94,
  appSwitchCount: 14,
  txFrequencyLastHour: 3,
  isLateNight: true,
  daysSinceLastPurchase: 0,
}

// ---------- Compute impulse risk score ----------
export function computeRiskScore(signals) {
  const { hourOfDay, appUsageMinutes, appSwitchCount, txFrequencyLastHour, isLateNight } = signals
  let score = 0
  // Late night heavily weighted
  if (hourOfDay >= 22 || hourOfDay <= 4) score += 30
  else if (hourOfDay >= 20) score += 15
  // App switches
  score += Math.min(appSwitchCount * 2, 20)
  // Usage duration
  score += Math.min(appUsageMinutes / 6, 15)
  // Tx frequency
  score += Math.min(txFrequencyLastHour * 5, 20)
  // Late night flag
  if (isLateNight) score += 10
  return Math.min(Math.round(score), 100)
}

// ---------- SHAP-style explanations ----------
export function getExplanations(signals) {
  const reasons = []
  if (signals.isLateNight || signals.hourOfDay >= 22)
    reasons.push({ icon: '🌙', text: 'Late-night browsing', weight: 0.88, color: 'violet' })
  if (signals.appSwitchCount >= 10)
    reasons.push({ icon: '📱', text: `${signals.appSwitchCount} app switches/hr`, weight: 0.71, color: 'amber' })
  if (signals.txFrequencyLastHour >= 2)
    reasons.push({ icon: '⚡', text: `${signals.txFrequencyLastHour} purchase attempts`, weight: 0.64, color: 'rose' })
  if (signals.appUsageMinutes >= 60)
    reasons.push({ icon: '⏱', text: `${signals.appUsageMinutes}min session`, weight: 0.42, color: 'neon' })
  return reasons.slice(0, 3)
}

// ---------- Heatmap data (24h × 7d) ----------
export function generateHeatmap() {
  const data = []
  const riskByHour = (h) => {
    if (h >= 22 || h <= 3) return 0.75 + Math.random() * 0.25
    if (h >= 12 && h <= 14) return 0.35 + Math.random() * 0.25
    if (h >= 6 && h <= 9) return 0.1 + Math.random() * 0.15
    return 0.2 + Math.random() * 0.3
  }
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      const base = riskByHour(h)
      const weekend = (d >= 5) ? 0.1 : 0
      data.push({ day: days[d], hour: h, risk: Math.min(base + weekend, 1) })
    }
  }
  return data
}

// ---------- Savings history ----------
export const savingsHistory = [
  { date: 'Mar 1', saved: 340, pauses: 2 },
  { date: 'Mar 3', saved: 890, pauses: 5 },
  { date: 'Mar 5', saved: 220, pauses: 1 },
  { date: 'Mar 7', saved: 1240, pauses: 7 },
  { date: 'Mar 9', saved: 560, pauses: 3 },
  { date: 'Mar 11', saved: 1800, pauses: 9 },
  { date: 'Mar 13', saved: 940, pauses: 4 },
  { date: 'Mar 15', saved: 2100, pauses: 11 },
  { date: 'Mar 17', saved: 680, pauses: 3 },
  { date: 'Mar 19', saved: 1520, pauses: 8 },
  { date: 'Mar 21', saved: 430, pauses: 2 },
  { date: 'Mar 23', saved: 2400, pauses: 13 },
  { date: 'Mar 25', saved: 1100, pauses: 6 },
  { date: 'Mar 27', saved: 1760, pauses: 9 },
  { date: 'Today', saved: 840, pauses: 3 },
]

// ---------- Recent pause events ----------
export const recentPauses = [
  { id: 1, time: '11:47 PM', merchant: 'Myntra', amount: 2499, category: 'Fashion', action: 'cancelled', score: 82 },
  { id: 2, time: '10:23 PM', merchant: 'Swiggy', amount: 649, category: 'Food', action: 'proceeded', score: 71 },
  { id: 3, time: '09:15 PM', merchant: 'Amazon', amount: 3899, category: 'Electronics', action: 'cancelled', score: 76 },
  { id: 4, time: '02:12 PM', merchant: 'Zomato', amount: 428, category: 'Food', action: 'proceeded', score: 44 },
  { id: 5, time: '01:08 AM', merchant: 'Meesho', amount: 1299, category: 'Fashion', action: 'cancelled', score: 91 },
]

// ---------- Badges ----------
export const badges = [
  { id: 1, emoji: '🔥', title: '7-Day Streak', desc: 'Completed all pauses', unlocked: true },
  { id: 2, emoji: '🧘', title: 'Mindful Spender', desc: 'Saved ₹10,000+', unlocked: true },
  { id: 3, emoji: '🌙', title: 'Night Guardian', desc: 'Stopped 5 late buys', unlocked: true },
  { id: 4, emoji: '🏆', title: 'Iron Will', desc: '30-day streak', unlocked: false },
  { id: 5, emoji: '💎', title: 'Diamond Saver', desc: 'Saved ₹50,000+', unlocked: false },
  { id: 6, emoji: '🤖', title: 'AI Partner', desc: 'Model calibrated', unlocked: true },
]

// ---------- Zustand global store ----------
export const useStore = create((set, get) => ({
  // App state
  activeScreen: 'dashboard',
  setScreen: (s) => set({ activeScreen: s }),

  // Observation mode
  isObservationMode: false,
  observationDaysLeft: 0,

  // Risk score
  riskScore: computeRiskScore(mockBehaviorSignals),
  signals: mockBehaviorSignals,
  updateSignals: (signals) => set({
    signals,
    riskScore: computeRiskScore(signals),
  }),

  // Pause modal
  pauseVisible: false,
  pauseMerchant: null,
  triggerPause: (merchant) => set({ pauseVisible: true, pauseMerchant: merchant }),
  dismissPause: () => set({ pauseVisible: false, pauseMerchant: null }),

  // Savings
  totalSaved: 18420,
  pausesToday: 3,
  pausesThisWeek: 11,
  savedToday: 840,
  savedThisWeek: 3240,
  streak: 7,

  // Heatmap
  heatmapData: generateHeatmap(),
}))
