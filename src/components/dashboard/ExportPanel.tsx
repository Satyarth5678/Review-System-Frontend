import { useMemo } from 'react'
import { Download } from 'lucide-react'
import type { ReviewResult, RedlineItem } from '../../types/review'

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

function createTextDraft(result: ReviewResult, redlines: RedlineItem[], currentText: string) {
  const acceptedRedlines = redlines.filter((r) => r.status === 'accepted')
  const pendingRedlines = redlines.filter((r) => r.status === 'pending')

  const lines = [
    'Lexa AI Redline Draft Report',
    '============================',
    '',
    `Document type: ${result.classification.documentType}`,
    `Language: ${result.classification.language}`,
    `Jurisdiction: ${result.classification.jurisdiction}`,
    `Overall risk: ${result.overallRiskLevel}`,
    '',
    '------------------------------------------------------------',
    'CURRENT CONTRACT TEXT (with applied changes)',
    '------------------------------------------------------------',
    currentText || result.documentTextPreview || 'No preview returned by backend.',
    '',
    '------------------------------------------------------------',
    'APPLIED REDLINES',
    '------------------------------------------------------------',
  ]

  if (!acceptedRedlines.length) {
    lines.push('No redlines have been applied to the contract text yet.')
  } else {
    acceptedRedlines.forEach((redline, index) => {
      lines.push(
        `${index + 1}. Redline ID: ${redline.redlineId}`,
        `   Original Text: "${redline.originalText}"`,
        `   Replacement:   "${redline.replacementText}"`,
        redline.reason ? `   Reason:        ${redline.reason}` : '',
        ''
      )
    })
  }

  lines.push(
    '',
    '------------------------------------------------------------',
    'PENDING PROPOSALS (not yet applied)',
    '------------------------------------------------------------'
  )

  if (!pendingRedlines.length) {
    lines.push('No pending redline proposals.')
  } else {
    pendingRedlines.forEach((redline, index) => {
      lines.push(
        `${index + 1}. Redline ID: ${redline.redlineId}`,
        `   Original Text: "${redline.originalText}"`,
        `   Replacement:   "${redline.replacementText}"`,
        redline.reason ? `   Reason:        ${redline.reason}` : '',
        ''
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
  redlines: RedlineItem[]
}

export function ExportPanel({ result, currentText, redlines }: ExportPanelProps) {
  const acceptedCount = redlines.filter((r) => r.status === 'accepted').length
  const pendingCount = redlines.filter((r) => r.status === 'pending').length
  const draft = useMemo(() => createTextDraft(result, redlines, currentText), [result, redlines, currentText])

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
          Your draft has <strong>{acceptedCount}</strong> applied change{acceptedCount === 1 ? '' : 's'} and <strong>{pendingCount}</strong> pending proposal{pendingCount === 1 ? '' : 's'}.
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
