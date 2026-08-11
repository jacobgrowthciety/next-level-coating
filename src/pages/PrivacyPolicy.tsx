import LegalDocument from '../components/LegalDocument'
import CallNowButton from '../components/CallNowButton'
import Seo from '../components/Seo'
import { PRIVACY_POLICY as DOC } from '../content/legal'

/** Privacy Policy. All copy lives in content/legal.ts — the build-time prerenderer reads the same
 * module to emit a static HTML version of this page (see vite.config.ts), so editing the text
 * there keeps the interactive and prerendered versions in sync. */
export default function PrivacyPolicy() {
  return (
    <main>
      <Seo title={DOC.seoTitle} description={DOC.seoDescription} path={DOC.path} />
      <LegalDocument
        title={DOC.title}
        lastUpdated={DOC.lastUpdated}
        intro={DOC.intro}
        blocks={DOC.blocks}
      />
      <CallNowButton />
    </main>
  )
}
