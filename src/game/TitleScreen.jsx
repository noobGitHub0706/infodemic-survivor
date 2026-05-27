import React from 'react'

export default function TitleScreen({ onStart }) {
  return (
    <div className="screen title-screen">
      <div className="title-screen__logo">
        INFODEMIC<br />SURVIVOR
      </div>
      <p className="title-screen__tagline">
        あなたの判断が<br />フォロワーの運命を左右する
      </p>
      <button className="btn-primary" onClick={onStart}>
        START
      </button>
    </div>
  )
}
