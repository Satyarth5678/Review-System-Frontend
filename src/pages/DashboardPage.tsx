import { useState, type CSSProperties } from 'react'
import { ArrowLeft, Scale } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { analyzeContract, updateSessionText } from '../lib/reviewApi'
import type { ReviewResult, SuggestionDecision } from '../types/review'

// Import modular components
import { DashboardTopBar, type StepId } from '../components/dashboard/DashboardTopBar'
import { UploadPanel } from '../components/dashboard/UploadPanel'
import { ProcessingPanel } from '../components/dashboard/ProcessingPanel'
import { OverviewPanel } from '../components/dashboard/OverviewPanel'
import { SummaryPanel } from '../components/dashboard/SummaryPanel'
import { RisksPanel } from '../components/dashboard/RisksPanel'
import { RedlinePanel } from '../components/dashboard/RedlinePanel'
import { ExportPanel } from '../components/dashboard/ExportPanel'
import { EmptyPanel } from '../components/dashboard/EmptyPanel'

const colors = {
  orange: '#F26522',
  dark: '#111827',
  muted: '#6b7280',
  soft: '#f9fafb',
  white: '#ffffff',
}

const pageShell: CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.soft,
  color: colors.dark,
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}

function isAcceptedFile(file: File) {
  const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  const ACCEPTED_EXTENSIONS = ['pdf', 'docx', 'txt']
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(extension)
}

function applySuggestionToText(currentText: string, originalClause: string, newText: string): string {
  if (!currentText || !originalClause) return currentText
  if (currentText.includes(originalClause)) {
    return currentText.replace(originalClause, newText)
  }
  const index = currentText.toLowerCase().indexOf(originalClause.toLowerCase())
  if (index !== -1) {
    return currentText.substring(0, index) + newText + currentText.substring(index + originalClause.length)
  }
  return currentText
}

function DashboardHeader({ onBack }: { onBack: () => void }) {
  return (
    <header style={{ padding: '12px clamp(16px,3vw,32px)', backgroundColor: '#ffffff', borderBottom: '1px solid rgba(17,24,39,0.08)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to landing page"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '1.5px solid #e5e7eb',
              backgroundColor: colors.white,
              color: colors.dark,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 200ms ease',
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
            <ArrowLeft size={17} />
          </button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Lexa AI Workspace</div>
            <div style={{ fontSize: 12, color: colors.muted }}>Contract review, risk analysis, and redline prep</div>
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: colors.soft, borderRadius: 999, padding: '7px 12px', border: '1px solid #f3f4f6' }}>
          <Scale size={14} color={colors.orange} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>Local AI Review</span>
        </div>
      </div>
    </header>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState<StepId>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentText, setCurrentText] = useState<string>('')
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
    setSessionId(null)
    setCurrentText('')
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
      setSessionId(nextResult.sessionId ?? null)
      setCurrentText(nextResult.documentTextPreview || '')
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

  const setSuggestionDecision = async (index: number, decision: SuggestionDecision) => {
    setDecisions((current) => ({ ...current, [index]: decision }))

    if (decision === 'accepted' && result) {
      const suggestion = result.suggestions[index]
      if (suggestion) {
        const replacementText = suggestion.implementationExample || suggestion.recommendation
        const newText = applySuggestionToText(currentText, suggestion.relatedClause, replacementText)
        setCurrentText(newText)

        if (sessionId) {
          try {
            await updateSessionText(sessionId, newText)
          } catch (err) {
            console.error('Failed to update session text on backend:', err)
          }
        }
      }
    }
  }

  const renderPanel = () => {
    // If active step is upload
    if (activeStep === 'upload') {
      return <UploadPanel file={file} error={error} onFileSelect={selectFile} onAnalyze={runAnalyze} />
    }
    
    // If active step is processing
    if (activeStep === 'processing') {
      return <ProcessingPanel isAnalyzing={isAnalyzing} result={result} error={error} onRetry={runAnalyze} />
    }
    
    // If user clicked another panel but result is not loaded yet
    if (!result) {
      return (
        <EmptyPanel 
          title="Review not loaded" 
          text="Upload and analyze a contract first to view legal analysis and playbooks here." 
        />
      )
    }

    // Render active panel
    if (activeStep === 'overview') return <OverviewPanel result={result} currentText={currentText} />
    if (activeStep === 'summary') return <SummaryPanel result={result} />
    if (activeStep === 'risks') return <RisksPanel result={result} selectedRiskId={selectedRiskId} onSelectRisk={setSelectedRiskId} />
    if (activeStep === 'redline') return <RedlinePanel result={result} decisions={decisions} onDecision={setSuggestionDecision} />
    return <ExportPanel result={result} decisions={decisions} currentText={currentText} />
  }

  return (
    <div style={pageShell}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 38px rgba(17,24,39,0.08) !important;
        }
        .hover-lift:hover .hover-accent-line {
          transform: scaleX(1) !important;
        }
        @media (max-width: 980px) {
          .upload-grid,
          .overview-grid,
          .risks-grid,
          .export-grid {
            grid-template-columns: 1fr !important;
          }
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
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(16px,3vw,32px)', width: '100%', boxSizing: 'border-box' }}>
        <DashboardTopBar 
          activeStep={activeStep} 
          result={result} 
          isAnalyzing={isAnalyzing} 
          onStepChange={setActiveStep} 
        />
        <div style={{ minWidth: 0, marginTop: 10 }}>{renderPanel()}</div>
      </main>
    </div>
  )
}
