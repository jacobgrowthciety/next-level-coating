import PatiosIntro from '../sections/PatiosIntro'
import PatiosGallery from '../sections/PatiosGallery'
import PatiosDetails from '../sections/PatiosDetails'
import PatiosCTA from '../sections/PatiosCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'
import { usePageContent } from '../lib/pageContent'

/** Patios, Sidewalks & Driveways service page (reference/BRIEF.md §8 `/patios`, §9). */
export default function Patios() {
  const { metaTitle, metaDescription, h1, bodyContent, bodySections, ogImage } = usePageContent('/patios')

  return (
    <main>
      <Seo
        title={metaTitle}
        description={metaDescription}
        path="/patios"
        image={ogImage}
      />
      <PatiosIntro h1={h1} body={bodyContent} />
      <PatiosGallery />
      <PatiosDetails sections={bodySections} />
      <PatiosCTA />
      <CallNowButton />
    </main>
  )
}
