import React from 'react'

const TECHNIQUE_COLORS = {
  fear: '#f4212e', authority: '#7856ff',
  fabricated_evidence: '#ff7a00', testimonial: '#00ba7c', social_proof: '#1d9bf0',
}

const TECHNIQUE_LABELS = {
  fear: 'FEAR APPEAL', authority: 'AUTHORITY',
  fabricated_evidence: 'FABRICATED EVIDENCE', testimonial: 'TESTIMONIAL', social_proof: 'SOCIAL PROOF',
}

const WEAKEST_DESCRIPTIONS = {
  fear:                '「危険」「緊急」に流されやすい傾向があります',
  authority:           '「専門家が言った」に弱い傾向があります',
  fabricated_evidence: '具体的な数字に騙されやすい傾向があります',
  testimonial:         '個人の体験談を信じやすい傾向があります',
  social_proof:        '「みんなやってる」に流されやすい傾向があります',
}

const TECHNIQUE_SHORT = {
  fear: 'FEAR APPEAL', authority: 'AUTHORITY',
  fabricated_evidence: 'FABRICATED EVIDENCE', testimonial: 'TESTIMONIAL', social_proof: 'SOCIAL PROOF',
}

export default function ResultScreen({ state, rank, accuracy, weakestKey, weakestLabel, onRetry }) {
  const { score, maxCombo, hp, followers, techniqueAccuracy, answers, enemyFollowersStolen } = state
  const totalAnswered = answers.length

  const wrongPosts = answers
    .filter(a => !a.isCorrect && a.postText)
    .slice(0, 3)

  const handleShare = () => {
    const text = `INFODEMIC SURVIVOR\nRank: ${rank.letter} — ${rank.name}\n正解率: ${accuracy}% | Score: ${score}\n${weakestLabel ? `弱点: ${weakestLabel}` : ''}`
    if (navigator.share) {
      navigator.share({ text }).catch(() => {})
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      alert('結果をクリップボードにコピーしました')
    }
  }

  return (
    <div className="screen result-screen">
      <div className="result-screen__label">Your Rank</div>
      <div className="result-screen__rank-letter">{rank.letter}</div>
      <div className="result-screen__rank-name">{rank.name}</div>

      <div className="result-screen__stats">
        <div className="result-screen__stat">
          <span className="result-screen__stat-label">Score</span>
          <span className="result-screen__stat-value">{score.toLocaleString()}</span>
        </div>
        <div className="result-screen__stat">
          <span className="result-screen__stat-label">Accuracy</span>
          <span className="result-screen__stat-value">{accuracy}%</span>
        </div>
        <div className="result-screen__stat">
          <span className="result-screen__stat-label">Max Combo</span>
          <span className="result-screen__stat-value">x{maxCombo}</span>
        </div>
        <div className="result-screen__stat">
          <span className="result-screen__stat-label">Enemy Followers Stolen</span>
          <span className="result-screen__stat-value">{enemyFollowersStolen.toLocaleString()}</span>
        </div>
        <div className="result-screen__stat">
          <span className="result-screen__stat-label">Final HP</span>
          <span className="result-screen__stat-value">{hp}</span>
        </div>
        <div className="result-screen__stat">
          <span className="result-screen__stat-label">Followers</span>
          <span className="result-screen__stat-value">{followers.toLocaleString()}</span>
        </div>
      </div>

      <div className="result-screen__techniques">
        <div className="result-screen__techniques-title">Technique Accuracy</div>
        {Object.entries(techniqueAccuracy).map(([key, { correct, total }]) => {
          if (total === 0) return null
          return (
            <div key={key} className="technique-row">
              <div className="technique-row__color" style={{ background: TECHNIQUE_COLORS[key] }} />
              <span className="technique-row__name">{TECHNIQUE_LABELS[key]}</span>
              <div className="technique-row__dots">
                {Array.from({ length: total }).map((_, i) => (
                  <div key={i} className={`technique-row__dot ${i < correct ? 'technique-row__dot--filled' : ''}`} />
                ))}
              </div>
              <span className="technique-row__score">{correct}/{total}</span>
            </div>
          )
        })}
      </div>

      {weakestLabel && (
        <div className="result-screen__weakest">
          Weakest:
          <strong>{weakestLabel}</strong>
          <p>{weakestKey ? WEAKEST_DESCRIPTIONS[weakestKey] : ''}</p>
        </div>
      )}

      <div className="result-screen__got-you">
        <div className="result-screen__got-you-title">POSTS THAT GOT YOU</div>
        {wrongPosts.length === 0 ? (
          <div className="result-screen__perfect-note">PERFECT — 1つも騙されなかった</div>
        ) : (
          <ol className="result-screen__got-you-list">
            {wrongPosts.map((a, i) => (
              <li key={i} className="result-screen__got-you-item">
                <div className="result-screen__got-you-text">
                  「{a.postText.length > 30 ? a.postText.slice(0, 30) + '…' : a.postText}」
                </div>
                {a.technique && (
                  <div
                    className="result-screen__got-you-technique"
                    style={{ color: TECHNIQUE_COLORS[a.technique] ?? 'var(--text-secondary)' }}
                  >
                    {TECHNIQUE_SHORT[a.technique] ?? a.technique}
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="result-screen__actions">
        <button className="btn-primary" onClick={handleShare}>SHARE</button>
        <button className="btn-secondary" onClick={onRetry}>RETRY</button>
      </div>
    </div>
  )
}
