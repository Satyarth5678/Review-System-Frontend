import { useEffect, useState } from 'react'
import {
  Upload, FileText, ShieldAlert, FileEdit, BarChart3,
  CheckCircle, Zap, Database, GitBranch, Layers, Play, RotateCcw
} from 'lucide-react'
import { useWindowWidth } from '../../hooks/useWindowWidth'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const ORANGE = '#F26522'
const DARK = '#111827'
const GRAY = '#6b7280'
const ease = 'cubic-bezier(0.25,0.1,0.25,1)'


const PIPELINE_STEPS = [
  { icon: Upload,      label: 'Contract Upload',         desc: 'PDF, DOCX or TXT dropped via Upload API',          color: '#6366f1' },
  { icon: FileText,    label: 'File Validation',          desc: 'MIME type, size & format checks via File Service',  color: '#8b5cf6' },
  { icon: Layers,      label: 'Text Extraction',          desc: 'PyMuPDF · python-docx · plain TXT parsers',         color: ORANGE },
  { icon: Database,    label: 'Cleanup & Normalise',      desc: 'Whitespace, encoding & language normalisation',     color: '#f59e0b' },
  { icon: GitBranch,   label: 'Contract Classification',  desc: 'Gemma 4 classifies contract type & jurisdiction',   color: '#10b981' },
  { icon: BarChart3,   label: 'Summary Generation',       desc: 'Concise executive summary via LLM prompt chain',    color: '#3b82f6' },
  { icon: ShieldAlert, label: 'Legal Risk Analysis',      desc: 'Clause-level risk scoring + Risk ID generation',    color: '#ef4444' },
  { icon: FileEdit,    label: 'Redlining & Suggestions',  desc: 'Negotiation-ready edits aligned to playbook',       color: ORANGE },
  { icon: CheckCircle, label: 'JSON Validation',          desc: 'Custom parser ensures structured, safe output',     color: '#22c55e' },
  { icon: Zap,         label: 'Structured Response',      desc: 'FastAPI returns typed Pydantic response to client', color: '#6366f1' },
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

function PipelineStep({
  step, index, activeStep, completedSteps, isAllComplete, hoveredStep, onClick, onHover, onLeave,
}: {
  step: typeof PIPELINE_STEPS[0]
  index: number
  activeStep: number
  completedSteps: number[]
  isAllComplete: boolean
  hoveredStep: number | null
  onClick: () => void
  onHover: () => void
  onLeave: () => void
}) {
  const Icon = step.icon
  const isActive = activeStep === index && !isAllComplete
  const isDone = completedSteps.includes(index)
  const isHovered = hoveredStep === index
  const showComplete = isDone || isHovered

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        display: 'flex', alignItems: 'center', gap: 16, width: '100%',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        padding: '12px 16px', borderRadius: 12,
        backgroundColor: isHovered
          ? 'rgba(34,197,94,0.06)'
          : isActive
            ? 'rgba(242,101,34,0.06)'
            : isDone
              ? 'rgba(34,197,94,0.02)'
              : 'transparent',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 6px 16px rgba(0,0,0,0.04)'
          : 'none',
        transition: `all 250ms ${ease}`,
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        backgroundColor: showComplete ? '#22c55e' : isActive ? step.color : '#f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: `background-color 250ms ${ease}`,
        position: 'relative',
        boxShadow: isHovered
          ? '0 4px 12px rgba(34,197,94,0.3)'
          : isActive
            ? `0 4px 12px ${step.color}40`
            : 'none',
      }}>
        {showComplete ? (
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>
        ) : (
          <Icon size={14} color={isActive ? '#fff' : '#9ca3af'} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: showComplete ? '#16a34a' : isActive ? DARK : isDone ? '#374151' : GRAY }}>
          {String(index + 1).padStart(2, '0')} — {step.label}
        </div>
      </div>
    </button>
  )
}

export function PipelineSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [running, setRunning] = useState(false)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const width = useWindowWidth()
  const isLg = width >= 1024
  const [sectionRef, sectionRevealed] = useScrollReveal(0.05)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setActiveStep(prevActive => {
        if (prevActive >= PIPELINE_STEPS.length - 1) {
          setRunning(false)
          setCompletedSteps(prevDone => prevDone.includes(prevActive) ? prevDone : [...prevDone, prevActive])
          return prevActive
        }
        setCompletedSteps(prevDone => prevDone.includes(prevActive) ? prevDone : [...prevDone, prevActive])
        return prevActive + 1
      })
    }, 950)
    return () => clearInterval(id)
  }, [running])

  const startAuto = () => {
    setRunning(false)
    setTimeout(() => {
      reset()
      setRunning(true)
    }, 10)
  }

  const reset = () => {
    setRunning(false)
    setActiveStep(0)
    setCompletedSteps([])
  }

  const step = PIPELINE_STEPS[activeStep]
  const Icon = step.icon
  const progress = completedSteps.length === PIPELINE_STEPS.length ? 100 : ((activeStep) / (PIPELINE_STEPS.length - 1)) * 100
  const isAllComplete = completedSteps.length === PIPELINE_STEPS.length && !running

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      id="pipeline"
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
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>2</span>
            </div>
            <Pill label="Backend Pipeline" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3rem)', fontWeight: 600, letterSpacing: '-0.02em', color: DARK, margin: '0 0 12px', lineHeight: 1.15 }}>
            10-step processing pipeline
          </h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.6, maxWidth: 520, margin: 0 }}>
            Every contract flows through a deterministic chain — from raw bytes to structured legal intelligence.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isLg ? '1fr 1fr' : '1fr', gap: 'clamp(32px,4vw,56px)', alignItems: 'center' }}>
          {/* Left: step list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {PIPELINE_STEPS.map((s, i) => (
              <PipelineStep
                key={i}
                step={s}
                index={i}
                activeStep={activeStep}
                completedSteps={completedSteps}
                isAllComplete={isAllComplete}
                hoveredStep={hoveredStep}
                onClick={() => {
                  reset()
                  setActiveStep(i)
                  if (i === PIPELINE_STEPS.length - 1) {
                    setCompletedSteps(Array.from({ length: PIPELINE_STEPS.length }, (_, k) => k))
                  } else {
                    setCompletedSteps(Array.from({ length: i }, (_, k) => k))
                  }
                }}
                onHover={() => {
                  setHoveredStep(i)
                  setRunning(false)
                  setActiveStep(i)
                  if (i === PIPELINE_STEPS.length - 1) {
                    setCompletedSteps(Array.from({ length: PIPELINE_STEPS.length }, (_, k) => k))
                  } else {
                    setCompletedSteps(Array.from({ length: i }, (_, k) => k))
                  }
                }}
                onLeave={() => setHoveredStep(null)}
              />
            ))}
            {/* Controls */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={startAuto} style={{
                flex: 1, padding: '12px 0', borderRadius: 9999, border: 'none', cursor: 'pointer',
                backgroundColor: running ? '#f3f4f6' : DARK, color: running ? GRAY : '#fff',
                fontSize: 14, fontWeight: 600, transition: `all 300ms ${ease}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
                <Play size={14} />
                {running ? 'Running…' : isAllComplete ? 'Replay Pipeline' : 'Auto-run Pipeline'}
              </button>
              <button onClick={reset} style={{
                padding: '12px 24px', borderRadius: 9999, border: '1px solid #e5e7eb',
                backgroundColor: 'transparent', color: DARK, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: `border-color 300ms ${ease}`,
                display: 'flex', alignItems: 'center', gap: 8
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = ORANGE)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>

          {/* Right: active step visualiser */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{
              backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 24,
              padding: 'clamp(32px,4vw,48px)', boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              transition: `all 300ms ${ease}`,
            }}>
              {/* Progress bar */}
              <div style={{ height: 4, backgroundColor: '#e5e7eb', borderRadius: 9999, marginBottom: 28, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: isAllComplete ? '#22c55e' : ORANGE,
                  borderRadius: 9999,
                  transition: `width 600ms ${ease}, background-color 300ms ease`
                }} />
              </div>

              {isAllComplete ? (
                <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 18, backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                    boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)',
                  }}>
                    <CheckCircle size={32} color="#22c55e" />
                  </div>
                  <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>
                    PIPELINE SUCCESS
                  </div>
                  <h3 style={{ fontSize: 'clamp(19px, 2.2vw, 25px)', fontWeight: 600, color: DARK, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                    Pipeline Execution Complete
                  </h3>
                  <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.65, margin: '0 0 32px' }}>
                    FastAPI has returned a structured, typed JSON response containing the executive summary, classified risk clauses, and redline suggestions.
                  </p>
                  
                  {/* Mock Technical Output for Success */}
                  <div style={{ backgroundColor: DARK, borderRadius: 12, padding: 20, fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.7)', animation: 'fadeIn 0.6s ease-out' }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: ORANGE }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
                    </div>
                    <div style={{ color: '#93c5fd', marginBottom: 6 }}>&gt; API Status: 200 OK</div>
                    <div style={{ color: '#86efac', marginBottom: 6 }}>&gt; Processing Time: 3.14s</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)' }}>&gt; Data Payload: 412.5 KB rendered</div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Icon */}
                  <div style={{
                    width: 64, height: 64, borderRadius: 18, backgroundColor: step.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                    boxShadow: `0 8px 24px ${step.color}40`,
                    transition: `background-color 400ms ${ease}, box-shadow 400ms ${ease}`,
                  }}>
                    <Icon size={28} color="#fff" />
                  </div>
                  <div style={{ fontSize: 11, color: ORANGE, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>
                    STEP {String(activeStep + 1).padStart(2, '0')} / {PIPELINE_STEPS.length}
                  </div>
                  <h3 style={{ fontSize: 'clamp(19px, 2.2vw, 25px)', fontWeight: 600, color: DARK, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                    {step.label}
                  </h3>
                  <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.65, margin: '0 0 28px' }}>{step.desc}</p>
                  
                  {/* Mini data flow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                    {PIPELINE_STEPS.slice(0, activeStep + 1).map((_s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: i === activeStep ? ORANGE : '#22c55e' }} />
                        {i < activeStep && <div style={{ width: 16, height: 1, backgroundColor: '#e5e7eb' }} />}
                      </div>
                    ))}
                  </div>

                  {/* Mock Technical Output for Active Step */}
                  <div style={{ backgroundColor: DARK, borderRadius: 12, padding: 20, fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.7)', transition: 'all 300ms ease' }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: ORANGE }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
                    </div>
                    <div style={{ color: '#93c5fd', marginBottom: 6 }}>&gt; Executing module: {step.label.toLowerCase().replace(/ /g, '_')}</div>
                    <div style={{ marginBottom: 6 }}>&gt; Status: <span style={{ color: '#86efac' }}>Processing...</span></div>
                    <div>&gt; Pipeline trace: active</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
