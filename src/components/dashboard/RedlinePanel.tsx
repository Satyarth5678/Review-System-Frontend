import { Check, X, RotateCcw, Clock, GitBranch } from 'lucide-react'
import type { ReviewResult, RiskItem, SuggestionItem, RedlineItem, VersionSnapshot } from '../../types/review'

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
  // First try matching by riskId directly
  if (suggestion.riskId && suggestion.riskId !== 'Not available') {
    const match = risks.find((r) => r.riskId === suggestion.riskId)
    if (match) return match
  }
  // Fallback: fuzzy match on clause text
  const target = suggestion.relatedClause.toLowerCase()
  return risks.find((risk) => {
    const haystack = `${risk.clause} ${risk.issue} ${risk.riskId}`.toLowerCase()
    return target && (haystack.includes(target.slice(0, 28)) || target.includes(risk.issue.toLowerCase().slice(0, 22)))
  })
}

function DetailBlock({ label, text }: { label: string; text: string }) {
  if (!text || text === 'Not available') return null
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

function DiffBlock({ original, replacement }: { original: string; replacement: string }) {
  if (!original && !replacement) return null
  return (
    <div style={{
      marginTop: 14,
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
    }}>
      {original ? (
        <div style={{ padding: '12px 14px', backgroundColor: 'rgba(239,68,68,0.04)', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Original</div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: '#991b1b', textDecoration: 'line-through', textDecorationColor: 'rgba(239,68,68,0.4)' }}>{original}</p>
        </div>
      ) : null}
      {replacement ? (
        <div style={{ padding: '12px 14px', backgroundColor: 'rgba(34,197,94,0.04)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#16a34a', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Replacement</div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: '#166534' }}>{replacement}</p>
        </div>
      ) : null}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isPending = status === 'pending'
  return (
    <span style={{
      borderRadius: 999,
      padding: '5px 12px',
      fontSize: 11,
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: isPending ? colors.orange : '#16a34a',
      backgroundColor: isPending ? 'rgba(242,101,34,0.08)' : 'rgba(34,197,94,0.08)',
    }}>
      {status}
    </span>
  )
}

interface RedlinePanelProps {
  result: ReviewResult
  decisions: Record<number, 'accepted' | 'rejected'>
  onDecision: (index: number, decision: 'accepted' | 'rejected') => void
  redlines: RedlineItem[]
  versions: VersionSnapshot[]
  onAcceptRedline: (redlineId: string) => void
  onRollback: () => void
}

export function RedlinePanel({ result, decisions, onDecision, redlines, versions, onAcceptRedline, onRollback }: RedlinePanelProps) {
  const pendingRedlines = redlines.filter((r) => r.status === 'pending')
  const acceptedRedlines = redlines.filter((r) => r.status === 'accepted')

  return (
    <section style={{ display: 'grid', gap: 18 }}>
      {/* Header */}
      <div style={{ backgroundColor: colors.dark, color: colors.white, borderRadius: 16, padding: 'clamp(24px, 4vw, 36px)' }}>
        <div style={{ fontSize: 12, color: colors.orange, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Redline workspace</div>
        <h2 style={{ marginTop: 10, fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: 500, lineHeight: 1.15 }}>
          Review suggestions, propose changes, apply redlines.
        </h2>
        {result.overallRecommendationSummary ? (
          <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.62)', fontSize: 15, lineHeight: 1.7, margin: '12px 0 0' }}>
            {result.overallRecommendationSummary}
          </p>
        ) : null}
        <div style={{ marginTop: 18, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ color: colors.orange, fontWeight: 700 }}>{result.suggestions.length}</span> suggestions
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ color: colors.orange, fontWeight: 700 }}>{pendingRedlines.length}</span> pending
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ color: '#22c55e', fontWeight: 700 }}>{acceptedRedlines.length}</span> applied
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ fontWeight: 700 }}>{versions.length}</span> versions
          </div>
        </div>
      </div>

      {/* ─── Section: Pending Redlines ─── */}
      {pendingRedlines.length > 0 ? (
        <>
          <div style={{ fontSize: 12, fontWeight: 800, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 8 }}>
            Pending redlines — review and apply
          </div>
          {pendingRedlines.map((redline) => (
            <div
              key={redline.redlineId}
              className="hover-lift"
              style={{
                ...panelStyle,
                padding: 24,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 250ms ease',
                borderLeft: `3px solid ${colors.orange}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={14} color={colors.orange} />
                  <span style={{ fontSize: 12, color: colors.muted, fontWeight: 600 }}>
                    {redline.redlineId.slice(0, 8)}…
                  </span>
                </div>
                <StatusBadge status={redline.status} />
              </div>

              <DiffBlock original={redline.originalText} replacement={redline.replacementText} />

              {redline.reason ? (
                <p style={{ marginTop: 12, fontSize: 13, color: colors.muted, lineHeight: 1.55 }}>
                  <strong>Reason:</strong> {redline.reason}
                </p>
              ) : null}

              <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => onAcceptRedline(redline.redlineId)}
                  style={{
                    border: 'none',
                    borderRadius: 999,
                    padding: '10px 20px',
                    backgroundColor: colors.dark,
                    color: colors.white,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.orange }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.dark }}
                >
                  <Check size={14} /> Apply to contract
                </button>
              </div>
            </div>
          ))}
        </>
      ) : null}

      {/* ─── Section: Version Control ─── */}
      <div style={{
        ...panelStyle,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GitBranch size={16} color={colors.muted} />
          <span style={{ fontSize: 14, fontWeight: 600, color: colors.dark }}>
            {versions.length} version{versions.length === 1 ? '' : ' snapshots'} available
          </span>
          {versions.length > 0 ? (
            <span style={{ fontSize: 12, color: colors.muted }}>
              · last saved {new Date(versions[versions.length - 1].timestamp).toLocaleTimeString()}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onRollback}
          disabled={versions.length === 0}
          style={{
            border: '1.5px solid #e5e7eb',
            borderRadius: 999,
            padding: '8px 16px',
            backgroundColor: versions.length > 0 ? colors.white : '#f9fafb',
            color: versions.length > 0 ? colors.dark : '#9ca3af',
            cursor: versions.length > 0 ? 'pointer' : 'not-allowed',
            fontSize: 13,
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            if (versions.length > 0) {
              e.currentTarget.style.borderColor = colors.orange
              e.currentTarget.style.color = colors.orange
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb'
            e.currentTarget.style.color = versions.length > 0 ? colors.dark : '#9ca3af'
          }}
        >
          <RotateCcw size={13} /> Undo last change
        </button>
      </div>

      {/* ─── Section: AI Suggestions ─── */}
      {result.suggestions.length > 0 ? (
        <>
          <div style={{ fontSize: 12, fontWeight: 800, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 8 }}>
            AI-generated suggestions
          </div>
          {result.suggestions.map((suggestion, index) => {
            const decision = decisions[index]
            const matchedRisk = findSuggestionMatch(suggestion, result.risks)
            const hasRedlineData = (suggestion.anchorText && suggestion.anchorText !== 'Not available') ||
                                   (suggestion.insertionAnchor && suggestion.insertionAnchor !== 'Not available')
            
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
                  opacity: decision === 'rejected' ? 0.55 : 1,
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
                      {decision === 'accepted' ? 'Proposed' : 'Rejected'}
                    </span>
                  ) : null}
                </div>
                
                <p style={{ marginTop: 14, color: '#374151', fontSize: 15, lineHeight: 1.7, fontWeight: 500 }}>
                  {suggestion.recommendation}
                </p>
                
                <DetailBlock label="Reason" text={suggestion.reason} />
                <DetailBlock label="Implementation example" text={suggestion.implementationExample} />
                
                {/* Show the proposed text change if available */}
                {hasRedlineData ? (
                  <DiffBlock
                    original={suggestion.anchorText !== 'Not available' ? suggestion.anchorText : ''}
                    replacement={suggestion.replacementText !== 'Not available' ? suggestion.replacementText : ''}
                  />
                ) : null}

                {!decision ? (
                  <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => onDecision(index, 'accepted')}
                      disabled={!hasRedlineData}
                      title={hasRedlineData ? 'Propose this change as a pending redline' : 'No anchor text available for this suggestion'}
                      style={{
                        border: 'none',
                        borderRadius: 999,
                        padding: '10px 18px',
                        backgroundColor: hasRedlineData ? colors.dark : '#d1d5db',
                        color: colors.white,
                        cursor: hasRedlineData ? 'pointer' : 'not-allowed',
                        fontSize: 13,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 150ms ease',
                      }}
                      onMouseEnter={(e) => { if (hasRedlineData) e.currentTarget.style.backgroundColor = colors.orange }}
                      onMouseLeave={(e) => { if (hasRedlineData) e.currentTarget.style.backgroundColor = colors.dark }}
                    >
                      <Check size={14} /> Propose redline
                    </button>
                    <button
                      type="button"
                      onClick={() => onDecision(index, 'rejected')}
                      style={{
                        border: '1.5px solid #e5e7eb',
                        borderRadius: 999,
                        padding: '10px 18px',
                        backgroundColor: colors.white,
                        color: colors.dark,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        transition: 'all 150ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = colors.orange
                        e.currentTarget.style.color = colors.orange
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb'
                        e.currentTarget.style.color = colors.dark
                      }}
                    >
                      <X size={14} /> Dismiss
                    </button>
                  </div>
                ) : null}
              </div>
            )
          })}
        </>
      ) : (
        <div style={{ ...panelStyle, padding: 28, textAlign: 'center' }}>
          <h2 style={{ marginTop: 12, fontSize: 22 }}>No suggestions returned</h2>
          <p style={{ marginTop: 8, color: colors.muted, fontSize: 14 }}>Suggestions may have been skipped because risk analysis failed.</p>
        </div>
      )}

      {/* ─── Section: Applied Changes Summary ─── */}
      {acceptedRedlines.length > 0 ? (
        <>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#16a34a', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 8 }}>
            Applied changes ({acceptedRedlines.length})
          </div>
          {acceptedRedlines.map((redline) => (
            <div
              key={redline.redlineId}
              style={{
                ...panelStyle,
                padding: '16px 20px',
                borderLeft: '3px solid #22c55e',
                opacity: 0.75,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: colors.muted, fontWeight: 600 }}>
                  {redline.redlineId.slice(0, 8)}…
                </span>
                <StatusBadge status="accepted" />
              </div>
              <DiffBlock original={redline.originalText} replacement={redline.replacementText} />
            </div>
          ))}
        </>
      ) : null}
    </section>
  )
}
