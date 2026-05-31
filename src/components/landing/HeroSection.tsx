import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../navigation/Navbar'
import { TextRollButton } from '../ui/TextRollButton'
import { AIVerifiedIcon } from '../icons/AIVerifiedIcon'

const ORANGE = '#F26522'

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
        @keyframes scanSweep {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.65; }
          90% { opacity: 0.65; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes badgeShimmer {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.85); }
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

          {/* Horizontal scanner sweep line (behind text, low z-index) */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(to right, transparent, var(--c-orange) 50%, transparent)',
            boxShadow: '0 0 12px 2px var(--c-orange)',
            animation: 'scanSweep 8s linear infinite',
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
          {/* Pill label — styled like explore page "Interactive Deep Dive" */}
          <div
            data-lag="0.15"
            style={{
              marginBottom: 'clamp(20px,3vw,32px)',
              animation: 'heroBounceIn 700ms cubic-bezier(0.25,0.1,0.25,1) 0ms both',
            }}
          >
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(242,101,34,0.1)',
              color: ORANGE,
              borderRadius: 9999,
              padding: '5px 14px',
            }}>
              Next-Generation Contract Intelligence
            </span>
          </div>

          {/* Headline — word-by-word slide-up animation, "intelligent redlining" in orange */}
          <h1
            data-speed="0.92"
            style={{
              fontSize: 'clamp(2.1rem, 6.2vw, 4.6rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              fontWeight: 600,
              color: '#111827',
              margin: 0,
            }}
          >
            {[
              { text: 'AI-powered contract review', orangeWords: [] as string[] },
              { text: 'and intelligent redlining', orangeWords: ['intelligent', 'redlining'] },
              { text: 'for modern legal workflows.', orangeWords: [] as string[] },
            ].map((line, lineIdx) => (
              <span
                key={lineIdx}
                style={{
                  display: 'block',
                  overflow: 'hidden',
                  paddingBottom: '0.12em', // prevents descender clipping
                }}
              >
                {line.text.split(' ').map((word, wordIdx, arr) => (
                  <span
                    key={wordIdx}
                    style={{
                      display: 'inline-block',
                      marginRight: wordIdx < arr.length - 1 ? '0.28em' : 0,
                      animation: `heroWordIn 700ms cubic-bezier(0.25,0.1,0.25,1) ${(lineIdx * 4 + wordIdx) * 75}ms both`,
                      color: line.orangeWords.includes(word.replace(/[.,]/g, '')) ? ORANGE : undefined,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {/* CTA row — bounce in after headline finishes */}
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
                bgColor="#111827"
                bgHoverColor="#F26522"
                arrowBg="#ffffff"
                arrowColor="#111827"
                arrowSize={30}
                paddingLeft={20}
                paddingRight={8}
                fontSize={13}
                onClick={() => navigate('/dashboard')}
              />
            </div>

            {/* Right half — AI Verified badge with premium shimmer effect */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                onMouseEnter={() => setBadgeHovered(true)}
                onMouseLeave={() => setBadgeHovered(false)}
                style={{
                  position: 'relative',
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                  borderRadius: 8,
                  padding: '10px 16px',
                  boxShadow: badgeHovered
                    ? '0 8px 24px rgba(242,101,34,0.12), 0 2px 8px rgba(0,0,0,0.06)'
                    : '0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                  border: `1px solid ${badgeHovered ? 'rgba(242,101,34,0.25)' : 'rgba(0,0,0,0.06)'}`,
                  transition: 'all 300ms cubic-bezier(0.25,0.1,0.25,1)',
                  cursor: 'default',
                  overflow: 'hidden',
                }}
              >
                {/* Shimmer sweep */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '60%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                  animation: 'badgeShimmer 3s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
                {/* Live pulse dot */}
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  animation: 'livePulse 2s ease-in-out infinite',
                  flexShrink: 0,
                }} />
                <AIVerifiedIcon style={{ width: 20, height: 20, color: '#E8704E' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>AI Verified</span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  backgroundColor: '#111827',
                  color: '#fff',
                  borderRadius: 5,
                  padding: '3px 8px',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em',
                }}>
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
