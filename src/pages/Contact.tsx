import ContactIntro from '../sections/ContactIntro'
import ContactFormSection from '../sections/ContactFormSection'
import ContactInfo from '../sections/ContactInfo'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'
import { usePageContent } from '../lib/pageContent'

/** Contact page (reference/BRIEF.md §8 `/contact`, §9). */
export default function Contact() {
  const { metaTitle, metaDescription, h1, bodyContent, ogImage } = usePageContent('/contact')

  return (
    <main>
      <Seo
        title={metaTitle}
        description={metaDescription}
        image={ogImage}
        path="/contact"
      />
      <ContactIntro h1={h1} body={bodyContent} />
      <ContactFormSection />
      <ContactInfo />
      <CallNowButton />
    </main>
  )
}
