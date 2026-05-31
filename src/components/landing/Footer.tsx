import { useState, useRef, useEffect } from 'react'
import { AIVerifiedIcon } from '../icons/AIVerifiedIcon'
import { TextRollButton } from '../ui/TextRollButton'
import { useWindowWidth } from '../../hooks/useWindowWidth'
import { useNavigate, useLocation } from 'react-router-dom'

const PX = 'clamp(20px,4vw,48px)'

const PRODUCT_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Explore', to: '/explore' },
  { label: 'Dashboard', to: '/dashboard' },
]

const RESOURCE_LINKS = [
  { label: 'Documentation', href: '#' },
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'Changelog', href: '#' },
  { label: 'API Reference', href: '#' },
]

const TEAM = [
  {
    name: 'Shashwat Singh',
    initials: 'SS',
    avatarBg: '#dcfce7', // pastel green
    avatarColor: '#166534',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    email: 'shashwat@lexa.ai',
  },
  {
    name: 'Satyarth Singh',
    initials: 'SY',
    avatarBg: '#ffe4e6', // pastel rose
    avatarColor: '#9f1239',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com/Satyarth5678',
    email: 'satyarth@lexa.ai',
  },
  {
    name: 'Shashwat Maurya',
    initials: 'SM',
    avatarBg: '#dbeafe', // pastel blue
    avatarColor: '#1e40af',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    email: 'maurya@lexa.ai',
  },
]

/* Inline SVG social icons — no lucide dependency */
function TwitterSVG() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GithubSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function MailSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  )
}

function FooterLink({ label, href, to }: { label: string; href?: string; to?: string }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (e: React.MouseEvent) => {
    if (to) {
      e.preventDefault()
      navigate(to)
      window.scrollTo(0, 0)
    } else if (href && href !== '#') {
      if (href.startsWith('#')) {
        e.preventDefault()
        if (location.pathname !== '/') {
          navigate('/' + href)
        } else {
          const target = document.querySelector(href)
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' })
          }
        }
      }
    }
  }

  return (
    <a
      href={to ?? href ?? '#'}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 14,
        color: hovered ? '#F26522' : '#6b7280',
        textDecoration: 'none',
        transition: 'color 200ms',
        display: 'block',
        cursor: 'pointer'
      }}
    >
      {label}
    </a>
  )
}

function SocialIconLink({ href, type }: { href: string; type: 'linkedin' | 'github' | 'email' }) {
  const [hovered, setHovered] = useState(false)
  const hoverColor = type === 'linkedin' ? '#0077b5' : type === 'email' ? '#F26522' : '#111827'

  return (
    <a
      href={type === 'email' ? `mailto:${href}` : href}
      target={type === 'email' ? undefined : '_blank'}
      rel={type === 'email' ? undefined : 'noopener noreferrer'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? hoverColor : '#9ca3af',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 200ms',
        cursor: 'pointer',
      }}
    >
      {type === 'linkedin' ? <LinkedInSVG /> : type === 'email' ? <MailSVG /> : <GithubSVG />}
    </a>
  )
}

function SocialBtn({ children, href }: { children: React.ReactNode; href: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 36, height: 36, borderRadius: '50%',
        border: `1px solid ${hovered ? '#111827' : '#e5e7eb'}`,
        backgroundColor: hovered ? '#111827' : 'transparent',
        color: hovered ? '#fff' : '#6b7280',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none', transition: 'all 250ms', flexShrink: 0,
      }}
    >
      {children}
    </a>
  )
}

function TeamCard({ member }: { member: typeof TEAM[0] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '14px 12px',
        width: '100%',
        minHeight: 140,
        backgroundColor: hovered ? '#ffffff' : 'rgba(242, 101, 34, 0.04)',
        border: `1px solid ${hovered ? '#F26522' : 'rgba(242, 101, 34, 0.15)'}`,
        borderRadius: 12,
        boxShadow: hovered ? '0 8px 20px rgba(242, 101, 34, 0.08)' : '0 2px 4px rgba(0,0,0,0.01)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 280ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        textAlign: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 68,
        height: 68,
        borderRadius: '50%',
        backgroundColor: member.avatarBg,
        color: member.avatarColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 700,
        flexShrink: 0,
      }}>
        {member.initials}
      </div>

      {/* Name */}
      <span style={{
        fontSize: 17,
        fontWeight: 600,
        color: '#111827',
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {member.name}
      </span>

      {/* Social Links — with mail */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
        <SocialIconLink href={member.email} type="email" />
        <SocialIconLink href={member.linkedin} type="linkedin" />
        <SocialIconLink href={member.github} type="github" />
      </div>
    </div>
  )
}

function AnimatedText({
  text,
  style,
  delay = 0,
}: {
  text: string
  style?: React.CSSProperties
  delay?: number
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
      },
      { threshold: 0.5, rootMargin: '0px 0px -60px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const words = text.split(' ')

  return (
    <p ref={ref} style={{ ...style, margin: 0 }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <span
            style={{
              display: 'inline-block',
              transform: visible ? 'translateY(0)' : 'translateY(110%)',
              opacity: visible ? 1 : 0,
              transition: `transform 480ms cubic-bezier(0.25, 0.1, 0.25, 1) ${delay + i * 55}ms, opacity 400ms ease ${delay + i * 55}ms`,
            }}
          >
            {word}
          </span>
        </span>
      )).reduce<React.ReactNode[]>((acc, el, i) => {
        if (i > 0) acc.push(' ')
        acc.push(el)
        return acc
      }, [])}
    </p>
  )
}

function FeedbackStrip() {
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) return
    setSubmitted(true)
  }

  return (
    <div
      style={{
        padding: 'clamp(24px,3vw,36px)',
        backgroundColor: '#111827',
        borderRadius: 16,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}
    >
      <div style={{ overflow: 'hidden', flex: '1 1 300px' }}>
        <AnimatedText
          text="Stay ahead of legal AI."
          delay={0}
          style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 4 }}
        />
        <AnimatedText
          text="Share your feedback, bug reports, or feature ideas with the team."
          delay={80}
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}
        />
      </div>
      {submitted ? (
        <div style={{ fontSize: 14, color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          ✓ Thank you! Your feedback has been sent.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-end' }}>
          <input
            type="text"
            placeholder="Your message or suggestion..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{
              fontSize: 13,
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 9999,
              padding: '10px 18px',
              outline: 'none',
              width: '100%',
              maxWidth: 320,
            }}
          />
          <TextRollButton
            label="Send Feedback"
            type="submit"
            bgColor="#ffffff"
            bgHoverColor="#F26522"
            textColor="#111827"
            arrowBg="transparent"
            arrowColor="#111827"
            arrowSize={14}
            paddingLeft={20}
            paddingRight={8}
            fontSize={13}
            arrowNoTransform
          />
        </form>
      )}
    </div>
  )
}

export function Footer() {
  const width = useWindowWidth()
  const isLg = width >= 1024
  const isMd = width >= 768

  return (
    <footer id="contact" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #f3f4f6' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', paddingLeft: PX, paddingRight: PX, paddingTop: 'clamp(28px,3.5vw,42px)', paddingBottom: 20 }}>

        {/* Top grid — 4 columns on desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isLg ? '1.4fr 0.7fr 0.7fr 1fr 1fr 1fr' : isMd ? '1.2fr 1fr 1fr' : '1fr',
          gap: isLg ? 'clamp(20px,2vw,28px)' : 'clamp(24px,3vw,36px)',
          marginBottom: 20,
        }}>
          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '-0.02em' }}>LX</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Lexa AI</span>
            </div>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65, maxWidth: 280, margin: 0 }}>
              AI-powered contract review and intelligent redlining for modern legal workflows.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 8, padding: '6px 12px', width: 'fit-content' }}>
              <AIVerifiedIcon style={{ width: 18, height: 18, color: '#E8704E' }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>AI Verified</span>
              <span style={{ fontSize: 10, backgroundColor: '#111827', color: '#fff', borderRadius: 4, padding: '2px 6px' }}>Secure Platform</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <SocialBtn href="#"><TwitterSVG /></SocialBtn>
              <SocialBtn href="#"><LinkedInSVG /></SocialBtn>
              <SocialBtn href="#"><GithubSVG /></SocialBtn>
            </div>
          </div>

          {/* Product links column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#111827', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Product</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PRODUCT_LINKS.map(item => (
                <FooterLink key={item.label} label={item.label} href={item.href} to={item.to} />
              ))}
            </div>
          </div>

          {/* Resources column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#111827', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Resources</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {RESOURCE_LINKS.map(item => (
                <FooterLink key={item.label} label={item.label} href={item.href} />
              ))}
            </div>
          </div>

          {/* Team cards — each gets its own grid column on desktop */}
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                gridColumn: isLg ? 'auto' : (isMd && i === 0) ? 'span 3' : 'auto',
              }}
            >
              {i === 0 && (
                <span style={{ fontSize: 12, fontWeight: 600, color: '#111827', letterSpacing: '0.06em', textTransform: 'uppercase' }}>The Team</span>
              )}
              {i > 0 && isLg && (
                <span style={{ fontSize: 12, fontWeight: 600, color: 'transparent', letterSpacing: '0.06em', textTransform: 'uppercase', pointerEvents: 'none', userSelect: 'none' }}>.</span>
              )}
              <TeamCard member={member} />
            </div>
          ))}
        </div>

        {/* Feedback strip */}
        <FeedbackStrip />
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', paddingLeft: PX, paddingRight: PX, paddingTop: 12, paddingBottom: 12, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>© 2026 Lexa AI. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Cookies'].map(item => <FooterLink key={item} label={item} />)}
          </div>
        </div>
      </div>
    </footer>
  )
}
