import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/themeContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const scrollTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: theme === 'dark' ? 'rgba(8,11,20,0.80)' : 'rgba(240,244,255,0.88)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.4s ease'
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onClick={() => navigate('/')}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: '#fff', fontWeight: 800,
              boxShadow: '0 4px 14px var(--glow)'
            }}>◈</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text)' }}>
              Dockler
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop-links">
            {['features', 'showcase', 'pricing', 'contact'].map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--muted)', fontSize: 14, fontWeight: 500,
                padding: '8px 14px', borderRadius: 8, fontFamily: 'DM Sans, sans-serif',
                transition: 'color 0.2s, background 0.2s', textTransform: 'capitalize'
              }}
                onMouseEnter={e => { e.target.style.color = 'var(--text)'; e.target.style.background = 'var(--bg3)' }}
                onMouseLeave={e => { e.target.style.color = 'var(--muted)'; e.target.style.background = 'none' }}
              >{id}</button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div onClick={toggleTheme} style={{
              width: 52, height: 28, background: 'var(--bg4)',
              border: '1px solid var(--border2)', borderRadius: 999,
              position: 'relative', cursor: 'pointer', flexShrink: 0
            }}>
              <div style={{
                position: 'absolute', top: 3, left: 3, width: 22, height: 22,
                borderRadius: '50%', background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                transform: theme === 'light' ? 'translateX(24px)' : 'translateX(0)',
                transition: 'transform 0.45s cubic-bezier(.34,1.56,.64,1)'
              }}>{theme === 'dark' ? '☀️' : '🌙'}</div>
            </div>

            <button onClick={() => navigate('/signup')} className="nav-desktop-links" style={{
              background: 'var(--accent)', color: '#0a0f1a',
              border: 'none', borderRadius: 10, padding: '10px 20px',
              fontSize: 14, fontWeight: 700, fontFamily: 'Syne, sans-serif',
              cursor: 'pointer', minHeight: 44, transition: 'all 0.2s ease'
            }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 20px var(--glow)' }}
              onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none' }}
            >Get Started</button>

            <button onClick={() => setMenuOpen(o => !o)} style={{
              display: 'none', flexDirection: 'column', gap: 5,
              background: 'none', border: 'none', cursor: 'pointer', padding: 8
            }} className="hamburger-btn" aria-label="Menu">
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block', width: 22, height: 2,
                  background: 'var(--text)', borderRadius: 2,
                  transition: 'all 0.3s ease',
                  transform: menuOpen
                    ? i === 0 ? 'translateY(7px) rotate(45deg)'
                    : i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'none'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1
                }} />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, zIndex: 99,
          background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          padding: '16px 24px 24px'
        }}>
          {['features', 'showcase', 'pricing', 'contact'].map(id => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              display: 'block', width: '100%', textAlign: 'left',
              background: 'none', border: 'none', borderBottom: '1px solid var(--border)',
              color: 'var(--text)', padding: '14px 0', fontSize: 18,
              fontWeight: 600, fontFamily: 'Syne, sans-serif', cursor: 'pointer',
              textTransform: 'capitalize'
            }}>{id}</button>
          ))}
          <button onClick={() => { navigate('/signup'); setMenuOpen(false) }} style={{
            marginTop: 16, width: '100%', padding: '14px',
            background: 'var(--accent)', color: '#0a0f1a',
            border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700,
            fontFamily: 'Syne, sans-serif', cursor: 'pointer', minHeight: 44
          }}>Get Started</button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}