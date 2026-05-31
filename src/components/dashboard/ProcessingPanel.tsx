import { AlertTriangle, Check, CheckCircle, Loader2, RefreshCw } from 'lucide-react'

const colors = {
  orange: '#F26522',
  dark: '#111827',
  muted: '#6b7280',
  line: '#e5e7eb',
  white: '#ffffff',
}

const PROCESSING_STEPS = [
  'Upload received',
  'Classifying document',
  'Generating summary',
  'Finding legal risks',
  'Preparing suggestions'
]

interface ProcessingPanelProps {
  isAnalyzing: boolean
  result: any | null
  error: string | null
  onRetry: () => void
}

export function ProcessingPanel({ isAnalyzing, result, error, onRetry }: ProcessingPanelProps) {
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
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Processing</div>
          <h2 style={{ marginTop: 10, fontSize: 'clamp(1.8rem,4vw,2.8rem)', lineHeight: 1.1, fontWeight: 500, letterSpacing: '-0.01em' }}>
            AI review pipeline
          </h2>
        </div>
        {isAnalyzing ? (
          <Loader2 size={32} color={colors.orange} style={{ animation: 'spin 1s linear infinite' }} />
        ) : result ? (
          <CheckCircle size={32} color="#22c55e" />
        ) : error ? (
          <AlertTriangle size={32} color="#ef4444" />
        ) : (
          <Loader2 size={32} color="#d1d5db" />
        )}
      </div>

      <div style={{ marginTop: 30, display: 'grid', gap: 12 }}>
        {PROCESSING_STEPS.map((step, index) => {
          const complete = Boolean(result)
          const active = isAnalyzing && index === (result ? 4 : 2) // mock progression or completed state
          
          let stepBg = '#fafafa'
          let stepBorder = '1px solid #f3f4f6'
          let stepColor = colors.muted
          let circleBg = '#e5e7eb'
          let circleColor = colors.muted

          if (complete) {
            stepBg = 'rgba(34, 197, 94, 0.04)'
            stepBorder = '1px solid rgba(34, 197, 94, 0.15)'
            stepColor = '#374151'
            circleBg = '#22c55e'
            circleColor = '#ffffff'
          } else if (active) {
            stepBg = 'rgba(242, 101, 34, 0.05)'
            stepBorder = '1px solid rgba(242, 101, 34, 0.15)'
            stepColor = colors.dark
            circleBg = colors.orange
            circleColor = '#ffffff'
          }

          return (
            <div
              key={step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 12,
                backgroundColor: stepBg,
                border: stepBorder,
                transition: 'all 200ms ease',
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
                transition: 'all 200ms ease',
              }}>
                {complete ? <Check size={14} /> : <span>{index + 1}</span>}
              </div>
              <span style={{ fontSize: 15, fontWeight: complete || active ? 600 : 500, color: stepColor }}>
                {step}
              </span>
            </div>
          )
        })}
      </div>

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
