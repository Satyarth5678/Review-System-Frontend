import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Menu, X } from 'lucide-react'
import { MobileMenu } from './MobileMenu'
import { TextRollButton } from '../ui/TextRollButton'
import { useLondonTime } from '../../hooks/useLondonTime'
import { useWindowWidth } from '../../hooks/useWindowWidth'

const NAV_LINKS = ['Features', 'Workflow', 'Security', 'Contact']

export function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const time = useLondonTime()
  const width = useWindowWidth()
  const isMd = width >= 768
  const isLg = width >= 1024

  return (
    <>
      <div style={{ position: 'relative', zIndex: 20, width: '100%', padding: '8px 12px' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 9999,
            padding: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* LEFT: logo + nav links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: '#111827',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>LX</span>
              </div>

              {isMd && (
                <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  {NAV_LINKS.map((label) => (
                    <NavLink key={label} label={label} href={`#${label.toLowerCase()}`} />
                  ))}
                </nav>
              )}
            </div>

            {/* RIGHT: desktop controls */}
            {isMd && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingRight: 4 }}>
                {isLg && (
                  <span style={{ fontSize: 13, color: '#4b5563' }}>
                    AI-powered legal review platform
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4b5563' }}>
                  <Clock size={14} />
                  {time} in India
                </span>
                <TextRollButton
                  label="Launch Workspace"
                  bgColor="#111827"
                  bgHoverColor="#374151"
                  arrowBg="#ffffff"
                  arrowColor="#111827"
                  arrowSize={24}
                  paddingLeft={20}
                  paddingRight={8}
                  fontSize={13}
                  onClick={() => navigate('/dashboard')}
                />
              </div>
            )}

            {/* MOBILE: hamburger */}
            {!isMd && (
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  backgroundColor: '#111827', color: '#fff',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {open ? <X size={16} /> : <Menu size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>

      <MobileMenu isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}

function NavLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 14,
        color: hovered ? '#6b7280' : '#111827',
        textDecoration: 'none',
        transition: 'color 300ms',
      }}
    >
      {label}
    </a>
  )
}
