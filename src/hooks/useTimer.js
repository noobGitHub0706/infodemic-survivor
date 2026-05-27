import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(totalSeconds, onExpire) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setRunning(true)
  }, [])

  const stop = useCallback(() => {
    setRunning(false)
    clear()
  }, [clear])

  const reset = useCallback((seconds) => {
    clear()
    setRemaining(seconds)
    setRunning(false)
  }, [clear])

  useEffect(() => {
    if (!running) {
      clear()
      return
    }

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 0.1) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setRunning(false)
          onExpireRef.current()
          return 0
        }
        return Math.max(0, prev - 0.1)
      })
    }, 100)

    return clear
  }, [running, clear])

  const ratio = totalSeconds > 0 ? remaining / totalSeconds : 0

  return { remaining, ratio, running, start, stop, reset }
}
