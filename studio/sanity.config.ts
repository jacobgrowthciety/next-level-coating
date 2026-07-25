import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

// Studio for the Next Level Coatings blog. Hosted separately (via `npx sanity deploy` →
// nextlevelcoatings.sanity.studio), NOT embedded in the marketing site, so its dependency tree
// never touches the site build.
//
// Replace projectId with the real Sanity project ID (same value the site uses as
// VITE_SANITY_PROJECT_ID). Env override supported so CI can inject it.
export default defineConfig({
  name: 'default',
  title: 'Next Level Coatings',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '8xmrim7j',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
