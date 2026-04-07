import React from 'react'
import Sidebar from './components/Sidebar'
import PauseModal from './components/PauseModal'
import Dashboard from './screens/Dashboard'
import PauseDemo from './screens/PauseDemo'
import Heatmap from './screens/Heatmap'
import Insights from './screens/Insights'
import Savings from './screens/Savings'
import Badges from './screens/Badges'
import { useStore } from './data/store'

const screens = {
  dashboard: Dashboard,
  pause: PauseDemo,
  heatmap: Heatmap,
  insights: Insights,
  savings: Savings,
  badges: Badges,
}

export default function App() {
  const { activeScreen } = useStore()
  const Screen = screens[activeScreen] || Dashboard

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--void)' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <Screen />
      </main>
      <PauseModal />
    </div>
  )
}
