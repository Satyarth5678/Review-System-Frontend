import { useEffect, useRef, useState } from 'react'

const DARK = '#111827'
const ease = 'cubic-bezier(0.25,0.1,0.25,1)'

/* ── Animated counter — replays on scroll ── */
function useReveal(threshold = 0.15) {
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

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const { ref, visible } = useReveal(0.3)
  const [prevVisible, setPrevVisible] = useState(visible)

  if (visible !== prevVisible) {
    setPrevVisible(visible)
    if (!visible) {
      setVal(0)
    }
  }

  useEffect(() => {
    if (!visible) return
    let start = 0
    const step = Math.ceil(to / 60)
    const id = setInterval(() => {
      start += step
      if (start >= to) { setVal(to); clearInterval(id) }
      else setVal(start)
    }, 16)
    return () => clearInterval(id)
  }, [visible, to])
  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {val}{suffix}
    </span>
  )
}

const STATS = [
  { value: 10, suffix: '', label: 'Processing Steps' },
  { value: 4,  suffix: '', label: 'AI Modules' },
  { value: 97, suffix: '%', label: 'Accuracy Rate' },
  { value: 3,  suffix: 's', label: 'Avg. Analysis Time' },
]

export function StatsSection() {
  const { ref, visible } = useReveal(0.2)

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: DARK,
        padding: 'clamp(56px,7vw,96px) clamp(20px,4vw,48px)',
        width: '100%',
      }}
    >
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'clamp(32px, 4vw, 48px)',
        textAlign: 'center',
      }}>
        {STATS.map((stat, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 600ms ${ease} ${i * 80}ms, transform 600ms ${ease} ${i * 80}ms`,
            }}
          >
            <div style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 500,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}>
              <Counter to={stat.value} suffix={stat.suffix} />
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.5)', fontWeight: 500 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
