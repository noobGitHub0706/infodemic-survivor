import React from 'react'

function formatFollowers(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

function cardAbbrev(name) {
  const words = name.split(' ')
  if (words.length >= 2) return words[0][0] + words[1][0]
  return name.substring(0, 2)
}

export default function HUD({ day, totalDays, hp, followers, combo, isTutorial, ownedCards = [], shieldCount = 0, onGuideOpen }) {
  const hpPercent = Math.max(0, Math.min(100, hp))
  const fillClass = hp <= 30 ? 'hud__hp-fill--low' : hp <= 60 ? 'hud__hp-fill--mid' : ''

  return (
    <div className="hud">
      <div className="hud__top">
        <div className="hud__day">
          {isTutorial ? (
            <>
              <span>TUTORIAL</span>
              <strong>TRAINING</strong>
            </>
          ) : (
            <>
              <span>DAY</span>
              <strong>{day} / {totalDays}</strong>
            </>
          )}
        </div>

        <div className="hud__hp">
          <div className="hud__hp-label">HP</div>
          <div className="hud__hp-bar">
            <div
              className={`hud__hp-fill ${fillClass}`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <div className="hud__hp-value">{hp}</div>
        </div>

        <div className="hud__right">
          <div className="hud__followers">
            <strong className="hud__followers-value">{formatFollowers(followers)}</strong>
            <span className="hud__followers-label">FOLLOWERS</span>
          </div>
          {onGuideOpen && (
            <button className="hud__guide-btn" onClick={onGuideOpen} title="技法ガイド">?</button>
          )}
        </div>
      </div>

      {combo >= 2 && (
        <div className="hud__combo">
          COMBO <strong>x{combo}</strong>
        </div>
      )}

      {(ownedCards.length > 0 || shieldCount > 0) && (
        <div className="hud__deck">
          <span className="hud__deck-label">DECK</span>
          {ownedCards.map(c => (
            <span key={c.id} className="hud__card-chip" title={c.name}>
              {cardAbbrev(c.name)}
            </span>
          ))}
          {shieldCount > 0 && (
            <span className="hud__card-chip hud__card-chip--shield" title={`SHIELD x${shieldCount}`}>
              🛡×{shieldCount}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
