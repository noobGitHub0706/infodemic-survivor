import React from 'react'

export default function TutorialIntro({ onStart }) {
  return (
    <div className="screen tutorial-intro">
      <div className="tutorial-intro__step">Tutorial</div>
      <h1 className="tutorial-intro__title">
        SNSの<br />情報を<br />見極めよ
      </h1>
      <p className="tutorial-intro__body">
        あなたは<strong>SNSユーザー</strong>。<br />
        タイムラインに流れてくる投稿を判断し、<br />
        フォロワーを誤情報から守ろう。
      </p>

      <div className="tutorial-intro__hints">
        <div className="tutorial-intro__hint">
          <div className="tutorial-intro__hint-icon">S</div>
          <div className="tutorial-intro__hint-text">
            <strong>SHARE</strong> — 正確な情報をシェアしてフォロワーに届ける
          </div>
        </div>
        <div className="tutorial-intro__hint">
          <div className="tutorial-intro__hint-icon">D</div>
          <div className="tutorial-intro__hint-text">
            <strong>DOUBT</strong> — 操作的な投稿を疑ってスルーする
          </div>
        </div>
        <div className="tutorial-intro__hint">
          <div className="tutorial-intro__hint-icon">V</div>
          <div className="tutorial-intro__hint-text">
            <strong>VERIFY</strong> — 情報源を確認してから判断する（タイマーは進む）
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={onStart}>
        BEGIN
      </button>
    </div>
  )
}
