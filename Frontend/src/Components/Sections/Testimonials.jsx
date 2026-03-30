import Tag from './Tag'
const TESTIMONIALS = [
  {
    text: "Had a 300+ page contract and just needed one clause. Didn’t feel like scrolling forever — asked here and got it instantly. Saved me a lot of time.",
    name: "Arjun Mehta",
    role: "Corporate Lawyer, Delhi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    stars: 5,
  },
  {
    text: "I mostly use it for research papers. It’s actually helpful when I just want quick answers instead of reading everything line by line.",
    name: "Priya Sharma",
    role: "PhD Researcher, IIT Bombay",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    stars: 5,
  },
  {
    text: "We uploaded our HR policies and now people just ask the bot instead of messaging me all day. Makes things way easier.",
    name: "Rahul Gupta",
    role: "HR Manager, Bangalore",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    stars: 4,
  },
  {
    text: "Tried searching for something vague and it still found the right sections. Didn’t expect it to understand context that well.",
    name: "Sneha Iyer",
    role: "Legal Counsel, Mumbai",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    stars: 5,
  },
  {
    text: "I deal with long reports daily, so this helps me jump directly to what I need. Especially useful during deadlines.",
    name: "Vikram Nair",
    role: "Chartered Accountant, Pune",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    stars: 4,
  },
  {
    text: "We started using it for compliance docs and it actually reduced the back-and-forth in the team. Less manual checking now.",
    name: "Meera Krishnan",
    role: "Compliance Head, Chennai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    stars: 5,
  },
  {
    text: "Used it while studying law — makes finding sections way faster. Not perfect, but definitely helpful.",
    name: "Aditya Rao",
    role: "Law Student, NLU Delhi",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    stars: 5,
  },
  {
    text: "We liked the fact that documents stay private. That was a big concern for us before trying it.",
    name: "Rohan Kapoor",
    role: "CTO, LegalTech Startup",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    stars: 5,
  },
  {
    text: "Setup was simple. Uploaded a doc and started asking questions right away. Didn’t need much explanation.",
    name: "Ananya Das",
    role: "ML Engineer, Hyderabad",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    stars: 4,
  },
];

const col1 = TESTIMONIALS.slice(0, 3)
const col2 = TESTIMONIALS.slice(3, 6)
const col3 = TESTIMONIALS.slice(6, 9)

function Stars({ count }) {
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
          fill={i <= count ? '#fbbf24' : 'none'}
          stroke={i <= count ? '#fbbf24' : 'var(--border2)'}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function TestiCard({ t }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: '28px 24px',
      maxWidth: 300,
      width: '100%',
      marginBottom: 20,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
        e.currentTarget.style.boxShadow = '0 20px 48px var(--shadow)'
        e.currentTarget.style.borderColor = 'var(--border2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      <Stars count={t.stars} />
      <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>
        "{t.text}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img
          src={t.avatar}
          alt={t.name}
          width={40} height={40}
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border2)' }}
        />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>{t.name}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{t.role}</div>
        </div>
      </div>
    </div>
  )
}

function ScrollColumn({ testimonials, duration, hidden }) {
  /* duplicate cards for seamless loop */
  const doubled = [...testimonials, ...testimonials]

  return (
    <div style={{
      display: hidden ? 'none' : 'block',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        animation: `scrollUp ${duration}s linear infinite`,
      }}>
        {doubled.map((t, i) => (
          <TestiCard key={i} t={t} />
        ))}
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ padding: '100px 0', background: 'var(--bg2)', position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @keyframes scrollUp {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        .testi-col-2 { display: none; }
        .testi-col-3 { display: none; }
        @media(min-width: 768px)  { .testi-col-2 { display: block !important; } }
        @media(min-width: 1024px) { .testi-col-3 { display: block !important; } }
      `}</style>

      {/* subtle bg glow */}
      <div style={{
        position: 'absolute', top: '20%', right: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(108,99,255,0.06) 0%,transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* header */}
        <div className="dm-reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <Tag>Testimonials</Tag>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem,4vw,3rem)',
            fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            Loved by professionals
            <br />
            <span style={{ color: 'var(--accent3, #f472b6)' }}>who read a lot</span>
          </h2>
        </div>

        {/* scrolling columns — fade top & bottom */}
        <div style={{
          display: 'flex',
          gap: 20,
          justifyContent: 'center',
          maxHeight: 700,
          overflow: 'hidden',
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}>
          {/* col 1 — always visible */}
          <ScrollColumn testimonials={col1} duration={18} hidden={false} />

          {/* col 2 — tablet+ */}
          <div className="testi-col-2">
            <ScrollColumn testimonials={col2} duration={22} hidden={false} />
          </div>

          {/* col 3 — desktop+ */}
          <div className="testi-col-3">
            <ScrollColumn testimonials={col3} duration={20} hidden={false} />
          </div>
        </div>

      </div>
    </section>
  )
}