import { useMemo } from 'react'
import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react'
import { Link } from 'react-router-dom'

/**
 * Renders Portable Text from a `pageContent` document as plain prose.
 *
 * Deliberately animation-free and unwrapped: it emits bare <p>/<ul> elements and nothing else.
 * Call sites animate this copy in different systems — page headers use `fadeUp` inside a stagger
 * container, the homepage hero uses `heroReveal` with an explicit delay — so the wrapper and its
 * motion variant belong to the caller. Baking one of them in here would force the others to
 * fight it.
 *
 * Editors can write several paragraphs where a page shipped with one, so spacing is handled
 * between paragraphs rather than assumed to be a single block.
 */
export default function SanityProse({
  blocks,
  className = 'max-w-xl text-base leading-relaxed text-white/70 sm:text-lg',
  gapClassName = 'mt-4',
}: {
  blocks: PortableTextBlock[]
  /** Type styles for each paragraph. Pass '' to inherit them from the caller's wrapper instead. */
  className?: string
  /** Space between consecutive paragraphs. The first never takes it — the wrapper owns leading space. */
  gapClassName?: string
}) {
  const components = useMemo<PortableTextComponents>(() => {
    const paragraph = `${gapClassName} first:mt-0 ${className}`.trim()
    return {
      block: {
        normal: ({ children }) => <p className={paragraph}>{children}</p>,
      },
      list: {
        bullet: ({ children }) => (
          <ul className={`${gapClassName} list-disc space-y-1 pl-6 first:mt-0 ${className}`.trim()}>
            {children}
          </ul>
        ),
      },
      marks: {
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        link: ({ children, value }) => {
          const href = (value as { href?: string })?.href ?? '#'
          // Internal links go through the router so they don't cost a full page reload; mailto:
          // and tel: are not navigations at all and must stay plain anchors.
          const internal = href.startsWith('/')
          const teal = 'text-brand-teal underline underline-offset-2 hover:text-brand-teal/80'
          if (internal) {
            return (
              <Link to={href} className={teal}>
                {children}
              </Link>
            )
          }
          const external = /^https?:\/\//.test(href)
          return (
            <a
              href={href}
              className={teal}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {children}
            </a>
          )
        },
      },
    }
  }, [className, gapClassName])

  // An empty value is a valid editorial state for the intro copy (the Contact page ships that
  // way), so render nothing rather than an empty wrapper that would still contribute margin.
  if (!blocks?.length) return null

  return <PortableText value={blocks} components={components} />
}
