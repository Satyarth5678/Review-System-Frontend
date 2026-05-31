import { useEffect } from 'react'
import { Navbar } from '../components/navigation/Navbar'
import { Footer } from '../components/landing/Footer'
import { HeroExplore } from '../components/explore/HeroExplore'
import { PipelineSection } from '../components/explore/PipelineSection'
import { TechStackSection } from '../components/explore/TechStackSection'
import { AIModulesSection } from '../components/explore/AIModulesSection'
import { ArchSection } from '../components/explore/ArchSection'
import { CTASection } from '../components/explore/CTASection'

export function ExplorePlatformPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ width: '100%', margin: 0, padding: 0, backgroundColor: '#ffffff' }}>
      <Navbar />
      <HeroExplore />
      <PipelineSection />
      <TechStackSection />
      <AIModulesSection />
      <ArchSection />
      <CTASection />
      <Footer />
    </div>
  )
}
