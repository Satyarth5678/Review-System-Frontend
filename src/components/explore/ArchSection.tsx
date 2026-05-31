import React, { useEffect, useRef, useState } from 'react'

const ORANGE = '#F26522'
const DARK = '#111827'
const GRAY = '#6b7280'

const ARCH_NODES = [
  { label: 'Client', sub: 'Browser / App', color: '#6366f1' },
  { label: 'FastAPI', sub: 'Upload API', color: ORANGE },
  { label: 'File Service', sub: 'Validation layer', color: '#f59e0b' },
  { label: 'Text Extractor', sub: 'PDF · DOCX · TXT', color: '#10b981' },
  { label: 'Prompt Builder', sub: 'Prompt Loader', color: '#3b82f6' },
  { label: 'Ollama LLM', sub: 'Gemma 4 model', color: '#8b5cf6' },
  { label: 'JSON Validator', sub: 'Custom parser', color: '#ef4444' },
  { label: 'Response', sub: 'Pydantic model', color: '#22c55e' },
]

function Pill({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
      textTransform: 'uppercase',
      backgroundColor: 'rgba(17,24,39,0.06)',
      color: DARK,
      borderRadius: 9999, padding: '4px 12px',
    }}>{label}</span>
  )
}

export function ArchSection() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [glowNode, setGlowNode] = useState(0)
  const glowTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const STEP_MS = 1000 // Faster, smoother steps
  const N = ARCH_NODES.length
  const CYCLE_MS = STEP_MS * N

  useEffect(() => {
    glowTimer.current = setInterval(() => {
      setGlowNode(n => (n + 1) % N)
    }, STEP_MS)
    return () => { if (glowTimer.current) clearInterval(glowTimer.current) }
  }, [N])

  return (
    <section style={{
      backgroundColor: '#f9fafb', padding: 'clamp(64px,8vw,120px) clamp(20px,4vw,48px)', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes waveFlowEffect {
          0% {
            stroke-dashoffset: 112.5;
          }
          87.5% {
            stroke-dashoffset: 12.5;
          }
          100% {
            stroke-dashoffset: 12.5;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(40px,5vw,64px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>5</span>
            </div>
            <Pill label="Architecture" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem,3.6vw,3rem)', fontWeight: 500, letterSpacing: '-0.02em', color: DARK, margin: '0 0 12px' }}>
            Request flow architecture
          </h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.6, maxWidth: 520, margin: 0 }}>
            Watch the signal travel through each layer of the pipeline.
          </p>
        </div>

        {/* ── Wave + node chain wrapper ── */}
        <div style={{ overflowX: 'auto', overflowY: 'visible', padding: '8px 4px 24px' }}>
          <div style={{
            position: 'relative',
            minWidth: N * 140,
          }}>

            {/* ── SVG wave ribbon — sits above the nodes ── */}
            <div style={{
              position: 'relative', width: '100%', height: 100,
              marginBottom: 16, overflow: 'visible',
              zIndex: 10,
            }}>
              <svg
                viewBox="0 0 800 100"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '100%', height: '100%',
                  overflow: 'visible', pointerEvents: 'none',
                }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="waveFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="25%" stopColor={ORANGE} />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="75%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <filter id="waveBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="16" />
                  </filter>
                </defs>

                {/* 1. Underlying connection background line */}
                <path
                  d="M 0,50 Q 200,0 400,50 T 800,50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* 2. Flowing thick blurred glow path (underneath) */}
                <path
                  d="M 0,50 Q 200,0 400,50 T 800,50"
                  fill="none"
                  stroke={ORANGE}
                  strokeWidth="16"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="25 75"
                  filter="url(#waveBlur)"
                  style={{
                    animation: `waveFlowEffect ${CYCLE_MS}ms linear infinite`,
                    opacity: 1,
                  }}
                />

                {/* 3. Flowing crisp overlay path (top) */}
                <path
                  d="M 0,50 Q 200,0 400,50 T 800,50"
                  fill="none"
                  stroke="url(#waveFlowGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="25 75"
                  style={{
                    animation: `waveFlowEffect ${CYCLE_MS}ms linear infinite`,
                  }}
                />
              </svg>
            </div>

            {/* ── Node chain ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {ARCH_NODES.map((node, i) => {
                const isGlowing = glowNode === i
                const isHovered = hoveredNode === i
                const isActive = isGlowing || isHovered

                // Pulse connector ahead of the glowing node
                const connectorLit = glowNode === i || glowNode === i + 1

                return (
                  <React.Fragment key={i}>
                    <div
                      onMouseEnter={() => setHoveredNode(i)}
                      onMouseLeave={() => setHoveredNode(null)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        padding: '16px 12px', borderRadius: 14, cursor: 'default', flex: 1,
                        backgroundColor: isActive ? '#ffffff' : 'transparent',
                        border: `1px solid ${isGlowing ? `${node.color}40` : 'transparent'}`,
                        boxShadow: isGlowing
                          ? `0 0 20px ${node.color}15, 0 8px 16px ${node.color}10`
                          : isHovered
                            ? '0 8px 24px rgba(0,0,0,0.06)'
                            : 'none',
                        transition: 'all 500ms ease',
                      }}
                    >
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        backgroundColor: isActive ? node.color : `${node.color}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isGlowing ? `0 0 16px ${node.color}50` : 'none',
                        transition: 'all 500ms ease',
                      }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%',
                          backgroundColor: isActive ? '#fff' : node.color,
                          transition: 'background-color 500ms ease',
                        }} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isGlowing ? node.color : DARK, textAlign: 'center', transition: 'color 500ms ease' }}>
                        {node.label}
                      </div>
                      <div style={{ fontSize: 11, color: GRAY, textAlign: 'center' }}>{node.sub}</div>
                    </div>

                    {i < N - 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, width: 24, justifyContent: 'center' }}>
                        <svg width="24" height="12" viewBox="0 0 24 12" style={{ overflow: 'visible' }}>
                          <path
                            d="M 0,6 L 20,6 M 15,1 L 20,6 L 15,11"
                            fill="none"
                            stroke={connectorLit ? ARCH_NODES[i].color : '#e5e7eb'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              transition: 'all 500ms ease',
                              filter: connectorLit ? `drop-shadow(0 0 4px ${ARCH_NODES[i].color}80)` : 'none'
                            }}
                          />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
