import React from 'react'
import { useGameState } from './hooks/useGameState.js'
import TitleScreen from './game/TitleScreen.jsx'
import StoryIntro from './game/StoryIntro.jsx'
import TutorialIntro from './game/Tutorial.jsx'
import GameEngine from './game/GameEngine.jsx'
import DaySummary from './game/DaySummary.jsx'
import RewardSelect from './game/RewardSelect.jsx'
import GameOver from './game/GameOver.jsx'
import ResultScreen from './game/ResultScreen.jsx'
import Day5Clear from './game/Day5Clear.jsx'

export default function App() {
  const game = useGameState()
  const { state, currentPost } = game

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
        />
      )

    default:
      return <TitleScreen onStart={game.startGame} />
  }
}
