import React, { useEffect } from 'react'

const PARTICLE_COUNT = 20

export default function Day5Clear({ isPerfect, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className={`screen day5-clear ${isPerfect ? 'day5-clear--perfect' : ''}`}>
      {isPerfect && (
        <div className="day5-clear__particles" aria-hidden="true">
          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
            <div
              key={i}
              className="day5-clear__particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.2}s`,
                animationDuration: `${1.2 + Math.random() * 0.8}s`,
                width: `${3 + Math.random() * 4}px`,
                height: `${3 + Math.random() * 4}px`,
              }}
            />
          ))}
        </div>
      )}
      <div className="day5-clear__title">
        {isPerfect ? 'PERFECT CLEAR' : 'SURVIVED'}
      </div>
      <div className="day5-clear__subtitle">
        {isPerfect ? '5日間を完全に生き延びた' : '5日間を生き延びた'}
      </div>
    </div>
  )
}
