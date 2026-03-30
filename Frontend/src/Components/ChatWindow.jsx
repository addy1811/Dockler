import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
 
export default function ChatWindow({ messages, loading, error }) {
  const bottomRef = useRef()
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])
 
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
 
      {messages.length === 0 && !loading && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-dim)', textAlign: 'center', gap: 12
        }}>
          <div style={{ fontSize: 40, opacity: 0.3 }}>◈</div>
          <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 16, color: 'var(--text-muted)' }}>
            Ask anything about your document
          </p>
          <p style={{ fontSize: 13 }}>
            Your questions stay within the document context
          </p>
        </div>
      )}
 
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
 
      {loading && (
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          gap: 10, marginBottom: 16
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #7c6af7, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14
          }}>◈</div>
          <div style={{
            padding: '14px 18px',
            borderRadius: '18px 18px 18px 4px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: 'blink 1.2s ease infinite',
                  animationDelay: `${i * 0.2}s`
                }} />
              ))}
            </div>
          </div>
        </div>
      )}
 
      {error && (
        <div style={{
          margin: '8px 0 16px', padding: '12px 16px',
          borderRadius: 10,
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#f87171', fontSize: 13
        }}>
          ⚠ {error}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
 