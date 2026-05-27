import React from 'react'

export default function ReasonPopup({ zone, onSelect, onClose }) {
  if (!zone) return null

  const shuffled = [...zone.reasons].sort(() => Math.random() - 0.5)

  return (
    <div className="reason-popup-backdrop" onClick={onClose}>
      <div className="reason-popup" onClick={e => e.stopPropagation()}>
        <div className="reason-popup__zone-text">{zone.text}</div>
        <div className="reason-popup__label">なぜ怪しい？</div>
        <div className="reason-popup__options">
          {shuffled.map(reason => (
            <button
              key={reason.id}
              className="reason-popup__option"
              onClick={() => onSelect(zone.id, reason.id)}
            >
              {reason.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
