import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

const EASE = 'cubic-bezier(0.25,0.1,0.25,1)'

interface Props {
  label: string
  bgColor?: string
  bgHoverColor?: string
  textColor?: string
  arrowBg?: string
  arrowColor?: string
  arrowSize?: number
  paddingLeft?: number | string
  paddingRight?: number | string
  fontSize?: number
  fullWidth?: boolean
  hideArrow?: boolean
  arrowNoTransform?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export function TextRollButton({
  label,
  bgColor = '#111827',
  bgHoverColor = '#374151',
  textColor = '#ffffff',
  arrowBg = '#ffffff',
  arrowColor = '#111827',
  arrowSize = 28,
  paddingLeft = 20,
  paddingRight = 8,
  fontSize = 13,
  fullWidth = false,
  hideArrow = false,
  arrowNoTransform = false,
  type = 'button',
  onClick,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false) }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: hovered ? bgHoverColor : bgColor,
        color: textColor,
        borderRadius: 9999,
        paddingLeft,
        paddingRight,
        paddingTop: 8,
        paddingBottom: 8,
        fontSize,
        fontWeight: 500,
        border: 'none',
        cursor: 'pointer',
        transition: `background-color 300ms`,
        width: fullWidth ? '100%' : undefined,
        justifyContent: fullWidth ? 'space-between' : undefined,
      }}
    >
      {/* Text roll container */}
      <span style={{ overflow: 'hidden', height: 20, display: 'block' }}>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            transform: hovered ? 'translateY(-50%)' : 'translateY(0)',
            transition: `transform 500ms ${EASE}`,
          }}
        >
          <span style={{ lineHeight: '20px', display: 'block', whiteSpace: 'nowrap' }}>{label}</span>
          <span style={{ lineHeight: '20px', display: 'block', whiteSpace: 'nowrap' }}>{label}</span>
        </span>
      </span>

      {/* Arrow circle */}
      {!hideArrow && (
        <span
          style={{
            width: arrowSize,
            height: arrowSize,
            borderRadius: '50%',
            backgroundColor: arrowBg,
            color: arrowColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transform: arrowNoTransform ? 'none' : `${hovered ? 'rotate(-45deg)' : 'rotate(0deg)'} ${active ? 'scale(0.85)' : 'scale(1)'}`,
            transition: `transform 400ms ${EASE}`,
          }}
        >
          <ArrowRight size={Math.round(arrowSize * 0.5)} />
        </span>
      )}
    </button>
  )
}
