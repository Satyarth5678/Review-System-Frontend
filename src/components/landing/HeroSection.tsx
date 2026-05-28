import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../navigation/Navbar'
import { TextRollButton } from '../ui/TextRollButton'
import { AIVerifiedIcon } from '../icons/AIVerifiedIcon'

export function HeroSection() {
  const [badgeHovered, setBadgeHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @keyframes meshOrb1 {
          0%   { transform: translate(0%,0%) scale(1); }
          25%  { transform: translate(12%,-18%) scale(1.25); }
          50%  { transform: translate(-8%,12%) scale(0.85); }
          75%  { transform: translate(15%,8%) scale(1.15); }
          100% { transform: translate(0%,0%) scale(1); }
        }
        @keyframes meshOrb2 {
          0%   { transform: translate(0%,0%) scale(1); }
          33%  { transform: translate(-15%,15%) scale(1.3); }
          66%  { transform: translate(12%,-12%) scale(0.8); }
          100% { transform: translate(0%,0%) scale(1); }
        }
        @keyframes meshOrb3 {
          0%   { transform: translate(0%,0%) scale(1); }
          40%  { transform: translate(8%,20%) scale(1.35); }
          80%  { transform: translate(-12%,-8%) scale(0.82); }
          100% { transform: translate(0%,0%) scale(1); }
        }
        @keyframes meshOrb4 {
          0%   { transform: translate(0%,0%) scale(1); }
          50%  { transform: translate(-18%,-15%) scale(1.2); }
          100% { transform: translate(0%,0%) scale(1); }
        }
        @keyframes meshOrb5 {
          0%   { transform: translate(0%,0%) scale(1); }
          30%  { transform: translate(20%,-10%) scale(1.4); }
          70%  { transform: translate(-10%,18%) scale(0.75); }
          100% { transform: translate(0%,0%) scale(1); }
        }
        @keyframes heroWordIn {
          from { transform: translateY(105%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes heroBounceIn {
          0%   { transform: translateY(24px); opacity: 0; }
          60%  { transform: translateY(-6px); opacity: 1; }
          80%  { transform: translateY(3px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes redLineMove {
          0%   { top: -10%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>

      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#EFEFEF',
          overflow: 'hidden',
        }}
      >
        {/* ── Prominent mesh gradient background ── */}
        <div
          data-speed="0.4"
          style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}
        >
          {/* Orb 1 — dominant orange, top-right */}
          <div style={{
            position: 'absolute',
            width: '80vw', height: '80vw',
            top: '-30vw', right: '-25vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, rgba(242,101,34,0.55) 0%, rgba(242,101,34,0.25) 35%, rgba(251,146,60,0.08) 60%, transparent 75%)',
            animation: 'meshOrb1 16s ease-in-out infinite',
            filter: 'blur(20px)',
          }} />

          {/* Orb 2 — warm peach, left-center */}
          <div style={{
            position: 'absolute',
            width: '65vw', height: '65vw',
            top: '5%', left: '-20vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 60% 50%, rgba(251,146,60,0.40) 0%, rgba(251,146,60,0.15) 40%, transparent 70%)',
            animation: 'meshOrb2 20s ease-in-out infinite',
            filter: 'blur(24px)',
          }} />

          {/* Orb 3 — bright cream center glow */}
          <div style={{
            position: 'absolute',
            width: '70vw', height: '70vw',
            top: '15%', left: '15%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.90) 0%, rgba(255,235,210,0.50) 35%, rgba(255,200,150,0.15) 60%, transparent 75%)',
            animation: 'meshOrb3 24s ease-in-out infinite',
            filter: 'blur(16px)',
          }} />

          {/* Orb 4 — deep orange, bottom-left */}
          <div style={{
            position: 'absolute',
            width: '55vw', height: '55vw',
            bottom: '-15vw', left: '-10vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 50% 50%, rgba(234,88,12,0.35) 0%, rgba(234,88,12,0.12) 45%, transparent 70%)',
            animation: 'meshOrb4 18s ease-in-out infinite',
            filter: 'blur(28px)',
          }} />

          {/* Orb 5 — accent orange, bottom-right */}
          <div style={{
            position: 'absolute',
            width: '50vw', height: '50vw',
            bottom: '-10vw', right: '-10vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 50% 50%, rgba(249,115,22,0.30) 0%, rgba(249,115,22,0.10) 45%, transparent 70%)',
            animation: 'meshOrb5 22s ease-in-out infinite',
            filter: 'blur(22px)',
          }} />

          {/* Subtle noise texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            opacity: 0.5,
          }} />

          {/* Slow-moving vertical red line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            width: 1.5,
            height: '35%',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(220,38,38,0.55) 30%, rgba(220,38,38,0.75) 50%, rgba(220,38,38,0.55) 70%, transparent 100%)',
            animation: 'redLineMove 6s ease-in-out infinite',
            filter: 'blur(0.5px)',
          }} />
        </div>

        {/* ── Navbar z-20 ── */}
        <div style={{ position: 'relative', zIndex: 20 }}>
          <Navbar />
        </div>

        {/* ── Spacer ── */}
        <div style={{ flex: 1 }} />

        {/* ── Hero content with parallax ── */}
        <div
          data-speed="0.85"
          style={{
            position: 'relative',
            zIndex: 20,
            maxWidth: 1440,
            margin: '0 auto',
            width: '100%',
            padding: 'clamp(20px,4vw,48px)',
            paddingBottom: 'clamp(56px,6vw,80px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Label — slight lag */}
          <p
            data-lag="0.15"
            style={{
              fontSize: 13,
              lineHeight: '14px',
              color: '#111827',
              letterSpacing: '0.05em',
              marginBottom: 'clamp(20px,3vw,32px)',
            }}
          >
            Lexa AI
          </p>

          {/* Headline — word-by-word slide-up animation */}
          <h1
            data-speed="0.92"
            style={{
              fontSize: 'clamp(1.75rem,7vw,4.2rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              fontWeight: 500,
              color: '#111827',
              margin: 0,
            }}
          >
            {[
              'AI-powered contract review',
              'and intelligent redlining',
              'for modern legal workflows.',
            ].map((line, lineIdx) => (
              <span
                key={lineIdx}
                style={{
                  display: 'block',
                  overflow: 'hidden',
                  paddingBottom: '0.12em', // prevents descender clipping
                }}
              >
                {line.split(' ').map((word, wordIdx, arr) => (
                  <span
                    key={wordIdx}
                    style={{
                      display: 'inline-block',
                      marginRight: wordIdx < arr.length - 1 ? '0.28em' : 0,
                      animation: `heroWordIn 700ms cubic-bezier(0.25,0.1,0.25,1) ${(lineIdx * 4 + wordIdx) * 75}ms both`,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {/* CTA row — bounce in after headline finishes */}
          {/* Each half is equal width so the seam between them sits exactly at left:50%
              where the red line travels — giving equal spacing on both sides */}
          <div
            data-lag="0.2"
            style={{
              marginTop: 'clamp(32px,4vw,48px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(16px,2.5vw,28px)',
              animation: 'heroBounceIn 700ms cubic-bezier(0.25,0.1,0.25,1) 900ms both',
            }}
          >
            {/* Left half — button right-aligned so its right edge approaches center */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <TextRollButton
                label="Start Reviewing"
                bgColor="#F26522"
                bgHoverColor="#e05a1a"
                arrowBg="#ffffff"
                arrowColor="#F26522"
                arrowSize={30}
                paddingLeft={20}
                paddingRight={8}
                fontSize={13}
                onClick={() => navigate('/dashboard')}
              />
            </div>

            {/* Right half — badge left-aligned so its left edge approaches center */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                onMouseEnter={() => setBadgeHovered(true)}
                onMouseLeave={() => setBadgeHovered(false)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  backgroundColor: '#ffffff', borderRadius: 4, padding: '8px 12px',
                  boxShadow: badgeHovered ? '0 4px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'box-shadow 300ms', cursor: 'default',
                }}
              >
                <AIVerifiedIcon style={{ width: 22, height: 22, color: '#E8704E' }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#111827', whiteSpace: 'nowrap' }}>AI Verified</span>
                <span style={{ fontSize: 10, backgroundColor: '#111827', color: '#fff', borderRadius: 4, padding: '2px 6px', whiteSpace: 'nowrap' }}>
                  Secure Platform
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
