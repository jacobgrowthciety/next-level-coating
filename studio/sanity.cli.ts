import { defineCliConfig } from 'sanity/cli'

// Project ID and dataset for the CLI (dev/build/deploy). Keep in sync with sanity.config.ts.
// Replace projectId with the real Sanity project ID (same value as the site's
// VITE_SANITY_PROJECT_ID). `studioHost` sets the free *.sanity.studio subdomain used by
// `npx sanity deploy`.
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '8xmrim7j',
    dataset: 'production',
  },
  studioHost: 'nextlevelcoatings',
})
