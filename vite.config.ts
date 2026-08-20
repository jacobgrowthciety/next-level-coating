import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import prerenderLegal from './scripts/prerender-legal'

/** Canonical production domain — mirrors SITE_URL in src/components/Seo.tsx. Duplicated rather
 * than imported because that module pulls in react-helmet-async, which has no business being
 * bundled into the Vite config. */
const SITE_URL = 'https://www.nextlevelcoatingsaz.com'

// https://vite.dev/config/
export default defineConfig({
  // prerenderLegal writes a static HTML copy of each legal page into dist so the policy text is in
  // the served document without JS — required for A2P 10DLC review. Build-only; see the plugin.
  plugins: [react(), tailwindcss(), prerenderLegal(SITE_URL)],
  resolve: {
    /**
     * The embedded Studio (/admin) pulls its config and schemas from `studio/`, which is a
     * separate npm project with its own node_modules. Module resolution starts at the importing
     * file, so `import {defineType} from 'sanity'` inside studio/schemas/* would resolve to
     * studio/node_modules/sanity while src/pages/Admin.tsx resolves to the root copy — bundling
     * two Sanity runtimes, and with them two React contexts, which is how a Studio ends up
     * throwing hook/context errors that make no sense from the source.
     *
     * Deduping pins each of these to the root install regardless of which tree the importer sits
     * in. React is listed for the same reason: Studio renders inside the site's React tree and
     * must be the same instance.
     */
    dedupe: ['sanity', 'styled-components', 'react', 'react-dom'],
  },
})
