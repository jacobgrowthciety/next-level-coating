import Hero from '../sections/Hero'
import WhyTrustUs from '../sections/WhyTrustUs'
import Process from '../sections/Process'
import AboutPreview from '../sections/AboutPreview'
import ServicesGrid from '../sections/ServicesGrid'
import Reviews from '../sections/Reviews'
import FinalCTA from '../sections/FinalCTA'
import Seo from '../components/Seo'
import CallNowButton from '../components/CallNowButton'

export default function Home() {
  return (
    <main>
      <Seo
        title="Polyaspartic Floor Coating in Arizona | Next Level Coatings"
        description="Arizona's top-rated concrete coating specialists — garage floors, patios, driveways & pool decks. 1-day installs, lifetime warranty. Free quotes."
        path="/"
      />
      <Hero />
      <WhyTrustUs />
      <Process />
      <AboutPreview />
      <ServicesGrid />
      <Reviews />
      <FinalCTA />
      <CallNowButton />
    </main>
  )
}
