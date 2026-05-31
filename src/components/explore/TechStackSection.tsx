import { useWindowWidth } from '../../hooks/useWindowWidth'

const ORANGE = '#F26522'
const DARK = '#111827'
const GRAY = '#6b7280'
const LIGHT = '#f9fafb'

const STACK = [
  { layer: 'Backend Framework', tech: 'FastAPI',          note: 'Async Python API layer',              color: '#009688' },
  { layer: 'Runtime',           tech: 'Python',           note: 'Core language',                       color: '#3776ab' },
  { layer: 'LLM Runtime',       tech: 'Ollama',           note: 'Local model serving',                 color: '#111827' },
  { layer: 'LLM Model',         tech: 'Gemma 4',          note: 'gemma4:e4b — legal reasoning',        color: ORANGE },
  { layer: 'PDF Parsing',       tech: 'PyMuPDF',          note: 'fitz — fast PDF text extraction',     color: '#e53935' },
  { layer: 'DOCX Parsing',      tech: 'python-docx',      note: 'Word document extraction',            color: '#1565c0' },
  { layer: 'API Validation',    tech: 'Pydantic',         note: 'Typed request/response models',       color: '#e91e63' },
  { layer: 'Server',            tech: 'Uvicorn',          note: 'ASGI server for FastAPI',             color: '#6366f1' },
  { layer: 'CORS',              tech: 'CORSMiddleware',   note: 'Cross-origin request handling',       color: '#f59e0b' },
  { layer: 'File Upload',       tech: 'python-multipart', note: 'Multipart form data handling',        color: '#10b981' },
]

function Pill({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
      textTransform: 'uppercase',
      backgroundColor: 'rgba(17,24,39,0.06)',
      color: DARK,
      borderRadius: 9999, padding: '4px 12px',
    }}>{label}</span>
  )
}

export function TechStackSection() {
  const width = useWindowWidth()
  const cols = width >= 1024 ? 2 : 1

  return (
    <section id="tech-stack" style={{
      backgroundColor: LIGHT, padding: 'clamp(64px,8vw,120px) clamp(20px,4vw,48px)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(40px,5vw,64px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>3</span>
            </div>
            <Pill label="Tech Stack" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem,3.6vw,3rem)', fontWeight: 500, letterSpacing: '-0.02em', color: DARK, margin: '0 0 12px' }}>
            Lightweight, local technology stack
          </h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.6, maxWidth: 520, margin: 0 }}>
            Lexa runs locally on your system using Ollama for offline-first AI inference.
          </p>
        </div>

        {/* List */}
        <div className="keyterms-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>
          {STACK.map((item, i) => (
            <div
              key={i}
              className="hover-lift"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e5e7eb',
                borderRadius: 14,
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.layer}
                </span>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: DARK, marginTop: 4 }}>
                  {item.tech}
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: item.color,
                  backgroundColor: `${item.color}15`,
                  padding: '4px 10px',
                  borderRadius: 6,
                  display: 'inline-block',
                  marginBottom: 4
                }}>
                  {item.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
