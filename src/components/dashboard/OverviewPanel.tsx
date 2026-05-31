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

function severityTone(severity: unknown) {
  const normalized = String(severity).toLowerCase()
  if (normalized === 'critical') return { bg: 'rgba(127,29,29,0.1)', color: '#991b1b', label: 'Critical' }
  if (normalized === 'high') return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'High' }
  if (normalized === 'medium') return { bg: 'rgba(242,101,34,0.1)', color: colors.orange, label: 'Medium' }
  if (normalized === 'low') return { bg: 'rgba(34,197,94,0.1)', color: '#16a34a', label: 'Low' }
  return { bg: 'rgba(107,114,128,0.1)', color: colors.muted, label: String(severity || 'Unknown') }
}

function StatCard({ label, value, tone }: { label: string; value: string | number; tone?: string }) {
  return (
    <div style={{ ...panelStyle, padding: 20 }}>
      <div style={{ fontSize: 11, color: colors.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 26, lineHeight: 1, color: tone ?? colors.dark, fontWeight: 700 }}>{value}</div>
    </div>
  )
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid #f3f4f6', paddingBottom: 10 }}>
      <span style={{ color: colors.muted, fontSize: 13, fontWeight: 500 }}>{label}</span>
      <span style={{ color: colors.dark, fontSize: 14, fontWeight: 700, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

interface OverviewPanelProps {
  result: ReviewResult
  currentText: string
}

export function OverviewPanel({ result, currentText }: OverviewPanelProps) {
  const tone = severityTone(result.overallRiskLevel)
  return (
    <section style={{ display: 'grid', gap: 18 }}>
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
        <StatCard label="Document Type" value={result.classification.documentType} />
        <StatCard label="Overall risk" value={tone.label} tone={tone.color} />
        <StatCard label="Risk issues" value={result.risks.length} />
        <StatCard label="Suggestions" value={result.suggestions.length} />
      </div>

      <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(280px, 0.8fr)', gap: 18 }}>
        <div style={{ ...panelStyle, padding: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Contract preview</div>
          <pre style={{
            marginTop: 16,
            whiteSpace: 'pre-wrap',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            color: '#374151',
            fontSize: 13,
            lineHeight: 1.65,
            maxHeight: 450,
            overflow: 'auto',
            backgroundColor: '#fafafa',
            padding: 18,
            borderRadius: 12,
            border: '1px solid #e5e7eb'
          }}>
            {currentText || result.documentTextPreview || 'No preview returned by backend.'}
          </pre>
        </div>

        <div style={{ ...panelStyle, padding: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Review notes</div>
          <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
            <InfoLine label="Language" value={result.classification.language} />
            <InfoLine label="Jurisdiction" value={result.classification.jurisdiction} />
            <InfoLine label="Missing protections" value={String(result.missingProtections.length)} />
          </div>
          {result.warnings.length ? (
            <div style={{ marginTop: 18, padding: 14, borderRadius: 12, backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c2410c' }}>Backend warnings</div>
              <ul style={{ marginTop: 8, paddingLeft: 18, color: '#9a3412', fontSize: 13, lineHeight: 1.55 }}>
                {result.warnings.map((warning) => <li key={warning}>{warning}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
