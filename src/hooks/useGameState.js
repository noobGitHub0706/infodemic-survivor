import { useReducer, useCallback } from 'react'
import {
  TUTORIAL_POSTS,
  DAY_POSTS,
  REWARD_CARDS,
} from '../data/survivor_posts_v4.js'

// ============================================================
// Data
// ============================================================

function getCurrentPost(isTutorial, day, postIndex) {
  if (isTutorial) return TUTORIAL_POSTS[postIndex] ?? null
  return DAY_POSTS[`day${day}`]?.[postIndex] ?? null
}

function getDayLength(day) {
  return DAY_POSTS[`day${day}`]?.length ?? 0
}

// ============================================================
// Constants
// ============================================================

const TECHNIQUE_LABELS = {
  fear:                'FEAR APPEAL',
  authority:           'AUTHORITY',
  fabricated_evidence: 'FABRICATED EVIDENCE',
  fabricated:          'FABRICATED EVIDENCE',
  evidence:            'FABRICATED EVIDENCE',
  testimonial:         'TESTIMONIAL',
  social_proof:        'SOCIAL PROOF',
  social:              'SOCIAL PROOF',
}

// ============================================================
// Score helpers
// ============================================================

function getRank(score) {
  if (score >= 3500) return { letter: 'S', name: '情報免疫マスター' }
  if (score >= 2500) return { letter: 'A', name: '優秀な判断者' }
  if (score >= 1500) return { letter: 'B', name: '成長中の判断者' }
  if (score >= 500)  return { letter: 'C', name: 'まだ騙される余地あり' }
  return { letter: 'D', name: '要注意' }
}

function getWeakestEntry(techniqueAccuracy) {
  let worstKey = null
  let worstRate = 2
  for (const [key, { correct, total }] of Object.entries(techniqueAccuracy)) {
    if (total === 0) continue
    const rate = correct / total
    if (rate < worstRate) { worstRate = rate; worstKey = key }
  }
  return worstKey
}

// ============================================================
// Initial state
// ============================================================

function initialState() {
  return {
    screen: 'title', // title | tutorialIntro | playing | daySummary | rewardSelect | gameOver | result
    isTutorial: true,
    day: 1,
    postIndex: 0,

    hp: 100,
    followers: 500,
    score: 0,
    combo: 0,
    maxCombo: 0,
    enemyFollowersStolen: 0,

    // null while idle; set by COMPLETE_ROUND, cleared by CLEAR_FEEDBACK
    feedback: null,
    pendingResult: null,

    // デッキ
    ownedCards: [],
    shieldCount: 0,

    dayResults: { correct: 0, total: 0, hpStart: 100, hpEnd: 100, techniquesLearned: [] },
    cardSelections: [],
    gameOverDay: null,
    retryCount: 0,
    day5PerfectClear: false,

    answers: [],
    techniqueAccuracy: {
      fear:                { correct: 0, total: 0 },
      authority:           { correct: 0, total: 0 },
      fabricated_evidence: { correct: 0, total: 0 },
      testimonial:         { correct: 0, total: 0 },
      social_proof:        { correct: 0, total: 0 },
    },
  }
}

// ============================================================
// Reducer
// ============================================================

function reducer(state, action) {
  switch (action.type) {

    // ── START ──────────────────────────────────────────────
    case 'START_GAME':
      return { ...initialState(), screen: 'storyIntro' }

    case 'SHOW_TUTORIAL_INTRO':
      return { ...state, screen: 'tutorialIntro' }

    case 'START_TUTORIAL':
      return {
        ...state,
        screen: 'playing',
        isTutorial: true,
        postIndex: 0,
        dayResults: { correct: 0, total: 0, hpStart: state.hp, hpEnd: state.hp, techniquesLearned: [] },
      }

    case 'START_MAIN':
      return {
        ...state,
        screen: 'playing',
        isTutorial: false,
        day: 1,
        postIndex: 0,
        dayResults: { correct: 0, total: 0, hpStart: state.hp, hpEnd: state.hp, techniquesLearned: [] },
      }

    // ── COMPLETE ROUND ────────────────────────────────────
    case 'COMPLETE_ROUND': {
      const rawHp = action.result?.hpDelta ?? 0
      let displayFeedback = action.feedback

      if (rawHp < 0) {
        // combo_shield: コンボ >= 閾値のとき無効化
        const comboThresholds = state.ownedCards
          .filter(c => c.effect?.type === 'combo_shield')
          .map(c => c.effect.value ?? 999)
        const minThreshold = comboThresholds.length > 0 ? Math.min(...comboThresholds) : 999
        const comboShieldActive = state.combo >= minThreshold

        if (comboShieldActive) {
          displayFeedback = { ...action.feedback, hpDelta: 0, shieldBroken: 'combo' }
        } else if (state.shieldCount > 0) {
          displayFeedback = { ...action.feedback, hpDelta: 0, shieldBroken: 'shield' }
        }
      }

      return { ...state, feedback: displayFeedback, pendingResult: action.result }
    }

    // ── CLEAR FEEDBACK ────────────────────────────────────
    case 'CLEAR_FEEDBACK': {
      const { pendingResult, hp, followers, score, combo, maxCombo,
              enemyFollowersStolen, answers, techniqueAccuracy, dayResults,
              isTutorial, day, postIndex, shieldCount } = state

      if (!pendingResult) return { ...state, feedback: null }

      const {
        hpDelta: rawHpDelta = 0, followerDelta = 0, scoreDelta = 0,
        isCorrect = false, techniqueKey = null, followerSteal = 0,
        answer = null,
      } = pendingResult

      // ── カード効果を適用 ──────────────────────────────────
      let effectiveHpDelta = rawHpDelta
      let effectiveScoreDelta = scoreDelta
      let newShieldCount = shieldCount

      // double_all (Day 5): ダメージとスコアを2倍
      if (day === 5 && state.ownedCards.some(c => c.effect?.type === 'double_all')) {
        if (effectiveHpDelta < 0) effectiveHpDelta *= 2
        effectiveScoreDelta *= 2
      }

      if (effectiveHpDelta < 0) {
        // combo_shield: コンボ >= 閾値のとき無効化（シールドを消費しない）
        const comboThresholds = state.ownedCards
          .filter(c => c.effect?.type === 'combo_shield')
          .map(c => c.effect.value ?? 999)
        const minComboThreshold = comboThresholds.length > 0 ? Math.min(...comboThresholds) : 999
        const comboShieldActive = combo >= minComboThreshold

        if (comboShieldActive) {
          effectiveHpDelta = 0
        } else if (shieldCount > 0) {
          // 通常シールド: ミスを無効化してシールドを1消費
          effectiveHpDelta = 0
          newShieldCount = shieldCount - 1
        } else {
          // damage_reduce: ダメージ軽減（0まで減らせる）
          const damageReduce = state.ownedCards
            .filter(c => c.effect?.type === 'damage_reduce')
            .reduce((sum, c) => sum + (c.effect.value ?? 0), 0)
          if (damageReduce > 0) {
            effectiveHpDelta = Math.min(0, effectiveHpDelta + damageReduce)
          }
        }
      } else if (effectiveHpDelta > 0) {
        // desperation: HP <= 閾値のとき回復量2倍
        const desperationThreshold = state.ownedCards
          .filter(c => c.effect?.type === 'desperation')
          .reduce((max, c) => Math.max(max, c.effect.value ?? 0), 0)
        if (desperationThreshold > 0 && hp <= desperationThreshold) {
          effectiveHpDelta *= 2
        }
      }

      const newHp        = Math.min(100, Math.max(0, hp + effectiveHpDelta))
      const newFollowers = Math.max(0, followers + followerDelta)
      const newScore     = Math.max(0, score + effectiveScoreDelta)
      const newCombo     = isCorrect ? combo + 1 : 0
      const newMaxCombo  = Math.max(maxCombo, isCorrect ? combo + 1 : combo)
      const newEnemySt   = enemyFollowersStolen + (followerSteal ?? 0)

      const normKey = normalizeKey(techniqueKey)
      const newTechAcc = { ...techniqueAccuracy }
      if (normKey && newTechAcc[normKey]) {
        newTechAcc[normKey] = {
          correct: newTechAcc[normKey].correct + (isCorrect ? 1 : 0),
          total:   newTechAcc[normKey].total + 1,
        }
      }

      const newAnswers = answer ? [...answers, {
        ...answer,
        day: isTutorial ? 0 : day,
        isTutorial,
        hpBefore: hp,
        hpAfter: newHp,
        scoreBefore: score,
        scoreAfter: newScore,
        comboCount: combo,
      }] : answers

      const newDayResults = {
        ...dayResults,
        correct: dayResults.correct + (isCorrect ? 1 : 0),
        total:   dayResults.total + 1,
        hpEnd:   newHp,
        techniquesLearned: techniqueKey && !dayResults.techniquesLearned.includes(techniqueKey)
          ? [...dayResults.techniquesLearned, techniqueKey]
          : dayResults.techniquesLearned,
      }

      const base = {
        hp: newHp, followers: newFollowers, score: newScore,
        combo: newCombo, maxCombo: newMaxCombo, enemyFollowersStolen: newEnemySt,
        techniqueAccuracy: newTechAcc, answers: newAnswers, dayResults: newDayResults,
        feedback: null, pendingResult: null, shieldCount: newShieldCount,
      }

      // game over
      if (newHp <= 0) {
        return { ...state, ...base, hp: 0, combo: 0, screen: 'gameOver', gameOverDay: day }
      }

      const nextPostIndex = postIndex + 1

      if (isTutorial) {
        if (nextPostIndex >= TUTORIAL_POSTS.length) {
          return {
            ...state, ...base,
            screen: 'playing', isTutorial: false,
            day: 1, postIndex: 0,
            dayResults: { correct: 0, total: 0, hpStart: newHp, hpEnd: newHp, techniquesLearned: [] },
          }
        }
        return { ...state, ...base, postIndex: nextPostIndex }
      }

      const dayLength = getDayLength(day)
      if (nextPostIndex >= dayLength) {
        if (day >= 5) {
          const day5PerfectClear = newDayResults.correct === newDayResults.total
          return { ...state, ...base, screen: 'day5Clear', day5PerfectClear }
        }
        return { ...state, ...base, screen: 'daySummary' }
      }

      return { ...state, ...base, postIndex: nextPostIndex }
    }

    // ── DAY NAV ───────────────────────────────────────────
    case 'SHOW_REWARD':
      return { ...state, screen: 'rewardSelect' }

    case 'SELECT_REWARD': {
      const { card } = action
      let newHp = state.hp
      let newShieldCount = state.shieldCount

      if (card.effect?.type === 'heal')   newHp = 100
      if (card.effect?.type === 'shield') newShieldCount += card.effect.value ?? 1

      const newOwnedCards = [...state.ownedCards, card]

      // combo_start: 所持カードのcombo_start合計をDay開始コンボに設定
      const comboStart = newOwnedCards
        .filter(c => c.effect?.type === 'combo_start')
        .reduce((sum, c) => sum + (c.effect.value ?? 0), 0)

      const newCardSelections = [
        ...state.cardSelections,
        { afterDay: state.day, selectedCardId: card.id },
      ]

      const nextDay = state.day + 1
      return {
        ...state,
        ownedCards: newOwnedCards,
        hp: newHp,
        shieldCount: newShieldCount,
        combo: comboStart,
        cardSelections: newCardSelections,
        screen: 'playing',
        day: nextDay,
        postIndex: 0,
        dayResults: { correct: 0, total: 0, hpStart: newHp, hpEnd: newHp, techniquesLearned: [] },
      }
    }

    case 'GOTO_RESULT':
      return { ...state, screen: 'result' }

    case 'RETRY': {
      const { retryCount, gameOverDay, ownedCards, shieldCount, answers, techniqueAccuracy, followers, maxCombo } = state
      if (retryCount >= 2) {
        return { ...state, screen: 'result' }
      }
      const comboStart = ownedCards
        .filter(c => c.effect?.type === 'combo_start')
        .reduce((sum, c) => sum + (c.effect.value ?? 0), 0)
      return {
        ...state,
        screen: 'playing',
        isTutorial: false,
        day: gameOverDay,
        postIndex: 0,
        hp: 70,
        score: 0,
        combo: comboStart,
        feedback: null,
        pendingResult: null,
        retryCount: retryCount + 1,
        dayResults: { correct: 0, total: 0, hpStart: 70, hpEnd: 70, techniquesLearned: [] },
      }
    }

    default:
      return state
  }
}

// ── helper ────────────────────────────────────────────────

function normalizeKey(key) {
  if (!key) return null
  const map = {
    fear: 'fear', authority: 'authority',
    fabricated_evidence: 'fabricated_evidence',
    fabricated: 'fabricated_evidence',
    evidence: 'fabricated_evidence',
    testimonial: 'testimonial',
    social_proof: 'social_proof',
    social: 'social_proof',
  }
  return map[key] ?? null
}

// ============================================================
// Hook
// ============================================================

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  const startGame          = useCallback(() => dispatch({ type: 'START_GAME' }),          [])
  const showTutorialIntro  = useCallback(() => dispatch({ type: 'SHOW_TUTORIAL_INTRO' }), [])
  const startTutorial      = useCallback(() => dispatch({ type: 'START_TUTORIAL' }),      [])
  const startMain     = useCallback(() => dispatch({ type: 'START_MAIN' }),     [])
  const showReward    = useCallback(() => dispatch({ type: 'SHOW_REWARD' }),    [])
  const selectReward  = useCallback((card) => dispatch({ type: 'SELECT_REWARD', card }), [])
  const gotoResult    = useCallback(() => dispatch({ type: 'GOTO_RESULT' }),    [])
  const retry         = useCallback(() => dispatch({ type: 'RETRY' }),          [])

  const completeRound = useCallback((feedback, result) => {
    dispatch({ type: 'COMPLETE_ROUND', feedback, result })
  }, [])

  const clearFeedback = useCallback(() => {
    dispatch({ type: 'CLEAR_FEEDBACK' })
  }, [])

  const currentPost = getCurrentPost(state.isTutorial, state.day, state.postIndex)

  const weakestKey   = getWeakestEntry(state.techniqueAccuracy)
  const weakestLabel = weakestKey ? (TECHNIQUE_LABELS[weakestKey] ?? null) : null
  const rank         = getRank(state.score)
  const accuracy     = state.answers.length > 0
    ? Math.round(state.answers.filter(a => a.isCorrect).length / state.answers.length * 100)
    : 0

  const rewardCards = state.screen === 'rewardSelect'
    ? (REWARD_CARDS[`afterDay${state.day}`] ?? [])
    : []

  return {
    state,
    currentPost,
    startGame, showTutorialIntro, startTutorial, startMain, showReward, selectReward, gotoResult, retry,
    completeRound, clearFeedback,
    weakestKey, weakestLabel, rank, accuracy,
    rewardCards,
    TECHNIQUE_LABELS,
  }
}
