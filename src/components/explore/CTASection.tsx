import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextRollButton } from '../ui/TextRollButton'

const ORANGE = '#F26522'
const DARK = '#111827'
const GRAY = '#6b7280'
const ease = 'cubic-bezier(0.25,0.1,0.25,1)'

function useReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { setVisible(e.isIntersecting) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function Pill({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
      textTransform: 'uppercase',
      backgroundColor: accent ? 'rgba(242,101,34,0.1)' : 'rgba(17,24,39,0.06)',
      color: accent ? ORANGE : DARK,
      borderRadius: 9999, padding: '4px 12px',
    }}>{label}</span>
  )
}

/* Word-by-word slide-up animation */
function AnimatedHeading({ text, visible, delay = 0 }: { text: string; visible: boolean; delay?: number }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <span
            style={{
              display: 'inline-block',
              transform: visible ? 'translateY(0)' : 'translateY(110%)',
              opacity: visible ? 1 : 0,
              transition: `transform 550ms ${ease} ${delay + i * 65}ms, opacity 450ms ease ${delay + i * 65}ms`,
            }}
          >
            {word}
          </span>
        </span>
      )).reduce<React.ReactNode[]>((acc, el, i) => {
        if (i > 0) acc.push(' ')
        acc.push(el)
        return acc
      }, [])}
    </>
  )
}

export function CTASection() {
  const navigate = useNavigate()
  const { ref, visible } = useReveal(0.2)

  return (
    <section ref={ref} style={{
      backgroundColor: '#ffffff', padding: 'clamp(64px,8vw,120px) clamp(20px,4vw,48px)',
    }}>
      <div style={{
        maxWidth: 800, margin: '0 auto', textAlign: 'center',
      }}>
        {/* Pill with fade-in */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 600ms ${ease}, transform 600ms ${ease}`,
        }}>
          <Pill label="Ready to start?" accent />
        </div>

        {/* Heading — word-by-word slide-up */}
        <h2 style={{
          fontSize: 'clamp(1.8rem,4vw,3.2rem)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: DARK,
          margin: '20px 0 16px',
          overflow: 'hidden',
        }}>
          <AnimatedHeading text="Put the pipeline to work" visible={visible} delay={100} />
          <br />
          <AnimatedHeading text="on your contracts" visible={visible} delay={400} />
        </h2>

        {/* Description — fade up */}
        <p style={{
          fontSize: 16, color: GRAY, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 36px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity 700ms ${ease} 600ms, transform 700ms ${ease} 600ms`,
        }}>
          Upload a contract and watch every step of the review pipeline execute in real time.
        </p>

        {/* CTA button — fade up */}
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity 700ms ${ease} 750ms, transform 700ms ${ease} 750ms`,
        }}>
          <TextRollButton
            label="Launch Workspace"
            bgColor={DARK}
            bgHoverColor={ORANGE}
            arrowBg="#ffffff"
            arrowColor={DARK}
            arrowSize={28}
            paddingLeft={24}
            paddingRight={8}
            fontSize={14}
            onClick={() => navigate('/dashboard')}
          />
        </div>
      </div>
    </section>
  )
}
