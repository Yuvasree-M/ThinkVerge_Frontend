import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import { About, MissionVision, HowItWorks } from './ContentSections'
import Instructors from './Instructors'
import { Testimonials, FAQ, Contact, Footer, ScrollToTop } from './BottomSections'
import { injectFonts } from './theme'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    injectFonts()
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <div style={{ background: '#F4F6F8', minHeight: '100vh' }}>
      <Navbar scrolled={scrolled} />
      <Hero />
      <About />
      <MissionVision />
      <HowItWorks />
      <Instructors />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  )
}