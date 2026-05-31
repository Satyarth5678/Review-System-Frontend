import { Check, X } from 'lucide-react'
import type { ReviewResult, RiskItem, SuggestionItem } from '../../types/review'

const colors = {
  orange: '#F26522',
  dark: '#111827',
  muted: '#6b7280',
  line: '#e5e7eb',
  white: '#ffffff',
}

const panelStyle = {
  backgroundColor: colors.white,
  border: '1px solid #f3f4f6',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(17,24,39,0.04)',
}

function findSuggestionMatch(suggestion: SuggestionItem, risks: RiskItem[]) {
  const target = suggestion.relatedClause.toLowerCase()
  return risks.find((risk) => {
    const haystack = `${risk.clause} ${risk.issue} ${risk.riskId}`.toLowerCase()
    return target && (haystack.includes(target.slice(0, 28)) || target.includes(risk.issue.toLowerCase().slice(0, 22)))
  })
}

function DetailBlock({ label, text }: { label: string; text: string }) {
  return (
    <div style={{
      marginTop: 14,
      padding: 14,
      borderRadius: 12,
      backgroundColor: '#fafafa',
      border: '1px solid #f3f4f6'
    }}>
      <div style={{ fontSize: 11, color: colors.orange, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <p style={{ marginTop: 6, color: '#374151', fontSize: 14, lineHeight: 1.6, margin: '6px 0 0' }}>{text}</p>
    </div>
  )
}

interface RedlinePanelProps {
  result: ReviewResult
  decisions: Record<number, 'accepted' | 'rejected'>
  onDecision: (index: number, decision: 'accepted' | 'rejected') => void
}

export function RedlinePanel({ result, decisions, onDecision }: RedlinePanelProps) {
  if (!result.suggestions.length) {
    return (
      <div style={{ ...panelStyle, padding: 28, textAlign: 'center' }}>
        <h2 style={{ marginTop: 12, fontSize: 22 }}>No suggestions returned</h2>
        <p style={{ marginTop: 8, color: colors.muted, fontSize: 14 }}>Suggestions may have been skipped because risk analysis failed.</p>
      </div>
    )
  }

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <div style={{ backgroundColor: colors.dark, color: colors.white, borderRadius: 16, padding: 'clamp(24px, 4vw, 36px)' }}>
        <div style={{ fontSize: 12, color: colors.orange, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Redline decisions</div>
        <h2 style={{ marginTop: 10, fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: 500, lineHeight: 1.15 }}>
          Accept the edits you want in the export draft.
        </h2>
        {result.overallRecommendationSummary ? (
          <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.62)', fontSize: 15, lineHeight: 1.7, margin: '12px 0 0' }}>
            {result.overallRecommendationSummary}
          </p>
        ) : null}
      </div>

      {result.suggestions.map((suggestion, index) => {
        const decision = decisions[index]
        const matchedRisk = findSuggestionMatch(suggestion, result.risks)
        
        return (
          <div
            key={`${suggestion.relatedClause}-${index}`}
            className="hover-lift"
            style={{
              ...panelStyle,
              padding: 24,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 250ms ease',
            }}
          >
            {/* Hover bottom orange accent line */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: colors.orange,
              transform: 'scaleX(0)',
              transition: 'transform 300ms ease',
              transformOrigin: 'left',
            }} className="hover-accent-line" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: colors.orange, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {suggestion.relatedClause}
                </div>
                {matchedRisk ? (
                  <div style={{ marginTop: 6, fontSize: 13, color: colors.muted, fontWeight: 500 }}>
                    Linked to {matchedRisk.riskId}
                  </div>
                ) : null}
              </div>
              {decision ? (
                <span style={{
                  borderRadius: 999,
                  padding: '6px 12px',
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: decision === 'accepted' ? '#16a34a' : '#ef4444',
                  backgroundColor: decision === 'accepted' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                }}>
                  {decision}
                </span>
              ) : null}
            </div>
            
            <p style={{ marginTop: 14, color: '#374151', fontSize: 15, lineHeight: 1.7, fontWeight: 500 }}>
              {suggestion.recommendation}
            </p>
            
            <DetailBlock label="Reason" text={suggestion.reason} />
            {suggestion.implementationExample ? (
              <DetailBlock label="Implementation example" text={suggestion.implementationExample} />
            ) : null}

            <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => onDecision(index, 'accepted')}
                style={{
                  border: 'none',
                  borderRadius: 999,
                  padding: '10px 18px',
                  backgroundColor: decision === 'accepted' ? '#16a34a' : colors.dark,
                  color: colors.white,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 150ms ease',
                  boxShadow: decision === 'accepted' ? '0 4px 12px rgba(34,197,94,0.2)' : 'none',
                }}
              >
                <Check size={14} /> Accept
              </button>
              <button
                type="button"
                onClick={() => onDecision(index, 'rejected')}
                style={{
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 999,
                  padding: '10px 18px',
                  backgroundColor: decision === 'rejected' ? '#fef2f2' : colors.white,
                  color: decision === 'rejected' ? '#ef4444' : colors.dark,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 150ms ease',
                }}
              >
                <X size={14} /> Reject
              </button>
            </div>
          </div>
        )
      })}
    </section>
  )
}
