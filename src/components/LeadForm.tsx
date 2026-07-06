import { useState } from 'react'
import type { FormEvent } from 'react'

/** Lead capture form — fields per reference/BRIEF.md §6. Reused across pages. */

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

export default function LeadForm() {
  const [values, setValues] = useState(initialState)

  function update(field: keyof typeof initialState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: wire to real submission endpoint / CRM.
    console.log('Lead submitted:', values)
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
          <label htmlFor="firstName" className="sr-only">
            First Name
          </label>
          <input
            id="firstName"
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
          <label htmlFor="lastName" className="sr-only">
            Last Name
          </label>
          <input
            id="lastName"
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
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
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
          <label htmlFor="phone" className="sr-only">
            Phone
          </label>
          <input
            id="phone"
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
          <label htmlFor="zip" className="sr-only">
            Zip Code
          </label>
          <input
            id="zip"
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
          <label htmlFor="project" className="sr-only">
            Project Description
          </label>
          <select
            id="project"
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

      <button
        type="submit"
        className="mt-4 w-full rounded-md bg-brand-teal px-4 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-teal/80"
      >
        Request My Free Quote
      </button>
    </form>
  )
}
