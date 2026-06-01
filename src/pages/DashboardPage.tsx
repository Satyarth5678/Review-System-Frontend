import { useState, type CSSProperties } from 'react'
import { ArrowLeft, Scale } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { analyzeContract, updateSessionText, fetchSessionData, proposePatch, acceptRedline, rollbackSession } from '../lib/reviewApi'
import type { ReviewResult, SuggestionDecision, RedlineItem, VersionSnapshot } from '../types/review'

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
  const [redlines, setRedlines] = useState<RedlineItem[]>([])
  const [versions, setVersions] = useState<VersionSnapshot[]>([])

  const [isProcessingAction, setIsProcessingAction] = useState(false)

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
    setRedlines([])
    setVersions([])
  }

  // ---------------------------------------------------------------------------
  // Refresh session state from backend
  // ---------------------------------------------------------------------------
  const refreshSession = async () => {
    if (!sessionId) return
    try {
      const session = await fetchSessionData(sessionId)
      setCurrentText(session.currentText)
      setRedlines(session.redlines)
      setVersions(session.versions)
    } catch (err) {
      console.error('Failed to refresh session:', err)
    }
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Upload + Analyze
  // ---------------------------------------------------------------------------
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
      setRedlines([])
      setVersions([])

      // Fetch full session to get redlines/versions
      if (nextResult.sessionId) {
        try {
          const session = await fetchSessionData(nextResult.sessionId)
          setCurrentText(session.currentText)
          setRedlines(session.redlines)
          setVersions(session.versions)
        } catch {
          // Session fetch is optional; the analyze response has enough data
        }
      }

      setActiveStep('overview')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to analyze this document.')
      setActiveStep('processing')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Suggestion Accept/Reject — two-step: propose patch on backend first
  // ---------------------------------------------------------------------------
  const setSuggestionDecision = async (index: number, decision: SuggestionDecision) => {
    if (isProcessingAction) return
    setDecisions((current) => ({ ...current, [index]: decision }))

    if (decision === 'accepted' && result && sessionId) {
      const suggestion = result.suggestions[index]
      if (!suggestion) return

      // Determine which anchor to use for the patch
      const hasAnchor = suggestion.anchorText && suggestion.anchorText !== 'Not available'
      const hasInsertion = suggestion.insertionAnchor && suggestion.insertionAnchor !== 'Not available'
      const hasReplacement = suggestion.replacementText && suggestion.replacementText !== 'Not available'

      if (!hasReplacement) {
        console.warn('Suggestion has no replacement text, skipping patch proposal')
        return
      }

      setIsProcessingAction(true)
      try {
        await proposePatch(sessionId, {
          anchorText: hasAnchor ? suggestion.anchorText : undefined,
          insertionAnchor: !hasAnchor && hasInsertion ? suggestion.insertionAnchor : undefined,
          replacementText: suggestion.replacementText,
          reason: suggestion.reason || suggestion.recommendation,
        })
        // Refresh session to see the new pending redline
        await refreshSession()
      } catch (err) {
        console.error('Failed to propose patch:', err)
        // Revert the decision on failure
        setDecisions((current) => {
          const updated = { ...current }
          delete updated[index]
          return updated
        })
      } finally {
        setIsProcessingAction(false)
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Accept a pending redline (apply it to the contract)
  // ---------------------------------------------------------------------------
  const handleAcceptRedline = async (redlineId: string) => {
    if (!sessionId || isProcessingAction) return
    setIsProcessingAction(true)
    try {
      const response = await acceptRedline(sessionId, redlineId)
      setCurrentText(response.currentText)
      await refreshSession()
    } catch (err) {
      console.error('Failed to accept redline:', err)
    } finally {
      setIsProcessingAction(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Rollback to previous version
  // ---------------------------------------------------------------------------
  const handleRollback = async () => {
    if (!sessionId || isProcessingAction) return
    setIsProcessingAction(true)
    try {
      const response = await rollbackSession(sessionId)
      setCurrentText(response.currentText)
      await refreshSession()
    } catch (err) {
      console.error('Failed to rollback:', err)
    } finally {
      setIsProcessingAction(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Manual text update from OverviewPanel edit mode
  // ---------------------------------------------------------------------------
  const handleTextUpdate = async (newText: string) => {
    if (!sessionId || isProcessingAction) return
    setIsProcessingAction(true)
    try {
      await updateSessionText(sessionId, newText)
      setCurrentText(newText)
      await refreshSession()
    } catch (err) {
      console.error('Failed to update text:', err)
    } finally {
      setIsProcessingAction(false)
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
    if (activeStep === 'overview') {
      return (
        <OverviewPanel
          result={result}
          currentText={currentText}
          sessionId={sessionId}
          redlineCount={redlines.length}
          versionCount={versions.length}
          onTextUpdate={handleTextUpdate}
        />
      )
    }
    if (activeStep === 'summary') return <SummaryPanel result={result} />
    if (activeStep === 'risks') return <RisksPanel result={result} selectedRiskId={selectedRiskId} onSelectRisk={setSelectedRiskId} />
    if (activeStep === 'redline') {
      return (
        <RedlinePanel
          result={result}
          decisions={decisions}
          onDecision={setSuggestionDecision}
          redlines={redlines}
          versions={versions}
          onAcceptRedline={handleAcceptRedline}
          onRollback={handleRollback}
          isProcessingAction={isProcessingAction}
        />
      )
    }
    return <ExportPanel result={result} decisions={decisions} currentText={currentText} redlines={redlines} />
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
