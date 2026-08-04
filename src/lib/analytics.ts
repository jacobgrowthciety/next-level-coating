/**
 * Conversion event helpers — each one reports to GA4 and to the Meta Pixel.
 *
 * The three conversions here are what the ad accounts actually optimize against. GA4 uses custom
 * names; Meta gets the nearest *standard* event, which is what its campaign objectives and
 * optimization can target (a custom pixel event would only be usable as a custom conversion):
 *
 *   form submit  → GA4 `generate_lead`   / pixel `Lead`
 *   tel: click   → GA4 `click_to_call`   / pixel `Contact`
 *   mailto:click → GA4 `click_to_email`  / pixel `Contact`
 *
 * Call and email collapse into the same pixel event because `Contact` is the only standard event
 * that fits either one. The GA4 name is passed through as a param so the two are still separable
 * in Meta's reporting.
 *
 * `window.gtag` / `window.fbq` are declared globally in hooks/useAnalytics.ts and are
 * optional-chained on every call: both tags load from index.html with `async`, and an ad/tracker
 * blocker can stop either outright, so they may legitimately be undefined when a handler runs. A
 * blocked tag must never break a phone call or a form submission — hence the silent no-op rather
 * than a throw. The two are also independent: one being blocked must not suppress the other.
 *
 * Location is read from window.location.pathname at fire time rather than passed in by the
 * caller, so every call site reports the route consistently and no site can forget the param.
 */
function track(event: string, params: Record<string, unknown>): void {
  window.gtag?.('event', event, params)
}

function trackMeta(event: string, params: Record<string, unknown>): void {
  window.fbq?.('track', event, params)
}

/** Fired only after the lead webhook confirms a successful submission — never on an error. */
export function trackGenerateLead(): void {
  track('generate_lead', { form_location: window.location.pathname })
  trackMeta('Lead', { content_name: window.location.pathname })
}

/**
 * Click handler for `tel:` links. Attached as a plain onClick alongside normal link behavior —
 * it never calls preventDefault, so the dialer still opens immediately. gtag's own transport
 * uses sendBeacon, which survives the page losing focus to the dialer; fbevents.js likewise
 * falls back to sendBeacon, so neither send is lost to the app switch.
 */
export function trackClickToCall(): void {
  track('click_to_call', { link_location: window.location.pathname })
  trackMeta('Contact', { content_name: 'click_to_call', content_category: window.location.pathname })
}

/** Click handler for `mailto:` links. Same non-blocking contract as trackClickToCall. */
export function trackClickToEmail(): void {
  track('click_to_email', { link_location: window.location.pathname })
  trackMeta('Contact', {
    content_name: 'click_to_email',
    content_category: window.location.pathname,
  })
}
