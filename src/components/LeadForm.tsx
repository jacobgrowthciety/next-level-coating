import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { trackClickToCall, trackGenerateLead } from '../lib/analytics'

/** Lead capture form — fields per reference/BRIEF.md §6. Reused across pages.
 * Both SMS consent checkboxes are intentionally optional (not `required`) — leads should still be
 * captured whether or not either is checked. Their state is sent to GoHighLevel as `smsConsent` and
 * `smsMarketingConsent` so a workflow can branch on them (only opted-in leads get enrolled in the
 * matching automated SMS). */

/* The exact consent language displayed at the point of opt-in, kept as constants so the strings
 * submitted as proof-of-consent are literally what the user saw — not copies that can drift.
 *
 * This wording is load-bearing for A2P 10DLC. The campaign is registered as Low Volume MIXED, which
 * means both transactional and promotional content are declared — and carriers require the two to
 * be consented to SEPARATELY. Hence two boxes, each independently optional: a lead can accept
 * appointment texts while refusing offers, and marketing is never implied by transactional consent.
 *
 * Each string must keep naming the legal entity, its own use case, frequency, rates, and both
 * HELP/STOP keywords, and must stay in sync with the campaign description and sample messages
 * registered in GoHighLevel. Reviewers compare the two directly. */
const SMS_CONSENT_TEXT =
  'I consent to receive non-marketing text messages from Next Level Coatings LLC about my quote ' +
  'request, appointment scheduling, and project updates. Message frequency may vary, message & ' +
  'data rates may apply. Text HELP for assistance, reply STOP to opt out. Consent is not a ' +
  'condition of purchase.'

const SMS_MARKETING_CONSENT_TEXT =
  'I consent to receive marketing text messages, about special offers, discounts, and service ' +
  'updates, from Next Level Coatings LLC at the phone number provided. Message frequency may ' +
  'vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out. ' +
  'Consent is not a condition of purchase.'

const PROJECT_OPTIONS = [
  '2 Car',
  '3 Car',
  'RV Garage',
  'Commercial',
  'Other',
] as const

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  zip: '',
  project: '',
}

const fieldClass =
  'w-full rounded-md border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-brand-teal focus:ring-1 focus:ring-brand-teal'

const GOHIGHLEVEL_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/tKHtSQwC4t275M0g1LQf/webhook-trigger/e67f7f0c-1cf5-4477-99b6-7d0c1408f0b9'

export default function LeadForm() {
  const [values, setValues] = useState(initialState)
  const [smsConsent, setSmsConsent] = useState(false)
  const [smsMarketingConsent, setSmsMarketingConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)
  const idPrefix = useId()
  const firstNameId = `${idPrefix}firstName`
  const lastNameId = `${idPrefix}lastName`
  const emailId = `${idPrefix}email`
  const phoneId = `${idPrefix}phone`
  const zipId = `${idPrefix}zip`
  const projectId = `${idPrefix}project`
  const consentId = `${idPrefix}consent`
  const marketingConsentId = `${idPrefix}marketingConsent`

  function update(field: keyof typeof initialState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(false)

    try {
      const response = await fetch(GOHIGHLEVEL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          zipCode: values.zip,
          projectDescription: values.project,
          // `smsConsent` keeps its original name (transactional opt-in) so the existing
          // GoHighLevel workflow mapping keeps working; marketing is a new, separate field.
          smsConsent,
          smsMarketingConsent,
          // Proof of opt-in, stored on the GoHighLevel contact. If a carrier or Twilio audits the
          // campaign they ask when consent was given, on what page, and to exactly what wording —
          // the booleans alone can't answer that. Both texts are sent regardless of which boxes
          // were ticked, since what matters is the wording that was presented.
          consentTimestamp: new Date().toISOString(),
          consentPageUrl: window.location.href,
          consentText: SMS_CONSENT_TEXT,
          marketingConsentText: SMS_MARKETING_CONSENT_TEXT,
        }),
      })

      if (!response.ok) {
        throw new Error(`GoHighLevel webhook returned status ${response.status}`)
      }

      // Fired here rather than in the `finally` block or before the fetch, so a rejected/failed
      // webhook never counts as a conversion — this line is only reachable on a 2xx response.
      trackGenerateLead()
      setSubmitted(true)
    } catch (err) {
      console.error('GoHighLevel webhook submission failed:', err)
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex w-full flex-col items-center rounded-xl border border-white/10 bg-black/50 p-8 text-center backdrop-blur-md sm:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal/15">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-9 w-9 text-brand-teal"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5 9.5 17 19 7" />
          </svg>
        </div>
        <p className="mt-5 font-script text-4xl text-brand-teal sm:text-5xl">Thank You!</p>
        <p className="mt-3 text-sm text-white/70 sm:text-base">We'll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl border border-white/10 bg-black/50 p-5 backdrop-blur-md sm:p-6"
    >
      <h2 className="text-lg font-semibold text-white">
        Get Your Free Quote
      </h2>
      <p className="mt-1 text-sm text-brand-gray">
        Arizona's top concrete coatings — one-day installs.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={firstNameId} className="sr-only">
            First Name
          </label>
          <input
            id={firstNameId}
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            placeholder="First Name"
            className={fieldClass}
            value={values.firstName}
            onChange={(e) => update('firstName', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={lastNameId} className="sr-only">
            Last Name
          </label>
          <input
            id={lastNameId}
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            placeholder="Last Name"
            className={fieldClass}
            value={values.lastName}
            onChange={(e) => update('lastName', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={emailId} className="sr-only">
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email"
            className={fieldClass}
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={phoneId} className="sr-only">
            Phone
          </label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder="Phone"
            className={fieldClass}
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={zipId} className="sr-only">
            Zip Code
          </label>
          <input
            id={zipId}
            name="zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            required
            placeholder="Zip Code"
            className={fieldClass}
            value={values.zip}
            onChange={(e) => update('zip', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={projectId} className="sr-only">
            Project Description
          </label>
          <select
            id={projectId}
            name="project"
            required
            className={`${fieldClass} ${values.project === '' ? 'text-white/40' : ''}`}
            value={values.project}
            onChange={(e) => update('project', e.target.value)}
          >
            <option value="" disabled>
              Project Description
            </option>
            {PROJECT_OPTIONS.map((option) => (
              <option key={option} value={option} className="text-black">
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Two independent opt-ins, both optional (not `required`) and unchecked by default.

          Consent must be an affirmative act, and the lead still submits with neither ticked. They
          are kept separate because the campaign is registered as Mixed: carriers require
          transactional and promotional consent to be granted individually, so someone can accept
          appointment texts without accepting offers. Never collapse these into one box, and never
          make either a condition of submitting.

          Policy acceptance is deliberately NOT bundled into either label — agreeing to the Privacy
          Policy / Terms is the separate statement below, so each checkbox means exactly one thing.

          Sized at text-xs rather than the old text-[10px]/50% opacity: the disclosures have to be
          legible and non-obscured to pass A2P review, and 10px at half opacity reads as hidden
          fine print in a reviewer's screenshot. */}
      <label
        htmlFor={consentId}
        className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-white/70"
      >
        <input
          id={consentId}
          name="smsConsent"
          type="checkbox"
          checked={smsConsent}
          onChange={(e) => setSmsConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand-teal"
        />
        <span>{SMS_CONSENT_TEXT}</span>
      </label>

      <label
        htmlFor={marketingConsentId}
        className="mt-3 flex items-start gap-2.5 text-xs leading-relaxed text-white/70"
      >
        <input
          id={marketingConsentId}
          name="smsMarketingConsent"
          type="checkbox"
          checked={smsMarketingConsent}
          onChange={(e) => setSmsMarketingConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand-teal"
        />
        <span>{SMS_MARKETING_CONSENT_TEXT}</span>
      </label>

      {/* New tab, so reading the policies never discards a half-filled form. */}
      <p className="mt-3 text-xs leading-relaxed text-white/70">
        By submitting this form you agree to our{' '}
        <Link
          to="/privacy-policy"
          target="_blank"
          className="underline transition-colors hover:text-brand-teal"
        >
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link
          to="/terms-conditions"
          target="_blank"
          className="underline transition-colors hover:text-brand-teal"
        >
          Terms &amp; Conditions
        </Link>
        .
      </p>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          Something went wrong sending your request. Please try again or call us at
          {' '}
          <a href="tel:+16232241097" onClick={trackClickToCall} className="underline hover:text-red-300">
            (623) 224-1097
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 w-full rounded-md bg-brand-teal px-4 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-teal/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Request My Free Quote'}
      </button>
    </form>
  )
}
