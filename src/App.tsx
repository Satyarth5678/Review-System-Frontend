import './index.css'
import { Component, type ReactNode } from 'react'
import { HeroSection } from './components/landing/HeroSection'
import { AboutSection } from './components/landing/AboutSection'
import { CaseStudiesSection } from './components/landing/CaseStudiesSection'
import { Footer } from './components/landing/Footer'
import { useSmoothScroll } from './hooks/useSmoothScroll'

class SectionBoundary extends Component<{ name: string; children: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, backgroundColor: '#fff1f2', borderLeft: '4px solid #ef4444', margin: 16 }}>
          <strong style={{ color: '#ef4444' }}>Crash in &lt;{this.props.name}&gt;</strong>
          <pre style={{ marginTop: 8, fontSize: 12, color: '#374151', whiteSpace: 'pre-wrap' }}>{this.state.error}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function LandingPage() {
  useSmoothScroll()

  return (
    <main style={{ width: '100%', margin: 0, padding: 0 }}>
      <SectionBoundary name="HeroSection"><HeroSection /></SectionBoundary>
      <SectionBoundary name="AboutSection"><AboutSection /></SectionBoundary>
      <SectionBoundary name="CaseStudiesSection"><CaseStudiesSection /></SectionBoundary>
      <SectionBoundary name="Footer"><Footer /></SectionBoundary>
    </main>
  )
}

function App() {
  return <LandingPage />
}

export default App
