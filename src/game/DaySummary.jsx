import React from 'react'

const TECHNIQUE_LABELS = {
  fear: 'FEAR APPEAL',
  authority: 'AUTHORITY',
  fabricated_evidence: 'FABRICATED EVIDENCE',
  testimonial: 'TESTIMONIAL',
  social_proof: 'SOCIAL PROOF',
}

export default function DaySummary({ day, dayResults, onNext }) {
  const { correct, total, hpStart, hpEnd, techniquesLearned } = dayResults
  const hpChange = hpEnd - hpStart
  const hpSign = hpChange >= 0 ? '+' : ''
  const primaryTech = techniquesLearned?.[0] || null

  return (
    <div className="screen day-summary">
      <div className="day-summary__label">Day {day} complete</div>
      <h2 className="day-summary__title">
        {correct >= total ? 'PERFECT' : correct >= total * 0.75 ? 'GREAT' : 'CLEAR'}
      </h2>

      <div className="day-summary__stats">
        <div className="day-summary__stat">
          <span className="day-summary__stat-label">Correct</span>
          <span className="day-summary__stat-value">{correct} / {total}</span>
        </div>
        <div className="day-summary__stat">
          <span className="day-summary__stat-label">HP</span>
          <span className="day-summary__stat-value">
            {hpStart} → {hpEnd}
            <span style={{ fontSize: '13px', color: hpChange >= 0 ? 'var(--color-testimonial)' : 'var(--color-fear)', marginLeft: '8px' }}>
              ({hpSign}{hpChange})
            </span>
          </span>
        </div>
      </div>

      {primaryTech && (
        <div className="day-summary__technique">
          Today you encountered:
          <strong>{TECHNIQUE_LABELS[primaryTech] || primaryTech}</strong>
        </div>
      )}

      <button className="btn-primary" onClick={onNext}>
        DAY {day + 1} →
      </button>
    </div>
  )
}
