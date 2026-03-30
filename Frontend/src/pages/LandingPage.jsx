import { useEffect } from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Sections/Hero'
import Feature from '../Components/Sections/Feature'
import Testimonials from '../Components/Sections/Testimonials'
import Pricing from '../Components/Sections/Pricing'
import Contact from '../Components/Sections/Contact'
import Footer from '../Components/Sections/Footer'

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('dm-visible'), i * 90)
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.dm-reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function LandingPage() {
  useReveal()

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Navbar />

      <style>{`
        .dm-reveal { opacity:0; transform:translateY(28px); transition:opacity 0.6s ease, transform 0.6s ease; }
        .dm-visible { opacity:1 !important; transform:none !important; }
        .feat-card:hover { transform:translateY(-6px) scale(1.02); box-shadow:0 20px 50px var(--shadow); border-color:var(--accent2) !important; }
        .testi-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px var(--shadow); }
        .price-card:hover { transform:scale(1.05) translateY(-4px); box-shadow:0 24px 64px var(--shadow),0 0 40px var(--glow); }
        @media(max-width:1024px){ .features-grid{ grid-template-columns:repeat(2,1fr) !important; } .testi-grid{ grid-template-columns:repeat(2,1fr) !important; } .pricing-grid{ grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:768px){ .features-grid,.testi-grid,.pricing-grid{ grid-template-columns:1fr !important; } .hero-inner{ grid-template-columns:1fr !important; gap:40px !important; } .showcase-inner,.contact-inner{ grid-template-columns:1fr !important; gap:36px !important; } .scene-col{ display:none !important; } }
      `}</style>

      <Hero />
      <Feature />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />

      <style>{`@keyframes blink{0%,80%,100%{opacity:0.2}40%{opacity:1}}`}</style>
    </div>
  )
}