import React from 'react'

export default function CounterCard({ card, onSelect, disabled }) {
  return (
    <button
      className={`counter-card ${disabled ? 'counter-card--disabled' : ''}`}
      onClick={() => !disabled && onSelect(card.id)}
      disabled={disabled}
    >
      <span className="counter-card__label">{card.label}</span>
      <span className="counter-card__desc">{card.desc}</span>
    </button>
  )
}
