import React from 'react'

const AVATAR_COLORS = ['#7856ff', '#f4212e', '#ff7a00', '#00ba7c', '#1d9bf0']

function hashColor(name) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

function formatFollowers(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

export default function EnemyProfile({ enemy }) {
  const color = hashColor(enemy.name)
  return (
    <div className="enemy-profile">
      <div className="enemy-avatar" style={{ background: color }}>
        {enemy.avatar}
      </div>
      <div className="enemy-info">
        <div className="enemy-name">{enemy.name}</div>
        <div className="enemy-followers">{formatFollowers(enemy.followers)} FOLLOWERS</div>
      </div>
    </div>
  )
}
