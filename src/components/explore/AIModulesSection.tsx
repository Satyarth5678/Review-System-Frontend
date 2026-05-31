import { useState, useEffect, useRef } from 'react'
import { FileText, ShieldAlert, FileEdit, GitBranch } from 'lucide-react'
import { useWindowWidth } from '../../hooks/useWindowWidth'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const ORANGE = '#F26522'
const DARK = '#111827'
const GRAY = '#6b7280'
const ease = 'cubic-bezier(0.25,0.1,0.25,1)'

const AI_MODULES = [
  {
    id: 'classification',
    label: 'Classification',
    icon: GitBranch,
    color: '#6366f1',
    title: 'Contract Classification',
    desc: 'Gemma 4 reads the full contract text and identifies the contract type, governing jurisdiction, and applicable legal framework.',
    output: {
      type: 'NDA — Mutual Non-Disclosure Agreement',
      jurisdiction: 'Delaware, United States',
      framework: 'Common Law',
      confidence: '97%',
    },
  },
  {
    id: 'summary',
    label: 'Summary',
    icon: FileText,
    color: '#3b82f6',
    title: 'Executive Summary',
    desc: 'A concise, structured summary of the contract is generated — covering parties, obligations, key dates, and critical terms.',
    output: {
      parties: 'Acme Corp ↔ Beta LLC',
      duration: '24 months from execution',
      obligations: 'Confidentiality, IP assignment, non-compete',
      keyDate: 'Termination: 30-day written notice',
    },
  },
  {
    id: 'risk',
    label: 'Risk Analysis',
    icon: ShieldAlert,
    color: '#ef4444',
    title: 'Legal Risk Analysis',
    desc: 'Each clause is scored for risk level. High-risk clauses receive a unique Risk ID and detailed explanation.',
    output: {
      'RISK-001': 'Unlimited liability — HIGH',
      'RISK-002': 'No termination notice — HIGH',
      'RISK-003': 'Net-60 payment — MEDIUM',
      'RISK-004': 'Delaware governing law — LOW',
    },
  },
  {
    id: 'suggestions',
    label: 'Suggestions',
    icon: FileEdit,
    color: ORANGE,
    title: 'Redlining & Suggestions',
    desc: 'For each flagged clause, the AI generates a negotiation-ready redline aligned to market standards and your firm\'s playbook.',
    output: {
      'RISK-001': 'Cap at 12-month fees paid',
      'RISK-002': 'Add 30-day written notice',
      'RISK-003': 'Reduce to Net-30 + 1.5%/mo late fee',
      'RISK-004': 'Standard — no change needed',
    },
  },
]

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

export function AIModulesSection() {
  const [active, setActive] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const width = useWindowWidth()
  const isLg = width >= 1024
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [sectionRef, sectionRevealed] = useScrollReveal(0.05)

  // Smoother auto-loop with pause on hover
  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setActive(a => {
        const next = (a + 1) % AI_MODULES.length
        return next
      })
    }, 5500)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isHovered])

  const handleModuleClick = (i: number) => {
    if (i !== active) {
      setActive(i)
    }
  }

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className={`section-reveal ${sectionRevealed ? 'revealed' : ''}`}
      style={{
        backgroundColor: '#ffffff', padding: 'clamp(64px,8vw,120px) clamp(20px,4vw,48px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(40px,5vw,64px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>4</span>
            </div>
            <Pill label="AI Modules" accent />
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3rem)', fontWeight: 600, letterSpacing: '-0.02em', color: DARK, margin: '0 0 12px', lineHeight: 1.15 }}>
            Four legal AI modules
          </h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.6, maxWidth: 520, margin: 0 }}>
            Each module runs a specialised prompt chain against the Gemma 4 model via Ollama.
          </p>
        </div>

        {/* Module tabs — hovering a button switches the card */}
        <div
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {AI_MODULES.map((m, i) => {
            const MIcon = m.icon
            const isAct = active === i
            return (
              <button
                key={m.id}
                onClick={() => handleModuleClick(i)}
                onMouseEnter={() => handleModuleClick(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', borderRadius: 9999, border: 'none', cursor: 'pointer',
                  backgroundColor: isAct ? m.color : '#f3f4f6',
                  color: isAct ? '#fff' : GRAY,
                  fontSize: 14, fontWeight: 600,
                  transition: `all 300ms ${ease}`,
                  boxShadow: isAct ? `0 4px 16px ${m.color}40` : 'none',
                }}
              >
                <MIcon size={15} />
                {m.label}
              </button>
            )
          })}
        </div>

        {/* Unified Card Container */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundColor: '#f9fafb', borderRadius: 24, padding: 'clamp(32px,4vw,48px)',
            border: '1px solid #f3f4f6', boxShadow: '0 12px 40px rgba(0,0,0,0.03)',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: isLg ? '1fr 1fr' : '1fr', gap: 'clamp(32px,4vw,64px)', alignItems: 'center' }}>

            {/* Left: descriptions stacked using grid-area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
              {AI_MODULES.map((m, idx) => {
                const isCurrent = active === idx
                const MIcon = m.icon
                return (
                  <div
                    key={`desc-${m.id}`}
                    style={{
                      gridArea: '1 / 1',
                      display: 'flex', flexDirection: 'column', gap: 20,
                      opacity: isCurrent ? 1 : 0,
                      pointerEvents: isCurrent ? 'auto' : 'none',
                      transition: `opacity 600ms ${ease}`,
                    }}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: 16, backgroundColor: m.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 8px 24px ${m.color}40`,
                      transition: `background-color 400ms ${ease}`,
                    }}>
                      <MIcon size={24} color="#fff" />
                    </div>
                    <h3 style={{ fontSize: 'clamp(19px, 2.2vw, 27px)', fontWeight: 600, color: DARK, margin: 0, letterSpacing: '-0.01em' }}>
                      {m.title}
                    </h3>
                    <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
                      <span style={{ fontSize: 13, color: GRAY }}>Powered by Gemma 4 via Ollama · FastAPI endpoint</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right: mock output stacked using grid-area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
              {AI_MODULES.map((m, idx) => {
                const isCurrent = active === idx
                return (
                  <div
                    key={`code-${m.id}`}
                    style={{
                      gridArea: '1 / 1',
                      backgroundColor: DARK, borderRadius: 16, padding: '24px',
                      fontFamily: 'monospace', fontSize: 14,
                      border: `1px solid ${m.color}30`,
                      boxShadow: `0 12px 32px ${m.color}15`,
                      opacity: isCurrent ? 1 : 0,
                      pointerEvents: isCurrent ? 'auto' : 'none',
                      transition: `opacity 600ms ${ease}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: ORANGE }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
                      <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>response.json</span>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{'{'}</div>
                    {Object.entries(m.output).map(([k, v], i) => (
                      <div key={i} style={{ paddingLeft: 16, marginBottom: 6 }}>
                        <span style={{ color: '#93c5fd' }}>"{k}"</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>: </span>
                        <span style={{ color: '#86efac' }}>"{v}"</span>
                        {i < Object.keys(m.output).length - 1 && <span style={{ color: 'rgba(255,255,255,0.4)' }}>,</span>}
                      </div>
                    ))}
                    <div style={{ color: 'rgba(255,255,255,0.4)' }}>{'}'}</div>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
