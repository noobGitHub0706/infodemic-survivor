import React, { useState } from 'react'

export default function RewardSelect({ day, cards, onSelect }) {
  const [selectedId, setSelectedId] = useState(null)
  const [acquiredCard, setAcquiredCard] = useState(null)

  const handleTap = (card) => {
    if (acquiredCard) return
    if (selectedId === card.id) {
      setAcquiredCard(card)
      setTimeout(() => onSelect(card), 600)
    } else {
      setSelectedId(card.id)
    }
  }

  const handleConfirm = () => {
    if (acquiredCard) return
    const card = cards.find(c => c.id === selectedId)
    if (card) {
      setAcquiredCard(card)
      setTimeout(() => onSelect(card), 600)
    }
  }

  if (acquiredCard) {
    return (
      <div className="screen reward-select reward-select--acquired">
        <div className="reward-acquired__card-name">{acquiredCard.name}</div>
        <div className="reward-acquired__label">CARD ACQUIRED</div>
        {acquiredCard.flavor && (
          <div className="reward-acquired__flavor">{acquiredCard.flavor}</div>
        )}
      </div>
    )
  }

  return (
    <div className="screen reward-select">
      <div className="reward-select__header">
        <div className="reward-select__day">DAY {day} CLEAR</div>
        <h2 className="reward-select__title">CHOOSE YOUR REWARD</h2>
        <p className="reward-select__hint">カードを選んでデッキに追加</p>
      </div>

      <div className="reward-select__cards">
        {cards.map(card => (
          <button
            key={card.id}
            className={`reward-card${selectedId === card.id ? ' reward-card--selected' : ''}`}
            onClick={() => handleTap(card)}
          >
            <div className="reward-card__name">{card.name}</div>
            <div className="reward-card__desc">{card.desc}</div>
            {card.flavor && (
              <div className="reward-card__flavor">{card.flavor}</div>
            )}
          </button>
        ))}
      </div>

      {selectedId ? (
        <button className="btn-primary reward-select__confirm" onClick={handleConfirm}>
          このカードを選ぶ →
        </button>
      ) : (
        <p className="reward-select__tap-hint">カードをタップして選択</p>
      )}
    </div>
  )
}
