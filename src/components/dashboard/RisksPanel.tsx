import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
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

function prettyKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function PillButton({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: `1.5px solid ${active ? colors.dark : colors.line}`,
        backgroundColor: active ? colors.dark : colors.white,
        color: active ? colors.white : colors.dark,
        borderRadius: 999,
        padding: '8px 16px',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ ...panelStyle, padding: 22 }}>
      <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700 }}>{title}</h3>
      <ul style={{ marginTop: 14, paddingLeft: 18, display: 'grid', gap: 8, color: '#374151', fontSize: 14, lineHeight: 1.6 }}>
        {items.length ? items.map((item) => <li key={item}>{item}</li>) : <li>Not clearly specified.</li>}
      </ul>
    </div>
  )
}

function DetailBlock({ label, text, danger = false }: { label: string; text: string; danger?: boolean }) {
  return (
    <div style={{
      marginTop: 18,
      padding: 16,
      borderRadius: 12,
      backgroundColor: danger ? 'rgba(239,68,68,0.04)' : '#fafafa',
      border: `1px solid ${danger ? 'rgba(239,68,68,0.12)' : '#f3f4f6'}`
    }}>
      <div style={{ fontSize: 11, color: danger ? '#ef4444' : colors.orange, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <p style={{ marginTop: 8, color: '#374151', fontSize: 14, lineHeight: 1.65, margin: '8px 0 0' }}>{text}</p>
    </div>
  )
}

interface RisksPanelProps {
  result: ReviewResult
  selectedRiskId: string | null
  onSelectRisk: (riskId: string) => void
}

export function RisksPanel({ result, selectedRiskId, onSelectRisk }: RisksPanelProps) {
  const [filter, setFilter] = useState('all')
  const selectedRisk = result.risks.find((risk) => risk.riskId === selectedRiskId) ?? result.risks[0]
  const severities = ['all', 'critical', 'high', 'medium', 'low']
  const filtered = filter === 'all' ? result.risks : result.risks.filter((risk) => String(risk.severity).toLowerCase() === filter)

  if (!result.risks.length) {
    return (
      <div style={{ ...panelStyle, padding: 28, textAlign: 'center' }}>
        <AlertTriangle size={32} color={colors.orange} style={{ margin: '0 auto' }} />
        <h2 style={{ marginTop: 12, fontSize: 22 }}>No risks returned</h2>
        <p style={{ marginTop: 8, color: colors.muted, fontSize: 14 }}>The backend did not return any risk cards for this document.</p>
      </div>
    )
  }

  return (
    <section style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {severities.map((severity) => (
          <PillButton key={severity} active={filter === severity} onClick={() => setFilter(severity)}>
            {severity === 'all' ? 'All risks' : prettyKey(severity)}
          </PillButton>
        ))}
      </div>

      <div className="risks-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 0.9fr) minmax(0, 1.1fr)', gap: 18 }}>
        <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
          {filtered.map((risk) => {
            const tone = severityTone(risk.severity)
            const active = selectedRisk?.riskId === risk.riskId
            return (
              <button
                key={risk.riskId}
                type="button"
                onClick={() => onSelectRisk(risk.riskId)}
                style={{
                  ...panelStyle,
                  padding: 16,
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: active ? `1.5px solid ${colors.orange}` : '1.5px solid #f3f4f6',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 12, color: colors.muted, fontWeight: 700 }}>{risk.riskId}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: tone.color, backgroundColor: tone.bg, borderRadius: 999, padding: '4px 10px', textTransform: 'uppercase' }}>{tone.label}</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 15, fontWeight: 700, color: colors.dark, lineHeight: 1.35 }}>{risk.issue}</div>
                <p style={{ marginTop: 8, color: colors.muted, fontSize: 13, lineHeight: 1.5, margin: '8px 0 0' }}>{risk.clause}</p>
              </button>
            )
          })}
        </div>

        {selectedRisk ? (
          <div style={{ ...panelStyle, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={18} color={severityTone(selectedRisk.severity).color} />
              <span style={{ fontSize: 12, color: colors.muted, fontWeight: 700 }}>{selectedRisk.riskId}</span>
            </div>
            <h2 style={{ marginTop: 12, fontSize: 'clamp(20px, 2.5vw, 30px)', lineHeight: 1.18, fontWeight: 600, margin: '12px 0 0' }}>
              {selectedRisk.issue}
            </h2>
            <DetailBlock label="Clause" text={selectedRisk.clause} danger />
            <DetailBlock label="Legal impact" text={selectedRisk.legalImpact} />
            <DetailBlock label="Plain-English explanation" text={selectedRisk.plainEnglishExplanation} />
          </div>
        ) : null}
      </div>

      <ListBlock title="Missing protections" items={result.missingProtections} />
      <ListBlock title="Analysis notes" items={result.analysisNotes} />
    </section>
  )
}
