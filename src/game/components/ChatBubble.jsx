import React from 'react'

export default function ChatBubble({ text, side = 'left', delay = 0, visible = true }) {
  return (
    <div
      className={`chat-bubble chat-bubble--${side}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.3s ease ${delay}s, transform 0.3s ease ${delay}s`,
      }}
    >
      <p className="chat-bubble__text">{text}</p>
    </div>
  )
}
