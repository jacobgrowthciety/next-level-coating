import ResidentialIntro from '../sections/ResidentialIntro'
import ResidentialGallery from '../sections/ResidentialGallery'
import ResidentialDetails from '../sections/ResidentialDetails'
import ResidentialCTA from '../sections/ResidentialCTA'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'
import { usePageContent } from '../lib/pageContent'

/** Residential service page (reference/BRIEF.md §8 `/residential`, §9). */
export default function Residential() {
  const { metaTitle, metaDescription, h1, bodyContent, bodySections, ogImage } = usePageContent('/residential')

  return (
    <main>
      <Seo
        title={metaTitle}
        description={metaDescription}
        path="/residential"
        image={ogImage}
      />
      <ResidentialIntro h1={h1} body={bodyContent} />
      <ResidentialGallery />
      <ResidentialDetails sections={bodySections} />
      <ResidentialCTA />
      <CallNowButton />
    </main>
  )
}
