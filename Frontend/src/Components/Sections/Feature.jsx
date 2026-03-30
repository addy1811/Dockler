import { useState, useRef, useEffect } from 'react'
import Tag from './Tag'

/* ── SVG icons (no external dep) ── */
const Icons = {
  Search: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Zap: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Brain: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-3 2.5 2.5 0 0 1 .98-4.79m0 0a2.5 2.5 0 0 1 3.13-3.13M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-3 2.5 2.5 0 0 0-.98-4.79m0 0a2.5 2.5 0 0 0-3.13-3.13"/>
    </svg>
  ),
  Database: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>
    </svg>
  ),
  History: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
      <path d="M12 7v5l4 2"/>
    </svg>
  ),
  Lock: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
}

const FEATURES = [
  {
    Icon: Icons.Search,
    color: '#6c63ff',
    bg: 'rgba(108,99,255,0.12)',
    border: 'rgba(108,99,255,0.25)',
    title: 'Semantic Search',
    desc: 'Finds meaning, not just keywords. Ask about "car" and it finds "automobile" — powered by SentenceTransformer embeddings.',
    stat: '10×', statLabel: 'faster than keyword search',
  },
  {
    Icon: Icons.Zap,
    color: '#4fffb0',
    bg: 'rgba(79,255,176,0.10)',
    border: 'rgba(79,255,176,0.22)',
    title: 'Instant Chunking',
    desc: 'Splits large PDFs into 500-char overlapping chunks with context preserved. Even 1,000-page docs work perfectly.',
    stat: '< 3s', statLabel: 'avg. indexing time',
  },
  {
    Icon: Icons.Brain,
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.10)',
    border: 'rgba(251,191,36,0.22)',
    title: 'Gemini AI Answers',
    desc: 'Gemini 2.5 Flash generates answers strictly from your document — no hallucinated outside knowledge.',
    stat: '99%', statLabel: 'context accuracy',
  },
  {
    Icon: Icons.Database,
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.10)',
    border: 'rgba(244,114,182,0.22)',
    title: 'Vector Store',
    desc: 'ChromaDB persists your embeddings to disk. Server restarts never lose your indexed documents.',
    stat: '∞', statLabel: 'docs stored',
  },
  {
    Icon: Icons.History,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.10)',
    border: 'rgba(52,211,153,0.22)',
    title: 'Chat History',
    desc: 'Every question and answer is saved to PostgreSQL so you can resume exactly where you left off.',
    stat: '500+', statLabel: 'pages per session',
  },
  {
    Icon: Icons.Lock,
    color: '#f87171',
    bg: 'rgba(239,68,68,0.10)',
    border: 'rgba(239,68,68,0.22)',
    title: 'Private by Default',
    desc: 'Your documents never train any model. Stored in your own infrastructure and fully under your control.',
    stat: '0', statLabel: 'data shared externally',
  },
]

function FeatureCard({ feature }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef(null)

  const onMouseMove = e => {
    const r = cardRef.current.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: 'var(--card-bg)',
        border: `1px solid ${hovered ? feature.border : 'var(--border)'}`,
        borderRadius: 20,
        padding: 28,
        overflow: 'hidden',
        transition: 'transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s ease, border-color 0.3s ease',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'none',
        boxShadow: hovered ? `0 20px 50px var(--shadow), 0 0 0 1px ${feature.border}` : 'none',
        cursor: 'default',
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute',
          left: pos.x - 80, top: pos.y - 80,
          width: 160, height: 160,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${feature.color}22 0%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'opacity 0.2s',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        {/* Icon box */}
        <div style={{
          width: 48, height: 48, borderRadius: 13,
          background: feature.bg,
          border: `1px solid ${feature.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: feature.color,
          transition: 'transform 0.3s ease',
          transform: hovered ? 'scale(1.1) rotate(-4deg)' : 'none',
        }}>
          <feature.Icon />
        </div>
        <div style={{
          textAlign: 'right',
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.3s',
        }}>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800,
            color: feature.color, lineHeight: 1,
          }}>{feature.stat}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3, maxWidth: 80, textAlign: 'right' }}>
            {feature.statLabel}
          </div>
        </div>
      </div>

      <div style={{
        fontSize: 17, fontWeight: 700,
        fontFamily: 'Syne, sans-serif',
        color: 'var(--text)',
        marginBottom: 10,
        transition: 'color 0.2s',
      }}>
        {feature.title}
      </div>

      <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7 }}>
        {feature.desc}
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
        opacity: hovered ? 0.6 : 0,
        transition: 'opacity 0.3s ease',
      }} />
    </div>
  )
}

export default function Feature() {
  return (
    <section id="features" style={{ padding: '100px 0', background: 'var(--bg2)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        <div className="dm-reveal" style={{ marginBottom: 60 }}>
          <Tag>Features</Tag>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem,4vw,3rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            lineHeight: 1.1, marginBottom: 16,
          }}>
            Everything you need to
            <br />
            <span style={{ color: 'var(--accent)' }}>master any document</span>
          </h2>
        </div>

        <div className="features-grid dm-reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}>
          {FEATURES.map(f => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>

      </div>
    </section>
  )
}