import LegalDocument, { BUSINESS, type LegalBlock } from '../components/LegalDocument'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'

const LAST_UPDATED = 'July 28, 2026'

const BLOCKS: LegalBlock[] = [
  {
    heading: 'Information We Collect',
    paragraphs: ['When you use our website or contact us for a quote, we may collect:'],
    bullets: ['Name', 'Phone number', 'Email address', 'ZIP code', 'Project details you provide'],
  },
  {
    heading: 'How We Use Your Information',
    paragraphs: ['We use the information you provide to:'],
    bullets: [
      'Respond to your quote requests and inquiries',
      "Schedule and provide services you've requested",
      'Send you updates about your project',
      'Improve our website and services',
    ],
  },
  {
    heading: 'SMS/Text Messaging Communications',
    paragraphs: [
      'If you provide your phone number and consent to receive text messages from us, we may send you messages related to your quote request, appointment scheduling, and project updates.',
    ],
    bullets: [
      'Message frequency varies based on your interactions with us.',
      'Message and data rates may apply.',
      'You can opt out of text messages at any time by replying STOP to any message.',
      `For help, reply HELP or contact us directly at ${BUSINESS.phone}.`,
      'Your mobile opt-in information and consent will NOT be shared with any third parties or affiliates for marketing or promotional purposes.',
    ],
  },
  {
    heading: 'How We Protect Your Information',
    paragraphs: [
      'We do not sell, rent, or trade your personal information to third parties. We may share information with trusted service providers (such as our customer relationship management platform) solely to help us operate our business and provide services to you, and only as necessary for that purpose.',
    ],
  },
  {
    heading: 'Cookies and Analytics',
    paragraphs: [
      'Our website uses Google Analytics to understand how visitors use our site. This helps us improve our website and services. You can control cookie preferences through your browser settings.',
    ],
  },
  {
    heading: 'Your Rights',
    paragraphs: [
      `You may request access to, correction of, or deletion of your personal information by contacting us at ${BUSINESS.email} or ${BUSINESS.phone}.`,
    ],
  },
  {
    heading: 'Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.',
    ],
  },
]

/** Privacy Policy — standalone page (previously a Coming Soon placeholder). */
export default function PrivacyPolicy() {
  return (
    <main>
      <Seo
        title="Privacy Policy | Next Level Coatings"
        description="How Next Level Coatings collects, uses, and protects the personal information you share with us, including our SMS/text messaging and analytics practices."
        path="/privacy-policy"
      />
      <LegalDocument
        title="Privacy Policy"
        lastUpdated={LAST_UPDATED}
        intro='Next Level Coatings ("we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information.'
        blocks={BLOCKS}
      />
      <CallNowButton />
    </main>
  )
}
