import CommercialIntro from '../sections/CommercialIntro'
import CommercialGallery from '../sections/CommercialGallery'
import CommercialDetails from '../sections/CommercialDetails'
import CommercialCTA from '../sections/CommercialCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'
import { usePageContent } from '../lib/pageContent'

/** Commercial service page (reference/BRIEF.md §8 `/commercial`, §9). */
export default function Commercial() {
  const { metaTitle, metaDescription, h1, bodyContent, bodySections, ogImage } = usePageContent('/commercial')

  return (
    <main>
      <Seo
        title={metaTitle}
        description={metaDescription}
        path="/commercial"
        image={ogImage}
      />
      <CommercialIntro h1={h1} body={bodyContent} />
      <CommercialGallery />
      <CommercialDetails sections={bodySections} />
      <CommercialCTA />
      <CallNowButton />
    </main>
  )
}
