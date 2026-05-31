import { useEffect, useState } from 'react'
import { Navbar } from '../navigation/Navbar'

const ORANGE = '#F26522'
const DARK = '#111827'
const GRAY = '#6b7280'
const ease = 'cubic-bezier(0.25,0.1,0.25,1)'

function Pill({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      backgroundColor: accent ? 'rgba(242,101,34,0.1)' : 'rgba(17,24,39,0.06)',
      color: accent ? ORANGE : DARK,
      borderRadius: 9999,
      padding: '4px 12px',
    }}>{label}</span>
  )
}

export function HeroExplore() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#EFEFEF',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes exploreOrb1 {
          0%   { transform: translate(0%,0%) scale(1); }
          25%  { transform: translate(12%,-18%) scale(1.25); }
          50%  { transform: translate(-8%,12%) scale(0.85); }
          75%  { transform: translate(15%,8%) scale(1.15); }
          100% { transform: translate(0%,0%) scale(1); }
        }
        @keyframes exploreOrb2 {
          0%   { transform: translate(0%,0%) scale(1); }
          33%  { transform: translate(-15%,15%) scale(1.3); }
          66%  { transform: translate(12%,-12%) scale(0.8); }
          100% { transform: translate(0%,0%) scale(1); }
        }
        @keyframes exploreOrb3 {
          0%   { transform: translate(0%,0%) scale(1); }
          40%  { transform: translate(8%,20%) scale(1.35); }
          80%  { transform: translate(-12%,-8%) scale(0.82); }
          100% { transform: translate(0%,0%) scale(1); }
        }
        @keyframes exploreOrb4 {
          0%   { transform: translate(0%,0%) scale(1); }
          50%  { transform: translate(-18%,-15%) scale(1.2); }
          100% { transform: translate(0%,0%) scale(1); }
        }
        @keyframes exploreOrb5 {
          0%   { transform: translate(0%,0%) scale(1); }
          30%  { transform: translate(20%,-10%) scale(1.4); }
          70%  { transform: translate(-10%,18%) scale(0.75); }
          100% { transform: translate(0%,0%) scale(1); }
        }
        @keyframes exploreScanSweep {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.65; }
          90% { opacity: 0.65; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {/* Animated mesh gradient — same as landing page hero */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Orb 1 — dominant orange, top-right */}
        <div style={{
          position: 'absolute', width: '80vw', height: '80vw', top: '-30vw', right: '-25vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%,rgba(242,101,34,0.55) 0%,rgba(242,101,34,0.25) 35%,rgba(251,146,60,0.08) 60%,transparent 75%)',
          animation: 'exploreOrb1 16s ease-in-out infinite', filter: 'blur(20px)',
        }} />
        {/* Orb 2 — warm peach, left-center */}
        <div style={{
          position: 'absolute', width: '65vw', height: '65vw', top: '5%', left: '-20vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 60% 50%,rgba(251,146,60,0.40) 0%,rgba(251,146,60,0.15) 40%,transparent 70%)',
          animation: 'exploreOrb2 20s ease-in-out infinite', filter: 'blur(24px)',
        }} />
        {/* Orb 3 — bright cream center glow */}
        <div style={{
          position: 'absolute', width: '70vw', height: '70vw', top: '15%', left: '15%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%,rgba(255,255,255,0.90) 0%,rgba(255,235,210,0.50) 35%,rgba(255,200,150,0.15) 60%,transparent 75%)',
          animation: 'exploreOrb3 24s ease-in-out infinite', filter: 'blur(16px)',
        }} />
        {/* Orb 4 — deep orange, bottom-left */}
        <div style={{
          position: 'absolute', width: '55vw', height: '55vw', bottom: '-15vw', left: '-10vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%,rgba(234,88,12,0.35) 0%,rgba(234,88,12,0.12) 45%,transparent 70%)',
          animation: 'exploreOrb4 18s ease-in-out infinite', filter: 'blur(28px)',
        }} />
        {/* Orb 5 — accent orange, bottom-right */}
        <div style={{
          position: 'absolute', width: '50vw', height: '50vw', bottom: '-10vw', right: '-10vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%,rgba(249,115,22,0.30) 0%,rgba(249,115,22,0.10) 45%,transparent 70%)',
          animation: 'exploreOrb5 22s ease-in-out infinite', filter: 'blur(22px)',
        }} />
        {/* Horizontal scanner sweep line (behind text, low z-index) */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(to right, transparent, ${ORANGE} 50%, transparent)`,
          boxShadow: `0 0 12px 2px ${ORANGE}`,
          animation: 'exploreScanSweep 8s linear infinite',
          pointerEvents: 'none',
          zIndex: 2,
        }} />
      </div>

      {/* ── Navbar z-20 ── */}
      <div style={{ position: 'relative', zIndex: 20 }}>
        <Navbar />
      </div>

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Hero content ── */}
      <div style={{
        position: 'relative', zIndex: 10, maxWidth: 860, width: '100%',
        margin: '0 auto', padding: 'clamp(20px,4vw,48px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>
        <div style={{ marginBottom: 24, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 600ms ${ease}, transform 600ms ${ease}` }}>
          <Pill label="Interactive Deep Dive" accent />
        </div>
        <h1 style={{
          fontSize: 'clamp(2.1rem, 6.2vw, 4.6rem)', fontWeight: 600, lineHeight: 1.1,
          letterSpacing: '-0.03em', color: DARK, margin: '0 0 24px',
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)',
          transition: `opacity 700ms ${ease} 100ms, transform 700ms ${ease} 100ms`,
        }}>
          Explore How the<br />
          <span style={{ color: ORANGE }}>Review System</span> Works
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 1.9vw, 19px)', color: GRAY, lineHeight: 1.7, maxWidth: 600, margin: '0 auto 40px',
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity 700ms ${ease} 200ms, transform 700ms ${ease} 200ms`,
        }}>
          A cinematic walkthrough of the AI-powered backend — from contract upload to structured legal intelligence.
        </p>
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity 700ms ${ease} 300ms, transform 700ms ${ease} 300ms`,
        }}>
          <a href="#pipeline" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            backgroundColor: DARK, color: '#fff', borderRadius: 9999,
            padding: '12px 24px', fontSize: 14, fontWeight: 500, textDecoration: 'none',
            transition: `background-color 200ms ${ease}`,
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = ORANGE)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = DARK)}
            onMouseDown={e => (e.currentTarget.style.backgroundColor = '#d5531a')}
            onMouseUp={e => (e.currentTarget.style.backgroundColor = ORANGE)}
          >
            See the Pipeline
          </a>
          <a href="#tech-stack" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            backgroundColor: '#ffffff', color: DARK,
            border: '1px solid #e5e7eb', borderRadius: 9999,
            padding: '12px 24px', fontSize: 14, fontWeight: 500, textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            transition: `all 200ms ${ease}`,
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = ORANGE; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.boxShadow = '0 4px 12px rgba(242,101,34,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = DARK; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)' }}
            onMouseDown={e => { e.currentTarget.style.backgroundColor = '#d5531a'; e.currentTarget.style.borderColor = '#d5531a' }}
            onMouseUp={e => { e.currentTarget.style.backgroundColor = ORANGE; e.currentTarget.style.borderColor = ORANGE }}
          >
            Tech Stack
          </a>
        </div>
      </div>

      {/* ── Spacer ── */}
      <div style={{ flex: 1.3 }} />
    </section>
  )
}
