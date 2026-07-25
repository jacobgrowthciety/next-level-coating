# Next Level Coatings — Sanity Studio

Standalone Sanity Studio for the blog. **Not** part of the marketing site build — its own
`package.json` keeps its heavy dependency tree out of the Vite bundle. The site (in the repo root)
only *reads* from Sanity via `@sanity/client`; this folder is where content is *authored*.

## One-time setup

1. Set the project ID in `sanity.config.ts` and `sanity.cli.ts` (replace `REPLACE_WITH_PROJECT_ID`),
   or copy `.env.example` → `.env` and set `SANITY_STUDIO_PROJECT_ID`. Use the **same** project ID as
   the site's `VITE_SANITY_PROJECT_ID`.
2. Install deps (in this folder):

   ```bash
   cd studio
   npm install
   ```

## Run locally

```bash
npm run dev        # http://localhost:3333
```

## Deploy the hosted Studio

```bash
npm run deploy     # publishes to https://nextlevelcoatings.sanity.studio
```

(`studioHost` in `sanity.cli.ts` sets that subdomain — change it if the name is taken.)

## Required API settings (in sanity.io → project → API)

- **Dataset `production` must be Public** so the site's unauthenticated browser reads don't 401.
- **CORS origins** — add all site origins that fetch from Sanity:
  - `http://localhost:5173` (local dev)
  - the production Vercel URL (e.g. `https://next-level-coatings.vercel.app`)
  - Vercel preview deployment URLs
  - the eventual custom domain once live (`https://www.nextlevelcoatingsaz.com`)

  (Credentials **not** required — reads are public.)
