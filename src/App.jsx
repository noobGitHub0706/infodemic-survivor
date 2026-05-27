import React, { useRef, useEffect } from 'react'
import { useGameState } from './hooks/useGameState.js'
import { useGameData } from './hooks/useGameData.js'
import TitleScreen from './game/TitleScreen.jsx'
import StoryIntro from './game/StoryIntro.jsx'
import TutorialIntro from './game/Tutorial.jsx'
import GameEngine from './game/GameEngine.jsx'
import DaySummary from './game/DaySummary.jsx'
import RewardSelect from './game/RewardSelect.jsx'
import GameOver from './game/GameOver.jsx'
import ResultScreen from './game/ResultScreen.jsx'
import Day5Clear from './game/Day5Clear.jsx'

const PARTICIPANT_ID = new URLSearchParams(window.location.search).get('id')
const NEXT_STEP_BASE_URL = import.meta.env.VITE_RESEARCH_PORTAL_URL

export default function App() {
  const game = useGameState()
  const { state, currentPost } = game

  const { initSession, saveDayResult, saveGameComplete, saveGameOver } = useGameData(PARTICIPANT_ID)

  // Use a ref so the effect closure always gets the latest Firebase functions
  const fbRef = useRef(null)
  fbRef.current = { initSession, saveDayResult, saveGameComplete, saveGameOver }

  const prevStateRef = useRef(null)

  useEffect(() => {
    const prev = prevStateRef.current
    prevStateRef.current = state

    if (prev === null) return
    if (prev.screen === state.screen) return

    const prevScreen = prev.screen
    const currScreen = state.screen
    const fb = fbRef.current

    if (currScreen === 'storyIntro') {
      fb.initSession()
    }

    // Days 1-4: rewardSelect → playing (after SELECT_REWARD)
    if (prevScreen === 'rewardSelect' && currScreen === 'playing') {
      const completedDay = prev.day
      const dr = prev.dayResults
      fb.saveDayResult(completedDay, {
        answers: state.answers.filter(a => !a.isTutorial && a.day === completedDay),
        summary: {
          correct: dr.correct,
          total: dr.total,
          accuracy: dr.total > 0 ? Math.round(dr.correct / dr.total * 100) : 0,
          hpStart: dr.hpStart,
          hpEnd: dr.hpEnd,
        },
        cardSelected: state.cardSelections.at(-1)?.selectedCardId ?? null,
      })
    }

    // Day 5: entering day5Clear (no rewardSelect phase)
    if (currScreen === 'day5Clear') {
      const dr = state.dayResults
      fb.saveDayResult(5, {
        answers: state.answers.filter(a => !a.isTutorial && a.day === 5),
        summary: {
          correct: dr.correct,
          total: dr.total,
          accuracy: dr.total > 0 ? Math.round(dr.correct / dr.total * 100) : 0,
          hpStart: dr.hpStart,
          hpEnd: dr.hpEnd,
        },
        cardSelected: null,
      })
    }

    if (currScreen === 'gameOver') {
      fb.saveGameOver({ gameOverDay: state.gameOverDay, retryCount: state.retryCount })
    }

    if (currScreen === 'result') {
      const { score, maxCombo, hp, followers, enemyFollowersStolen,
              techniqueAccuracy, answers, gameOverDay, retryCount, cardSelections } = state
      const acc = answers.length > 0
        ? Math.round(answers.filter(a => a.isCorrect).length / answers.length * 100)
        : 0
      fb.saveGameComplete({
        gameOverDay,
        retryCount,
        result: {
          totalScore: score,
          rank: game.rank.letter,
          accuracy: acc,
          maxCombo,
          finalHp: hp,
          finalFollowers: followers,
          enemyFollowersStolen,
        },
        techniqueAccuracy,
        cardSelections,
        allAnswers: answers,
      })
    }
  }, [state])

  const nextStepUrl = PARTICIPANT_ID && NEXT_STEP_BASE_URL
    ? `${NEXT_STEP_BASE_URL}/?id=${PARTICIPANT_ID}&phase=postMediator`
    : null

  switch (state.screen) {
    case 'title':
      return <TitleScreen onStart={game.startGame} />

    case 'storyIntro':
      return <StoryIntro onComplete={game.showTutorialIntro} />

    case 'tutorialIntro':
      return <TutorialIntro onStart={game.startTutorial} />

    case 'playing':
      return (
        <GameEngine
          state={state}
          currentPost={currentPost}
          completeRound={game.completeRound}
          clearFeedback={game.clearFeedback}
        />
      )

    case 'daySummary':
      return (
        <DaySummary
          day={state.day}
          dayResults={state.dayResults}
          onNext={game.showReward}
        />
      )

    case 'rewardSelect':
      return (
        <RewardSelect
          day={state.day}
          cards={game.rewardCards}
          onSelect={game.selectReward}
        />
      )

    case 'day5Clear':
      return (
        <Day5Clear
          isPerfect={state.day5PerfectClear}
          onDone={game.gotoResult}
        />
      )

    case 'gameOver':
      return (
        <GameOver
          day={state.gameOverDay}
          accuracy={game.accuracy}
          weakestTechnique={game.weakestLabel}
          onRetry={game.retry}
          onResults={game.gotoResult}
          retryCount={state.retryCount}
        />
      )

    case 'result':
      return (
        <ResultScreen
          state={state}
          rank={game.rank}
          accuracy={game.accuracy}
          weakestKey={game.weakestKey}
          weakestLabel={game.weakestLabel}
          onRetry={game.retry}
          nextStepUrl={nextStepUrl}
        />
      )

    default:
      return <TitleScreen onStart={game.startGame} />
  }
}
