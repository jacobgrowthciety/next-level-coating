import Hero from '../sections/Hero'
import WhyTrustUs from '../sections/WhyTrustUs'
import Process from '../sections/Process'
import AboutPreview from '../sections/AboutPreview'
import ServicesGrid from '../sections/ServicesGrid'
import Reviews from '../sections/Reviews'
import FinalCTA from '../sections/FinalCTA'

export default function Home() {
  return (
    <main>
      <Hero />
      <WhyTrustUs />
      <Process />
      <AboutPreview />
      <ServicesGrid />
      <Reviews />
      <FinalCTA />
    </main>
  )
}
