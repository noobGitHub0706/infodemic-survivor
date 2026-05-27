import React, { useState, useEffect } from 'react'
import EnemyProfile from '../components/EnemyProfile.jsx'
import CounterCard from '../components/CounterCard.jsx'
import ChatBubble from '../components/ChatBubble.jsx'

// phases: select → chat → done (wrong t1) | counterReveal → counterSelect (correct t1)
export default function VersusRound({ post, onComplete, eliminateOneWrong = false }) {
  const [phase, setPhase] = useState('select')
  const [selectedTurn1, setSelectedTurn1] = useState(null)
  const [chatLines, setChatLines] = useState([])
  const [visibleLines, setVisibleLines] = useState(0)
  const [enemyCounterVisible, setEnemyCounterVisible] = useState(false)

  // versus_eliminate: 不正解カードを1枚グレーアウト
  const eliminatedCardId = React.useMemo(() => {
    if (!eliminateOneWrong || !post.counterAttack?.cards) return null
    const wrongCards = post.counterAttack.cards.filter(c => !c.correct)
    return wrongCards.length > 0 ? wrongCards[0].id : null
  }, [eliminateOneWrong, post.counterAttack])

  // ── Turn 1: カード選択 ──────────────────────────────────
  const handleCardSelect = (cardId) => {
    const card = post.counterCards.find(c => c.id === cardId)
    if (!card) return
    setSelectedTurn1(card)

    const lines = (post.dialogue?.[cardId] ?? []).map((entry, i) => ({
      id: i,
      text: entry.text,
      side: entry.speaker === 'player' ? 'right' : 'left',
    }))
    setChatLines(lines)
    setVisibleLines(0)
    setPhase('chat')
  }

  // ── ダイアログアニメーション ─────────────────────────────
  useEffect(() => {
    if (phase !== 'chat') return
    if (visibleLines >= chatLines.length) {
      const t = setTimeout(() => {
        setPhase(selectedTurn1?.correct ? 'counterReveal' : 'done')
      }, 600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setVisibleLines(v => v + 1), 500)
    return () => clearTimeout(t)
  }, [phase, visibleLines, chatLines.length, selectedTurn1])

  // ── 敵の切り返し表示 → 2ターン目カード表示 ─────────────
  useEffect(() => {
    if (phase !== 'counterReveal') return
    const t1 = setTimeout(() => setEnemyCounterVisible(true), 500)
    const t2 = setTimeout(() => setPhase('counterSelect'), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [phase])

  // ── Turn 1 不正解: 終了 ──────────────────────────────────
  const finishTurn1Wrong = () => {
    onComplete(
      {
        type: 'wrong',
        hpDelta: -8,
        message: '反論は通じませんでした',
        techniqueKey: post.enemyTechnique,
        techniqueLabel: 'OBJECTION OVERRULED',
      },
      {
        hpDelta: -8, followerDelta: -30, scoreDelta: -50,
        isCorrect: false, techniqueKey: post.enemyTechnique, followerSteal: 0,
        answer: { postId: post.id, choice: selectedTurn1?.id, turn: 1, isCorrect: false, postText: post.enemyPost.slice(0, 60), technique: post.enemyTechnique },
      }
    )
  }

  // ── Turn 2: 切り返しカード選択 ─────────────────────────
  const handleCounterSelect = (cardId) => {
    const card = post.counterAttack?.cards.find(c => c.id === cardId)
    if (!card) return
    onComplete(
      {
        type: card.correct ? 'objection' : 'wrong',
        hpDelta: card.hpChange,
        message: card.correct
          ? `敵のフォロワー ${(card.followerSteal ?? 0).toLocaleString()}人 を奪いました`
          : '切り返しに負けました',
        techniqueKey: post.enemyTechnique,
        techniqueLabel: card.correct ? 'OBJECTION SUSTAINED' : 'OBJECTION OVERRULED',
      },
      {
        hpDelta: card.hpChange,
        followerDelta: card.correct ? 50 : -30,
        scoreDelta: card.correct ? 150 : -50,
        isCorrect: card.correct,
        techniqueKey: post.enemyTechnique,
        followerSteal: card.followerSteal ?? 0,
        answer: { postId: post.id, choice: cardId, turn: 2, isCorrect: card.correct, postText: post.enemyPost.slice(0, 60), technique: post.enemyTechnique },
      }
    )
  }

  const showChat = phase !== 'select'

  return (
    <div className="versus-round">
      <div className="versus-round__enemy-area">
        {post.intro && <div className="versus-round__intro">{post.intro}</div>}
        <EnemyProfile enemy={post.enemy} />
        <div className="versus-round__enemy-post">
          <p>{post.enemyPost}</p>
        </div>
      </div>

      {phase === 'select' && (
        <div className="versus-round__cards">
          <div className="versus-round__cards-label">反論カードを選べ</div>
          <div className="versus-round__cards-grid">
            {post.counterCards.map(card => (
              <CounterCard key={card.id} card={card} onSelect={handleCardSelect} disabled={false} />
            ))}
          </div>
        </div>
      )}

      {showChat && (
        <div className="versus-round__chat">
          {chatLines.map((line, i) => (
            <ChatBubble
              key={line.id}
              text={line.text}
              side={line.side}
              visible={phase === 'chat' ? i < visibleLines : true}
            />
          ))}

          {/* 敵の切り返し（Turn 2） */}
          {(phase === 'counterReveal' || phase === 'counterSelect') && post.counterAttack && (
            <ChatBubble
              text={post.counterAttack.enemyResponse}
              side="left"
              visible={enemyCounterVisible || phase === 'counterSelect'}
            />
          )}

          {/* Turn 1 不正解: CONTINUE ボタン */}
          {phase === 'done' && (
            <button className="btn-primary versus-round__confirm" onClick={finishTurn1Wrong}>
              CONTINUE →
            </button>
          )}

          {/* Turn 2 カード選択 */}
          {phase === 'counterSelect' && post.counterAttack && (
            <div className="versus-round__counter-cards">
              <div className="versus-round__cards-label">どう返す？</div>
              {post.counterAttack.cards.map(card => {
                const isEliminated = card.id === eliminatedCardId
                return (
                  <button
                    key={card.id}
                    className={`counter-card counter-card--response${isEliminated ? ' counter-card--eliminated' : ''}`}
                    onClick={() => !isEliminated && handleCounterSelect(card.id)}
                    disabled={isEliminated}
                  >
                    <span className="counter-card__label">{card.label}</span>
                    <span className="counter-card__desc">{isEliminated ? '（排除済み）' : card.text}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
