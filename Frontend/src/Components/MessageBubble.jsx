export default function MessageBubble({ message }) {
    const isUser = message.role === 'user'
   
    return (
      <div
        className="animate-slide-in"
        style={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginBottom: 16,
          gap: 10,
          alignItems: 'flex-end'
        }}
      >
        {!isUser && (
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #7c6af7, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, marginBottom: 2
          }}>◈</div>
        )}
   
        <div style={{
          maxWidth: '72%',
          padding: isUser ? '12px 18px' : '16px 20px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isUser
            ? 'linear-gradient(135deg, #7c6af7, #6657e8)'
            : 'var(--bg3)',
          border: isUser ? 'none' : '1px solid var(--border)',
          color: isUser ? '#fff' : 'var(--text)',
          fontSize: 14,
          lineHeight: 1.65,
          boxShadow: isUser
            ? '0 4px 16px rgba(124,106,247,0.25)'
            : '0 2px 8px rgba(0,0,0,0.2)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {message.content}
   
          <div style={{
            marginTop: 6, fontSize: 11,
            color: isUser ? 'rgba(255,255,255,0.5)' : 'var(--text-dim)',
            textAlign: 'right'
          }}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
   
        {isUser && (
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'var(--bg3)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, marginBottom: 2
          }}>👤</div>
        )}
      </div>
    )
  }