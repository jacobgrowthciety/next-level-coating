import LegalDocument, { BUSINESS, type LegalBlock } from '../components/LegalDocument'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

const LAST_UPDATED = 'July 28, 2026'

const BLOCKS: LegalBlock[] = [
  {
    heading: 'Use of Website',
    paragraphs: [
      'This website is provided for informational purposes to help you learn about our services and request quotes. You agree to use this site only for lawful purposes.',
    ],
  },
  {
    heading: 'Services',
    paragraphs: [
      'Quotes provided through this website are estimates only and are subject to confirmation following an in-person or detailed assessment of your project. Final pricing, scope of work, and timelines will be confirmed directly with you before any work begins.',
    ],
  },
  {
    heading: 'SMS Terms of Service',
    paragraphs: [
      'By submitting your phone number through our website and opting in to receive text messages, you consent to receive SMS communications from Next Level Coatings related to your quote requests, appointments, and project updates.',
    ],
    bullets: [
      'Message frequency varies.',
      'Message and data rates may apply.',
      'You may opt out at any time by replying STOP to any message received.',
      `Reply HELP for assistance, or contact us directly at ${BUSINESS.phone}.`,
      'Carriers are not liable for delayed or undelivered messages.',
      'This SMS program is not shared with third parties for marketing purposes, and your consent to receive texts is not a condition of purchasing any goods or services.',
    ],
  },
  {
    heading: 'Limitation of Liability',
    paragraphs: [
      'Next Level Coatings provides this website "as is" without warranties of any kind. We are not liable for any damages arising from your use of this website or reliance on information provided here.',
    ],
  },
  {
    heading: 'Intellectual Property',
    paragraphs: [
      'All content on this website, including text, images, and logos, is the property of Next Level Coatings unless otherwise noted, and may not be used without permission.',
    ],
  },
  {
    heading: 'Governing Law',
    paragraphs: ['These terms are governed by the laws of the State of Arizona.'],
  },
  {
    heading: 'Changes to These Terms',
    paragraphs: [
      'We may update these Terms & Conditions at any time. Continued use of this website after changes are posted constitutes acceptance of the updated terms.',
    ],
  },
]

/** Terms & Conditions — standalone page (previously a Coming Soon placeholder). */
export default function TermsConditions() {
  return (
    <main>
      <Seo
        title="Terms & Conditions | Next Level Coatings"
        description="The terms governing your use of the Next Level Coatings website, including quote estimates, SMS messaging terms, liability, and governing law."
        path="/terms-conditions"
      />
      <LegalDocument
        title="Terms & Conditions"
        lastUpdated={LAST_UPDATED}
        intro="Welcome to Next Level Coatings. By accessing or using our website, you agree to be bound by the following terms and conditions."
        blocks={BLOCKS}
      />
      <CallNowButton />
    </main>
  )
}
