/**
 * GA4 conversion event helpers.
 *
 * The three events here are the conversions the ad account actually optimizes against:
 * `generate_lead` (form submit), `click_to_call` (tel: link), `click_to_email` (mailto: link).
 *
 * `window.gtag` is declared globally in hooks/useAnalytics.ts and is optional-chained on every
 * call: gtag.js is loaded from index.html with `async`, and an ad/tracker blocker can stop it
 * outright, so it may legitimately be undefined when a handler runs. A blocked tag must never
 * break a phone call or a form submission — hence the silent no-op rather than a throw.
 *
 * Location is read from window.location.pathname at fire time rather than passed in by the
 * caller, so every call site reports the route consistently and no site can forget the param.
 */
function track(event: string, params: Record<string, unknown>): void {
  window.gtag?.('event', event, params)
}

/** Fired only after the lead webhook confirms a successful submission — never on an error. */
export function trackGenerateLead(): void {
  track('generate_lead', { form_location: window.location.pathname })
}

/**
 * Click handler for `tel:` links. Attached as a plain onClick alongside normal link behavior —
 * it never calls preventDefault, so the dialer still opens immediately. gtag's own transport
 * uses sendBeacon, which survives the page losing focus to the dialer.
 */
export function trackClickToCall(): void {
  track('click_to_call', { link_location: window.location.pathname })
}

/** Click handler for `mailto:` links. Same non-blocking contract as trackClickToCall. */
export function trackClickToEmail(): void {
  track('click_to_email', { link_location: window.location.pathname })
}
