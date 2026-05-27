import { useRef } from 'react'
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase.js'

export function useGameData(participantId) {
  // セッションIDはマウント時に1回だけ生成（再レンダリングで変わらない）
  const sessionIdRef = useRef(
    participantId ?? `anon_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  )
  const sessionId = sessionIdRef.current
  const docRef = doc(db, 'survivor_sessions', sessionId)

  const initSession = async () => {
    try {
      await setDoc(docRef, {
        participantId: participantId ?? null,
        sessionId,
        startedAt: serverTimestamp(),
        completed: false,
        status: 'playing',
        userAgent: navigator.userAgent,
      })
    } catch (e) {
      console.error('[Firebase] initSession:', e)
    }
  }

  const saveDayResult = async (dayNum, dayData) => {
    try {
      await updateDoc(docRef, {
        [`day${dayNum}`]: { ...dayData, completedAt: serverTimestamp() },
        lastActiveDay: dayNum,
        status: 'playing',
      })
    } catch (e) {
      console.error('[Firebase] saveDayResult:', e)
    }
  }

  const saveGameComplete = async (resultData) => {
    try {
      await updateDoc(docRef, {
        ...resultData,
        completed: true,
        status: 'complete',
        completedAt: serverTimestamp(),
      })
    } catch (e) {
      console.error('[Firebase] saveGameComplete:', e)
    }
  }

  const saveGameOver = async (gameOverData) => {
    try {
      await updateDoc(docRef, {
        ...gameOverData,
        status: 'game_over',
      })
    } catch (e) {
      console.error('[Firebase] saveGameOver:', e)
    }
  }

  return { sessionId, initSession, saveDayResult, saveGameComplete, saveGameOver }
}
