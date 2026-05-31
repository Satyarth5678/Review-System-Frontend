import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Clock, Menu, X } from 'lucide-react'
import { MobileMenu } from './MobileMenu'
import { TextRollButton } from '../ui/TextRollButton'
import { useLondonTime } from '../../hooks/useLondonTime'
import { useWindowWidth } from '../../hooks/useWindowWidth'

const NAV_ITEMS = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Explore Platform', to: '/explore' }
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const time = useLondonTime()
  const width = useWindowWidth()
  const isMd = width >= 768
  const isLg = width >= 1024

  return (
    <>
      <div style={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 100, width: '100%', padding: '16px 20px 8px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.78)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(17, 24, 39, 0.07)',
            boxShadow: '0 12px 34px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.01)',
            borderRadius: 9999,
            padding: '6px 8px 6px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* LEFT: logo + nav links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div
                onClick={() => { navigate('/'); window.scrollTo(0, 0) }}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  backgroundColor: '#111827',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>LX</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>Lexa AI</span>

              {isMd && (
                <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {NAV_ITEMS.map((item) => (
                    <NavLink key={item.label} label={item.label} href={item.href} to={item.to} />
                  ))}
                </nav>
              )}
            </div>

            {/* RIGHT: desktop controls */}
            {isMd && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingRight: 4 }}>
                {isLg && (
                  <span style={{ fontSize: 12, color: '#4b5563', fontFamily: "'DM Sans', sans-serif" }}>
                    AI legal review platform
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4b5563', fontFamily: "'DM Sans', sans-serif" }}>
                  <Clock size={13} />
                  {time} in India
                </span>
                <TextRollButton
                  label="Launch Workspace"
                  bgColor="#111827"
                  bgHoverColor="var(--c-orange)"
                  arrowBg="#ffffff"
                  arrowColor="#111827"
                  arrowSize={24}
                  paddingLeft={16}
                  paddingRight={6}
                  fontSize={12}
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
                  width: 34, height: 34, borderRadius: '50%',
                  backgroundColor: '#111827', color: '#fff',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {open ? <X size={15} /> : <Menu size={15} />}
              </button>
            )}
          </div>
        </div>
      </div>

      <MobileMenu isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}

function NavLink({ label, href, to }: { label: string; href?: string; to?: string }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (e: React.MouseEvent) => {
    if (to) {
      e.preventDefault()
      navigate(to)
      window.scrollTo(0, 0)
    } else if (href) {
      if (location.pathname !== '/') {
        e.preventDefault()
        navigate('/' + href)
      }
    }
  }

  const isCurrent = to ? location.pathname === to : location.pathname === '/' && location.hash === href

  return (
    <a
      href={to ?? ('/' + (href ?? ''))}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 13,
        fontWeight: isCurrent ? 600 : 500,
        color: isCurrent ? 'var(--c-orange)' : hovered ? 'var(--c-orange)' : '#111827',
        textDecoration: 'none',
        transition: 'color 300ms',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {label}
    </a>
  )
}

