import React, { useState } from 'react'
import HighlightText from '../components/HighlightText.jsx'
import ReasonPopup from '../components/ReasonPopup.jsx'

const TECHNIQUE_COLORS = {
  fear: '#f4212e', authority: '#7856ff',
  fabricated_evidence: '#ff7a00', evidence: '#ff7a00', fabricated: '#ff7a00',
  testimonial: '#00ba7c', social_proof: '#1d9bf0', social: '#1d9bf0',
}

function formatNum(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

function genHandle(id) {
  const map = {
    tut_01: '@anon_user', tut_02: '@consumer_affairs',
    d1_01: '@tech_insider99', d1_02: '@health_lab_jp', d1_03: '@weather_report',
    d2_01: '@morning_hustle', d2_02: '@food_safety_info', d2_03: '@factory_anon',
    d3_01: '@env_alert', d3_02: '@env_research',
    d4_01: '@nutrition_media', d4_02: '@mof_official', d4_03: '@parent_voice',
    d5_01: '@pandemic_alert',
  }
  return map[id] || '@user'
}

export default function InspectRound({ post, isTutorial, onComplete, firstTapHpBonus = 0 }) {
  const [tappedZones, setTappedZones] = useState(new Map()) // zoneId → reasonId
  const [activeZone, setActiveZone] = useState(null)
  const firstTapCorrectRef = React.useRef(null) // null=未判定, true/false=判定済み

  const handleZoneTap = (zone) => {
    if (tappedZones.has(zone.id)) {
      // 選択済みゾーンを再タップ → 理由をリセットして再選択
      setTappedZones(prev => {
        const next = new Map(prev)
        next.delete(zone.id)
        return next
      })
    }
    setActiveZone(zone)
  }

  const handleReasonSelect = (zoneId, reasonId) => {
    if (firstTapCorrectRef.current === null) {
      const zone = post.highlightZones.find(z => z.id === zoneId)
      firstTapCorrectRef.current = !!(zone && !zone.isTrap && zone.correctReason === reasonId)
    }
    setTappedZones(prev => new Map(prev).set(zoneId, reasonId))
    setActiveZone(null)
  }

  const handleObject = () => {
    if (!post.isManipulative) {
      // 正当な投稿にOBJECT → wrong
      // 罠ゾーンをタップしていた場合はそのtrapFeedbackを優先表示
      const tappedTrapZone = [...tappedZones.keys()]
        .map(id => post.highlightZones.find(z => z.id === id))
        .find(z => z?.isTrap)
      const message = tappedTrapZone?.trapFeedback ?? post.incorrectFeedback
      onComplete(
        {
          type: 'wrong',
          hpDelta: -8,
          message,
          techniqueKey: null,
          techniqueLabel: null,
        },
        {
          hpDelta: -8, followerDelta: -50, scoreDelta: -50,
          isCorrect: false, techniqueKey: null, followerSteal: 0,
          answer: { postId: post.id, choice: 'object', isCorrect: false, postText: post.text.slice(0, 60), technique: null },
        }
      )
      return
    }

    // 操作的投稿: 罠ゾーンを除いた実際のゾーンで判定
    const zones = post.highlightZones.filter(z => !z.isTrap)
    const correctCount = [...tappedZones.entries()].filter(([zoneId, reasonId]) => {
      const zone = zones.find(z => z.id === zoneId)
      return zone && zone.correctReason === reasonId
    }).length
    const totalZones = zones.length

    let hpDelta, scoreDelta, feedbackType
    if (totalZones === 0 || correctCount === totalZones) {
      hpDelta = 10; scoreDelta = 150; feedbackType = 'objection'
    } else if (correctCount > 0) {
      hpDelta = 3; scoreDelta = 50; feedbackType = 'partial'
    } else {
      hpDelta = -12; scoreDelta = -50; feedbackType = 'wrong'
    }

    // firstTapBonus: 最初のタップが正解なら追加HP
    const bonus = (feedbackType !== 'wrong' && firstTapCorrectRef.current === true) ? firstTapHpBonus : 0
    if (bonus > 0) hpDelta += bonus

    const isCorrect = hpDelta > 0
    const tc = post.primaryTechnique
    const color = tc ? TECHNIQUE_COLORS[tc] : null

    onComplete(
      {
        type: feedbackType,
        hpDelta,
        message: isCorrect ? post.objectionDetail : post.incorrectFeedback,
        techniqueKey: tc,
        techniqueLabel: post.objectionText,
        techniqueColor: color,
        isPartial: feedbackType === 'partial',
      },
      {
        hpDelta, followerDelta: isCorrect ? 80 : -80, scoreDelta,
        isCorrect, techniqueKey: tc, followerSteal: 0,
        answer: { postId: post.id, choice: 'object', isCorrect, correctCount, totalZones, postText: post.text.slice(0, 60), technique: tc },
      }
    )
  }

  const handleTrust = () => {
    if (post.isManipulative) {
      // 操作的投稿をTRUST → big wrong
      onComplete(
        {
          type: 'wrong',
          hpDelta: -18,
          message: post.incorrectFeedback,
          techniqueKey: post.primaryTechnique,
          techniqueLabel: post.objectionText,
          techniqueColor: post.primaryTechnique ? TECHNIQUE_COLORS[post.primaryTechnique] : null,
          likesAnimation: { from: post.baseLikes ?? 0, to: Math.floor((post.baseLikes ?? 0) * 2.4) },
        },
        {
          hpDelta: -18, followerDelta: 200, scoreDelta: -50,
          isCorrect: false, techniqueKey: post.primaryTechnique, followerSteal: 0,
          answer: { postId: post.id, choice: 'trust', isCorrect: false, postText: post.text.slice(0, 60), technique: post.primaryTechnique },
        }
      )
    } else {
      // 正当な投稿をTRUST → correct
      onComplete(
        {
          type: 'trust',
          hpDelta: 3,
          message: post.trustFeedback ?? post.objectionDetail ?? '正確な情報でした',
          techniqueKey: null,
          techniqueLabel: null,
        },
        {
          hpDelta: 3, followerDelta: 50, scoreDelta: 100,
          isCorrect: true, techniqueKey: null, followerSteal: 0,
          answer: { postId: post.id, choice: 'trust', isCorrect: true, postText: post.text.slice(0, 60), technique: null },
        }
      )
    }
  }

  const techniqueColor = post.primaryTechnique ? TECHNIQUE_COLORS[post.primaryTechnique] : 'transparent'
  const hasZones = post.highlightZones.length > 0
  const tappedCount = tappedZones.size
  // カウント表示は全ゾーン数（罠含む）を使い、操作的投稿と見た目を揃える
  const displayTotal = post.highlightZones.length

  return (
    <div className="inspect-round">
      <div className="post-card-full">
        <div
          className="post-card__technique-line"
          style={{ background: isTutorial ? 'transparent' : techniqueColor }}
        />

        <div className="post-card__meta">
          <div className="post-card__avatar" />
          <div className="post-card__account">
            <div className="post-card__name">
              {genHandle(post.id).replace('@', '')}
            </div>
            <div className="post-card__handle">{genHandle(post.id)}</div>
          </div>
        </div>

        <HighlightText
          text={post.text}
          zones={post.highlightZones}
          tappedZones={tappedZones}
          onZoneTap={handleZoneTap}
          techniqueColor={isTutorial ? null : (post.primaryTechnique ? TECHNIQUE_COLORS[post.primaryTechnique] : null)}
        />

        <div className="post-card__stats">
          <span className="post-card__stat">
            {formatNum(post.baseLikes ?? 0)}<span>LIKES</span>
          </span>
          <span className="post-card__stat">
            {formatNum(post.baseRetweets ?? 0)}<span>RT</span>
          </span>
        </div>
      </div>

      {hasZones && tappedCount > 0 && (
        <div className="inspect-round__hint">
          {tappedCount} / {displayTotal} 箇所を特定
        </div>
      )}
      {hasZones && tappedCount === 0 && (
        <div className="inspect-round__hint inspect-round__hint--idle">
          怪しい箇所をタップしてください
        </div>
      )}

      <div className="inspect-round__actions">
        <button className="inspect-btn inspect-btn--trust" onClick={handleTrust}>
          <span className="inspect-btn__label">TRUST</span>
        </button>
        <button
          className={`inspect-btn inspect-btn--object ${tappedCount > 0 ? 'inspect-btn--ready' : ''}`}
          onClick={handleObject}
        >
          <span className="inspect-btn__label">OBJECT</span>
          {hasZones && tappedCount > 0 && (
            <span className="inspect-btn__count">{tappedCount}</span>
          )}
        </button>
      </div>

      {activeZone && (
        <ReasonPopup
          zone={activeZone}
          onSelect={handleReasonSelect}
          onClose={() => setActiveZone(null)}
        />
      )}
    </div>
  )
}
