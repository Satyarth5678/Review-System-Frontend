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

function prettyKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ ...panelStyle, padding: 18 }}>
      <div style={{ fontSize: 11, color: colors.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 20, lineHeight: 1.2, color: colors.dark, fontWeight: 700 }}>{value}</div>
    </div>
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

interface SummaryPanelProps {
  result: ReviewResult
}

export function SummaryPanel({ result }: SummaryPanelProps) {
  const summary = result.summary
  if (!summary) {
    return (
      <div style={{ ...panelStyle, padding: 28, textAlign: 'center' }}>
        <h2 style={{ marginTop: 12, fontSize: 22 }}>Summary unavailable</h2>
        <p style={{ marginTop: 8, color: colors.muted, fontSize: 14 }}>The backend did not return a usable contract summary.</p>
      </div>
    )
  }

  return (
    <section style={{ display: 'grid', gap: 18 }}>
      <div style={{ ...panelStyle, padding: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Executive summary</div>
        <h2 style={{ marginTop: 10, fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: 600, lineHeight: 1.2 }}>{summary.documentType}</h2>
        <p style={{ marginTop: 14, color: '#374151', fontSize: 15, lineHeight: 1.75 }}>{summary.summary}</p>
      </div>

      <div className="summary-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
        <StatCard label="Effective date" value={summary.effectiveDate} />
        <StatCard label="Duration" value={summary.duration} />
        <StatCard label="Governing law" value={summary.governingLaw} />
      </div>

      <div style={{ ...panelStyle, padding: 24 }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Key terms</h3>
        <div className="keyterms-grid" style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
          {Object.entries(summary.keyTerms).map(([key, value]) => (
            <div key={key} style={{ padding: 16, borderRadius: 12, backgroundColor: '#fafafa', border: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.orange, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{prettyKey(key)}</div>
              <p style={{ marginTop: 8, color: '#374151', fontSize: 14, lineHeight: 1.55 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="summary-lists-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
        <ListBlock title="Major obligations" items={summary.majorObligations} />
        <ListBlock title="Important clauses" items={summary.importantClauses} />
        <ListBlock title="Missing or unclear sections" items={summary.missingOrUnclearSections} />
        
        <div style={{ ...panelStyle, padding: 22 }}>
          <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700 }}>Parties</h3>
          <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
            {summary.parties.length ? summary.parties.map((party, index) => (
              <div key={`${party.name ?? 'party'}-${index}`} style={{ padding: 14, borderRadius: 12, backgroundColor: '#fafafa', border: '1px solid #f3f4f6' }}>
                {Object.entries(party).map(([key, value]) => (
                  <div key={key} style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                    <strong>{prettyKey(key)}:</strong> {value}
                  </div>
                ))}
              </div>
            )) : <p style={{ color: colors.muted, fontSize: 14 }}>Not clearly specified.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
