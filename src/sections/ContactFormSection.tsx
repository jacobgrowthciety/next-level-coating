import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/variants'
import LeadForm from '../components/LeadForm'

// Same dark cluster as ContactIntro above (reference/BRIEF.md §2A "within consecutive dark
// sections... vary the exact shade slightly") — reads as one continuous dark block, no divider,
// same pattern as GarageFlooringIntro → GarageFlooringGallery.
const SECTION_BG = '#0A0A0A'

const CONTACT_VIDEO = '/videos/contact-video.mp4'

/** Video (left) + lead form (right) — stacks to a single column on mobile, video on top. */
export default function ContactFormSection() {
  return (
    <section className="relative z-10" style={{ backgroundColor: SECTION_BG }}>
      <div className="px-6 pb-24 pt-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-16"
        >
          {/* Portrait source video (9:16), narrated with on-screen captions — object-contain
              (not cover) so the full frame including bottom captions is always visible, never
              cropped; the container's own black background letterboxes seamlessly. Native
              `controls` give play/pause + volume since this has real narration audio, not an
              ambient loop, so it isn't autoplayed muted like the Hero video. */}
          <motion.div
            variants={fadeUp}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 bg-black lg:aspect-auto lg:min-h-[560px]"
          >
            <video
              className="absolute inset-0 h-full w-full object-contain"
              src={CONTACT_VIDEO}
              controls
              loop
              playsInline
              preload="metadata"
            />
          </motion.div>

          <motion.div variants={fadeUp} className="w-full">
            <LeadForm />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
