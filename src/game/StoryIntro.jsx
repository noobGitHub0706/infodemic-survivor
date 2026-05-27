import React, { useState } from 'react'

const SCREENS = [
  'SNSには毎日、膨大な情報が流れている。\nその中には、あなたの判断を操るために\n作られた投稿が紛れ込んでいる。',
  'あなたの役割は、フィードに流れる投稿を見極め、\n操作的な情報からフォロワーを守ること。\n投稿を調査し、怪しい箇所を見つけ出せ。',
  '5日間を生き延びろ。\n失敗すれば、あなたのフォロワーは\n誤情報の海に沈む。',
]

export default function StoryIntro({ onComplete }) {
  const [index, setIndex] = useState(0)

  const advance = () => {
    if (index < SCREENS.length - 1) {
      setIndex(i => i + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="screen story-intro" onClick={advance}>
      <div className="story-intro__content">
        <p className="story-intro__text">{SCREENS[index]}</p>
      </div>

      <div className="story-intro__footer">
        <div className="story-intro__dots">
          {SCREENS.map((_, i) => (
            <span
              key={i}
              className={`story-intro__dot${i === index ? ' story-intro__dot--active' : ''}`}
            />
          ))}
        </div>
        <button className="story-intro__btn" onClick={e => { e.stopPropagation(); advance() }}>
          {index < SCREENS.length - 1 ? '→' : 'BEGIN →'}
        </button>
      </div>
    </div>
  )
}
