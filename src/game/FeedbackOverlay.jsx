import React, { useEffect, useState } from 'react'

const TECHNIQUE_COLORS = {
  fear: '#f4212e', authority: '#7856ff',
  fabricated_evidence: '#ff7a00', evidence: '#ff7a00',
  testimonial: '#00ba7c', social_proof: '#1d9bf0', social: '#1d9bf0',
}

function formatLikes(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toLocaleString()
}

export default function FeedbackOverlay({ feedback, onDismiss }) {
  const [locked, setLocked] = useState(true)
  const [displayLikes, setDisplayLikes] = useState(null)

  // 表示後0.5秒はタップ無効（誤タップ防止）
  useEffect(() => {
    if (!feedback) return
    setLocked(true)
    const t = setTimeout(() => setLocked(false), 500)
    return () => clearTimeout(t)
  }, [feedback])

  // いいねカウントアップアニメーション
  useEffect(() => {
    if (!feedback?.likesAnimation) { setDisplayLikes(null); return }
    const { from, to } = feedback.likesAnimation
    setDisplayLikes(from)
    const STEPS = 24
    const DURATION = 800
    let step = 0
    const id = setInterval(() => {
      step++
      const t = step / STEPS
      const eased = t * t * (3 - 2 * t)
      setDisplayLikes(Math.round(from + (to - from) * eased))
      if (step >= STEPS) clearInterval(id)
    }, DURATION / STEPS)
    return () => clearInterval(id)
  }, [feedback?.likesAnimation])

  if (!feedback) return null

  const { type, hpDelta, message, techniqueKey, techniqueLabel, techniqueColor, isPartial, shieldBroken, likesAnimation } = feedback
  const color = techniqueColor || (techniqueKey ? TECHNIQUE_COLORS[techniqueKey] : null)
  const hpSign = hpDelta >= 0 ? '+' : ''

  const isObjection = type === 'objection'
  const isTrust     = type === 'trust'
  const isPartialOk = type === 'partial'

  let bgClass = 'feedback-overlay--wrong'
  if (isObjection || isPartialOk) bgClass = 'feedback-overlay--correct'
  if (isTrust) bgClass = 'feedback-overlay--trust'

  let verdict = 'WRONG'
  if (isObjection)  verdict = 'OBJECTION'
  if (isPartialOk)  verdict = 'PARTIAL'
  if (isTrust)      verdict = 'TRUSTED'

  return (
    <div
      className={`feedback-overlay ${bgClass} ${isObjection ? 'feedback-overlay--objection' : ''}`}
      onClick={() => !locked && onDismiss()}
    >
      {color && isObjection && (
        <div className="feedback-overlay__technique-bar" style={{ background: color }} />
      )}

      <div className="feedback-overlay__verdict">{verdict}</div>

      {shieldBroken && (
        <div className={`feedback-overlay__shield-broken ${shieldBroken === 'combo' ? 'feedback-overlay__shield-broken--combo' : ''}`}>
          {shieldBroken === 'combo' ? '⚡ COMBO SHIELD' : '🛡 SHIELD BROKEN'}
        </div>
      )}

      {techniqueLabel && (
        <div
          className="feedback-overlay__technique-name"
          style={{ color: color || 'var(--text-secondary)' }}
        >
          {techniqueLabel}
        </div>
      )}

      <div className="feedback-overlay__hp">{hpSign}{hpDelta} HP</div>

      <p className="feedback-overlay__message">{message}</p>

      {likesAnimation && displayLikes !== null && (
        <div className="feedback-overlay__likes-anim">
          ❤ {formatLikes(displayLikes)}
        </div>
      )}

      <span className={`feedback-overlay__hint ${locked ? 'feedback-overlay__hint--locked' : ''}`}>
        TAP TO CONTINUE
      </span>
    </div>
  )
}
