import React, { useEffect, useState, useCallback } from 'react'

export default function Navigator({ text, onDone }) {
  const [visible, setVisible] = useState(false)

  const dismiss = useCallback(() => {
    setVisible(false)
    setTimeout(onDone, 250)
  }, [onDone])

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50)
    const t2 = setTimeout(() => setVisible(false), 1600)
    const t3 = setTimeout(() => onDone(), 1900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div className="navigator" onClick={dismiss}>
      <p className={`navigator__text${visible ? ' navigator__text--visible' : ''}`}>
        {text}
      </p>
    </div>
  )
}
