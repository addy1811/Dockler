import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../context/themeContext'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function CheckItem({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--muted)' }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(79,255,176,0.15)', border: '1px solid var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, color: 'var(--accent)'
      }}>✓</div>
      {text}
    </div>
  )
}

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError(null)
    setTimeout(() => { setLoading(false); navigate('/app') }, 1200)
  }

  const handleGoogle = () => {
    window.location.href = '/api/auth/google'
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'stretch',
      position: 'relative', overflow: 'hidden'
    }}>
      <div className="signup-left" style={{
        flex: 1, background: 'linear-gradient(160deg,#0d1120 0%,#1a1040 50%,#0d1120 100%)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 56px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '20%', right: '-60px', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(108,99,255,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '25%', left: '-40px', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,255,176,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 60 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,var(--accent2),var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff', fontWeight: 800 }}>◈</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#e4e8f5' }}>Dockler</span>
        </div>

        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, color: '#e4e8f5', lineHeight: 1.2, marginBottom: 20 }}>
          Your documents,<br />
          <span style={{ background: 'linear-gradient(135deg,#4fffb0,#6c63ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>finally answerable.</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <CheckItem text="Upload PDFs up to 16MB" />
          <CheckItem text="Semantic search — understands meaning" />
          <CheckItem text="100% private — your data stays yours" />
          <CheckItem text="Free plan — no credit card needed" />
        </div>

        <div style={{
          position: 'absolute', bottom: 60, right: 40,
          background: 'rgba(20,24,40,0.9)', border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: 14, padding: '16px 20px', width: 200,
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: 10, color: 'rgba(79,255,176,0.8)', fontWeight: 700, marginBottom: 10, letterSpacing: '0.08em' }}>📄 CONTRACT.PDF</div>
          {[100, 80, 95, 65].map((w, i) => (
            <div key={i} style={{ height: 5, borderRadius: 3, marginBottom: 6, width: `${w}%`, background: i === 2 ? 'linear-gradient(90deg,#6c63ff,#4fffb0)' : 'rgba(255,255,255,0.08)' }} />
          ))}
          <div style={{ marginTop: 10, fontSize: 9, color: '#a78bfa', background: 'rgba(108,99,255,0.15)', borderRadius: 6, padding: '6px 8px' }}>💬 "Summarise termination clause"</div>
        </div>
      </div>

      <div style={{
        width: '100%', maxWidth: 480,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '48px 40px', position: 'relative'
      }}>
        <div onClick={toggleTheme} style={{
          position: 'absolute', top: 24, right: 24,
          width: 52, height: 28, background: 'var(--bg4)',
          border: '1px solid var(--border2)', borderRadius: 999, cursor: 'pointer'
        }}>
          <div style={{
            position: 'absolute', top: 3, left: 3, width: 22, height: 22,
            borderRadius: '50%', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
            transform: theme === 'light' ? 'translateX(24px)' : 'translateX(0)',
            transition: 'transform 0.45s cubic-bezier(.34,1.56,.64,1)'
          }}>{theme === 'dark' ? '☀️' : '🌙'}</div>
        </div>

        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Create your account</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>Start for free — no credit card required.</p>

        <button onClick={handleGoogle} style={{
          width: '100%', padding: '13px 20px', minHeight: 44,
          background: 'var(--bg3)', border: '1px solid var(--border2)',
          borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontSize: 15, fontWeight: 600, color: 'var(--text)',
          fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
          transition: 'all 0.2s ease', marginBottom: 24
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg3)'}
        >
          <GoogleIcon />
          Sign up with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>or with email</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13 }}>
              ⚠ {error}
            </div>
          )}

          {[
            { key: 'name', label: 'Full Name', type: 'text'},
            { key: 'email', label: 'Email', type: 'email'},
            { key: 'password', label: 'Password', type: 'password'},
            { key: 'confirm', label: 'Confirm Password', type: 'password'},
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
              <input
                type={type} value={form[key]} onChange={set(key)}
                placeholder={placeholder}
                style={{
                  width: '100%', padding: '14px 18px', minHeight: 44,
                  background: 'var(--bg3)', border: '1px solid var(--border2)',
                  borderRadius: 12, color: 'var(--text)',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 15, outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent2)'}
                onBlur={e => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>
          ))}

          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>
            By signing up, you agree to our{' '}
            <span style={{ color: 'var(--accent2)', cursor: 'pointer' }}>Terms of Service</span> and{' '}
            <span style={{ color: 'var(--accent2)', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '15px', minHeight: 44,
            background: loading ? 'var(--bg4)' : 'linear-gradient(135deg,var(--accent2),var(--accent))',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: 16, fontWeight: 700, fontFamily: 'Syne, sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(108,99,255,0.3)'
          }}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent2)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>

      <style>{`
        @media(max-width:768px) { .signup-left { display: none !important; } }
      `}</style>
    </div>
  )
}