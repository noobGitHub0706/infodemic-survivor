import React, { useState, useEffect, useRef, useCallback } from 'react'
import HUD from './HUD.jsx'
import FeedbackOverlay from './FeedbackOverlay.jsx'
import Navigator from './Navigator.jsx'
import TechniqueGuide from './TechniqueGuide.jsx'
import InspectRound from './rounds/InspectRound.jsx'
import VersusRound from './rounds/VersusRound.jsx'
import DMRound from './rounds/DMRound.jsx'
import SpeedRound from './rounds/SpeedRound.jsx'
import { NAVIGATOR, DAY_POSTS } from '../data/survivor_posts_v4.js'

// ── ナビゲーターテキスト決定 ───────────────────────────────
function getNavText(day, postIndex, postType) {
  const dayKey = `day${day}`
  const nav = NAVIGATOR[dayKey]
  if (!nav) return null
  if (postIndex === 0) return nav.intro ?? null
  if (postType === 'versus') return nav.beforeVersus ?? null
  if (postType === 'dm')     return nav.beforeDM ?? null
  if (postType === 'speed')  return nav.beforeSpeed ?? null
  const dayPosts = DAY_POSTS[dayKey] ?? []
  const prevPost = postIndex > 0 ? dayPosts[postIndex - 1] : null
  if (prevPost?.type === 'versus' && nav.afterVersus) return nav.afterVersus
  return null
}

// ── ラウンドタイプ初回説明 ────────────────────────────────
const ROUND_TYPE_INTROS = {
  inspect: '怪しい箇所をタップしてハイライトし、\n理由を選んでOBJECTION。\n正当な投稿なら何も選ばずTRUST。',
  dm:      '友達からの相談。\n返信を選べ。言い方が大事。',
  versus:  '敵インフルエンサーとの対決。\n反論カードを選んで切れ。',
  speed:   '投稿ラッシュ。制限時間内に\n直感でOBJECTかTRUSTを判断。',
}

function getTypeIntro(roundType) {
  const key = `seen_${roundType}`
  if (sessionStorage.getItem(key)) return null
  sessionStorage.setItem(key, '1')
  return ROUND_TYPE_INTROS[roundType] ?? null
}

// ── コンポーネント ────────────────────────────────────────
export default function GameEngine({
  state,
  currentPost,
  completeRound,
  clearFeedback,
}) {
  const { hp, followers, combo, day, postIndex, feedback, isTutorial, ownedCards = [], shieldCount = 0 } = state

  const [navText, setNavText] = useState(null)
  const [pendingTypeIntro, setPendingTypeIntro] = useState(null)
  const [showGuide, setShowGuide] = useState(false)
  const [showComboBreak, setShowComboBreak] = useState(false)
  const lastPostIdRef = useRef(null)
  const prevComboRef = useRef(combo)

  // COMBO BREAK検知: コンボが2以上から0に落ちたとき
  useEffect(() => {
    const prev = prevComboRef.current
    prevComboRef.current = combo
    if (prev >= 2 && combo === 0 && !feedback) {
      setShowComboBreak(true)
      const t = setTimeout(() => setShowComboBreak(false), 300)
      return () => clearTimeout(t)
    }
  }, [combo, feedback])

  // ナビゲーター + 初回説明のセット
  useEffect(() => {
    if (!currentPost) return
    if (currentPost.id === lastPostIdRef.current) return
    lastPostIdRef.current = currentPost.id

    const navT  = !isTutorial ? getNavText(day, postIndex, currentPost.type) : null
    const typeT = getTypeIntro(currentPost.type)

    if (navT && typeT) {
      setNavText(navT)
      setPendingTypeIntro(typeT)
    } else if (navT) {
      setNavText(navT)
      setPendingTypeIntro(null)
    } else if (typeT) {
      setNavText(typeT)
      setPendingTypeIntro(null)
    }
  }, [currentPost?.id, isTutorial, day, postIndex])

  // ナビゲーター完了 → キューに続きがあれば表示
  const handleNavDone = useCallback(() => {
    if (pendingTypeIntro) {
      setNavText(pendingTypeIntro)
      setPendingTypeIntro(null)
    } else {
      setNavText(null)
    }
  }, [pendingTypeIntro])

  // カード効果計算
  const speedBonus = ownedCards
    .filter(c => c.effect?.type === 'speed_bonus' || c.effect?.type === 'speed_boost')
    .reduce((sum, c) => sum + (c.effect.timeBonus ?? c.effect.value ?? 0), 0)

  const speedHpBonus = ownedCards
    .filter(c => c.effect?.type === 'speed_boost')
    .reduce((sum, c) => sum + (c.effect.hpBonus ?? 0), 0)

  const firstTapBonus = ownedCards
    .filter(c => c.effect?.type === 'first_tap_bonus')
    .reduce((sum, c) => sum + (c.effect.value ?? 0), 0)

  const hasVersusEliminate = ownedCards.some(c => c.effect?.type === 'versus_eliminate')

  if (!currentPost) return null

  // ナビゲーター表示中
  if (navText) {
    return (
      <div className="screen" style={{ position: 'relative' }}>
        <Navigator text={navText} onDone={handleNavDone} />
      </div>
    )
  }

  const renderRound = () => {
    switch (currentPost.type) {
      case 'inspect':
        return (
          <InspectRound
            key={currentPost.id}
            post={currentPost}
            isTutorial={isTutorial}
            onComplete={completeRound}
            firstTapHpBonus={firstTapBonus}
          />
        )
      case 'versus':
        return (
          <VersusRound
            key={currentPost.id}
            post={currentPost}
            onComplete={completeRound}
            eliminateOneWrong={hasVersusEliminate}
          />
        )
      case 'dm':
        return (
          <DMRound
            key={currentPost.id}
            post={currentPost}
            onComplete={completeRound}
          />
        )
      case 'speed':
        return (
          <SpeedRound
            key={currentPost.id}
            post={currentPost}
            extraTime={speedBonus}
            hpBonusPerCorrect={speedHpBonus}
            onComplete={completeRound}
          />
        )
      default:
        return <div style={{ padding: 20, color: 'red' }}>Unknown round type: {currentPost.type}</div>
    }
  }

  return (
    <div className="screen" style={{ position: 'relative' }}>
      {isTutorial && (
        <div className="tutorial-banner">TUTORIAL — 練習問題</div>
      )}

      <HUD
        day={day}
        totalDays={5}
        hp={hp}
        followers={followers}
        combo={combo}
        isTutorial={isTutorial}
        ownedCards={ownedCards}
        shieldCount={shieldCount}
        onGuideOpen={() => setShowGuide(true)}
      />

      <div className="game-area" style={{ overflowY: 'auto' }}>
        {renderRound()}
      </div>

      {showComboBreak && (
        <div className="combo-break" aria-live="assertive">COMBO BREAK</div>
      )}

      {feedback && (
        <FeedbackOverlay
          feedback={feedback}
          onDismiss={clearFeedback}
        />
      )}

      {showGuide && (
        <TechniqueGuide onClose={() => setShowGuide(false)} />
      )}
    </div>
  )
}
