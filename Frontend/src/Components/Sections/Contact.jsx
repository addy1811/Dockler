import { useState } from 'react'
import Tag from './Tag'

/* ── SVG Icons ── */
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}
function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
}
function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}
function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}

const CONTACT_INFO = [
  { Icon: MailIcon,    label: 'Email',    value: 'adityamewar061@gmail.com',          color: '#6c63ff', bg: 'rgba(108,99,255,0.12)',  border: 'rgba(108,99,255,0.25)' },
  { Icon: MapPinIcon,  label: 'Location', value: 'Dehradun, Uttarakhand, IN',  color: '#4fffb0', bg: 'rgba(79,255,176,0.10)',  border: 'rgba(79,255,176,0.22)' },
  { Icon: ClockIcon,   label: 'Response', value: 'Within 24 hours',            color: '#fbbf24', bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.22)' },
]

function Field({ label, type = 'text', placeholder, as, value, onChange }) {
  const [focused, setFocused] = useState(false)
  const baseStyle = {
    width: '100%',
    padding: '13px 16px',
    background: 'var(--bg3)',
    border: `1px solid ${focused ? 'var(--accent2)' : 'var(--border2)'}`,
    borderRadius: 12,
    color: 'var(--text)',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 0 3px rgba(108,99,255,0.12)' : 'none',
    resize: 'vertical',
    minHeight: as === 'textarea' ? 110 : 44,
  }
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      {as === 'textarea'
        ? <textarea placeholder={placeholder} value={value} onChange={onChange} style={baseStyle} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
        : <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={baseStyle} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      }
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    setTimeout(() => { setSending(false); setSent(true) }, 1200)
  }

  return (
    <section id="contact" style={{ padding: '100px 0', background: 'var(--bg2)', position: 'relative', overflow: 'hidden' }}>

      {/* bg glow */}
      <div style={{ position: 'absolute', bottom: '-5%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(108,99,255,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* section header */}
        <div className="dm-reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <Tag>Contact</Tag>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>
            Get in touch
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 440, margin: '0 auto' }}>
            Have questions or need a custom plan? I'll get back within 24 hours.
          </p>
        </div>

        <div className="dm-reveal" style={{ position: 'relative' }}>
          {[
            { top: -10, left: -10 },
            { top: -10, right: -10 },
            { bottom: -10, left: -10 },
            { bottom: -10, right: -10 },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', ...pos, zIndex: 2,
              color: 'var(--accent2)', opacity: 0.7,
            }}>
              <PlusIcon />
            </div>
          ))}

          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border2)',
            borderRadius: 24,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            overflow: 'hidden',
            boxShadow: '0 24px 64px var(--shadow)',
          }} className="contact-inner">

            <div style={{
              padding: '48px 40px',
              background: 'linear-gradient(160deg,var(--bg2) 0%,var(--bg3) 100%)',
              borderRight: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
                  I'm here to help
                </h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 36 }}>
                  Whether you're a lawyer, researcher, or Student — Dockler is built for you.
                </p>

                {/* contact info items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {CONTACT_INFO.map(({ Icon, label, value, color, bg, border }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: bg, border: `1px solid ${border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color,
                      }}>
                        <Icon />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div style={{ padding: '48px 40px' }}>
              {sent ? (
                <div style={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16,
                }}>
                  <div style={{ fontSize: 52 }}>✅</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>Message sent!</div>
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 280 }}>
                    Thanks for reaching out. I'll get back to you within 24 hours.
                  </p>
                  <button onClick={() => { setSent(false); setForm({ name:'',email:'',subject:'',message:'' }) }} style={{
                    marginTop: 8, padding: '10px 22px', borderRadius: 10,
                    border: '1px solid var(--border2)', background: 'transparent',
                    color: 'var(--muted)', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'Syne, sans-serif',
                  }}>Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>
                    Send me a message
                  </h3>

                  <Field label="Full Name" value={form.name} onChange={set('name')} />
                  <Field label="Email" type="email"  value={form.email} onChange={set('email')} />
                  <Field label="Message" as="textarea" placeholder="Tell me what you need..." value={form.message} onChange={set('message')} />

                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      width: '100%', minHeight: 48, padding: '14px 20px',
                      borderRadius: 12, fontSize: 15, fontWeight: 700,
                      fontFamily: 'Syne, sans-serif', cursor: sending ? 'not-allowed' : 'pointer',
                      border: 'none',
                      background: sending ? 'var(--bg4)' : 'linear-gradient(135deg,var(--accent2),var(--accent))',
                      color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.2s ease',
                      boxShadow: sending ? 'none' : '0 4px 20px rgba(108,99,255,0.3)',
                      marginTop: 4,
                    }}
                    onMouseEnter={e => { if (!sending) e.currentTarget.style.boxShadow = '0 8px 28px rgba(108,99,255,0.5)' }}
                    onMouseLeave={e => { if (!sending) e.currentTarget.style.boxShadow = '0 4px 20px rgba(108,99,255,0.3)' }}
                  >
                    {sending ? 'Sending…' : <><SendIcon /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}