import { createStudioConfig } from './sanity.config.shared'

/**
 * Studio configuration for the copy embedded in the marketing site at /admin.
 *
 * Same schemas and tools as the standalone build — see studio/sanity.config.shared.ts — with a
 * basePath, because here Studio is mounted under a route on a site it does not own.
 *
 * `basePath` must match the route in App.tsx. Studio does its own routing beneath this prefix, so
 * the React Router entry has to be a splat (`/admin/*`) or Studio's internal navigation 404s.
 */
export default createStudioConfig({
  projectId: (import.meta.env.VITE_SANITY_PROJECT_ID || '8xmrim7j').trim(),
  basePath: '/admin',
})
