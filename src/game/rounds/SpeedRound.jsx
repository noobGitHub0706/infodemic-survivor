import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSwipeable } from 'react-swipeable'

const TECHNIQUE_LABELS = {
  fear: 'FEAR APPEAL', authority: 'AUTHORITY',
  fabricated_evidence: 'FABRICATED EVIDENCE', testimonial: 'TESTIMONIAL', social_proof: 'SOCIAL PROOF',
}

export default function SpeedRound({ post, extraTime = 0, hpBonusPerCorrect = 0, onComplete }) {
  const TOTAL_TIME = (post.timeLimit ?? 90) + extraTime

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [swipeDir, setSwipeDir] = useState(null) // 'left' | 'right' | null
  const [animating, setAnimating] = useState(false)
  const [resultBanner, setResultBanner] = useState(null) // { isCorrect, techniqueLabel }
  const doneRef = useRef(false)

  const posts = post.posts
  const currentSp = posts[index]

  const finishRound = useCallback((finalAnswers) => {
    if (doneRef.current) return
    doneRef.current = true
    const correct = finalAnswers.filter(a => a.isCorrect).length
    const total   = finalAnswers.length
    const hpDelta = correct * (3 + hpBonusPerCorrect) - (total - correct) * 8
    onComplete(
      {
        type: correct >= Math.ceil(total / 2) ? 'objection' : 'wrong',
        hpDelta,
        message: `${correct} / ${total} 正解`,
        techniqueKey: null,
        techniqueLabel: 'SPEED ROUND',
      },
      {
        hpDelta,
        followerDelta: correct * 30,
        scoreDelta: correct * 100,
        isCorrect: correct >= Math.ceil(total / 2),
        techniqueKey: null,
        followerSteal: 0,
        answer: { postId: post.id, type: 'speed', correct, total },
      }
    )
  }, [post.id, onComplete])

  const finishRef = useRef(finishRound)
  finishRef.current = finishRound
  const answersRef = useRef(answers)
  answersRef.current = answers

  // タイマー（マウント時に1回だけ開始、ref経由でfinishRoundを参照）
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(interval)
          finishRef.current(answersRef.current)
          return 0
        }
        return Math.max(0, prev - 0.1)
      })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const handleAnswer = useCallback((isObject) => {
    if (animating || doneRef.current) return
    const isManipulative = currentSp.isManipulative
    const isCorrect = isObject === isManipulative // OBJECT → correct for manipulative

    setAnimating(true)
    setSwipeDir(isObject ? 'left' : 'right')

    const newAnswers = [
      ...answersRef.current,
      { id: currentSp.id, isCorrect, choice: isObject ? 'object' : 'trust', feedback: currentSp.feedback },
    ]
    answersRef.current = newAnswers
    setAnswers(newAnswers)

    // 結果バナー表示（0.5秒）
    const techniqueLabel = currentSp.primaryTechnique ? TECHNIQUE_LABELS[currentSp.primaryTechnique] : null
    setResultBanner({ isCorrect, techniqueLabel })
    setTimeout(() => setResultBanner(null), 500)

    setTimeout(() => {
      setSwipeDir(null)
      setAnimating(false)
      if (newAnswers.length >= posts.length) {
        finishRef.current(newAnswers)
      } else {
        setIndex(prev => prev + 1)
      }
    }, 350)
  }, [animating, currentSp, posts.length])

  const swipeHandlers = useSwipeable({
    onSwipedLeft:  () => handleAnswer(true),  // OBJECT
    onSwipedRight: () => handleAnswer(false), // TRUST
    preventScrollOnSwipe: true,
    trackMouse: true,
  })

  const timerPct = (timeLeft / TOTAL_TIME) * 100
  const timerColor = timerPct <= 25 ? '#f4212e' : timerPct <= 50 ? '#ff7a00' : 'var(--text-secondary)'

  return (
    <div className="speed-round">
      {resultBanner && (
        <div className={`speed-banner ${resultBanner.isCorrect ? 'speed-banner--correct' : 'speed-banner--wrong'}`}>
          {resultBanner.isCorrect
            ? 'CORRECT'
            : `WRONG${resultBanner.techniqueLabel ? ` — ${resultBanner.techniqueLabel}` : ''}`
          }
        </div>
      )}
      <div className="speed-round__header">
        <div className="speed-round__title">SPEED ROUND</div>
        <div className="speed-round__timer" style={{ color: timerColor }}>
          {Math.ceil(timeLeft)}s
        </div>
        <div className="speed-round__progress">{index + 1} / {posts.length}</div>
      </div>

      <div className="speed-round__timer-bar">
        <div
          className="speed-round__timer-fill"
          style={{ width: `${timerPct}%`, background: timerColor }}
        />
      </div>

      <div className="speed-round__arena">
        <div className="speed-round__label speed-round__label--left">OBJECT</div>

        <div
          {...swipeHandlers}
          className="speed-card"
          style={{
            transform: swipeDir === 'left'
              ? 'translateX(-120%) rotate(-15deg)'
              : swipeDir === 'right'
                ? 'translateX(120%) rotate(15deg)'
                : 'none',
            transition: swipeDir ? 'transform 0.3s ease' : 'none',
          }}
        >
          <p className="speed-card__text">{currentSp?.text}</p>
        </div>

        <div className="speed-round__label speed-round__label--right">TRUST</div>
      </div>

      <div className="speed-round__buttons">
        <button
          className="speed-btn speed-btn--object"
          onClick={() => handleAnswer(true)}
          disabled={animating}
        >
          OBJECT
        </button>
        <button
          className="speed-btn speed-btn--trust"
          onClick={() => handleAnswer(false)}
          disabled={animating}
        >
          TRUST
        </button>
      </div>
    </div>
  )
}
