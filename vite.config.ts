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
})
