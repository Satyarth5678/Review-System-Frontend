import { useState, useEffect, type ReactNode } from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { useWindowWidth } from '../../hooks/useWindowWidth'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const PX = 'clamp(20px,4vw,48px)'

const CLAUSES = [
  { label: 'Termination clause', risk: 'high', score: 92 },
  { label: 'Indemnification', risk: 'high', score: 87 },
  { label: 'Liability cap', risk: 'medium', score: 54 },
  { label: 'Payment terms', risk: 'low', score: 18 },
  { label: 'Governing law', risk: 'low', score: 12 },
]

const REDLINES = [
  { original: 'Liability shall not exceed $10,000', redline: 'Liability shall not exceed $50,000' },
  { original: 'Termination with 7 days notice', redline: 'Termination with 30 days notice' },
  { original: 'Governed by laws of Delaware', redline: 'Governed by laws of New York' },
]


function riskColor(r: string) {
  return r === 'high' ? '#ef4444' : r === 'medium' ? '#F26522' : '#22c55e'
}

function RiskDetectionCard() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActive(v => (v + 1) % CLAUSES.length), 1800)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {CLAUSES.map((c, i) => (
        <div key={c.label} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          backgroundColor: active === i ? 'rgba(242,101,34,0.08)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${active === i ? 'rgba(242,101,34,0.25)' : 'rgba(255,255,255,0.06)'}`,
          transition: 'all 400ms',
        }}>
          {active === i
            ? <AlertTriangle size={13} color="#F26522" />
            : <CheckCircle size={13} color="rgba(255,255,255,0.2)" />}
          <span style={{ flex: 1, fontSize: 12, color: active === i ? '#fff' : 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {c.label}
          </span>
          <div style={{ width: 64, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ height: '100%', width: active === i ? `${c.score}%` : '0%', backgroundColor: riskColor(c.risk), borderRadius: 2, transition: 'width 600ms' }} />
          </div>
          <span style={{ fontSize: 11, color: riskColor(c.risk), fontWeight: 600, width: 24, textAlign: 'right', flexShrink: 0 }}>
            {active === i ? String(c.score) : '-'}
          </span>
        </div>
      ))}
    </div>
  )
}

function RedliningCard() {
  const [animation, setAnimation] = useState({ step: 0, typing: 0 })

  useEffect(() => {
    const typingId = setInterval(() => {
      setAnimation(current => {
        const max = REDLINES[current.step % REDLINES.length].redline.length
        if (current.typing >= max) return current
        return { ...current, typing: Math.min(current.typing + 3, max) }
      })
    }, 40)
    const stepId = setInterval(() => {
      setAnimation(current => ({ step: current.step + 1, typing: 0 }))
    }, 3500)
    return () => { clearInterval(typingId); clearInterval(stepId) }
  }, [])

  const idx = animation.step % REDLINES.length
  const current = REDLINES[idx]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6 }}>ORIGINAL</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, textDecoration: 'line-through', margin: 0 }}>{current.original}</p>
      </div>
      <div style={{ padding: '12px 14px', borderRadius: 10, backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6 }}>SUGGESTED REDLINE</div>
        <p style={{ fontSize: 13, color: '#fff', lineHeight: 1.5, margin: 0 }}>
          {current.redline.slice(0, animation.typing)}
          <span style={{ display: 'inline-block', width: 2, height: 13, backgroundColor: '#F26522', marginLeft: 1, verticalAlign: 'middle' }} />
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22c55e' }} />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>AI recommendation generated</span>
      </div>
    </div>
  )
}

// Stages: 0 = original clause shown, 1 = AI rewriting, 2 = rewritten clause, 3 = generating PDF, 4 = ready to download
const CLAUSE_STAGES = [
  { original: 'Either party may terminate this agreement at any time without cause or notice.', rewritten: 'Either party may terminate this agreement with 30 days written notice, except in cases of material breach.' },
  { original: 'The liability of either party shall be unlimited under all circumstances.', rewritten: 'Each party\'s liability shall be limited to the total fees paid in the 12 months preceding the claim.' },
  { original: 'Vendor may amend these terms unilaterally without notifying the client.', rewritten: 'Any amendments require mutual written consent from both parties with 14 days advance notice.' },
]

function PDFExportCard() {
  const [animation, setAnimation] = useState({ stage: 0, clause: 0, typing: 0, hold: 0 })

  useEffect(() => {
    const id = setInterval(() => {
      setAnimation(current => {
        const clause = CLAUSE_STAGES[current.clause % CLAUSE_STAGES.length]
        if (current.stage === 0) return { ...current, stage: 1 }
        if (current.stage === 1) {
          const max = clause.rewritten.length
          if (current.typing < max) {
            return { ...current, typing: Math.min(current.typing + 4, max) }
          }
          return { ...current, stage: 2 }
        }
        if (current.stage === 2) return { ...current, stage: 3 }
        if (current.stage === 3) return { ...current, stage: 4 }
        if (current.stage === 4) {
          if (current.hold < 18) return { ...current, hold: current.hold + 1 }
          return { stage: 0, clause: current.clause + 1, typing: 0, hold: 0 }
        }
        return current
      })
    }, 120)
    return () => clearInterval(id)
  }, [])

  const stage = animation.stage
  const clause = CLAUSE_STAGES[animation.clause % CLAUSE_STAGES.length]
  const typed = clause.rewritten.slice(0, animation.typing)
  const progress = stage >= 3 ? (stage === 3 ? 60 : 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Original clause */}
      <div style={{ padding: '10px 12px', borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
        <div style={{ fontSize: 9, color: '#ef4444', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 5 }}>ORIGINAL CLAUSE</div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0, textDecoration: stage >= 1 ? 'line-through' : 'none', transition: 'text-decoration 300ms' }}>
          {clause.original}
        </p>
      </div>

      {/* Rewritten clause */}
      <div style={{
        padding: '10px 12px', borderRadius: 10,
        backgroundColor: stage >= 1 ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${stage >= 1 ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 400ms',
        minHeight: 52,
      }}>
        <div style={{ fontSize: 9, color: '#22c55e', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 5 }}>
          {stage >= 1 ? 'AI-REWRITTEN CLAUSE' : 'AWAITING REWRITE...'}
        </div>
        <p style={{ fontSize: 11, color: '#fff', lineHeight: 1.5, margin: 0 }}>
          {typed}
          {stage === 1 && (
            <span style={{ display: 'inline-block', width: 2, height: 11, backgroundColor: '#F26522', marginLeft: 1, verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
          )}
        </p>
      </div>

      {/* PDF generation progress */}
      <div style={{
        padding: '10px 12px', borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        opacity: stage >= 3 ? 1 : 0.35,
        transition: 'opacity 400ms',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            {stage === 3 ? 'Generating updated PDF...' : stage >= 4 ? 'PDF ready' : 'Pending PDF export'}
          </span>
          {stage >= 4 && (
            <span style={{ fontSize: 9, fontWeight: 700, color: '#22c55e', letterSpacing: '0.06em' }}>✓ DONE</span>
          )}
        </div>
        {/* Progress bar */}
        <div style={{ height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2,
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #F26522, #22c55e)',
            transition: 'width 800ms cubic-bezier(0.25,0.1,0.25,1)',
          }} />
        </div>
        {/* Download button */}
        {stage >= 4 && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              backgroundColor: '#F26522', borderRadius: 6,
              padding: '5px 10px', cursor: 'pointer',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>Download PDF</span>
            </div>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>contract_revised.pdf</span>
          </div>
        )}
      </div>
    </div>
  )
}

function WorkflowCard({ number, title, description, index, children }: {
  number: string; title: string; description: string; index: number; children: ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  const [ref, revealed] = useScrollReveal()

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={revealed ? `card-reveal card-delay-${(index % 4) + 1}` : ''}
      style={{
        opacity: revealed ? 1 : 0,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#111827',
        border: `1px solid ${hovered ? 'rgba(242,101,34,0.35)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'border-color 300ms, transform 300ms, box-shadow 300ms, opacity 400ms ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 24px 56px rgba(0,0,0,0.35)' : '0 4px 16px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 420,
      }}
    >
      {/* Animation area — grows to fill available space */}
      <div style={{ padding: '28px 24px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {children}
      </div>
      {/* Info footer — fixed at bottom */}
      <div style={{ padding: '20px 24px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#F26522', letterSpacing: '0.06em' }}>{number}</span>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: 0 }}>{title}</h3>
        </div>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>{description}</p>
      </div>
    </div>
  )
}

export function CaseStudiesSection() {
  const width = useWindowWidth()
  const isMd = width >= 768
  return (
    <section id="workflow" style={{ backgroundColor: '#F5F5F5', padding: 'clamp(64px,8vw,120px) 0' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: PX, paddingRight: PX, marginBottom: 'clamp(24px,3vw,32px)' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 600, lineHeight: 1 }}>2</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, border: '1px solid #d1d5db', borderRadius: 9999, padding: '5px 14px', color: '#111827' }}>
            AI Contract Reviews
          </span>
        </div>
        <h2 data-speed="0.95" style={{ paddingLeft: PX, paddingRight: PX, fontSize: 'clamp(1.75rem,7vw,4.2rem)', lineHeight: 1.08, letterSpacing: '-0.03em', fontWeight: 500, color: '#111827', marginBottom: 'clamp(40px,5vw,64px)' }}>
          AI Legal Workflows
        </h2>
        <div style={{ paddingLeft: PX, paddingRight: PX, display: 'grid', gridTemplateColumns: isMd ? 'repeat(3, 1fr)' : '1fr', gap: 'clamp(20px,2.5vw,32px)' }}>
          <div data-speed="0.88" data-lag="0.08" style={{ position: 'relative' }}>
            <WorkflowCard number="01" title="Risk Detection" description="AI scans every clause and scores risk in real time." index={0}>
              <RiskDetectionCard />
            </WorkflowCard>
          </div>
          <div data-speed="0.93" data-lag="0.14" style={{ position: 'relative' }}>
            <WorkflowCard number="02" title="Smart Redlining" description="Get negotiation-ready edits aligned to your playbook." index={1}>
              <RedliningCard />
            </WorkflowCard>
          </div>
          <div data-speed="0.97" data-lag="0.20" style={{ position: 'relative' }}>
            <WorkflowCard number="03" title="PDF Export & Redline Apply" description="Rewrites risky clauses into legally sound language and exports a clean, downloadable PDF instantly." index={2}>
              <PDFExportCard />
            </WorkflowCard>
          </div>
        </div>
      </div>
    </section>
  )
}
