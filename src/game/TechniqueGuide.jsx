import React from 'react'

const TECHNIQUES = [
  { label: 'FEAR APPEAL',          color: '#f4212e', desc: '恐怖を煽って判断力を下げる' },
  { label: 'AUTHORITY',            color: '#7856ff', desc: '偽の専門家や機関名で信頼を装う' },
  { label: 'FABRICATED EVIDENCE',  color: '#ff7a00', desc: '出典不明の数字やデータで装う' },
  { label: 'TESTIMONIAL',          color: '#00ba7c', desc: '個人の体験談を一般的事実に見せる' },
  { label: 'SOCIAL PROOF',         color: '#1d9bf0', desc: '「みんなやってる」で同調させる' },
]

export default function TechniqueGuide({ onClose }) {
  return (
    <div className="technique-guide-backdrop" onClick={onClose}>
      <div className="technique-guide" onClick={e => e.stopPropagation()}>
        <div className="technique-guide__title">TECHNIQUE GUIDE</div>

        <div className="technique-guide__list">
          {TECHNIQUES.map(t => (
            <div key={t.label} className="technique-guide__item">
              <span className="technique-guide__dot" style={{ background: t.color }} />
              <div className="technique-guide__info">
                <div className="technique-guide__name" style={{ color: t.color }}>{t.label}</div>
                <div className="technique-guide__desc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-primary technique-guide__close" onClick={onClose}>
          CLOSE
        </button>
      </div>
    </div>
  )
}
