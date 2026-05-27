import React, { useState } from 'react'

const QUALITY_COLORS = { best: '#00ba7c', ok: '#ff7a00', bad: '#f4212e' }
const QUALITY_LABELS = { best: 'BEST', ok: 'OK', bad: 'BAD' }

function AvatarBubble({ initial, color }) {
  return (
    <div className="dm-avatar" style={{ background: color }}>
      {initial}
    </div>
  )
}

const FRIEND_COLORS = ['#7856ff', '#1d9bf0', '#00ba7c', '#ff7a00']
function friendColor(name) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xff
  return FRIEND_COLORS[h % FRIEND_COLORS.length]
}

export default function DMRound({ post, onComplete }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (response) => {
    if (selected) return
    setSelected(response)
    const isCorrect = response.quality === 'best' || response.quality === 'ok'
    onComplete(
      {
        type: isCorrect ? (response.quality === 'best' ? 'objection' : 'trust') : 'wrong',
        hpDelta: response.hpChange,
        message: response.feedback,
        techniqueKey: post.attachedPostTechnique,
        techniqueLabel: QUALITY_LABELS[response.quality],
      },
      {
        hpDelta: response.hpChange,
        followerDelta: response.quality === 'best' ? 100 : response.quality === 'ok' ? 20 : -50,
        scoreDelta: response.quality === 'best' ? 150 : response.quality === 'ok' ? 50 : -50,
        isCorrect: response.quality !== 'bad',
        techniqueKey: post.attachedPostTechnique,
        followerSteal: 0,
        answer: { postId: post.id, choice: response.id, quality: response.quality, isCorrect, postText: (post.attachedPost ?? post.message).slice(0, 60), technique: post.attachedPostTechnique },
      }
    )
  }

  const color = friendColor(post.friend.name)

  return (
    <div className="dm-round">
      <div className="dm-round__header">
        <AvatarBubble initial={post.friend.avatar} color={color} />
        <div className="dm-round__friend-name">DM from {post.friend.name}</div>
      </div>

      <div className="dm-round__chat">
        <div className="dm-round__message-row">
          <AvatarBubble initial={post.friend.avatar} color={color} />
          <div className="dm-bubble dm-bubble--friend">
            <p>{post.message}</p>
          </div>
        </div>

        {post.attachedPost && (
          <div className="dm-round__attached">
            <div className="dm-attached-label">添付</div>
            <div className="dm-attached-card">
              <p>{post.attachedPost}</p>
            </div>
          </div>
        )}
      </div>

      <div className="dm-round__responses">
        <div className="dm-round__responses-label">返信を選べ</div>
        {post.responses.map(resp => (
          <button
            key={resp.id}
            className={`dm-response-btn${selected?.id === resp.id ? ' dm-response-btn--selected' : ''}`}
            onClick={() => handleSelect(resp)}
            disabled={!!selected}
          >
            <span className="dm-response-btn__quality"
              style={{ color: QUALITY_COLORS[resp.quality] }}>
              {resp.id.toUpperCase()}
            </span>
            <span className="dm-response-btn__text">{resp.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
