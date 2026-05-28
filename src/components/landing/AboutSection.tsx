import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextRollButton } from '../ui/TextRollButton'
import { ShieldAlert, FileEdit, BookOpen, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react'
import { useWindowWidth } from '../../hooks/useWindowWidth'

const PX = 'clamp(20px,4vw,48px)'

const FEATURES = [
  {
    icon: ShieldAlert,
    tag: '01',
    title: 'AI Contract Risk Detection',
    description:
      'Instantly surface high-risk clauses, termination liabilities, indemnification traps, and compliance gaps across any contract type.',
    accent: '#F26522',
    bullets: ['Clause-level risk scoring', 'Jurisdiction-aware analysis', 'Real-time flagging'],
  },
  {
    icon: FileEdit,
    tag: '02',
    title: 'Intelligent Redlining & Recommendations',
    description:
      'Generate balanced redline suggestions and counter-proposals grounded in market standards and your firm\u2019s playbook.',
    accent: '#111827',
    bullets: ['Negotiation-ready edits', 'Playbook alignment', 'Side-by-side diff view'],
  },
  {
    icon: BookOpen,
    tag: '03',
    title: 'Interactive AI-Powered PDF Workspace',
    description:
      'Chat with any contract directly. Ask questions, extract key terms, and get instant answers without leaving the document.',
    accent: '#F26522',
    bullets: ['Natural language Q&A', 'Key term extraction', 'Multi-document context'],
  },
]

/* ── Interactive contract review widget ── */
const CLAUSES = [
  {
    text: 'Either party may terminate this agreement at any time without cause.',
    risk: 'high' as const,
    suggestion: 'Add 30-day written notice requirement and mutual consent clause.',
  },
  {
    text: 'Liability of either party shall be unlimited under all circumstances.',
    risk: 'high' as const,
    suggestion: 'Cap liability at total fees paid in the preceding 12 months.',
  },
  {
    text: 'Payment terms are Net-60 with no late fee provisions.',
    risk: 'medium' as const,
    suggestion: 'Reduce to Net-30 and add 1.5%/month late fee after 15 days.',
  },
  {
    text: 'Governing law shall be the laws of the State of Delaware.',
    risk: 'low' as const,
    suggestion: 'Clause is standard. No changes recommended.',
  },
]

function riskBadge(risk: 'high' | 'medium' | 'low') {
  const map = {
    high: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'High Risk' },
    medium: { bg: 'rgba(242,101,34,0.1)', color: '#F26522', label: 'Medium Risk' },
    low: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', label: 'Low Risk' },
  }
  return map[risk]
}

function ContractWidget() {
  const [active, setActive] = useState(0)
  const [accepted, setAccepted] = useState<Set<number>>(new Set())
  const clause = CLAUSES[active]
  const badge = riskBadge(clause.risk)
  const isAccepted = accepted.has(active)

  const handleAccept = () => {
    setAccepted(prev => new Set([...prev, active]))
    if (active < CLAUSES.length - 1) {
      setTimeout(() => setActive(a => a + 1), 400)
    }
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #f3f4f6',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
      userSelect: 'none',
      maxWidth: 460,
    }}>
      {/* Header */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F26522' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
        </div>
        <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500 }}>contract_review.pdf</span>
        <span style={{ fontSize: 10, color: '#9ca3af' }}>{active + 1}/{CLAUSES.length}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, backgroundColor: '#f3f4f6' }}>
        <div style={{ height: '100%', width: `${(accepted.size / CLAUSES.length) * 100}%`, backgroundColor: '#22c55e', transition: 'width 400ms ease' }} />
      </div>

      {/* Clause tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
        {CLAUSES.map((c, i) => {
          const b = riskBadge(c.risk)
          const done = accepted.has(i)
          return (
            <button key={i} onClick={() => setActive(i)} style={{ flex: 1, padding: '8px 4px', border: 'none', borderBottom: active === i ? `2px solid ${b.color}` : '2px solid transparent', backgroundColor: active === i ? '#fafafa' : 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, transition: 'all 200ms' }}>
              {done ? <CheckCircle size={12} color="#22c55e" /> : <AlertTriangle size={12} color={b.color} />}
              <span style={{ fontSize: 9, color: active === i ? '#111827' : '#9ca3af', fontWeight: 500 }}>§{i + 1}</span>
            </button>
          )
        })}
      </div>

      {/* Clause content */}
      <div style={{ padding: '14px 16px 12px' }}>
        {/* Risk badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', backgroundColor: badge.bg, color: badge.color, borderRadius: 5, padding: '2px 7px' }}>
            {badge.label.toUpperCase()}
          </span>
          <span style={{ fontSize: 10, color: '#9ca3af' }}>Clause {active + 1}</span>
        </div>

        {/* Original text */}
        <div style={{ padding: '9px 11px', backgroundColor: isAccepted ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)', border: `1px solid ${isAccepted ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.12)'}`, borderRadius: 8, marginBottom: 8, transition: 'all 300ms' }}>
          <p style={{ fontSize: 11, color: '#374151', lineHeight: 1.55, margin: 0, textDecoration: isAccepted ? 'line-through' : 'none', opacity: isAccepted ? 0.5 : 1, transition: 'all 300ms' }}>
            {clause.text}
          </p>
        </div>

        {/* AI suggestion */}
        <div style={{ padding: '9px 11px', backgroundColor: 'rgba(242,101,34,0.04)', border: '1px solid rgba(242,101,34,0.12)', borderRadius: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 8, color: '#F26522', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>AI SUGGESTION</div>
          <p style={{ fontSize: 11, color: '#374151', lineHeight: 1.55, margin: 0 }}>{clause.suggestion}</p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={handleAccept} disabled={isAccepted} style={{ flex: 1, padding: '7px 12px', backgroundColor: isAccepted ? '#22c55e' : '#111827', color: '#fff', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: isAccepted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'background-color 300ms' }}>
            {isAccepted ? <><CheckCircle size={11} /> Applied</> : 'Apply Suggestion'}
          </button>
          <button onClick={() => setActive(a => (a + 1) % CLAUSES.length)} style={{ padding: '7px 10px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 200ms' }}>
            <ChevronRight size={13} color="#6b7280" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: '#9ca3af' }}>{accepted.size} of {CLAUSES.length} applied</span>
        {accepted.size === CLAUSES.length && <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>✓ Review complete</span>}
      </div>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  tag,
  title,
  description,
  accent,
  bullets,
}: (typeof FEATURES)[0]) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? '#f9fafb' : '#ffffff',
        border: `1px solid ${hovered ? '#e5e7eb' : '#f3f4f6'}`,
        borderRadius: 20,
        padding: 'clamp(24px,3vw,36px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        transition: 'background-color 300ms, border-color 300ms, transform 300ms, box-shadow 300ms',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 48px rgba(0,0,0,0.10)' : '0 2px 8px rgba(0,0,0,0.04)',
        cursor: 'default',
        minHeight: 420,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.08em' }}>{tag}</span>
        <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: accent === '#F26522' ? 'rgba(242,101,34,0.08)' : 'rgba(17,24,39,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={accent} strokeWidth={1.5} />
        </div>
      </div>
      <h3 style={{ fontSize: 'clamp(16px,1.5vw,20px)', fontWeight: 600, color: '#111827', lineHeight: 1.3, letterSpacing: '-0.01em', margin: 0 }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{description}</p>
      <div style={{ height: 1, backgroundColor: '#f3f4f6', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: hovered ? '100%' : '0%', backgroundColor: accent, transition: 'width 500ms cubic-bezier(0.25,0.1,0.25,1)' }} />
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {bullets.map((b) => (
          <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#374151' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: accent, flexShrink: 0 }} />
            {b}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AboutSection() {
  const width = useWindowWidth()
  const navigate = useNavigate()
  const isMd = width >= 768
  const isLg = width >= 1024

  return (
    <section
      id="features"
      style={{ backgroundColor: '#ffffff', paddingTop: 'clamp(64px,8vw,128px)', paddingBottom: 'clamp(64px,8vw,128px)', overflow: 'hidden' }}
    >
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>

        {/* Badge row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: PX, paddingRight: PX, marginBottom: 'clamp(24px,3vw,32px)' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 600, lineHeight: 1 }}>1</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, border: '1px solid #e5e7eb', borderRadius: 9999, padding: '5px 14px', color: '#111827' }}>
            Introducing Lexa AI
          </span>
        </div>

        {/* Heading row — two columns on desktop */}
        <div
          data-speed="0.95"
          style={{
            paddingLeft: PX,
            paddingRight: PX,
            marginBottom: 'clamp(48px,6vw,80px)',
            display: 'grid',
            gridTemplateColumns: isLg ? '1fr 1fr' : '1fr',
            gap: 'clamp(32px,4vw,64px)',
            alignItems: 'center',
          }}
        >
          {/* Left: heading + text + button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.2rem)', lineHeight: 1.12, letterSpacing: '-0.02em', fontWeight: 500, color: '#111827', margin: 0 }}>
              AI-driven legal analysis, built
              <br />
              for modern contract workflows.
            </h2>
            <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6, maxWidth: 480, margin: 0 }}>
              Upload contracts, detect risky clauses, generate smart recommendations, and simplify legal workflows with AI.
            </p>
            <div>
              <TextRollButton
                label="Explore Platform"
                bgColor="#F26522"
                bgHoverColor="#e05a1a"
                arrowBg="#ffffff"
                arrowColor="#F26522"
                arrowSize={28}
                paddingLeft={20}
                paddingRight={8}
                fontSize={13}
                onClick={() => navigate('/dashboard')}
              />
            </div>
          </div>

          {/* Right: interactive contract widget (desktop only) */}
          {isLg && (
            <div style={{ position: 'relative' }}>
              <ContractWidget />
            </div>
          )}
        </div>

        {/* Feature cards */}
        <div
          style={{
            paddingLeft: PX,
            paddingRight: PX,
            display: 'grid',
            gridTemplateColumns: isMd ? 'repeat(3, 1fr)' : '1fr',
            gap: 'clamp(20px,2.5vw,32px)',
          }}
        >
          {FEATURES.map((f, i) => {
            const speeds = ['0.88', '0.93', '0.97']
            const lags = ['0.08', '0.14', '0.20']
            return (
              <div key={f.tag} data-speed={speeds[i]} data-lag={lags[i]} style={{ position: 'relative' }}>
                <FeatureCard {...f} />
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
