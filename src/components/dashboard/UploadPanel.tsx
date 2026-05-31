import { useRef, useState } from 'react'
import { FolderUp } from 'lucide-react'

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

function PillButton({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      style={{
        border: `1.5px solid ${active ? colors.dark : colors.line}`,
        backgroundColor: active ? colors.dark : colors.white,
        color: active ? colors.white : colors.dark,
        borderRadius: 999,
        padding: '8px 16px',
        fontSize: 13,
        fontWeight: 700,
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  )
}

interface UploadPanelProps {
  file: File | null
  error: string | null
  onFileSelect: (file: File) => void
  onAnalyze: () => void
}

export function UploadPanel({ file, error, onFileSelect, onAnalyze }: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    const selected = files?.[0]
    if (selected) onFileSelect(selected)
  }

  return (
    <section style={{ ...panelStyle, padding: 'clamp(24px,4vw,40px)' }}>
      <div className="upload-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(280px, 0.85fr)', gap: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Upload contract</div>
          <h1 style={{ marginTop: 12, fontSize: 'clamp(2rem,5.2vw,4.2rem)', lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.02em' }}>
            Review a contract without losing the legal context.
          </h1>
          <p style={{ marginTop: 18, maxWidth: 620, color: colors.muted, fontSize: 16, lineHeight: 1.7 }}>
            Upload a PDF, DOCX, or TXT file. Lexa will classify the agreement, summarize key terms, flag risky clauses, and prepare practical redline suggestions.
          </p>
          <div style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['PDF', 'DOCX', 'TXT'].map((item) => (
              <PillButton key={item} active={file?.name.toLowerCase().endsWith(item.toLowerCase())}>
                {item}
              </PillButton>
            ))}
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
            border: `2px dashed ${dragging ? colors.orange : '#d1d5db'}`,
            borderRadius: 12,
            backgroundColor: dragging ? 'rgba(242,101,34,0.05)' : '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            transition: 'all 200ms ease',
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
          <div style={{ marginTop: 18, fontSize: 18, fontWeight: 700 }}>{file ? file.name : 'Drop your contract here'}</div>
          <div style={{ marginTop: 8, color: colors.muted, fontSize: 14, lineHeight: 1.5 }}>
            {file ? `${Math.max(file.size / 1024, 1).toFixed(1)} KB selected` : 'or choose a file from your device'}
          </div>
          <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                border: '1.5px solid #d1d5db',
                backgroundColor: colors.white,
                color: colors.dark,
                borderRadius: 999,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.dark}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
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
                padding: '10px 22px',
                fontSize: 14,
                fontWeight: 700,
                cursor: file ? 'pointer' : 'not-allowed',
                boxShadow: file ? `0 4px 12px ${colors.orange}30` : 'none',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => { if(file) e.currentTarget.style.backgroundColor = '#e05a1a' }}
              onMouseLeave={(e) => { if(file) e.currentTarget.style.backgroundColor = colors.orange }}
            >
              Analyze contract
            </button>
          </div>
          {error ? <div style={{ marginTop: 16, color: '#ef4444', fontSize: 14, lineHeight: 1.5, fontWeight: 500 }}>{error}</div> : null}
        </div>
      </div>
    </section>
  )
}
