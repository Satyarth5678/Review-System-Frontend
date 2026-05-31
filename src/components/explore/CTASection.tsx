import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { TextRollButton } from '../ui/TextRollButton'

const ORANGE = '#F26522'
const DARK = '#111827'
const GRAY = '#6b7280'
const ease = 'cubic-bezier(0.25,0.1,0.25,1)'

function Pill({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
      textTransform: 'uppercase',
      backgroundColor: accent ? 'rgba(242,101,34,0.1)' : 'rgba(17,24,39,0.06)',
      color: accent ? ORANGE : DARK,
      borderRadius: 9999, padding: '4px 12px',
    }}>{label}</span>
  )
}

export function CTASection() {
  const navigate = useNavigate()
  return (
    <section style={{
      backgroundColor: '#ffffff', padding: 'clamp(64px,8vw,120px) clamp(20px,4vw,48px)',
    }}>
      <div style={{
        maxWidth: 800, margin: '0 auto', textAlign: 'center',
      }}>
        <Pill label="Ready to start?" accent />
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3.2rem)', fontWeight: 500, letterSpacing: '-0.02em', color: DARK, margin: '20px 0 16px' }}>
          Put the pipeline to work<br />on your contracts
        </h2>
        <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 36px' }}>
          Upload a contract and watch every step of the review pipeline execute in real time.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <TextRollButton
            label="Launch Workspace"
            bgColor={DARK}
            bgHoverColor={ORANGE}
            arrowBg="#ffffff"
            arrowColor={DARK}
            arrowSize={28}
            paddingLeft={24}
            paddingRight={8}
            fontSize={14}
            onClick={() => navigate('/dashboard')}
          />
        </div>
      </div>
    </section>
  )
}
