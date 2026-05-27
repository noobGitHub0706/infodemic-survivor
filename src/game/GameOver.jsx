import React from 'react'

const TECHNIQUE_LABELS = {
  fear: 'FEAR APPEAL',
  authority: 'AUTHORITY',
  fabricated_evidence: 'FABRICATED EVIDENCE',
  testimonial: 'TESTIMONIAL',
  social_proof: 'SOCIAL PROOF',
}

export default function GameOver({ day, accuracy, weakestTechnique, onRetry, onResults, retryCount = 0 }) {
  const retriesLeft = Math.max(0, 2 - retryCount)

  return (
    <div className="screen game-over">
      <div className="game-over__label">Game Over</div>
      <h2 className="game-over__title">
        GAME<br />OVER
      </h2>
      <p className="game-over__message">
        あなたのフォロワーは<br />誤情報の海に沈みました
      </p>

      <div className="game-over__stats">
        <div className="day-summary__stat">
          <span className="day-summary__stat-label">Reached</span>
          <span className="day-summary__stat-value">Day {day}</span>
        </div>
        <div className="day-summary__stat" style={{ marginTop: '10px' }}>
          <span className="day-summary__stat-label">Accuracy</span>
          <span className="day-summary__stat-value">{accuracy}%</span>
        </div>
      </div>

      {weakestTechnique && (
        <div className="game-over__weakest">
          Weakest:
          <strong>{weakestTechnique}</strong>
        </div>
      )}

      <div className="game-over__actions">
        <button className="btn-primary" onClick={onRetry}>
          {retriesLeft > 0 ? `RETRY — 残り${retriesLeft}回` : 'CONTINUE →'}
        </button>
        <button className="btn-secondary" onClick={onResults}>RESULTS</button>
      </div>

      {retriesLeft > 0 && (
        <p className="game-over__retry-note">HP 70 で同じDayから再開 / カード維持</p>
      )}
    </div>
  )
}
