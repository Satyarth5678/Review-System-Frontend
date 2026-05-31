import { useMemo } from 'react'
import { Download } from 'lucide-react'
import type { ReviewResult } from '../../types/review'

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

function createTextDraft(result: ReviewResult, decisions: Record<number, 'accepted' | 'rejected'>, currentText: string) {
  const accepted = result.suggestions.filter((_, index) => decisions[index] === 'accepted')
  const lines = [
    'Lexa AI Redline Draft',
    '',
    `Document type: ${result.classification.documentType}`,
    `Language: ${result.classification.language}`,
    `Jurisdiction: ${result.classification.jurisdiction}`,
    `Overall risk: ${result.overallRiskLevel}`,
    '',
    'Original document preview (updated with accepted redlines)',
    '------------------------------------------------------------',
    currentText || result.documentTextPreview || 'No preview returned by backend.',
    '',
    'Accepted redline suggestions',
    '----------------------------',
  ]

  if (!accepted.length) {
    lines.push('No suggestions accepted yet.')
  } else {
    accepted.forEach((suggestion, index) => {
      lines.push(
        '',
        `${index + 1}. ${suggestion.relatedClause}`,
        `Recommendation: ${suggestion.recommendation}`,
        `Reason: ${suggestion.reason}`,
        suggestion.implementationExample ? `Implementation example: ${suggestion.implementationExample}` : 'Implementation example: Not provided.',
      )
    })
  }

  lines.push('', 'Note: DOCX and PDF export require backend document generation support.')
  return lines.join('\n')
}

interface ExportPanelProps {
  result: ReviewResult
  decisions: Record<number, 'accepted' | 'rejected'>
  currentText: string
}

export function ExportPanel({ result, decisions, currentText }: ExportPanelProps) {
  const acceptedCount = Object.values(decisions).filter((decision) => decision === 'accepted').length
  const draft = useMemo(() => createTextDraft(result, decisions, currentText), [result, decisions, currentText])

  const downloadText = () => {
    const blob = new Blob([draft], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'lexa-redline-draft.txt'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="export-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 360px)', gap: 18 }}>
      <div style={{ ...panelStyle, padding: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Export preview</div>
        <pre style={{
          marginTop: 16,
          whiteSpace: 'pre-wrap',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          color: '#374151',
          fontSize: 13,
          lineHeight: 1.65,
          maxHeight: 560,
          overflow: 'auto',
          backgroundColor: '#fafafa',
          padding: 18,
          borderRadius: 12,
          border: '1px solid #e5e7eb',
        }}>{draft}</pre>
      </div>

      <div style={{ ...panelStyle, padding: 24, alignSelf: 'start' }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Download draft</h2>
        <p style={{ marginTop: 10, color: colors.muted, fontSize: 14, lineHeight: 1.65 }}>
          {acceptedCount} accepted suggestion{acceptedCount === 1 ? '' : 's'} will be included in the frontend-generated text draft.
        </p>
        <button
          type="button"
          onClick={downloadText}
          style={{
            marginTop: 18,
            width: '100%',
            border: 'none',
            borderRadius: 999,
            padding: '12px 16px',
            backgroundColor: colors.orange,
            color: colors.white,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: `0 4px 12px ${colors.orange}30`,
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e05a1a'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.orange}
        >
          <Download size={16} /> Download TXT
        </button>
        {['Download DOCX', 'Download PDF'].map((label) => (
          <button
            key={label}
            type="button"
            disabled
            style={{
              marginTop: 10,
              width: '100%',
              border: '1px solid #e5e7eb',
              borderRadius: 999,
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              color: '#9ca3af',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'not-allowed',
            }}
          >
            {label} - backend pending
          </button>
        ))}
      </div>
    </section>
  )
}
