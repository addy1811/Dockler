export default function Tag({ children }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--bg3)',
        border: '1px solid var(--border2)',
        borderRadius: 999,
        padding: '6px 14px',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--accent)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 20,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
      {children}
    </div>
  )
}
