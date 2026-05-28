import './index.css'
import { Component, type ReactNode, useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { HeroSection } from './components/landing/HeroSection'
import { AboutSection } from './components/landing/AboutSection'
import { CaseStudiesSection } from './components/landing/CaseStudiesSection'
import { Footer } from './components/landing/Footer'
import { ExplorePlatformPage } from './pages/ExplorePlatformPage'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { DashboardPage } from './pages/DashboardPage'

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

/** Wraps each route in a fade-in/out transition */
function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [opacity, setOpacity] = useState(1)
  const prevKey = useRef(location.key)

  useEffect(() => {
    if (prevKey.current === location.key) return
    prevKey.current = location.key

    // Fade out
    setOpacity(0)
    const fadeOut = setTimeout(() => {
      setDisplayChildren(children)
      // Fade in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setOpacity(1))
      })
    }, 280)

    return () => clearTimeout(fadeOut)
  }, [location.key, children])

  // Sync children when same route re-renders
  useEffect(() => {
    setDisplayChildren(children)
  }, [children])

  return (
    <div
      style={{
        opacity,
        transition: 'opacity 280ms cubic-bezier(0.25,0.1,0.25,1)',
        minHeight: '100vh',
      }}
    >
      {displayChildren}
    </div>
  )
}

function App() {
  const location = useLocation()

  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore-platform" element={<ExplorePlatformPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </PageTransition>
  )
}

export default App
