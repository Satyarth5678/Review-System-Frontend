import { FileText } from 'lucide-react'

const colors = {
  orange: '#F26522',
  muted: '#6b7280',
  white: '#ffffff',
}

const panelStyle = {
  backgroundColor: colors.white,
  border: '1px solid #f3f4f6',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(17,24,39,0.04)',
}

interface EmptyPanelProps {
  title: string
  text: string
}

export function EmptyPanel({ title, text }: EmptyPanelProps) {
  return (
    <div style={{ ...panelStyle, padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        backgroundColor: 'rgba(242, 101, 34, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        <FileText size={32} color={colors.orange} />
      </div>
      <h2 style={{ marginTop: 0, fontSize: 20, fontWeight: 600, color: '#111827' }}>{title}</h2>
      <p style={{ marginTop: 8, color: colors.muted, fontSize: 15, lineHeight: 1.6, maxWidth: 360 }}>{text}</p>
    </div>
  )
}
