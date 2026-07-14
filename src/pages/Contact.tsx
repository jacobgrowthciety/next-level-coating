import ContactIntro from '../sections/ContactIntro'
import ContactFormSection from '../sections/ContactFormSection'
import ContactInfo from '../sections/ContactInfo'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

/** Contact page (reference/BRIEF.md §8 `/contact`, §9). */
export default function Contact() {
  return (
    <main>
      <Seo
        title="Contact | Next Level Coatings"
        description="Get a free quote from Arizona's top concrete coating specialists. Call (623) 224-1097 or send us your project details — serving Phoenix, Surprise, Peoria & the Valley."
        path="/contact"
      />
      <ContactIntro />
      <ContactFormSection />
      <ContactInfo />
      <CallNowButton />
    </main>
  )
}
