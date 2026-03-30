import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tag from './Tag'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function BillingToggle({ cycle, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 56 }}>
      <span style={{
        fontSize: 15, fontWeight: 600,
        color: cycle === 'monthly' ? 'var(--text)' : 'var(--muted)',
        transition: 'color 0.3s'
      }}>Monthly</span>

      <div
        onClick={() => onChange(cycle === 'monthly' ? 'yearly' : 'monthly')}
        style={{
          width: 52, height: 28,
          background: 'var(--bg4)',
          border: '1px solid var(--border2)',
          borderRadius: 999,
          position: 'relative',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 3, left: 3,
          width: 22, height: 22,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
          boxShadow: '0 2px 8px var(--glow)',
          transform: cycle === 'yearly' ? 'translateX(24px)' : 'translateX(0)',
          transition: 'transform 0.45s cubic-bezier(.34,1.56,.64,1)',
        }} />
      </div>

      <span style={{
        fontSize: 15, fontWeight: 600,
        color: cycle === 'yearly' ? 'var(--text)' : 'var(--muted)',
        transition: 'color 0.3s'
      }}>Yearly</span>

      <span style={{
        fontSize: 12, fontWeight: 700,
        color: 'var(--accent)',
        background: 'rgba(79,255,176,0.1)',
        border: '1px solid rgba(79,255,176,0.25)',
        borderRadius: 999,
        padding: '3px 10px',
        letterSpacing: '0.04em'
      }}>Save 20%</span>
    </div>
  )
}

const PLANS = [
  {
    name: 'Starter',
    price: { monthly: '₹0', yearly: '₹0' },
    period: '/mo',
    desc: 'Perfect for individuals trying out document AI for the first time.',
    features: ['5 documents / month', '16 MB max file size', '50 questions / day', '7-day chat history'],
    featured: false,
  },
  {
    name: 'Pro',
    price: { monthly: '₹499', yearly: '₹399' },
    period: '/mo',
    desc: 'For professionals who work with large documents daily.',
    features: ['Unlimited documents', '50 MB max file size', 'Unlimited questions', 'Permanent chat history', 'Priority Gemini API'],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: 'Custom', yearly: 'Custom' },
    period: '',
    desc: 'Self-hosted deployment with your own infrastructure and API keys.',
    features: ['Self-hosted on your servers', 'No file-size limits', 'Team collaboration', 'Custom integrations', 'SLA + dedicated support'],
    featured: false,
  },
]

function PlanCard({ plan, cycle, navigate }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        border: plan.featured
          ? '1px solid var(--accent2)'
          : '1px solid var(--border)',
        background: plan.featured ? 'var(--bg2)' : 'var(--card-bg)',
        boxShadow: hovered
          ? plan.featured
            ? '0 0 0 1px var(--accent2), 0 28px 64px var(--shadow), 0 0 48px var(--glow)'
            : '0 20px 56px var(--shadow)'
          : plan.featured
          ? '0 0 0 1px var(--accent2), 0 12px 36px var(--shadow)'
          : 'none',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'none',
        transition: 'transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Aurora glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        opacity: hovered ? (plan.featured ? 0.18 : 0.10) : 0,
        background: plan.featured
          ? 'linear-gradient(45deg, #8A2BE2, #4A00E0)'
          : 'linear-gradient(45deg, #0077ff, #00ff77)',
        filter: 'blur(50px)',
        transition: 'opacity 0.5s ease',
      }} />

      {/* Badge */}
      {plan.featured && (
        <div style={{
          position: 'absolute', top: 0, right: 0, zIndex: 3,
          fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
          color: '#0a0f1a', background: 'var(--accent2)',
          padding: '6px 14px', borderBottomLeftRadius: 12,
        }}>MOST POPULAR</div>
      )}

      {/* Body */}
      <div style={{ position: 'relative', zIndex: 2, padding: '24px 28px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text)', marginBottom: 10 }}>
          {plan.name}
        </div>

        <div style={{ marginBottom: 12 }}>
          <span
            key={cycle + plan.name}
            style={{
              fontSize: 42, fontWeight: 800,
              fontFamily: 'Syne, sans-serif',
              color: 'var(--accent)',
              display: 'inline-block',
              animation: 'priceIn 0.3s ease',
            }}
          >
            {plan.price[cycle]}
          </span>
          {plan.period && (
            <span style={{ fontSize: 15, color: 'var(--muted)', fontWeight: 400, marginLeft: 4 }}>
              {plan.period}
            </span>
          )}
        </div>

        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 20 }}>
          {plan.desc}
        </p>

        <ul style={{ listStyle: 'none', flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {plan.features.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
              <span style={{ color: 'var(--accent2)', flexShrink: 0 }}><CheckIcon /></span>
              {f}
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate('/signup')}
          style={{
            width: '100%', minHeight: 48, padding: '14px 20px',
            borderRadius: 14, fontSize: 15, fontWeight: 700,
            fontFamily: 'Syne, sans-serif', cursor: 'pointer',
            border: plan.featured ? 'none' : '1px solid var(--border2)',
            background: plan.featured
              ? 'linear-gradient(135deg, var(--accent2), var(--accent))'
              : 'transparent',
            color: plan.featured ? '#fff' : 'var(--text)',
            transition: 'all 0.2s ease',
            boxShadow: plan.featured ? '0 4px 20px rgba(108,99,255,0.3)' : 'none',
          }}
          onMouseEnter={e => {
            if (!plan.featured) { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--accent2)' }
            else { e.currentTarget.style.boxShadow = '0 8px 32px rgba(108,99,255,0.5)' }
          }}
          onMouseLeave={e => {
            if (!plan.featured) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border2)' }
            else { e.currentTarget.style.boxShadow = '0 4px 20px rgba(108,99,255,0.3)' }
          }}
        >
          {plan.name === 'Enterprise' ? 'Contact Sales' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default function Pricing() {
  const navigate = useNavigate()
  const [cycle, setCycle] = useState('monthly')

  return (
    <section id="pricing" style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Aurora blobs */}
      <div style={{
        position: 'absolute', top: '10%', left: '10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'rgba(0,128,255,0.06)', filter: 'blur(100px)',
        pointerEvents: 'none', animation: 'auroraMove1 20s infinite alternate ease-in-out',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 420, height: 420, borderRadius: '50%',
        background: 'rgba(108,99,255,0.08)', filter: 'blur(100px)',
        pointerEvents: 'none', animation: 'auroraMove2 25s infinite alternate ease-in-out',
      }} />

      <style>{`
        @keyframes auroraMove1 { from{transform:translate(0,0) rotate(0deg)} to{transform:translate(80px,40px) rotate(180deg)} }
        @keyframes auroraMove2 { from{transform:translate(0,0) rotate(0deg)} to{transform:translate(-80px,-40px) rotate(-180deg)} }
        @keyframes priceIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div className="dm-reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <Tag>Pricing</Tag>
          <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 440, margin: '0 auto' }}>
            Start free. Scale as your document library grows.
          </p>
        </div>

        <div className="dm-reveal">
          <BillingToggle cycle={cycle} onChange={setCycle} />
        </div>

        <div
          className="pricing-grid dm-reveal"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, alignItems: 'start' }}
        >
          {PLANS.map(plan => (
            <PlanCard key={plan.name} plan={plan} cycle={cycle} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  )
}