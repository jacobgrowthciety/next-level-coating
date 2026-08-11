import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'vite'
import { BUSINESS, LEGAL_DOCS, type LegalBullet, type LegalDoc } from '../src/content/legal'

/**
 * Emits a static HTML file per legal document (dist/privacy-policy.html, …) so the served document
 * contains the full policy text before any JavaScript runs.
 *
 * WHY: A2P 10DLC brand/campaign review fetches /privacy-policy and /terms-conditions. This is a
 * client-rendered SPA, so the raw response for those URLs is an empty #root — a reviewer or crawler
 * that doesn't execute JS sees no policy and rejects the registration. Verified before this plugin
 * existed: `curl /privacy-policy` returned the index shell with zero policy text.
 *
 * HOW: each file is dist/index.html (so it keeps the exact hashed asset tags, analytics snippets and
 * preloads) plus (a) correct per-page <title>/description/canonical, and (b) a #legal-fallback block
 * holding the whole document as semantic HTML.
 *
 * The fallback is hidden the instant JS is available — an inline script in <head> stamps a class on
 * <html> during parse, before first paint, so browsers never flash it and React renders the normal
 * page. Non-JS agents don't run the script, so for them the content is simply visible. Same content
 * either way; this is a no-JS fallback, not cloaking.
 *
 * Serving these files requires the matching rewrites in vercel.json, ahead of the SPA catch-all.
 */

const FALLBACK_ID = 'legal-fallback'

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderBullet(bullet: LegalBullet): string {
  if (typeof bullet === 'string') return escapeHtml(bullet)
  return bullet
    .map((run) =>
      typeof run === 'string'
        ? escapeHtml(run)
        : `<a href="${escapeHtml(run.to)}">${escapeHtml(run.text)}</a>`,
    )
    .join('')
}

/** The document itself, as plain semantic HTML. Deliberately unstyled beyond a readable column —
 * this is a fallback for agents that don't run JS, not a second design system to maintain. */
function renderFallback(doc: LegalDoc, siteUrl: string): string {
  const blocks = doc.blocks
    .map((block) => {
      const paragraphs = (block.paragraphs ?? [])
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join('\n      ')
      const bullets = block.bullets?.length
        ? `<ul>\n        ${block.bullets
            .map((b) => `<li>${renderBullet(b)}</li>`)
            .join('\n        ')}\n      </ul>`
        : ''
      return `<h2>${escapeHtml(block.heading)}</h2>\n      ${paragraphs}\n      ${bullets}`
    })
    .join('\n\n      ')

  return `<div id="${FALLBACK_ID}">
      <h1>${escapeHtml(doc.title)}</h1>
      <p><em>Last updated: ${escapeHtml(doc.lastUpdated)}</em></p>
      <p>${escapeHtml(doc.intro)}</p>

      ${blocks}

      <h2>Contact Us</h2>
      <p>If you have questions about this page, contact us at:</p>
      <address>
        ${escapeHtml(BUSINESS.legalName)}<br />
        ${escapeHtml(BUSINESS.address)}<br />
        <a href="${escapeHtml(BUSINESS.phoneHref)}">${escapeHtml(BUSINESS.phone)}</a><br />
        <a href="mailto:${escapeHtml(BUSINESS.email)}">${escapeHtml(BUSINESS.email)}</a>
      </address>
      <p><a href="${escapeHtml(siteUrl)}">Return to ${escapeHtml(BUSINESS.legalName)}</a></p>
    </div>`
}

/**
 * Per-page head tags.
 *
 * index.html intentionally ships no static <title>/description (react-helmet-async inserts its own
 * rather than adopting an existing tag, which previously produced duplicates). Adding them here is
 * safe precisely because these values are per-route and identical to what helmet then sets — the
 * first tag in DOM order, which crawlers read, is already the correct one.
 *
 * og:* tags are left at index.html's homepage values, unchanged: that is the site's existing
 * behaviour for every non-blog route, and link-preview accuracy is not what this plugin is for.
 */
function renderHead(doc: LegalDoc, siteUrl: string): string {
  return `
    <title>${escapeHtml(doc.seoTitle)}</title>
    <meta name="description" content="${escapeHtml(doc.seoDescription)}" />
    <link rel="canonical" href="${escapeHtml(siteUrl + doc.path)}" />
    <script>document.documentElement.classList.add('has-js')</script>
    <style>
      .has-js #${FALLBACK_ID} { display: none; }
      #${FALLBACK_ID} {
        max-width: 46rem;
        margin: 0 auto;
        padding: 2rem 1.5rem 4rem;
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.6;
        color: #1a1a1a;
      }
      #${FALLBACK_ID} h1 { font-size: 2rem; }
      #${FALLBACK_ID} h2 { font-size: 1.25rem; margin-top: 2rem; }
      #${FALLBACK_ID} address { font-style: normal; }
    </style>
  `
}

export default function prerenderLegal(siteUrl: string): Plugin {
  return {
    name: 'prerender-legal',
    apply: 'build',
    // closeBundle, not writeBundle: dist/index.html must already be on disk, since every generated
    // file is derived from it and inherits its hashed asset tags.
    async closeBundle() {
      const outDir = path.resolve(process.cwd(), 'dist')
      const shell = await readFile(path.join(outDir, 'index.html'), 'utf-8')

      for (const doc of LEGAL_DOCS) {
        if (!shell.includes('</head>') || !shell.includes('<div id="root">')) {
          throw new Error(
            'prerender-legal: could not find the expected </head> / #root anchors in dist/index.html.',
          )
        }

        const html = shell
          .replace('</head>', `${renderHead(doc, siteUrl)}</head>`)
          // After #root, so the SPA's own markup is what a browser paints first.
          .replace('<div id="root"></div>', `<div id="root"></div>\n    ${renderFallback(doc, siteUrl)}`)

        const file = `${doc.path.replace(/^\//, '')}.html`
        await writeFile(path.join(outDir, file), html, 'utf-8')
        this.info?.(`prerendered ${file}`)
      }
    },
  }
}
