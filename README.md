# PAUSEnPAY — Behavioral AI Impulse Spending Prevention

> **Stop. Think. Spend Smart.**  
> A real-time behavioral AI system that predicts and prevents impulse purchases before they happen.

---

## 🚀 Quick Start

```bash
# Clone / unzip the project
cd pausenpay

# Option 1: Use the install script (recommended)
chmod +x install.sh
./install.sh

# Option 2: Manual install
npm install
npm run start
```

Open **http://localhost:5173** in your browser.

---

## 🧠 What is PAUSEnPAY?

PAUSEnPAY is a **behavioral AI-based financial speed bump** that intercepts impulsive spending by:

1. **Tracking behavioral signals** — app usage time, switches, time of day, transaction frequency
2. **Scoring impulse risk 0–100** using an on-device XGBoost model
3. **Triggering a 10-second pause** before high-risk transactions complete
4. **Explaining WHY** using SHAP (Shapley) values in plain language
5. **Tracking money saved** with gamified rewards and streaks

---

## 📁 Project Structure

```
pausenpay/
├── index.html                    # Entry point
├── vite.config.js                # Vite build config
├── package.json                  # Dependencies
├── install.sh                    # One-click installer
└── src/
    ├── main.jsx                  # React root
    ├── App.jsx                   # App shell + routing
    ├── index.css                 # Design system (CSS vars)
    ├── components/
    │   ├── Sidebar.jsx           # Navigation sidebar
    │   ├── RiskGauge.jsx         # Animated SVG risk gauge
    │   └── PauseModal.jsx        # 10-second pause overlay
    ├── screens/
    │   ├── Dashboard.jsx         # Main dashboard
    │   ├── PauseDemo.jsx         # Interactive pause demo
    │   ├── Heatmap.jsx           # 24h×7d risk heatmap
    │   ├── Insights.jsx          # AI signal tuner + SHAP
    │   ├── Savings.jsx           # Savings tracker + goals
    │   └── Badges.jsx            # Gamification + leaderboard
    └── data/
        └── store.js              # Zustand store + mock AI engine
```

---

## 🎯 Features

| Screen | What it shows |
|--------|--------------|
| **Dashboard** | Live risk score, SHAP explanations, savings chart, recent pauses |
| **Pause Demo** | Click any merchant to trigger the 10-second pause modal |
| **Heatmap** | 7-day × 24-hour impulse risk visualization |
| **Insights** | Live signal tuner — move sliders, watch the AI score update |
| **Savings** | ₹ saved tracker, goals progress, monthly trend |
| **Badges** | Achievements, streaks, anonymous leaderboard |

---

## 🤖 AI / ML Architecture

```
Behavioral Signals → Feature Engineering → XGBoost → Risk Score (0-100)
                                                    ↓
                                              SHAP Explainer
                                                    ↓
                                         "Why you're being paused"
```

**Input features:**
- `hour_of_day` — normalized 0–23
- `app_usage_minutes` — session duration
- `app_switch_count` — switches per hour
- `tx_frequency_last_hour` — payment attempts
- `is_late_night` — boolean flag (10 PM – 4 AM)

**Model:** XGBoost classifier → ONNX export → on-device inference (&lt;50ms)

**Explainability:** SHAP TreeExplainer → top-3 feature contributions → plain English

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 | Component model, ecosystem |
| Routing | React Router v6 | Client-side navigation |
| State | Zustand | Lightweight, no boilerplate |
| Animation | Framer Motion | Production-grade transitions |
| Charts | Recharts | Composable, React-native |
| Icons | Lucide React | Consistent, tree-shakeable |
| Build | Vite 5 | Sub-second HMR |
| Fonts | Syne + DM Sans | Editorial × functional pairing |

**Full stack (production):**
- Mobile: React Native + ONNX Runtime RN
- Backend: FastAPI (Python)
- DB: PostgreSQL (users) + MongoDB (events)
- AI: XGBoost + SHAP + federated learning roadmap

---

## 🔐 Privacy Architecture

- **On-device inference** — no behavioral data leaves the phone
- **Differential privacy** — ε-DP noise injection on aggregated syncs
- **Minimal server footprint** — only anonymized model gradients sent up
- **Consent-first** — granular per-signal opt-in
- **Silent observation** — 14-day baseline calibration, zero interventions

---

## 🎮 Gamification

- 🔥 Daily mindful spending streak
- 🏆 Badges for milestones (Night Guardian, Iron Will, Diamond Saver)
- 📊 Weekly impulse report card (A+ / A / B grades)
- 🎯 Savings goals with progress bars
- 👥 Anonymous leaderboard

---

## 📅 MVP Roadmap

| Phase | Weeks | Deliverables |
|-------|-------|-------------|
| Foundation | 1–4 | Auth, consent, behavioral SDK, silent observation mode |
| AI Core | 5–8 | XGBoost training, ONNX export, pause UI, UPI hook |
| Polish | 9–12 | Heatmap, gamification, privacy audit, beta launch |

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.0",
  "framer-motion": "^11.0.8",
  "recharts": "^2.12.2",
  "lucide-react": "^0.344.0",
  "zustand": "^4.5.2",
  "date-fns": "^3.3.1",
  "clsx": "^2.1.0"
}
```

---

## 🤝 Team

Built for the PAUSEnPAY pitch deck — behavioral AI for the next generation of mindful fintech.

---

*"10 seconds is all it takes to turn an impulse into a decision."*
