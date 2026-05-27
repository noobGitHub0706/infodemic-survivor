import React from 'react'

function splitText(text, zones) {
  if (!zones.length) return [{ type: 'plain', text }]

  const [zone, ...rest] = zones
  const idx = text.indexOf(zone.text)
  if (idx === -1) return splitText(text, rest)

  const before = text.slice(0, idx)
  const after  = text.slice(idx + zone.text.length)
  const parts  = []
  if (before) parts.push({ type: 'plain', text: before })
  parts.push({ type: 'zone', zone, text: zone.text })
  parts.push(...splitText(after, rest))
  return parts
}

export default function HighlightText({ text, zones, tappedZones, onZoneTap, techniqueColor }) {
  const parts = splitText(text, zones)

  return (
    <p className="highlight-text">
      {parts.map((part, i) => {
        if (part.type === 'plain') {
          return <span key={i}>{part.text}</span>
        }
        const { zone } = part
        const isTapped = tappedZones.has(zone.id)
        const reasonId = isTapped ? tappedZones.get(zone.id) : null
        const reasonLabel = reasonId ? zone.reasons.find(r => r.id === reasonId)?.label : null

        // 技法カラーの背景色（タップ済み時）
        const tappedBg = techniqueColor
          ? `${techniqueColor}28`   // 16% opacity
          : 'rgba(255, 122, 0, 0.18)'
        const tappedBorder = techniqueColor ?? '#ff7a00'

        return (
          <span
            key={zone.id}
            className={`highlight-zone ${isTapped ? 'highlight-zone--tapped' : 'highlight-zone--idle'}`}
            style={isTapped ? { background: tappedBg, borderBottomColor: tappedBorder, position: 'relative' } : {}}
            onClick={() => onZoneTap(zone)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onZoneTap(zone)}
            title={isTapped ? '再タップで理由を変更' : undefined}
          >
            {part.text}
            {isTapped && reasonLabel && (
              <span className="highlight-zone__label">{reasonLabel}</span>
            )}
          </span>
        )
      })}
    </p>
  )
}
