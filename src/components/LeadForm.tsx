import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

/** Lead capture form — fields per reference/BRIEF.md §6. Reused across pages.
 * The SMS consent checkbox is intentionally optional (not `required`) — leads should still be
 * captured whether or not it's checked. Its state is sent to GoHighLevel as `smsConsent` so a
 * workflow can branch on it (only opted-in leads get enrolled in automated SMS). */

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
  'https://services.leadconnectorhq.com/hooks/YWEIkN47BTWMMU9mVr8B/webhook-trigger/6964db57-b3f2-4969-a608-35dcc99347d6'

export default function LeadForm() {
  const [values, setValues] = useState(initialState)
  const [smsConsent, setSmsConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const idPrefix = useId()
  const firstNameId = `${idPrefix}firstName`
  const lastNameId = `${idPrefix}lastName`
  const emailId = `${idPrefix}email`
  const phoneId = `${idPrefix}phone`
  const zipId = `${idPrefix}zip`
  const projectId = `${idPrefix}project`
  const consentId = `${idPrefix}consent`

  function update(field: keyof typeof initialState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Always show the confirmation state — a failed background submission shouldn't block it.
    setSubmitted(true)

    fetch(GOHIGHLEVEL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        zipCode: values.zip,
        projectDescription: values.project,
        smsConsent,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error('GoHighLevel webhook returned an error status:', response.status)
        }
      })
      .catch((error) => {
        console.error('GoHighLevel webhook submission failed:', error)
      })
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

      {/* Optional (not `required`) — unchecked by default so consent is opt-in, per TCPA.
          Leaving it unchecked still submits the lead; it only withholds SMS consent. */}
      <label
        htmlFor={consentId}
        className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-white/50"
      >
        <input
          id={consentId}
          name="smsConsent"
          type="checkbox"
          checked={smsConsent}
          onChange={(e) => setSmsConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand-teal"
        />
        <span>
          I agree to Terms &amp; Conditions and Privacy Policy linked below provided by Next
          Level Coatings. By providing my phone number, I agree to receive text messages from
          Next Level Coatings at the phone number provided above. Data rates may apply, reply
          STOP to opt out.
          <span className="mt-1 flex gap-4">
            <Link to="/privacy-policy" className="underline transition-colors hover:text-brand-teal">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="underline transition-colors hover:text-brand-teal">
              Terms &amp; Conditions
            </Link>
          </span>
        </span>
      </label>

      <button
        type="submit"
        className="mt-4 w-full rounded-md bg-brand-teal px-4 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-teal/80"
      >
        Request My Free Quote
      </button>
    </form>
  )
}
