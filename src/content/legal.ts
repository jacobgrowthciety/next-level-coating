/**
 * Legal document copy — the single source of truth for /privacy-policy and /terms-conditions.
 *
 * WHY THIS IS A STANDALONE DATA MODULE, not copy living inside the page components:
 * this site is a client-rendered SPA, so the HTML served for /privacy-policy contains no policy
 * text at all until React mounts. A2P 10DLC brand/campaign review fetches those two URLs, and any
 * step of that pipeline that doesn't execute JS concludes the site has no privacy policy and
 * rejects the registration. So the same copy is ALSO rendered to static HTML at build time (see
 * the prerender plugin in vite.config.ts) and shipped inside the served document.
 *
 * Keeping the text here — as plain data with no React imports — is what lets the build script and
 * the React pages read from one place. Editing policy copy in a component would silently desync
 * the prerendered fallback, which is the version the carriers actually read.
 *
 * CONSTRAINT: this module is imported by vite.config.ts, which esbuild bundles for Node. It must
 * stay free of React, JSX, and browser globals.
 */

/** Business NAP (reference/BRIEF.md §7) — same values as the footer and LocalBusinessSchema.
 * `legalName` is the entity on the EIN and must match the A2P brand registration exactly; the
 * marketing name ("Next Level Coatings") is the same string minus the suffix, so no DBA
 * declaration is required. */
export const BUSINESS = {
  legalName: 'Next Level Coatings LLC',
  phoneHref: 'tel:+16232241097',
  phone: '(623) 224-1097',
  email: 'nextlevelcoatingsaz@gmail.com',
  address: '25689 N 140th Ln, Surprise, AZ 85387',
}

/** A run of text inside a bullet. The object form renders as an internal link — a react-router
 * <Link> in the app, a plain <a href> in the prerendered HTML. */
export type LegalInline = string | { text: string; to: string }

/** A bullet is either plain text or a sequence of runs (used where a link is needed inline). */
export type LegalBullet = string | LegalInline[]

export type LegalBlock = {
  heading: string
  paragraphs?: string[]
  bullets?: LegalBullet[]
}

export type LegalDoc = {
  /** Route path — also the basename of the generated `<path>.html` file. */
  path: string
  title: string
  seoTitle: string
  seoDescription: string
  lastUpdated: string
  intro: string
  blocks: LegalBlock[]
}

export const PRIVACY_POLICY: LegalDoc = {
  path: '/privacy-policy',
  title: 'Privacy Policy',
  seoTitle: 'Privacy Policy | Next Level Coatings',
  seoDescription:
    'How Next Level Coatings collects, uses, and protects the personal information you share with us, including our SMS/text messaging and analytics practices.',
  lastUpdated: 'August 12, 2026',
  intro: `${BUSINESS.legalName} ("we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information.`,
  blocks: [
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
        'Our quote request form offers two separate SMS consent checkboxes, and you may accept either, both, or neither. Neither is required to submit the form or to purchase any goods or services.',
        'If you consent to non-marketing messages, we may text you about your quote request, appointment scheduling, and project updates. If you separately consent to marketing messages, we may text you about special offers, discounts, and service updates. Consenting to one does not opt you in to the other.',
      ],
      bullets: [
        'Message frequency may vary based on your interactions with us.',
        'Message and data rates may apply.',
        'You can opt out at any time by replying STOP to any message you receive from us. Replying STOP ends all text messages from us, both non-marketing and marketing.',
        `For help, reply HELP or contact us at ${BUSINESS.phone} or ${BUSINESS.email}.`,
        'Consent to receive text messages is not a condition of purchasing any goods or services.',
        `Text messages are sent from a ${BUSINESS.legalName} messaging number, which may differ from the main business line listed on this website.`,
      ],
    },
    {
      // Verbatim carrier/CTIA-mandated clause for A2P 10DLC registration — reviewers pattern-match
      // this exact sentence, so do not paraphrase, reword, or split it.
      heading: 'Mobile Information and Third Parties',
      paragraphs: [
        'No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Information sharing to subcontractors in support services, such as customer service, is permitted. All other use case categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.',
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
  ],
}

export const TERMS_CONDITIONS: LegalDoc = {
  path: '/terms-conditions',
  title: 'Terms & Conditions',
  seoTitle: 'Terms & Conditions | Next Level Coatings',
  seoDescription:
    'The terms governing your use of the Next Level Coatings website, including quote estimates, SMS messaging terms, liability, and governing law.',
  lastUpdated: 'August 12, 2026',
  intro: `Welcome to ${BUSINESS.legalName}. By accessing or using our website, you agree to be bound by the following terms and conditions.`,
  blocks: [
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
      // A2P 10DLC (Low Volume Mixed campaign) required disclosures. Each bullet maps to a clause
      // the carriers check for: frequency, rates, the full STOP/HELP opt-out protocol, carrier
      // liability, the not-a-condition-of-purchase statement, and the Privacy Policy cross-link.
      // Changing the stated frequency here means updating the registered campaign too.
      heading: 'SMS Terms of Service',
      paragraphs: [
        `By submitting your phone number through our website and checking one or both SMS consent boxes, you consent to receive the corresponding SMS communications from ${BUSINESS.legalName}. The non-marketing opt-in covers messages related to your quote request, appointment scheduling, and project updates. The separate marketing opt-in covers special offers, discounts, and service updates. The two consents are independent, and neither is required to submit the form or to purchase any goods or services.`,
        `Text messages are sent from a ${BUSINESS.legalName} messaging number, which may differ from our main business line; our main line remains ${BUSINESS.phone} for calls.`,
      ],
      bullets: [
        // Required by the A2P compliance review: the Terms must state an 18+ age restriction for
        // the SMS program. Unrelated to the "age gated content" campaign flag, which covers
        // alcohol/tobacco/cannabis/gambling and stays off.
        'You must be 18 years or older to use this SMS service. By providing your phone number and opting in, you confirm that you are at least 18 years of age.',
        'You will receive up to 10 messages per month in total across both message types. Message frequency may vary based on your interactions with us. As always, message and data rates may apply for any messages sent to you from us and to us from you. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.',
        `You can cancel the SMS service at any time by replying STOP to any message you receive from us. Replying STOP unsubscribes you from all text messages from us, both non-marketing and marketing. After you send STOP, we will send you one message confirming that you have been unsubscribed, and you will receive no further messages. If you want to join again, just submit a new quote request through our website and we will start sending messages to you again. If you are experiencing issues with the messaging program, reply HELP for assistance, or contact us directly at ${BUSINESS.phone} or ${BUSINESS.email}.`,
        'Carriers are not liable for delayed or undelivered messages.',
        'Your consent to receive text messages is not a condition of purchasing any goods or services.',
        [
          'If you have any questions regarding privacy, please read our ',
          { text: 'Privacy Policy', to: '/privacy-policy' },
          '.',
        ],
      ],
    },
    {
      heading: 'Limitation of Liability',
      paragraphs: [
        `${BUSINESS.legalName} provides this website "as is" without warranties of any kind. We are not liable for any damages arising from your use of this website or reliance on information provided here.`,
      ],
    },
    {
      heading: 'Intellectual Property',
      paragraphs: [
        `All content on this website, including text, images, and logos, is the property of ${BUSINESS.legalName} unless otherwise noted, and may not be used without permission.`,
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
  ],
}

/** Every document that gets a prerendered HTML file. Adding one here is all the build needs —
 * remember to add the matching rewrite in vercel.json so the file is actually served. */
export const LEGAL_DOCS: LegalDoc[] = [PRIVACY_POLICY, TERMS_CONDITIONS]
