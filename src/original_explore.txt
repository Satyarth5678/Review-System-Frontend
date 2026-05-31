import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/navigation/Navbar'
import { Footer } from '../components/landing/Footer'
import { useWindowWidth } from '../hooks/useWindowWidth'
import {
  Upload, FileText, Cpu as _Cpu, ShieldAlert, FileEdit, BarChart3,
  CheckCircle, ArrowRight, Zap, Database, GitBranch, Layers,
} from 'lucide-react'

const ORANGE = '#F26522'
const DARK = '#111827'
const GRAY = '#6b7280'
const LIGHT = '#f9fafb'
const ease = 'cubic-bezier(0.25,0.1,0.25,1)'

/* ── Intersection-observer fade-in hook — re-triggers on every scroll into view ── */
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

/* ── Animated counter — resets and replays every time it scrolls into view ── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const { ref, visible } = useReveal(0.3)
  useEffect(() => {
    if (!visible) { setVal(0); return }
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

/* ── Pill label ── */
function Pill({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
      textTransform: 'uppercase' as const,
      backgroundColor: accent ? 'rgba(242,101,34,0.1)' : 'rgba(17,24,39,0.06)',
      color: accent ? ORANGE : DARK,
      borderRadius: 9999, padding: '4px 12px',
    }}>{label}</span>
  )
}

/* ══════════════════════════════════════════
   SECTION 1 — HERO
══════════════════════════════════════════ */
function HeroExplore() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t) }, [])

  return (
    <section style={{
      position: 'relative', minHeight: '92vh',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      textAlign: 'center', overflow: 'hidden',
      backgroundColor: '#EFEFEF',
      padding: 'clamp(80px,10vw,140px) clamp(20px,4vw,48px) clamp(60px,8vw,100px)',
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
        @keyframes exploreRedLine {
          0%   { top: -10%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>

      {/* Animated mesh gradient — same as landing page hero */}
      <div aria-hidden="true" style={{ position:'absolute',inset:0,zIndex:1,pointerEvents:'none',overflow:'hidden' }}>
        {/* Orb 1 — dominant orange, top-right */}
        <div style={{
          position:'absolute', width:'80vw', height:'80vw', top:'-30vw', right:'-25vw',
          borderRadius:'50%',
          background:'radial-gradient(circle at 40% 40%,rgba(242,101,34,0.55) 0%,rgba(242,101,34,0.25) 35%,rgba(251,146,60,0.08) 60%,transparent 75%)',
          animation:'exploreOrb1 16s ease-in-out infinite', filter:'blur(20px)',
        }} />
        {/* Orb 2 — warm peach, left-center */}
        <div style={{
          position:'absolute', width:'65vw', height:'65vw', top:'5%', left:'-20vw',
          borderRadius:'50%',
          background:'radial-gradient(circle at 60% 50%,rgba(251,146,60,0.40) 0%,rgba(251,146,60,0.15) 40%,transparent 70%)',
          animation:'exploreOrb2 20s ease-in-out infinite', filter:'blur(24px)',
        }} />
        {/* Orb 3 — bright cream center glow */}
        <div style={{
          position:'absolute', width:'70vw', height:'70vw', top:'15%', left:'15%',
          borderRadius:'50%',
          background:'radial-gradient(circle at 50% 50%,rgba(255,255,255,0.90) 0%,rgba(255,235,210,0.50) 35%,rgba(255,200,150,0.15) 60%,transparent 75%)',
          animation:'exploreOrb3 24s ease-in-out infinite', filter:'blur(16px)',
        }} />
        {/* Orb 4 — deep orange, bottom-left */}
        <div style={{
          position:'absolute', width:'55vw', height:'55vw', bottom:'-15vw', left:'-10vw',
          borderRadius:'50%',
          background:'radial-gradient(circle at 50% 50%,rgba(234,88,12,0.35) 0%,rgba(234,88,12,0.12) 45%,transparent 70%)',
          animation:'exploreOrb4 18s ease-in-out infinite', filter:'blur(28px)',
        }} />
        {/* Orb 5 — accent orange, bottom-right */}
        <div style={{
          position:'absolute', width:'50vw', height:'50vw', bottom:'-10vw', right:'-10vw',
          borderRadius:'50%',
          background:'radial-gradient(circle at 50% 50%,rgba(249,115,22,0.30) 0%,rgba(249,115,22,0.10) 45%,transparent 70%)',
          animation:'exploreOrb5 22s ease-in-out infinite', filter:'blur(22px)',
        }} />
        {/* Slow-moving vertical red line */}
        <div style={{
          position:'absolute', left:'50%', width:1.5, height:'35%',
          background:'linear-gradient(to bottom,transparent 0%,rgba(220,38,38,0.55) 30%,rgba(220,38,38,0.75) 50%,rgba(220,38,38,0.55) 70%,transparent 100%)',
          animation:'exploreRedLine 6s ease-in-out infinite', filter:'blur(0.5px)',
        }} />
      </div>

      <div style={{ position:'relative', zIndex:2, maxWidth:860 }}>
        <div style={{ marginBottom:24, opacity: mounted?1:0, transform: mounted?'translateY(0)':'translateY(20px)', transition:`opacity 600ms ${ease}, transform 600ms ${ease}` }}>
          <Pill label="Interactive Deep Dive" accent />
        </div>
        <h1 style={{
          fontSize:'clamp(2rem,6vw,4.5rem)', fontWeight:500, lineHeight:1.1,
          letterSpacing:'-0.03em', color:DARK, margin:'0 0 24px',
          opacity: mounted?1:0, transform: mounted?'translateY(0)':'translateY(30px)',
          transition:`opacity 700ms ${ease} 100ms, transform 700ms ${ease} 100ms`,
        }}>
          Explore How the<br />
          <span style={{ color:ORANGE }}>Review System</span> Works
        </h1>
        <p style={{
          fontSize:'clamp(15px,1.8vw,18px)', color:GRAY, lineHeight:1.7, maxWidth:600, margin:'0 auto 40px',
          opacity: mounted?1:0, transform: mounted?'translateY(0)':'translateY(20px)',
          transition:`opacity 700ms ${ease} 200ms, transform 700ms ${ease} 200ms`,
        }}>
          A cinematic walkthrough of the AI-powered backend — from contract upload to structured legal intelligence.
        </p>
        <div style={{
          display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap',
          opacity: mounted?1:0, transform: mounted?'translateY(0)':'translateY(20px)',
          transition:`opacity 700ms ${ease} 300ms, transform 700ms ${ease} 300ms`,
        }}>
          <a href="#pipeline" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            backgroundColor:DARK, color:'#fff', borderRadius:9999,
            padding:'12px 24px', fontSize:14, fontWeight:500, textDecoration:'none',
            transition:`background-color 300ms ${ease}`,
          }}
            onMouseEnter={e=>(e.currentTarget.style.backgroundColor='#374151')}
            onMouseLeave={e=>(e.currentTarget.style.backgroundColor=DARK)}
          >
            See the Pipeline <ArrowRight size={16} />
          </a>
          <a href="#tech-stack" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            backgroundColor:'transparent', color:DARK,
            border:'1px solid #e5e7eb', borderRadius:9999,
            padding:'12px 24px', fontSize:14, fontWeight:500, textDecoration:'none',
            transition:`border-color 300ms ${ease}`,
          }}
            onMouseEnter={e=>(e.currentTarget.style.borderColor=ORANGE)}
            onMouseLeave={e=>(e.currentTarget.style.borderColor='#e5e7eb')}
          >
            Tech Stack
          </a>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   SECTION 2 — LIVE PIPELINE FLOW
══════════════════════════════════════════ */
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

function PipelineStep({
  step, index, activeStep, onClick,
}: {
  step: typeof PIPELINE_STEPS[0]
  index: number
  activeStep: number
  onClick: () => void
}) {
  const Icon = step.icon
  const isActive = activeStep === index
  const isDone = index < activeStep
  return (
    <button
      onClick={onClick}
      style={{
        display:'flex', alignItems:'flex-start', gap:16, width:'100%',
        background:'none', border:'none', cursor:'pointer', textAlign:'left',
        padding:'14px 16px', borderRadius:12,
        backgroundColor: isActive ? 'rgba(242,101,34,0.06)' : isDone ? 'rgba(34,197,94,0.04)' : 'transparent',
        borderLeft: `3px solid ${isActive ? ORANGE : isDone ? '#22c55e' : '#e5e7eb'}`,
        transition:`all 300ms ${ease}`,
      }}
    >
      <div style={{
        width:36, height:36, borderRadius:10, flexShrink:0,
        backgroundColor: isActive ? step.color : isDone ? '#22c55e' : '#f3f4f6',
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:`background-color 300ms ${ease}`,
      }}>
        <Icon size={16} color={isActive || isDone ? '#fff' : '#9ca3af'} />
      </div>
      <div>
        <div style={{ fontSize:13, fontWeight:600, color: isActive ? DARK : isDone ? '#374151' : GRAY, marginBottom:2 }}>
          {String(index + 1).padStart(2,'0')} — {step.label}
        </div>
        <div style={{ fontSize:12, color:GRAY, lineHeight:1.5 }}>{step.desc}</div>
      </div>
    </button>
  )
}

function PipelineSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { ref, visible } = useReveal(0.1)
  const width = useWindowWidth()
  const isLg = width >= 1024

  const startAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setRunning(true)
    timerRef.current = setInterval(() => {
      setActiveStep(s => {
        if (s >= PIPELINE_STEPS.length - 1) {
          clearInterval(timerRef.current!)
          setRunning(false)
          return s
        }
        return s + 1
      })
    }, 900)
  }

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setRunning(false)
    setActiveStep(0)
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const step = PIPELINE_STEPS[activeStep]
  const Icon = step.icon
  const progress = ((activeStep) / (PIPELINE_STEPS.length - 1)) * 100

  return (
    <section id="pipeline" ref={ref} style={{
      backgroundColor:'#ffffff', padding:'clamp(64px,8vw,120px) clamp(20px,4vw,48px)',
    }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        {/* Header */}
        <div style={{
          marginBottom:'clamp(40px,5vw,64px)',
          opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(24px)',
          transition:`opacity 600ms ${ease}, transform 600ms ${ease}`,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <div style={{ width:26,height:26,borderRadius:'50%',backgroundColor:DARK,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ color:'#fff',fontSize:11,fontWeight:600 }}>2</span>
            </div>
            <Pill label="Backend Pipeline" />
          </div>
          <h2 style={{ fontSize:'clamp(1.5rem,3.5vw,2.8rem)',fontWeight:500,letterSpacing:'-0.02em',color:DARK,margin:'0 0 12px' }}>
            11-step processing pipeline
          </h2>
          <p style={{ fontSize:15,color:GRAY,lineHeight:1.6,maxWidth:520,margin:0 }}>
            Every contract flows through a deterministic chain — from raw bytes to structured legal intelligence.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns: isLg ? '1fr 1fr' : '1fr', gap:'clamp(32px,4vw,56px)', alignItems:'start' }}>
          {/* Left: step list */}
          <div style={{
            display:'flex', flexDirection:'column', gap:4,
            opacity: visible?1:0, transform: visible?'translateX(0)':'translateX(-24px)',
            transition:`opacity 700ms ${ease} 100ms, transform 700ms ${ease} 100ms`,
          }}>
            {PIPELINE_STEPS.map((s, i) => (
              <PipelineStep key={i} step={s} index={i} activeStep={activeStep} onClick={() => { reset(); setActiveStep(i) }} />
            ))}
            {/* Controls */}
            <div style={{ display:'flex', gap:10, marginTop:16 }}>
              <button onClick={startAuto} disabled={running} style={{
                flex:1, padding:'10px 0', borderRadius:9999, border:'none', cursor: running?'default':'pointer',
                backgroundColor: running ? '#f3f4f6' : DARK, color: running ? GRAY : '#fff',
                fontSize:13, fontWeight:500, transition:`all 300ms ${ease}`,
              }}>
                {running ? 'Running…' : activeStep === PIPELINE_STEPS.length-1 ? 'Replay' : 'Auto-run Pipeline'}
              </button>
              <button onClick={reset} style={{
                padding:'10px 20px', borderRadius:9999, border:'1px solid #e5e7eb',
                backgroundColor:'transparent', color:DARK, fontSize:13, fontWeight:500, cursor:'pointer',
                transition:`border-color 300ms ${ease}`,
              }}
                onMouseEnter={e=>(e.currentTarget.style.borderColor=ORANGE)}
                onMouseLeave={e=>(e.currentTarget.style.borderColor='#e5e7eb')}
              >Reset</button>
            </div>
          </div>

          {/* Right: active step visualiser */}
          <div style={{
            position:'sticky', top:100,
            opacity: visible?1:0, transform: visible?'translateX(0)':'translateX(24px)',
            transition:`opacity 700ms ${ease} 200ms, transform 700ms ${ease} 200ms`,
          }}>
            <div style={{
              backgroundColor:LIGHT, border:'1px solid #f3f4f6', borderRadius:20,
              padding:'clamp(24px,3vw,40px)', boxShadow:'0 8px 32px rgba(0,0,0,0.05)',
            }}>
              {/* Progress bar */}
              <div style={{ height:3, backgroundColor:'#e5e7eb', borderRadius:9999, marginBottom:28, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${progress}%`, backgroundColor:ORANGE, borderRadius:9999, transition:`width 600ms ${ease}` }} />
              </div>
              {/* Icon */}
              <div style={{
                width:64, height:64, borderRadius:18, backgroundColor:step.color,
                display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20,
                boxShadow:`0 8px 24px ${step.color}40`,
                transition:`background-color 400ms ${ease}, box-shadow 400ms ${ease}`,
              }}>
                <Icon size={28} color="#fff" />
              </div>
              <div style={{ fontSize:11, color:ORANGE, fontWeight:700, letterSpacing:'0.08em', marginBottom:8 }}>
                STEP {String(activeStep+1).padStart(2,'0')} / {PIPELINE_STEPS.length}
              </div>
              <h3 style={{ fontSize:'clamp(18px,2vw,24px)', fontWeight:600, color:DARK, margin:'0 0 12px', letterSpacing:'-0.01em' }}>
                {step.label}
              </h3>
              <p style={{ fontSize:14, color:GRAY, lineHeight:1.65, margin:'0 0 24px' }}>{step.desc}</p>
              {/* Mini data flow */}
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                {PIPELINE_STEPS.slice(0, activeStep+1).map((_s,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <div style={{ width:8,height:8,borderRadius:'50%',backgroundColor: i===activeStep ? ORANGE : '#22c55e' }} />
                    {i < activeStep && <div style={{ width:16,height:1,backgroundColor:'#e5e7eb' }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   SECTION 3 — TECH STACK
══════════════════════════════════════════ */
const STACK = [
  { layer:'Backend Framework', tech:'FastAPI',          note:'Async Python API layer',              color:'#009688' },
  { layer:'Runtime',           tech:'Python',           note:'Core language',                       color:'#3776ab' },
  { layer:'LLM Runtime',       tech:'Ollama',           note:'Local model serving',                 color:'#111827' },
  { layer:'LLM Model',         tech:'Gemma 4',          note:'gemma4:e4b — legal reasoning',        color:ORANGE },
  { layer:'PDF Parsing',       tech:'PyMuPDF',          note:'fitz — fast PDF text extraction',     color:'#e53935' },
  { layer:'DOCX Parsing',      tech:'python-docx',      note:'Word document extraction',            color:'#1565c0' },
  { layer:'API Validation',    tech:'Pydantic',         note:'Typed request/response models',       color:'#e91e63' },
  { layer:'Server',            tech:'Uvicorn',          note:'ASGI server for FastAPI',             color:'#6366f1' },
  { layer:'CORS',              tech:'CORSMiddleware',   note:'Cross-origin request handling',       color:'#f59e0b' },
  { layer:'File Upload',       tech:'python-multipart', note:'Multipart form data handling',        color:'#10b981' },
]

function TechStackSection() {
  const { ref, visible } = useReveal(0.1)
  const width = useWindowWidth()
  const cols = width >= 1024 ? 2 : 1

  return (
    <section id="tech-stack" ref={ref} style={{
      backgroundColor:'#f9fafb', padding:'clamp(64px,8vw,120px) clamp(20px,4vw,48px)',
    }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        <div style={{
          marginBottom:'clamp(40px,5vw,64px)',
          opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(24px)',
          transition:`opacity 600ms ${ease}, transform 600ms ${ease}`,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <div style={{ width:26,height:26,borderRadius:'50%',backgroundColor:DARK,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ color:'#fff',fontSize:11,fontWeight:600 }}>3</span>
            </div>
            <Pill label="Technology Stack" />
          </div>
          <h2 style={{ fontSize:'clamp(1.5rem,3.5vw,2.8rem)',fontWeight:500,letterSpacing:'-0.02em',color:DARK,margin:'0 0 12px' }}>
            Built on proven open-source infrastructure
          </h2>
          <p style={{ fontSize:15,color:GRAY,lineHeight:1.6,maxWidth:520,margin:0 }}>
            Every layer is purpose-selected for legal AI workloads — fast, local, and privacy-first.
          </p>
        </div>

        <div style={{
          display:'grid', gridTemplateColumns: cols===2 ? '1fr 1fr' : '1fr',
          gap:'clamp(12px,1.5vw,16px)',
        }}>
          {STACK.map((s, i) => {
            const delay = (i % (cols===2 ? 5 : 10)) * 60
            return (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:16,
                backgroundColor:'#ffffff', border:'1px solid #f3f4f6', borderRadius:14,
                padding:'16px 20px',
                boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
                opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(16px)',
                transition:`opacity 500ms ${ease} ${delay}ms, transform 500ms ${ease} ${delay}ms`,
              }}>
                <div style={{ width:10,height:10,borderRadius:'50%',backgroundColor:s.color,flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11,color:GRAY,marginBottom:2 }}>{s.layer}</div>
                  <div style={{ fontSize:14,fontWeight:600,color:DARK }}>{s.tech}</div>
                </div>
                <div style={{ fontSize:12,color:GRAY,textAlign:'right' as const }}>{s.note}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   SECTION 4 — AI MODULES INTERACTIVE DEMO
══════════════════════════════════════════ */
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

function AIModulesSection() {
  const [active, setActive] = useState(0)
  const { ref, visible } = useReveal(0.1)
  const width = useWindowWidth()
  const isLg = width >= 1024
  const mod = AI_MODULES[active]
  const Icon = mod.icon

  return (
    <section ref={ref} style={{
      backgroundColor:'#ffffff', padding:'clamp(64px,8vw,120px) clamp(20px,4vw,48px)',
    }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        <div style={{
          marginBottom:'clamp(40px,5vw,64px)',
          opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(24px)',
          transition:`opacity 600ms ${ease}, transform 600ms ${ease}`,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <div style={{ width:26,height:26,borderRadius:'50%',backgroundColor:DARK,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <span style={{ color:'#fff',fontSize:11,fontWeight:600 }}>4</span>
            </div>
            <Pill label="AI Modules" accent />
          </div>
          <h2 style={{ fontSize:'clamp(1.5rem,3.5vw,2.8rem)',fontWeight:500,letterSpacing:'-0.02em',color:DARK,margin:'0 0 12px' }}>
            Four parallel AI analysis modules
          </h2>
          <p style={{ fontSize:15,color:GRAY,lineHeight:1.6,maxWidth:520,margin:0 }}>
            Each module runs a specialised prompt chain against the Gemma 4 model via Ollama.
          </p>
        </div>

        {/* Module tabs */}
        <div style={{
          display:'flex', gap:8, flexWrap:'wrap', marginBottom:32,
          opacity: visible?1:0, transition:`opacity 600ms ${ease} 100ms`,
        }}>
          {AI_MODULES.map((m, i) => {
            const MIcon = m.icon
            const isAct = active === i
            return (
              <button key={m.id} onClick={() => setActive(i)} style={{
                display:'flex', alignItems:'center', gap:8,
                padding:'10px 18px', borderRadius:9999, border:'none', cursor:'pointer',
                backgroundColor: isAct ? m.color : '#f3f4f6',
                color: isAct ? '#fff' : GRAY,
                fontSize:13, fontWeight:500,
                transition:`all 300ms ${ease}`,
                boxShadow: isAct ? `0 4px 16px ${m.color}40` : 'none',
              }}>
                <MIcon size={14} />
                {m.label}
              </button>
            )
          })}
        </div>

        <div style={{
          display:'grid', gridTemplateColumns: isLg ? '1fr 1fr' : '1fr',
          gap:'clamp(24px,3vw,40px)', alignItems:'start',
          opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(24px)',
          transition:`opacity 700ms ${ease} 200ms, transform 700ms ${ease} 200ms`,
        }}>
          {/* Left: description */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{
              width:56, height:56, borderRadius:16, backgroundColor:mod.color,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:`0 8px 24px ${mod.color}40`,
              transition:`background-color 400ms ${ease}`,
            }}>
              <Icon size={24} color="#fff" />
            </div>
            <h3 style={{ fontSize:'clamp(18px,2vw,26px)', fontWeight:600, color:DARK, margin:0, letterSpacing:'-0.01em' }}>
              {mod.title}
            </h3>
            <p style={{ fontSize:15, color:GRAY, lineHeight:1.7, margin:0 }}>{mod.desc}</p>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:8,height:8,borderRadius:'50%',backgroundColor:'#22c55e' }} />
              <span style={{ fontSize:12, color:GRAY }}>Powered by Gemma 4 via Ollama · FastAPI endpoint</span>
            </div>
          </div>

          {/* Right: mock output */}
          <div style={{
            backgroundColor:DARK, borderRadius:16, padding:'24px',
            fontFamily:'monospace', fontSize:13,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:16 }}>
              <div style={{ width:8,height:8,borderRadius:'50%',backgroundColor:'#ef4444' }} />
              <div style={{ width:8,height:8,borderRadius:'50%',backgroundColor:ORANGE }} />
              <div style={{ width:8,height:8,borderRadius:'50%',backgroundColor:'#22c55e' }} />
              <span style={{ marginLeft:8, fontSize:11, color:'rgba(255,255,255,0.3)' }}>response.json</span>
            </div>
            <div style={{ color:'rgba(255,255,255,0.4)', marginBottom:8 }}>{'{'}</div>
            {Object.entries(mod.output).map(([k, v], i) => (
              <div key={i} style={{ paddingLeft:16, marginBottom:6 }}>
                <span style={{ color:'#93c5fd' }}>"{k}"</span>
                <span style={{ color:'rgba(255,255,255,0.4)' }}>: </span>
                <span style={{ color:'#86efac' }}>"{v}"</span>
                {i < Object.keys(mod.output).length - 1 && <span style={{ color:'rgba(255,255,255,0.4)' }}>,</span>}
              </div>
            ))}
            <div style={{ color:'rgba(255,255,255,0.4)' }}>{'}'}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   SECTION 5 — STATS
══════════════════════════════════════════ */
function StatsSection() {
  const { ref, visible } = useReveal(0.2)
  const STATS = [
    { value: 11, suffix: '', label: 'Pipeline Steps' },
    { value: 4,  suffix: '', label: 'AI Modules' },
    { value: 97, suffix: '%', label: 'Classification Accuracy' },
    { value: 3,  suffix: 's', label: 'Avg. Processing Time' },
  ]
  return (
    <section ref={ref} style={{
      backgroundColor:DARK, padding:'clamp(56px,7vw,96px) clamp(20px,4vw,48px)',
    }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',
          gap:'clamp(32px,4vw,48px)', textAlign:'center' as const,
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(20px)',
              transition:`opacity 600ms ${ease} ${i*80}ms, transform 600ms ${ease} ${i*80}ms`,
            }}>
              <div style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:500, color:'#ffffff', letterSpacing:'-0.03em', lineHeight:1 }}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.45)', marginTop:8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   SECTION 6 — DATA FLOW ARCHITECTURE
══════════════════════════════════════════ */
const ARCH_NODES = [
  { label:'Client',         sub:'Browser / App',      col:0, row:0, color:'#6366f1' },
  { label:'FastAPI',        sub:'Upload API',          col:1, row:0, color:ORANGE },
  { label:'File Service',   sub:'Validation layer',   col:2, row:0, color:'#f59e0b' },
  { label:'Text Extractor', sub:'PDF · DOCX · TXT',   col:3, row:0, color:'#10b981' },
  { label:'Prompt Builder', sub:'Prompt Loader',       col:4, row:0, color:'#3b82f6' },
  { label:'Ollama LLM',     sub:'Gemma 4 model',       col:5, row:0, color:'#8b5cf6' },
  { label:'JSON Validator', sub:'Custom parser',       col:6, row:0, color:'#ef4444' },
  { label:'Response',       sub:'Pydantic model',      col:7, row:0, color:'#22c55e' },
]

function ArchSection() {
  const { ref, visible } = useReveal(0.1)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [glowNode, setGlowNode] = useState(0)
  const glowTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  // waveOffset drives the SVG wave translateX — moves one node-width per step
  const [waveOffset, setWaveOffset] = useState(0)
  const STEP_MS = 1400
  const N = ARCH_NODES.length

  useEffect(() => {
    if (visible) {
      // reset both on entry
      setGlowNode(0)
      setWaveOffset(0)
      glowTimer.current = setInterval(() => {
        setGlowNode(n => (n + 1) % N)
        setWaveOffset(o => o + 1)          // keeps incrementing; CSS uses modulo via translateX
      }, STEP_MS)
    } else {
      if (glowTimer.current) clearInterval(glowTimer.current)
      setGlowNode(0)
      setWaveOffset(0)
    }
    return () => { if (glowTimer.current) clearInterval(glowTimer.current) }
  }, [visible, N])

  // Each node occupies (100 / N)% of the chain width
  const nodeWidthPct = 100 / N
  // Wave translateX: move one node-width per step, wrapping at 100%
  const waveTx = `${(waveOffset % N) * nodeWidthPct}%`

  return (
    <section ref={ref} style={{
      backgroundColor: '#f9fafb', padding: 'clamp(64px,8vw,120px) clamp(20px,4vw,48px)', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes archWaveGlow {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          marginBottom: 'clamp(40px,5vw,64px)',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: `opacity 600ms ${ease}, transform 600ms ${ease}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>5</span>
            </div>
            <Pill label="Architecture" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.8rem)', fontWeight: 500, letterSpacing: '-0.02em', color: DARK, margin: '0 0 12px' }}>
            Request flow architecture
          </h2>
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.6, maxWidth: 520, margin: 0 }}>
            Watch the signal travel through each layer of the pipeline.
          </p>
        </div>

        {/* ── Wave + node chain wrapper ── */}
        <div style={{ overflowX: 'hidden', overflowY: 'visible', padding: '8px 4px 24px' }}>
          <div style={{
            position: 'relative',
            minWidth: N * 140,
            opacity: visible ? 1 : 0, transition: `opacity 700ms ${ease} 200ms`,
          }}>

            {/* ── SVG wave ribbon — sits above the nodes ── */}
            <div style={{
              position: 'relative', width: '100%', height: 48,
              marginBottom: 8, overflow: 'visible',
            }}>
              <svg
                viewBox="0 0 800 48"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '200%',   // double-wide so we can slide it
                  height: '100%',
                  transform: `translateX(calc(${waveTx} - 50%))`,
                  transition: `transform ${STEP_MS * 0.85}ms ${ease}`,
                  animation: visible ? `archWaveGlow ${STEP_MS * 2}ms ease-in-out infinite` : 'none',
                }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor={ORANGE} stopOpacity="0" />
                    <stop offset="30%"  stopColor={ORANGE} stopOpacity="0.3" />
                    <stop offset="50%"  stopColor={ORANGE} stopOpacity="1" />
                    <stop offset="70%"  stopColor={ORANGE} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
                  </linearGradient>
                  <filter id="waveBlur">
                    <feGaussianBlur stdDeviation="2" />
                  </filter>
                </defs>
                {/* Glow blur copy */}
                <path
                  d="M0,24 C100,4 200,44 400,24 C600,4 700,44 800,24"
                  fill="none"
                  stroke="url(#waveGrad)"
                  strokeWidth="8"
                  filter="url(#waveBlur)"
                />
                {/* Crisp line on top */}
                <path
                  d="M0,24 C100,4 200,44 400,24 C600,4 700,44 800,24"
                  fill="none"
                  stroke="url(#waveGrad)"
                  strokeWidth="2.5"
                />

              </svg>
            </div>

            {/* ── Node chain ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {ARCH_NODES.map((node, i) => {
                const isGlowing = glowNode === i
                const isHovered = hoveredNode === i
                const isActive = isGlowing || isHovered
                const connectorLit = i < glowNode

                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div
                      onMouseEnter={() => setHoveredNode(i)}
                      onMouseLeave={() => setHoveredNode(null)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        padding: '16px 12px', borderRadius: 14, cursor: 'default', flex: 1,
                        backgroundColor: isActive ? '#ffffff' : 'transparent',
                        border: `2px solid ${isGlowing ? node.color : 'transparent'}`,
                        outline: isGlowing ? `3px solid ${node.color}40` : 'none',
                        outlineOffset: 2,
                        boxShadow: isGlowing
                          ? `0 8px 32px ${node.color}40`
                          : isHovered
                            ? '0 8px 24px rgba(0,0,0,0.08)'
                            : 'none',
                        transition: `all 300ms ${ease}`,
                      }}
                    >
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        backgroundColor: isActive ? node.color : `${node.color}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isGlowing ? `0 0 20px ${node.color}80` : 'none',
                        transition: `background-color 300ms ${ease}, box-shadow 300ms ${ease}`,
                      }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%',
                          backgroundColor: isActive ? '#fff' : node.color,
                          transition: `background-color 300ms ${ease}`,
                        }} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isGlowing ? node.color : DARK, textAlign: 'center' as const, transition: `color 300ms ${ease}` }}>
                        {node.label}
                      </div>
                      <div style={{ fontSize: 10, color: GRAY, textAlign: 'center' as const }}>{node.sub}</div>
                    </div>

                    {i < N - 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, width: 24 }}>
                        <div style={{
                          flex: 1, height: 2, borderRadius: 9999,
                          backgroundColor: connectorLit ? ARCH_NODES[i].color : '#e5e7eb',
                          boxShadow: connectorLit ? `0 0 6px ${ARCH_NODES[i].color}80` : 'none',
                          transition: `background-color 400ms ${ease}, box-shadow 400ms ${ease}`,
                        }} />
                        <ArrowRight size={12} color={connectorLit ? ARCH_NODES[i].color : '#9ca3af'} style={{ transition: `color 400ms ${ease}` }} />
                      </div>
                    )}
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
/* ══════════════════════════════════════════
   SECTION 7 — CTA
══════════════════════════════════════════ */
function CTASection() {
  const navigate = useNavigate()
  const { ref, visible } = useReveal(0.2)
  return (
    <section ref={ref} style={{
      backgroundColor:'#ffffff', padding:'clamp(64px,8vw,120px) clamp(20px,4vw,48px)',
    }}>
      <div style={{
        maxWidth:800, margin:'0 auto', textAlign:'center' as const,
        opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(24px)',
        transition:`opacity 700ms ${ease}, transform 700ms ${ease}`,
      }}>
        <Pill label="Ready to start?" accent />
        <h2 style={{ fontSize:'clamp(1.8rem,4vw,3.2rem)',fontWeight:500,letterSpacing:'-0.02em',color:DARK,margin:'20px 0 16px' }}>
          Put the pipeline to work<br />on your contracts
        </h2>
        <p style={{ fontSize:15,color:GRAY,lineHeight:1.7,maxWidth:480,margin:'0 auto 36px' }}>
          Upload a contract and watch every step of the review pipeline execute in real time.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => navigate('/')} style={{
            display:'inline-flex', alignItems:'center', gap:8,
            backgroundColor:ORANGE, color:'#fff', borderRadius:9999,
            padding:'13px 28px', fontSize:14, fontWeight:500, border:'none', cursor:'pointer',
            transition:`background-color 300ms ${ease}`,
            boxShadow:`0 8px 24px ${ORANGE}40`,
          }}
            onMouseEnter={e=>(e.currentTarget.style.backgroundColor='#e05a1a')}
            onMouseLeave={e=>(e.currentTarget.style.backgroundColor=ORANGE)}
          >
            Back to Home <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   PAGE ROOT
══════════════════════════════════════════ */
export function ExplorePlatformPage() {
  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ width:'100%', margin:0, padding:0, backgroundColor:'#ffffff' }}>
      <Navbar />
      <HeroExplore />
      <PipelineSection />
      <TechStackSection />
      <AIModulesSection />
      <StatsSection />
      <ArchSection />
      <CTASection />
      <Footer />
    </div>
  )
}
