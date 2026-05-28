import { useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  FolderUp,
  Loader2,
  RefreshCw,
  Scale,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { analyzeContract } from '../lib/reviewApi'
import type { ReviewResult, RiskItem, Severity, SuggestionItem } from '../types/review'
import { useWindowWidth } from '../hooks/useWindowWidth'

type StepId = 'upload' | 'processing' | 'overview' | 'summary' | 'risks' | 'redline' | 'export'
type SuggestionDecision = 'accepted' | 'rejected'

const STEPS: Array<{ id: StepId; label: string; icon: typeof FileText }> = [
  { id: 'upload', label: 'Upload', icon: FolderUp },
  { id: 'processing', label: 'Processing', icon: Loader2 },
  { id: 'overview', label: 'Overview', icon: ClipboardList },
  { id: 'summary', label: 'Summary', icon: BookOpen },
  { id: 'risks', label: 'Risks', icon: ShieldAlert },
  { id: 'redline', label: 'Redline', icon: Sparkles },
  { id: 'export', label: 'Export', icon: Download },
]

const PROCESSING_STEPS = ['Upload received', 'Classifying document', 'Generating summary', 'Finding legal risks', 'Preparing suggestions']
const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
const ACCEPTED_EXTENSIONS = ['pdf', 'docx', 'txt']

const colors = {
  orange: '#F26522',
  dark: '#111827',
  muted: '#6b7280',
  line: '#e5e7eb',
  soft: '#f5f5f5',
  white: '#ffffff',
}

const pageShell: CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.soft,
  color: colors.dark,
  overflowX: 'hidden',
}

const panelStyle: CSSProperties = {
  backgroundColor: colors.white,
  border: '1px solid #f3f4f6',
  borderRadius: 8,
  boxShadow: '0 10px 34px rgba(17,24,39,0.06)',
}

function severityTone(severity: Severity) {
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

function isAcceptedFile(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(extension)
}

function findSuggestionMatch(suggestion: SuggestionItem, risks: RiskItem[]) {
  const target = suggestion.relatedClause.toLowerCase()
  return risks.find((risk) => {
    const haystack = `${risk.clause} ${risk.issue} ${risk.riskId}`.toLowerCase()
    return target && (haystack.includes(target.slice(0, 28)) || target.includes(risk.issue.toLowerCase().slice(0, 22)))
  })
}

function createTextDraft(result: ReviewResult, decisions: Record<number, SuggestionDecision>) {
  const accepted = result.suggestions.filter((_, index) => decisions[index] === 'accepted')
  const lines = [
    'Lexa AI Redline Draft',
    '',
    `Document type: ${result.classification.documentType}`,
    `Language: ${result.classification.language}`,
    `Jurisdiction: ${result.classification.jurisdiction}`,
    `Overall risk: ${result.overallRiskLevel}`,
    '',
    'Original document preview',
    '-------------------------',
    result.documentTextPreview || 'No preview returned by backend.',
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

function PillButton({
  children,
  onClick,
  active = false,
  disabled = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: `1px solid ${active ? colors.dark : colors.line}`,
        backgroundColor: active ? colors.dark : colors.white,
        color: active ? colors.white : disabled ? '#9ca3af' : colors.dark,
        borderRadius: 999,
        padding: '8px 14px',
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'all 200ms',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

function StatCard({ label, value, tone }: { label: string; value: string | number; tone?: string }) {
  return (
    <div style={{ ...panelStyle, padding: 18 }}>
      <div style={{ fontSize: 11, color: colors.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1, color: tone ?? colors.dark, fontWeight: 600 }}>{value}</div>
    </div>
  )
}

function DashboardHeader({ onBack }: { onBack: () => void }) {
  return (
    <header style={{ padding: '12px clamp(16px,3vw,32px)', backgroundColor: '#EFEFEF', borderBottom: '1px solid rgba(17,24,39,0.08)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to landing page"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: colors.dark,
              color: colors.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Lexa AI Workspace</div>
            <div style={{ fontSize: 12, color: colors.muted }}>Contract review, risk analysis, and redline prep</div>
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: colors.white, borderRadius: 999, padding: '7px 12px', border: '1px solid #f3f4f6' }}>
          <Scale size={14} color={colors.orange} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>Local AI Review</span>
        </div>
      </div>
    </header>
  )
}

function StepRail({
  activeStep,
  result,
  isAnalyzing,
  onStepChange,
}: {
  activeStep: StepId
  result: ReviewResult | null
  isAnalyzing: boolean
  onStepChange: (step: StepId) => void
}) {
  return (
    <aside style={{ ...panelStyle, padding: 12, position: 'sticky', top: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {STEPS.map(({ id, label, icon: Icon }) => {
          const disabled = id !== 'upload' && !result && !(id === 'processing' && isAnalyzing)
          const active = activeStep === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => !disabled && onStepChange(id)}
              disabled={disabled}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                border: 'none',
                borderRadius: 8,
                padding: '11px 12px',
                backgroundColor: active ? colors.dark : 'transparent',
                color: active ? colors.white : disabled ? '#9ca3af' : colors.dark,
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: 13,
                fontWeight: 600,
                textAlign: 'left',
              }}
            >
              <Icon size={16} color={active ? colors.white : disabled ? '#9ca3af' : colors.orange} />
              <span style={{ flex: 1 }}>{label}</span>
              {active ? <ChevronRight size={14} /> : null}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

function UploadPanel({
  file,
  error,
  onFileSelect,
  onAnalyze,
}: {
  file: File | null
  error: string | null
  onFileSelect: (file: File) => void
  onAnalyze: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    const selected = files?.[0]
    if (selected) onFileSelect(selected)
  }

  return (
    <section style={{ ...panelStyle, padding: 'clamp(22px,4vw,36px)' }}>
      <div className="upload-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(260px, 0.85fr)', gap: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Upload contract</div>
          <h1 style={{ marginTop: 12, fontSize: 'clamp(1.9rem,5vw,4rem)', lineHeight: 1.04, fontWeight: 500, letterSpacing: '-0.02em' }}>
            Review a contract without losing the legal context.
          </h1>
          <p style={{ marginTop: 18, maxWidth: 620, color: colors.muted, fontSize: 15, lineHeight: 1.7 }}>
            Upload a PDF, DOCX, or TXT file. Lexa will classify the agreement, summarize key terms, flag risky clauses, and prepare practical redline suggestions.
          </p>
          <div style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['PDF', 'DOCX', 'TXT'].map((item) => <PillButton key={item}>{item}</PillButton>)}
          </div>
        </div>

        <div
          onDragEnter={(event) => { event.preventDefault(); setDragging(true) }}
          onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            handleFiles(event.dataTransfer.files)
          }}
          style={{
            minHeight: 310,
            border: `1.5px dashed ${dragging ? colors.orange : '#d1d5db'}`,
            borderRadius: 8,
            backgroundColor: dragging ? 'rgba(242,101,34,0.05)' : '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            transition: 'all 200ms',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(event) => handleFiles(event.target.files)}
            style={{ display: 'none' }}
          />
          <div style={{ width: 62, height: 62, borderRadius: '50%', backgroundColor: colors.dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FolderUp size={26} color={colors.white} />
          </div>
          <div style={{ marginTop: 18, fontSize: 17, fontWeight: 700 }}>{file ? file.name : 'Drop your contract here'}</div>
          <div style={{ marginTop: 8, color: colors.muted, fontSize: 13, lineHeight: 1.5 }}>
            {file ? `${Math.max(file.size / 1024, 1).toFixed(1)} KB selected` : 'or choose a file from your device'}
          </div>
          <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                border: '1px solid #d1d5db',
                backgroundColor: colors.white,
                color: colors.dark,
                borderRadius: 999,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Choose file
            </button>
            <button
              type="button"
              onClick={onAnalyze}
              disabled={!file}
              style={{
                border: 'none',
                backgroundColor: file ? colors.orange : '#d1d5db',
                color: colors.white,
                borderRadius: 999,
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: 700,
                cursor: file ? 'pointer' : 'not-allowed',
              }}
            >
              Analyze contract
            </button>
          </div>
          {error ? <div style={{ marginTop: 16, color: '#ef4444', fontSize: 13, lineHeight: 1.5 }}>{error}</div> : null}
        </div>
      </div>
    </section>
  )
}

function ProcessingPanel({ isAnalyzing, result, error, onRetry }: {
  isAnalyzing: boolean
  result: ReviewResult | null
  error: string | null
  onRetry: () => void
}) {
  return (
    <section style={{ backgroundColor: colors.dark, color: colors.white, borderRadius: 8, padding: 'clamp(24px,4vw,42px)', boxShadow: '0 20px 60px rgba(17,24,39,0.24)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Processing</div>
          <h2 style={{ marginTop: 10, fontSize: 'clamp(1.8rem,4vw,3.2rem)', lineHeight: 1.08, fontWeight: 500 }}>AI review pipeline</h2>
        </div>
        {isAnalyzing ? <Loader2 size={32} color={colors.orange} style={{ animation: 'spin 1s linear infinite' }} /> : result ? <CheckCircle size={32} color="#22c55e" /> : <AlertTriangle size={32} color="#ef4444" />}
      </div>
      <div style={{ marginTop: 30, display: 'grid', gap: 10 }}>
        {PROCESSING_STEPS.map((step, index) => {
          const complete = Boolean(result)
          const active = isAnalyzing && index <= 4
          return (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderRadius: 8, backgroundColor: active ? 'rgba(242,101,34,0.09)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: complete ? '#22c55e' : active ? colors.orange : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {complete ? <Check size={13} /> : <span style={{ fontSize: 11, fontWeight: 700 }}>{index + 1}</span>}
              </div>
              <span style={{ fontSize: 14, color: complete || active ? colors.white : 'rgba(255,255,255,0.45)' }}>{step}</span>
            </div>
          )
        })}
      </div>
      {error ? (
        <div style={{ marginTop: 24, padding: 16, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fecaca' }}>Review could not be completed</div>
          <p style={{ marginTop: 6, color: 'rgba(255,255,255,0.68)', fontSize: 13, lineHeight: 1.6 }}>{error}</p>
          <button type="button" onClick={onRetry} style={{ marginTop: 12, border: 'none', backgroundColor: colors.orange, color: colors.white, borderRadius: 999, padding: '9px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      ) : null}
    </section>
  )
}

function OverviewPanel({ result }: { result: ReviewResult }) {
  const tone = severityTone(result.overallRiskLevel)
  return (
    <section style={{ display: 'grid', gap: 18 }}>
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
        <StatCard label="Document" value={result.classification.documentType} />
        <StatCard label="Overall risk" value={tone.label} tone={tone.color} />
        <StatCard label="Risk issues" value={result.risks.length} />
        <StatCard label="Suggestions" value={result.suggestions.length} />
      </div>
      <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(280px, 0.8fr)', gap: 18 }}>
        <div style={{ ...panelStyle, padding: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Contract preview</div>
          <pre style={{ marginTop: 16, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', color: '#374151', fontSize: 12, lineHeight: 1.65, maxHeight: 430, overflow: 'auto' }}>
            {result.documentTextPreview || 'No preview returned by backend.'}
          </pre>
        </div>
        <div style={{ ...panelStyle, padding: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Review notes</div>
          <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
            <InfoLine label="Language" value={result.classification.language} />
            <InfoLine label="Jurisdiction" value={result.classification.jurisdiction} />
            <InfoLine label="Missing protections" value={String(result.missingProtections.length)} />
          </div>
          {result.warnings.length ? (
            <div style={{ marginTop: 18, padding: 13, borderRadius: 8, backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#c2410c' }}>Backend warnings</div>
              <ul style={{ marginTop: 8, paddingLeft: 18, color: '#9a3412', fontSize: 12, lineHeight: 1.55 }}>
                {result.warnings.map((warning) => <li key={warning}>{warning}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid #f3f4f6', paddingBottom: 10 }}>
      <span style={{ color: colors.muted, fontSize: 12 }}>{label}</span>
      <span style={{ color: colors.dark, fontSize: 13, fontWeight: 700, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ ...panelStyle, padding: 20 }}>
      <h3 style={{ fontSize: 15, margin: 0 }}>{title}</h3>
      <ul style={{ marginTop: 14, paddingLeft: 18, display: 'grid', gap: 8, color: '#374151', fontSize: 13, lineHeight: 1.55 }}>
        {items.length ? items.map((item) => <li key={item}>{item}</li>) : <li>Not clearly specified.</li>}
      </ul>
    </div>
  )
}

function SummaryPanel({ result }: { result: ReviewResult }) {
  const summary = result.summary
  if (!summary) {
    return <EmptyPanel title="Summary unavailable" text="The backend did not return a usable contract summary." />
  }

  return (
    <section style={{ display: 'grid', gap: 18 }}>
      <div style={{ ...panelStyle, padding: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Executive summary</div>
        <h2 style={{ marginTop: 10, fontSize: 28, fontWeight: 500, lineHeight: 1.2 }}>{summary.documentType}</h2>
        <p style={{ marginTop: 14, color: '#374151', fontSize: 14, lineHeight: 1.75 }}>{summary.summary}</p>
      </div>
      <div className="summary-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
        <StatCard label="Effective date" value={summary.effectiveDate} />
        <StatCard label="Duration" value={summary.duration} />
        <StatCard label="Governing law" value={summary.governingLaw} />
      </div>
      <div style={{ ...panelStyle, padding: 22 }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>Key terms</h3>
        <div className="keyterms-grid" style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          {Object.entries(summary.keyTerms).map(([key, value]) => (
            <div key={key} style={{ padding: 14, borderRadius: 8, backgroundColor: '#fafafa', border: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.orange, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{prettyKey(key)}</div>
              <p style={{ marginTop: 8, color: '#374151', fontSize: 13, lineHeight: 1.55 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="summary-lists-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
        <ListBlock title="Major obligations" items={summary.majorObligations} />
        <ListBlock title="Important clauses" items={summary.importantClauses} />
        <ListBlock title="Missing or unclear sections" items={summary.missingOrUnclearSections} />
        <div style={{ ...panelStyle, padding: 20 }}>
          <h3 style={{ fontSize: 15, margin: 0 }}>Parties</h3>
          <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
            {summary.parties.length ? summary.parties.map((party, index) => (
              <div key={`${party.name ?? 'party'}-${index}`} style={{ padding: 12, borderRadius: 8, backgroundColor: '#fafafa', border: '1px solid #f3f4f6' }}>
                {Object.entries(party).map(([key, value]) => (
                  <div key={key} style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
                    <strong>{prettyKey(key)}:</strong> {value}
                  </div>
                ))}
              </div>
            )) : <p style={{ color: colors.muted, fontSize: 13 }}>Not clearly specified.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}

function RisksPanel({
  result,
  selectedRiskId,
  onSelectRisk,
}: {
  result: ReviewResult
  selectedRiskId: string | null
  onSelectRisk: (riskId: string) => void
}) {
  const [filter, setFilter] = useState('all')
  const selectedRisk = result.risks.find((risk) => risk.riskId === selectedRiskId) ?? result.risks[0]
  const severities = ['all', 'critical', 'high', 'medium', 'low']
  const filtered = filter === 'all' ? result.risks : result.risks.filter((risk) => String(risk.severity).toLowerCase() === filter)

  if (!result.risks.length) {
    return <EmptyPanel title="No risks returned" text="The backend did not return any risk cards for this document." />
  }

  return (
    <section style={{ display: 'grid', gap: 16 }}>
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
                  border: active ? `1px solid ${colors.orange}` : '1px solid #f3f4f6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 12, color: colors.muted, fontWeight: 700 }}>{risk.riskId}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: tone.color, backgroundColor: tone.bg, borderRadius: 999, padding: '4px 8px', textTransform: 'uppercase' }}>{tone.label}</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: colors.dark, lineHeight: 1.35 }}>{risk.issue}</div>
                <p style={{ marginTop: 8, color: colors.muted, fontSize: 12, lineHeight: 1.5 }}>{risk.clause}</p>
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
            <h2 style={{ marginTop: 12, fontSize: 26, lineHeight: 1.18, fontWeight: 500 }}>{selectedRisk.issue}</h2>
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

function DetailBlock({ label, text, danger = false }: { label: string; text: string; danger?: boolean }) {
  return (
    <div style={{ marginTop: 18, padding: 15, borderRadius: 8, backgroundColor: danger ? 'rgba(239,68,68,0.05)' : '#fafafa', border: `1px solid ${danger ? 'rgba(239,68,68,0.14)' : '#f3f4f6'}` }}>
      <div style={{ fontSize: 11, color: danger ? '#ef4444' : colors.orange, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <p style={{ marginTop: 8, color: '#374151', fontSize: 13, lineHeight: 1.65 }}>{text}</p>
    </div>
  )
}

function RedlinePanel({
  result,
  decisions,
  onDecision,
}: {
  result: ReviewResult
  decisions: Record<number, SuggestionDecision>
  onDecision: (index: number, decision: SuggestionDecision) => void
}) {
  if (!result.suggestions.length) {
    return <EmptyPanel title="No suggestions returned" text="Suggestions may have been skipped because risk analysis failed." />
  }

  return (
    <section style={{ display: 'grid', gap: 14 }}>
      <div style={{ backgroundColor: colors.dark, color: colors.white, borderRadius: 8, padding: 24 }}>
        <div style={{ fontSize: 12, color: colors.orange, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Redline decisions</div>
        <h2 style={{ marginTop: 10, fontSize: 28, fontWeight: 500, lineHeight: 1.15 }}>Accept the edits you want in the export draft.</h2>
        {result.overallRecommendationSummary ? <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.62)', fontSize: 14, lineHeight: 1.7 }}>{result.overallRecommendationSummary}</p> : null}
      </div>
      {result.suggestions.map((suggestion, index) => {
        const decision = decisions[index]
        const matchedRisk = findSuggestionMatch(suggestion, result.risks)
        return (
          <div key={`${suggestion.relatedClause}-${index}`} style={{ ...panelStyle, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: colors.orange, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{suggestion.relatedClause}</div>
                {matchedRisk ? <div style={{ marginTop: 6, fontSize: 12, color: colors.muted }}>Linked to {matchedRisk.riskId}</div> : null}
              </div>
              {decision ? (
                <span style={{ borderRadius: 999, padding: '5px 9px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: decision === 'accepted' ? '#16a34a' : '#ef4444', backgroundColor: decision === 'accepted' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                  {decision}
                </span>
              ) : null}
            </div>
            <p style={{ marginTop: 14, color: '#374151', fontSize: 14, lineHeight: 1.7 }}>{suggestion.recommendation}</p>
            <DetailBlock label="Reason" text={suggestion.reason} />
            {suggestion.implementationExample ? <DetailBlock label="Implementation example" text={suggestion.implementationExample} /> : null}
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => onDecision(index, 'accepted')} style={{ border: 'none', borderRadius: 999, padding: '9px 14px', backgroundColor: decision === 'accepted' ? '#16a34a' : colors.dark, color: colors.white, cursor: 'pointer', fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <Check size={13} /> Accept
              </button>
              <button type="button" onClick={() => onDecision(index, 'rejected')} style={{ border: '1px solid #e5e7eb', borderRadius: 999, padding: '9px 14px', backgroundColor: decision === 'rejected' ? '#fef2f2' : colors.white, color: decision === 'rejected' ? '#ef4444' : colors.dark, cursor: 'pointer', fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <X size={13} /> Reject
              </button>
            </div>
          </div>
        )
      })}
    </section>
  )
}

function ExportPanel({ result, decisions }: { result: ReviewResult; decisions: Record<number, SuggestionDecision> }) {
  const acceptedCount = Object.values(decisions).filter((decision) => decision === 'accepted').length
  const draft = useMemo(() => createTextDraft(result, decisions), [result, decisions])

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
      <div style={{ ...panelStyle, padding: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Export preview</div>
        <pre style={{ marginTop: 16, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', color: '#374151', fontSize: 12, lineHeight: 1.65, maxHeight: 560, overflow: 'auto' }}>{draft}</pre>
      </div>
      <div style={{ ...panelStyle, padding: 22, alignSelf: 'start' }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 500 }}>Download draft</h2>
        <p style={{ marginTop: 10, color: colors.muted, fontSize: 13, lineHeight: 1.65 }}>
          {acceptedCount} accepted suggestion{acceptedCount === 1 ? '' : 's'} will be included in the frontend-generated text draft.
        </p>
        <button type="button" onClick={downloadText} style={{ marginTop: 18, width: '100%', border: 'none', borderRadius: 999, padding: '12px 16px', backgroundColor: colors.orange, color: colors.white, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Download size={15} /> Download TXT
        </button>
        {['Download DOCX', 'Download PDF'].map((label) => (
          <button key={label} type="button" disabled style={{ marginTop: 10, width: '100%', border: '1px solid #e5e7eb', borderRadius: 999, padding: '12px 16px', backgroundColor: '#f9fafb', color: '#9ca3af', fontSize: 13, fontWeight: 800, cursor: 'not-allowed' }}>
            {label} - backend pending
          </button>
        ))}
      </div>
    </section>
  )
}

function EmptyPanel({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ ...panelStyle, padding: 28, textAlign: 'center' }}>
      <FileText size={32} color={colors.orange} />
      <h2 style={{ marginTop: 12, fontSize: 22 }}>{title}</h2>
      <p style={{ marginTop: 8, color: colors.muted, fontSize: 14 }}>{text}</p>
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const width = useWindowWidth()
  const isWide = width >= 980
  const [activeStep, setActiveStep] = useState<StepId>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null)
  const [decisions, setDecisions] = useState<Record<number, SuggestionDecision>>({})

  const selectFile = (selected: File) => {
    if (!isAcceptedFile(selected)) {
      setError('Unsupported file type. Please upload a PDF, DOCX, or TXT contract.')
      return
    }
    setFile(selected)
    setError(null)
    setResult(null)
    setSelectedRiskId(null)
    setDecisions({})
  }

  const runAnalyze = async () => {
    if (!file) return
    setError(null)
    setIsAnalyzing(true)
    setActiveStep('processing')

    try {
      const nextResult = await analyzeContract(file)
      setResult(nextResult)
      setSelectedRiskId(nextResult.risks[0]?.riskId ?? null)
      setDecisions({})
      setActiveStep('overview')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to analyze this document.')
      setActiveStep('processing')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const setSuggestionDecision = (index: number, decision: SuggestionDecision) => {
    setDecisions((current) => ({ ...current, [index]: decision }))
  }

  const renderPanel = () => {
    if (activeStep === 'upload') {
      return <UploadPanel file={file} error={error} onFileSelect={selectFile} onAnalyze={runAnalyze} />
    }
    if (activeStep === 'processing') {
      return <ProcessingPanel isAnalyzing={isAnalyzing} result={result} error={error} onRetry={runAnalyze} />
    }
    if (!result) {
      return <EmptyPanel title="No review loaded" text="Upload a contract first to unlock this workspace panel." />
    }
    if (activeStep === 'overview') return <OverviewPanel result={result} />
    if (activeStep === 'summary') return <SummaryPanel result={result} />
    if (activeStep === 'risks') return <RisksPanel result={result} selectedRiskId={selectedRiskId} onSelectRisk={setSelectedRiskId} />
    if (activeStep === 'redline') return <RedlinePanel result={result} decisions={decisions} onDecision={setSuggestionDecision} />
    return <ExportPanel result={result} decisions={decisions} />
  }

  return (
    <div style={pageShell}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 979px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .dashboard-grid,
          .dashboard-content,
          .dashboard-steprail,
          .upload-grid,
          .overview-grid,
          .risks-grid,
          .export-grid { min-width: 0 !important; max-width: 100% !important; }
          .dashboard-steprail aside { position: static !important; overflow-x: auto; }
          .dashboard-steprail aside > div { flex-direction: row !important; min-width: max-content; }
          .dashboard-steprail button { width: auto !important; }
          .upload-grid,
          .overview-grid,
          .risks-grid,
          .export-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 820px) {
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .summary-stat-grid,
          .keyterms-grid,
          .summary-lists-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <DashboardHeader onBack={() => navigate('/')} />
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(16px,3vw,32px)' }}>
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: isWide ? '240px minmax(0, 1fr)' : '1fr', gap: 18, alignItems: 'start' }}>
          <div className="dashboard-steprail">
            <StepRail activeStep={activeStep} result={result} isAnalyzing={isAnalyzing} onStepChange={setActiveStep} />
          </div>
          <div className="dashboard-content" style={{ minWidth: 0 }}>{renderPanel()}</div>
        </div>
      </main>
    </div>
  )
}
