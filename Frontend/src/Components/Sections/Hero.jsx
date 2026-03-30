import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/* ─── particle canvas hook ─── */
function useParticleCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let rafId
    let particles = []
    const mouse = { x: null, y: null, radius: 180 }

    class Particle {
      constructor(x, y, dx, dy, size) {
        this.x = x; this.y = y
        this.dx = dx; this.dy = dy
        this.size = size
        this.color = 'rgba(108,99,255,0.75)'
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
      update() {
        if (this.x > canvas.width || this.x < 0) this.dx = -this.dx
        if (this.y > canvas.height || this.y < 0) this.dy = -this.dy
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x, dy = mouse.y - this.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < mouse.radius + this.size) {
            const f = (mouse.radius - dist) / mouse.radius
            this.x -= (dx / dist) * f * 4
            this.y -= (dy / dist) * f * 4
          }
        }
        this.x += this.dx; this.y += this.dy
        this.draw()
      }
    }

    function init() {
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 10000)
      for (let i = 0; i < count; i++) {
        const s = Math.random() * 1.8 + 0.6
        particles.push(new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          s
        ))
      }
    }

    function connect() {
      const threshold = (canvas.width / 7) * (canvas.height / 7)
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const dist2 = dx * dx + dy * dy
          if (dist2 < threshold) {
            const opacity = 1 - dist2 / 20000
            const nearMouse = mouse.x !== null && Math.sqrt(
              (particles[a].x - mouse.x) ** 2 + (particles[a].y - mouse.y) ** 2
            ) < mouse.radius
            ctx.strokeStyle = nearMouse
              ? `rgba(79,255,176,${opacity * 0.6})`
              : `rgba(108,99,255,${opacity * 0.35})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    function animate() {
      rafId = requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => p.update())
      connect()
    }

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      init()
    }

    const onMouseMove = e => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onMouseLeave = () => { mouse.x = null; mouse.y = null }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    animate()
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [canvasRef])
}

/* ─── floating chat mock ─── */
function ChatMock() {
  const messages = [
    { role: 'user', text: 'What is the penalty under Section 379 IPC?' },
    { role: 'ai',   text: 'Section 379 IPC prescribes imprisonment up to 3 years, or fine, or both for theft.' },
    { role: 'user', text: 'Summarise the termination clause.' },
  ]

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border2)',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 32px 80px var(--shadow), 0 0 0 1px rgba(108,99,255,0.15)',
      width: '100%',
      maxWidth: 460,
      animation: 'floatY 4s ease-in-out infinite',
    }}>
      {/* title bar */}
      <div style={{
        background: 'var(--bg3)',
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {['#ff5f57','#febc2e','#28c840'].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <span style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>
          Dockler — contract.pdf
        </span>
      </div>

      {/* messages */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            padding: '11px 14px',
            borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
            background: m.role === 'user'
              ? 'linear-gradient(135deg,var(--accent2),#8b5cf6)'
              : 'var(--bg3)',
            border: m.role === 'ai' ? '1px solid var(--border)' : 'none',
            color: m.role === 'user' ? '#fff' : 'var(--text)',
            fontSize: 12, lineHeight: 1.55,
            maxWidth: '82%',
            marginLeft: m.role === 'user' ? 'auto' : 0,
          }}>{m.text}</div>
        ))}

        {/* typing indicator */}
        <div style={{
          display: 'flex', gap: 5, alignItems: 'center',
          padding: '11px 14px',
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: '14px 14px 14px 2px',
          width: 60,
        }}>
          {[0,1,2].map(i => (
            <span key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--accent2)', display: 'block',
              animation: `blink 1.2s ${i * 0.2}s ease-in-out infinite`,
            }} />
          ))}
        </div>
      </div>

      {/* input bar */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '12px 16px',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <div style={{
          flex: 1, height: 36, borderRadius: 10,
          background: 'var(--bg4)', border: '1px solid var(--border2)',
          display: 'flex', alignItems: 'center', padding: '0 12px',
          fontSize: 12, color: 'var(--dim)',
        }}>Ask anything about this document…</div>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg,var(--accent2),var(--accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, cursor: 'pointer',
        }}>↑</div>
      </div>
    </div>
  )
}

/* ─── main Hero ─── */
export default function Hero() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  useParticleCanvas(canvasRef)

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      paddingTop: 68,
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      {/* Particle canvas — full section bg */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        opacity: 0.55,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 60% at 60% 40%, rgba(108,99,255,0.08) 0%, transparent 65%)',
      }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px', width: '100%',
        position: 'relative', zIndex: 2,
      }}>
        <div className="hero-inner" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64, alignItems: 'center',
          padding: '80px 0',
        }}>
          <div className="dm-reveal">
            <h1 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(2.4rem,5vw,4.2rem)',
              fontWeight: 800, lineHeight: 1.06,
              letterSpacing: '-0.03em', marginBottom: 24,
            }}>
              Find answers in your<br />
              <span style={{
                background: 'linear-gradient(135deg,var(--accent) 0%,var(--accent2) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>documents.</span><br />
              easily
            </h1>

            <p style={{
              fontSize: 17, color: 'var(--muted)',
              lineHeight: 1.75, marginBottom: 40, maxWidth: 460,
            }}>
              Upload any PDF and ask natural language questions. Dockler finds exact answers buried in hundreds of pages in seconds.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  background: 'linear-gradient(135deg,var(--accent2),var(--accent))',
                  color: '#fff', border: 'none', borderRadius: 12,
                  padding: '14px 28px', fontSize: 15, fontWeight: 700,
                  fontFamily: 'Syne, sans-serif', cursor: 'pointer',
                  minHeight: 48,
                  boxShadow: '0 4px 20px rgba(108,99,255,0.35)',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 10px 32px rgba(108,99,255,0.55)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(108,99,255,0.35)'
                }}
              >
                Get Started Free →
              </button>

              <button
                onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: 'var(--bg3)', color: 'var(--text)',
                  border: '1px solid var(--border2)', borderRadius: 12,
                  padding: '14px 28px', fontSize: 15, fontWeight: 600,
                  fontFamily: 'Syne, sans-serif', cursor: 'pointer',
                  minHeight: 48, transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              >
                See Demo
              </button>
            </div>

            {/* stats */}
            <div style={{
              display: 'flex', gap: 40, flexWrap: 'wrap',
              marginTop: 48, paddingTop: 48,
              borderTop: '1px solid var(--border)',
            }}>
              {[['500+','Pages handled'],['3s','Avg answer time'],['99%','Context accuracy']].map(([n,l]) => (
                <div key={l}>
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontSize: 30,
                    fontWeight: 800, color: 'var(--accent)',
                  }}>{n}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: floating chat mock ── */}
          <div className="scene-col dm-reveal" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChatMock />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.4); }
        }
        @keyframes blink {
          0%,80%,100% { opacity:0.2; transform:scale(0.85); }
          40%          { opacity:1;   transform:scale(1.1); }
        }
      `}</style>
    </section>
  )
}