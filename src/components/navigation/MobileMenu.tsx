import { useEffect } from 'react'
import { X } from 'lucide-react'
import { TextRollButton } from '../ui/TextRollButton'
import { useLondonTime } from '../../hooks/useLondonTime'

const NAV_LINKS = ['Features', 'Workflow', 'Security', 'Contact']

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: Props) {
  const time = useLondonTime()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          backgroundColor: 'rgba(0,0,0,0.6)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 500ms',
        }}
      />

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          margin: '0 12px 12px',
          backgroundColor: '#ffffff',
          borderRadius: 16,
          overflow: 'hidden',
          transform: isOpen ? 'translateY(0)' : 'translateY(110%)',
          transition: 'transform 500ms cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        <div style={{ padding: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <span style={{ fontSize: 13, color: '#4b5563', backgroundColor: '#f3f4f6', borderRadius: 9999, padding: '6px 12px' }}>
              {time} in India
            </span>
            <button
              onClick={onClose}
              aria-label="Close menu"
              style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: '#111827', color: '#fff',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 32 }}>
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={onClose}
                style={{
                  fontSize: 28, lineHeight: '32px', fontWeight: 500,
                  color: '#111827', textDecoration: 'none', padding: '4px 0',
                }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <TextRollButton
            label="Launch Workspace"
            bgColor="#111827"
            bgHoverColor="#374151"
            arrowBg="#ffffff"
            arrowColor="#111827"
            arrowSize={32}
            paddingLeft={24}
            paddingRight={8}
            fontSize={14}
            fullWidth
          />
        </div>
      </div>
    </>
  )
}
