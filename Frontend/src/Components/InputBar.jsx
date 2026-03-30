import { useState, useRef } from 'react'
 
export default function InputBar({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef()
 
  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
    textareaRef.current.style.height = 'auto'
  }
 
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
 
  const handleInput = (e) => {
    setValue(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
  }
 
  return (
    <div style={{
      padding: '16px 20px',
      background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 10,
        background: 'var(--bg3)', borderRadius: 16,
        border: `1px solid ${value ? 'var(--border-bright)' : 'var(--border)'}`,
        padding: '10px 14px',
        transition: 'border-color 0.2s ease',
        boxShadow: value ? '0 0 0 3px var(--accent-glow)' : 'none'
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about the document..."
          disabled={disabled}
          rows={1}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: 14, lineHeight: 1.6,
            resize: 'none', fontFamily: 'DM Sans, sans-serif',
            placeholder: 'var(--text-dim)',
            minHeight: 24, maxHeight: 140, overflowY: 'auto'
          }}
        />
 
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          style={{
            width: 36, height: 36, borderRadius: 10, border: 'none',
            background: value.trim() && !disabled
              ? 'linear-gradient(135deg, #7c6af7, #a78bfa)'
              : 'var(--border)',
            color: '#fff', cursor: value.trim() && !disabled ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0, transition: 'all 0.2s ease',
            transform: value.trim() && !disabled ? 'scale(1)' : 'scale(0.9)',
            boxShadow: value.trim() && !disabled ? '0 4px 12px rgba(124,106,247,0.4)' : 'none'
          }}
        >
          {disabled ? (
            <span className="animate-spin-slow" style={{
              display: 'inline-block', width: 16, height: 16,
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff', borderRadius: '50%'
            }} />
          ) : '↑'}
        </button>
      </div>
 
      <p style={{ color: 'var(--text-dim)', fontSize: 11, textAlign: 'center', marginTop: 8 }}>
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}