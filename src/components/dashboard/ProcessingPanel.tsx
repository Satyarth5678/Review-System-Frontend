import { useEffect, useState } from 'react'
import { AlertTriangle, Check, CheckCircle, Loader2, RefreshCw } from 'lucide-react'
import type { ReviewResult } from '../../types/review'

const colors = {
  orange: '#F26522',
  dark: '#111827',
  muted: '#6b7280',
  white: '#ffffff',
}

const PROCESSING_STEPS = [
  {
    label: 'Contract secured for review',
    detail: 'Extracting text and validating document format',
  },
  {
    label: 'Mapping contract type and context',
    detail: 'Identifying agreement category and language',
  },
  {
    label: 'Extracting key obligations and terms',
    detail: 'Building structured contract representation',
  },
  {
    label: 'Inspecting clauses for risk exposure',
    detail: 'Reviewing enforceability, ambiguity and missing protections',
  },
  {
    label: 'Preparing clause improvements',
    detail: 'Generating recommendations from identified risks',
  },
  {
    label: 'Preparing review-ready redlines',
    detail: 'Building editable clause modifications',
  },
]

const STEP_INTERVAL_MS = 35000

interface ProcessingPanelProps {
  isAnalyzing: boolean
  result: ReviewResult | null
  error: string | null
  onRetry: () => void
}

export function ProcessingPanel({ isAnalyzing, result, error, onRetry }: ProcessingPanelProps) {
  const [currentStep, setCurrentStep] = useState(() => {
    if (isAnalyzing) return 0
    if (result) return PROCESSING_STEPS.length
    return -1
  })

  const [prevIsAnalyzing, setPrevIsAnalyzing] = useState(isAnalyzing)
  const [prevResult, setPrevResult] = useState(result)

  if (isAnalyzing !== prevIsAnalyzing || result !== prevResult) {
    setPrevIsAnalyzing(isAnalyzing)
    setPrevResult(result)
    if (isAnalyzing) {
      setCurrentStep(0)
    } else if (result) {
      setCurrentStep(PROCESSING_STEPS.length)
    } else {
      setCurrentStep(-1)
    }
  }

  // Animate steps sequentially while analyzing
  useEffect(() => {
    if (!isAnalyzing) return

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= PROCESSING_STEPS.length - 1) return prev
        return prev + 1
      })
    }, STEP_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [isAnalyzing])

  const allComplete = Boolean(result) && !isAnalyzing
  return (
    <section style={{
      backgroundColor: colors.white,
      color: colors.dark,
      border: '1px solid #f3f4f6',
      borderRadius: 16,
      padding: 'clamp(24px,4vw,42px)',
      boxShadow: '0 8px 32px rgba(17,24,39,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Legal review pipeline</div>
          <h2 style={{ marginTop: 10, fontSize: 'clamp(1.8rem,4vw,2.8rem)', lineHeight: 1.1, fontWeight: 500, letterSpacing: '-0.01em' }}>
            {allComplete ? 'Review completed' : isAnalyzing ? 'Reviewing contract' : error ? 'Review interrupted' : 'Waiting to begin'}
          </h2>
        </div>
        {isAnalyzing ? (
          <Loader2 size={32} color={colors.orange} style={{ animation: 'spin 1s linear infinite' }} />
        ) : allComplete ? (
          <CheckCircle size={32} color="#22c55e" />
        ) : error ? (
          <AlertTriangle size={32} color="#ef4444" />
        ) : (
          <Loader2 size={32} color="#d1d5db" />
        )}
      </div>

      <div style={{ marginTop: 30, display: 'grid', gap: 10 }}>
        {PROCESSING_STEPS.map((step, index) => {
          const isComplete = allComplete || index < currentStep
          const isActive = isAnalyzing && index === currentStep
          const isPending = !isComplete && !isActive

          let stepBg = '#fafafa'
          let stepBorder = '1px solid #f3f4f6'
          let stepColor = colors.muted
          let circleBg = '#e5e7eb'
          let circleColor = colors.muted

          if (isComplete) {
            stepBg = 'rgba(34, 197, 94, 0.04)'
            stepBorder = '1px solid rgba(34, 197, 94, 0.15)'
            stepColor = '#374151'
            circleBg = '#22c55e'
            circleColor = '#ffffff'
          } else if (isActive) {
            stepBg = 'rgba(242, 101, 34, 0.05)'
            stepBorder = '1px solid rgba(242, 101, 34, 0.15)'
            stepColor = colors.dark
            circleBg = colors.orange
            circleColor = '#ffffff'
          }

          return (
            <div
              key={step.label}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 12,
                backgroundColor: stepBg,
                border: stepBorder,
                transition: 'all 400ms ease',
                opacity: isPending ? 0.5 : 1,
              }}
            >
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: circleBg,
                color: circleColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 12,
                fontWeight: 700,
                transition: 'all 400ms ease',
                marginTop: 1,
              }}>
                {isComplete ? (
                  <Check size={14} />
                ) : isActive ? (
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div>
                <span style={{ fontSize: 15, fontWeight: isComplete || isActive ? 600 : 500, color: stepColor, display: 'block', lineHeight: 1.35 }}>
                  {step.label}
                </span>
                <span style={{ fontSize: 13, color: colors.muted, display: 'block', marginTop: 3, lineHeight: 1.4 }}>
                  {step.detail}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {allComplete ? (
        <div style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.15)',
          fontSize: 14,
          fontWeight: 600,
          color: '#16a34a',
          textAlign: 'center',
        }}>
          Legal review completed — results ready for inspection
        </div>
      ) : null}

      {error ? (
        <div style={{
          marginTop: 24,
          padding: 18,
          borderRadius: 12,
          backgroundColor: '#fef2f2',
          border: '1.5px solid #fee2e2',
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#991b1b' }}>Review could not be completed</div>
          <p style={{ marginTop: 6, color: '#7f1d1d', fontSize: 14, lineHeight: 1.6 }}>{error}</p>
          <button
            type="button"
            onClick={onRetry}
            style={{
              marginTop: 14,
              border: 'none',
              backgroundColor: colors.orange,
              color: colors.white,
              borderRadius: 999,
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: `0 4px 12px ${colors.orange}30`,
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e05a1a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.orange}
          >
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      ) : null}
    </section>
  )
}
