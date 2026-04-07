import React from 'react'
import { badges } from '../data/store'

export default function Badges() {
  const leaderboard = [
    { rank: 1, name: 'Priya K.', saved: 48200, streak: 34, badge: '💎' },
    { rank: 2, name: 'Rahul M.', saved: 32100, streak: 28, badge: '🏆' },
    { rank: 3, name: 'Ananya S.', saved: 29800, streak: 21, badge: '🥉' },
    { rank: 4, name: 'You (Arjun)', saved: 18420, streak: 7, badge: '🔥', isYou: true },
    { rank: 5, name: 'Kiran R.', saved: 14300, streak: 5, badge: '⚡' },
  ]

  return (
    <div style={{ padding: '32px 36px', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
          Achievements & <span className="text-gradient">Badges</span>
        </div>
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Gamified rewards for mindful spending</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Badges grid */}
        <div>
          <div className="glass" style={{ padding: 24 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.14em', marginBottom: 20 }}>YOUR BADGES</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {badges.map(b => (
                <div key={b.id} style={{
                  padding: '18px 12px', borderRadius: 'var(--r-lg)',
                  background: b.unlocked ? 'var(--violet-dim)' : 'rgba(255,255,255,0.02)',
                  border: `0.5px solid ${b.unlocked ? 'rgba(124,106,247,0.3)' : 'var(--border)'}`,
                  textAlign: 'center', position: 'relative',
                  opacity: b.unlocked ? 1 : 0.4,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: b.unlocked ? 'default' : 'not-allowed',
                }}
                  onMouseEnter={e => { if (b.unlocked) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px var(--violet-glow)' } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {!b.unlocked && (
                    <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 10 }}>🔒</div>
                  )}
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{b.emoji}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: b.unlocked ? 'var(--violet-light)' : 'var(--text-3)', marginBottom: 4 }}>{b.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-4)', lineHeight: 1.4 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly report card */}
          <div className="glass" style={{ padding: 24, marginTop: 20 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.14em', marginBottom: 16 }}>WEEKLY IMPULSE REPORT CARD</div>
            {[
              { label: 'Pauses completed', value: 11, max: 11, grade: 'A+' },
              { label: 'Override rate', value: 3, max: 11, grade: 'A' },
              { label: 'Late night stops', value: 5, max: 5, grade: 'A+' },
              { label: 'Streak maintained', value: 7, max: 7, grade: 'A+' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--neon)', width: 36, textAlign: 'right' }}>{item.grade}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${(item.value / item.max) * 100}%`, borderRadius: 2, background: 'var(--neon)', boxShadow: '0 0 6px rgba(0,229,195,0.4)' }} />
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', width: 36 }}>{item.value}/{item.max}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.14em', marginBottom: 20 }}>
            ANONYMOUS LEADERBOARD — THIS WEEK
          </div>
          {leaderboard.map((user, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 'var(--r-md)',
              marginBottom: 10,
              background: user.isYou ? 'var(--violet-dim)' : 'rgba(255,255,255,0.02)',
              border: `0.5px solid ${user.isYou ? 'rgba(124,106,247,0.4)' : 'var(--border)'}`,
              transition: 'border-color 0.2s',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: i === 0 ? 'var(--amber)' : i === 1 ? 'var(--text-3)' : i === 2 ? '#cd7f32' : 'var(--text-4)', width: 24, textAlign: 'center' }}>
                {user.rank}
              </div>
              <div style={{ fontSize: 22 }}>{user.badge}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: user.isYou ? 600 : 400, color: user.isYou ? 'var(--violet-light)' : 'var(--text-1)' }}>{user.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  🔥 {user.streak} day streak
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--neon)' }}>₹{user.saved.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>saved</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'var(--neon-dim)', border: '0.5px solid rgba(0,229,195,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--neon)', marginBottom: 4 }}>🎯 Save ₹13,780 more to reach rank 3</div>
            <div style={{ fontSize: 11, color: 'var(--text-4)' }}>All names are anonymized • data stays on device</div>
          </div>
        </div>
      </div>
    </div>
  )
}
