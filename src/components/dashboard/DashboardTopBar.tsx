import { FolderUp, Loader2, ClipboardList, BookOpen, ShieldAlert, Sparkles, Download, Check } from 'lucide-react'

export type StepId = 'upload' | 'processing' | 'overview' | 'summary' | 'risks' | 'redline' | 'export'

const STEPS: Array<{ id: StepId; label: string; icon: any }> = [
  { id: 'upload', label: 'Upload', icon: FolderUp },
  { id: 'processing', label: 'Processing', icon: Loader2 },
  { id: 'overview', label: 'Overview', icon: ClipboardList },
  { id: 'summary', label: 'Summary', icon: BookOpen },
  { id: 'risks', label: 'Risks', icon: ShieldAlert },
  { id: 'redline', label: 'Redline', icon: Sparkles },
  { id: 'export', label: 'Export', icon: Download },
]

interface TopBarProps {
  activeStep: StepId
  result: any | null
  isAnalyzing: boolean
  onStepChange: (step: StepId) => void
}

export function DashboardTopBar({ activeStep, result, isAnalyzing, onStepChange }: TopBarProps) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #f3f4f6',
      borderRadius: 16,
      padding: '12px 16px',
      boxShadow: '0 8px 32px rgba(17,24,39,0.04)',
      marginBottom: 20,
      width: '100%',
      overflowX: 'auto',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        minWidth: 780, // ensures it doesn't wrap awkwardly on smaller tablets
      }}>
        {STEPS.map(({ id, label, icon: Icon }) => {
          const active = activeStep === id
          
          // Only show "content ready" for data panels (not upload/processing) when result is loaded
          const isDataPanel = id !== 'upload' && id !== 'processing'
          const hasContent = isDataPanel && result !== null

          // Active styles vs non-active styles
          const bg = active 
            ? '#111827' 
            : hasContent 
              ? 'rgba(34, 197, 94, 0.05)' 
              : 'transparent'
          
          const color = active 
            ? '#ffffff' 
            : hasContent 
              ? '#374151' 
              : '#6b7280'

          const border = active
            ? '1px solid #111827'
            : hasContent
              ? '1px solid rgba(34, 197, 94, 0.2)'
              : '1px solid #e5e7eb'

          return (
            <button
              key={id}
              type="button"
              onClick={() => onStepChange(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                flex: 1,
                border,
                borderRadius: 9999,
                padding: '10px 16px',
                backgroundColor: bg,
                color,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 200ms ease',
              }}
            >
              {id === 'processing' && isAnalyzing ? (
                <Icon size={14} style={{ animation: 'spin 1s linear infinite' }} />
              ) : hasContent ? (
                <Check size={14} color={active ? '#ffffff' : '#16a34a'} />
              ) : (
                <Icon size={14} />
              )}
              <span>{label}</span>
              
              {/* Small green dot for content-ready data panels */}
              {hasContent && !active && (
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#16a34a',
                  display: 'inline-block',
                }} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
