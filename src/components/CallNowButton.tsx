/** Persistent mobile "Call Now" button — always visible on touch/small screens (BRIEF.md §5, §6). */
export default function CallNowButton() {
  return (
    <a
      href="tel:+16232241097"
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 bg-brand-teal px-4 py-3.5 text-center text-base font-semibold text-brand-black shadow-lg md:hidden"
      style={{ paddingBottom: 'calc(0.875rem + env(safe-area-inset-bottom))' }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="currentColor"
      >
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
      </svg>
      Call Now · (623) 224-1097
    </a>
  )
}
