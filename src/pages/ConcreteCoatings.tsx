import ConcreteCoatingsIntro from '../sections/ConcreteCoatingsIntro'
import ConcreteCoatingsGallery from '../sections/ConcreteCoatingsGallery'
import ConcreteCoatingsDetails from '../sections/ConcreteCoatingsDetails'
import ConcreteCoatingsCTA from '../sections/ConcreteCoatingsCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

/** Concrete Coatings service page (reference/BRIEF.md §8 `/concrete-coatings`, §9). */
export default function ConcreteCoatings() {
  return (
    <main>
      <Seo
        title="Concrete Coatings in Phoenix | Next Level Coatings"
        description="Family-owned epoxy and polyaspartic concrete coatings for garages, warehouses, offices, and patios across the Greater Phoenix area. Fast cure times. Free quotes."
        path="/concrete-coatings"
        image="https://www.nextlevelcoatingsaz.com/services/concrete-coatings/concrete-coatings-01.webp"
      />
      <ConcreteCoatingsIntro />
      <ConcreteCoatingsGallery />
      <ConcreteCoatingsDetails />
      <ConcreteCoatingsCTA />
      <CallNowButton />
    </main>
  )
}
