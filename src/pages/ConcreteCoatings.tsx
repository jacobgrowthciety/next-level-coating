import ConcreteCoatingsIntro from '../sections/ConcreteCoatingsIntro'
import ConcreteCoatingsGallery from '../sections/ConcreteCoatingsGallery'
import ConcreteCoatingsDetails from '../sections/ConcreteCoatingsDetails'
import ConcreteCoatingsCTA from '../sections/ConcreteCoatingsCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'
import { usePageContent } from '../lib/pageContent'

/** Concrete Coatings service page (reference/BRIEF.md §8 `/concrete-coatings`, §9). */
export default function ConcreteCoatings() {
  const { metaTitle, metaDescription, h1, bodyContent, bodySections, ogImage } = usePageContent('/concrete-coatings')

  return (
    <main>
      <Seo
        title={metaTitle}
        description={metaDescription}
        path="/concrete-coatings"
        image={ogImage}
      />
      <ConcreteCoatingsIntro h1={h1} body={bodyContent} />
      <ConcreteCoatingsGallery />
      <ConcreteCoatingsDetails sections={bodySections} />
      <ConcreteCoatingsCTA />
      <CallNowButton />
    </main>
  )
}
