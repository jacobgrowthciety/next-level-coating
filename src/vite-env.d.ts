/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Sanity project ID (from sanity.io project settings). Dataset is always `production`. */
  readonly VITE_SANITY_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
