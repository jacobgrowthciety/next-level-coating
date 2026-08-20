import { createStudioConfig } from '../src/admin/sanity.config.shared'

/**
 * Standalone Studio entry — the build behind nextlevelcoatings.sanity.studio (`npx sanity deploy`).
 *
 * Studio is now ALSO embedded in the marketing site at /admin (src/admin/), which is the copy
 * editors are pointed at. This build is kept so the subdomain keeps working during the switchover;
 * both share createStudioConfig, so they cannot drift.
 *
 * The config and schemas live under src/admin/ rather than here, and this file imports `sanity`
 * only indirectly through them. That is deliberate: `studio/` has its own node_modules, so any
 * `sanity` import in a file under this directory resolves to a *different* copy than the one the
 * site's build uses, and the two copies' types and React contexts do not interoperate. Keeping
 * every shared module on the src/ side means one install serves both builds.
 *
 * Env override supported so CI can inject the project id; the literal is the real one.
 */
export default createStudioConfig({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '8xmrim7j',
})
