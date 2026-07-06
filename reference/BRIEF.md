# Next Level Coatings — Site Rebuild Brief (BRIEF.md)

**Project type:** Full rebuild with elevated design, motion, and animation. Same brand identity (logo, colors, voice) as the current live site — executed at a premium, high-end level using real photography/video plus targeted AI-generated assets where needed.

---

## 1. POSITIONING

Same brand, executed like a top-tier agency built it. The teal/black/bold-script identity stays exactly as-is — the goal is to elevate *execution quality*, not change *what the brand is*. Visual inspiration: premium contractor/remodeler sites — dark, moody, image-forward, minimal text, portfolio-driven, motion used to build trust and confidence rather than decoration.

---

## 2. BRAND TOKENS (exact values, extracted directly from brand assets — do not deviate)

```
colors:
  brand-teal: #41CAD2
  brand-black: #000000
  brand-gray: #808080
  (derive light/dark tints of brand-teal for hover states; 
  do not introduce any other primary color)

neutrals: white, black, and charcoal/gray shades only
```

**Typography:** Two fonts used on the original site —
1. A bold condensed display font (used for "NEXT LEVEL" in the logo and major headers)
2. A brush/marker-style script font (used for "COATINGS" and section headlines like "THE NEXT LEVEL PROCESS," "WHY TRUST US," "ABOUT US")

Original font files are not available — select the closest free Google Fonts match for each and confirm with a side-by-side comparison before locking in.

---

## 2A. SECTION COLOR RHYTHM (alternate light/dark, per the original site)

The build has drifted toward every section being black/dark, losing the visual separation the original site had. The original site alternated: white/light hero → black process section → white "Why Trust Us" → black About → white educational/SEO section → black footer. Reintroduce this rhythm — do NOT introduce any new colors, stay strictly within teal/black/white/gray:

- Alternate section backgrounds between black/near-black and white/off-white as sections stack down the page, following the original site's pattern where reasonable (Hero stays dark per its video; sections after can alternate from there)
- Within consecutive dark sections (where alternation isn't practical), vary the exact shade slightly (e.g. pure black vs. a near-black charcoal like #0A0A0A vs. #121212) so adjacent dark sections aren't visually identical/flat
- Light sections use white or off-white backgrounds with black/dark text (inverse of dark sections' white text on black)
- The rough-edge-mask divider (section 4A) should be used at every section transition regardless of light/dark combination — it needs to work both ways (dark section transitioning to light, and light to dark), so the mask/stroke treatment may need a light-section variant (e.g. a white or light-gray shape instead of black, with the teal highlight stroke still tracing the edge either way)
- Teal can also be used sparingly as a full section background for a high-impact moment (e.g. a stat callout or final CTA band) — use deliberately, not as a default

---

## 3. TECH STACK

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Deployed to Vercel, repo on GitHub

---

## 4. MOTION LANGUAGE

- Scroll-triggered staged reveals (elements fade/slide in with slight delay between each, not all at once)
- Parallax on hero and section backgrounds
- Animated number/stat counters (e.g. "4X stronger," years in business)
- Smooth hover/cursor interactions on buttons, cards, nav
- The 6-step process section built as an interactive/animated sequence, not static cards
- Subtle looping video backgrounds where real footage exists

---

## 4A. SECTION TRANSITIONS (reusable pattern, site-wide)

Sections transition using a "pinned-reveal" technique: the section above uses `position: sticky; top: 0` and stays pinned while the next section rises over it in normal document flow (higher z-index). The boundary is marked with `rough-edge-mask.png` (a brush-stroke/torn-paper shape) applied as a CSS mask-image on the top edge of the rising section, recreating the original site's jagged divider style. Since black-on-black (divider against dark sections) has low contrast, add a thin 2-3px brand-teal (#41CAD2) highlight stroke tracing the jagged edge so it reads clearly regardless of what's behind it. This transition pattern should be reused for other major section boundaries on the page, not just Hero → Why Trust Us.

---

## 5A. PROCESS SECTION — SIGNATURE INTERACTION ("The Next Level Process," 6 steps)

This section gets the most motion attention on the page (per section 4).

**Desktop:** Pinned step-cycling layout. The section container is tall (6 steps × ~80-100vh of scroll distance), with a sticky inner layout (`position: sticky; top: 0; height: 100vh`) that stays fixed while the user scrolls through that distance. Layout is split:
- **Left: persistent step rail** — all 6 steps listed (numbers 01-06 + names: GRIND, REPAIR, COAT, FLAKE, SCRAPE, SEAL). The currently active step is highlighted (brand-teal, bolder/larger); inactive steps are dimmed. A connecting progress line/fill between rail items tracks overall progress through the section.
- **Right: swapping detail panel** — shows the full description text for the currently active step, crossfading (opacity + slight vertical slide) as the user scrolls from one step to the next.
- Map scroll progress (0-1 across the section's scroll distance) to an active step index (0-5) using 6 equal segments, driving both the rail highlight and detail panel content.
- After the 6th step, the section releases and the page continues scrolling normally into the next section.

**Mobile:** Do NOT use the pinned/cycling interaction — consistent with the Hero decision, scroll-pinning/scrubbing effects are unreliable and feel janky on touch devices, and most site traffic is mobile. Instead, use a normal stacked sequence: each of the 6 steps as its own full-width card in regular document flow, with the same scroll-triggered staggered fade/slide-in animation used elsewhere on mobile (e.g. trust badges).

A cinematic ~8 second video plays once on page load, then settles on its final frame as the persistent hero background behind the lead capture form.

**Sequence:** Camera starts on a wide establishing shot of the real branded truck/trailer parked in the driveway of a real Arizona home → pushes forward and pans toward the (single, real) garage door → door lifts open → camera moves through the doorway into the garage interior → settles on the owner (Chase) mid-motion throwing flake chips across a freshly coated floor.

**Assets:**
- Start frame: real photo, truck + trailer + home (not AI-generated)
- End frame: AI-generated still of Chase (using his real photo as a likeness reference) throwing small black/gray flake chips — flake size and color corrected to match real product (fine, subtle, NOT large or colorful)
- Video interpolation: generated with Seedance 2.0 (start_image/end_image roles), 1080p, 16:9, 8 seconds
- Final pass: upscaled with Higgsfield's video upscaler (Topaz, 1080p) for sharpness
- Single web-optimized encode is sufficient — no scroll-scrubbing, so no need for dense keyframes or a separate desktop/mobile version. Compress to a reasonable web file size (aim under ~8-10MB) for both devices.

**Behavior (all devices):** Video autoplays once on load (muted, playsInline) → settles on its last frame as the static hero background → lead capture form fades in on top once the video finishes → sticky mobile "Call Now" button always visible.

**Mobile layout (distinct from desktop):** On mobile, the hero does NOT use a full-bleed video-with-text-overlay layout for its FINAL settled state — this caused headline text to visually collide with the subject's face/body, and felt cramped with the full form competing for the same space. However, the video's initial PLAYBACK should still feel immersive, not immediately cramped into a small zone. Sequence:

1. **On load:** video plays at full viewport height (100dvh), full-bleed, no text/form visible yet — this is the cinematic "wow" moment, same energy as the original full-bleed concept.
2. **On video `ended`:** the video container smoothly animates (height/scale, ~0.8-1s easeInOut) from full viewport down to a compact top zone (~50-55vh). Simultaneously, the bottom panel (previously collapsed/hidden) expands and its content fades in — headline, subhead, form. This should read as one coordinated, deliberate transition, not two separate unrelated animations.
3. **Final settled state:** compact video zone on top (~50-55vh) showing Chase's upper body/head clearly (see cropping note below), solid dark panel below with headline/subhead/form.

**Cropping fix:** The compact top zone must NOT cut off Chase's head. Since the zone is short and the video is landscape, use `object-position` biased toward the top of the frame (e.g. `center 15-20%` rather than `center center`) so his head and shoulders stay fully visible — it's fine to lose visibility of his feet/the floor at the bottom of frame in the compact state, since attention has shifted to the text/form below by that point anyway.

- Header (logo + hamburger + call icon) stays fixed on top throughout, low-opacity/scrim background as already approved
- Sticky bottom "Call Now" bar remains throughout
- Since most site traffic will be mobile, this sequence deserves an extra review pass — check the exact frame/crop after implementation via screenshot before considering it final

**Optional nice-to-have (not required for launch):** A subtle parallax effect as the user scrolls past the hero — the settled video/image container shifts slightly slower than the rest of the page (a simple CSS transform tied to scroll position, no video `currentTime` manipulation involved). This is a cheap way to add polish without the complexity of true scroll-scrubbing — only add this after the core hero is working and if time allows.

**Explicitly decided against:** Scroll-scrubbed video (scroll position driving `video.currentTime`). Evaluated and rejected — added significant build complexity (device branching, dual video encodes, imperative scrub logic, performance risk) for a benefit that mostly only reaches desktop visitors, when most traffic to this site will be mobile. Not worth the fragility for a small business site where trust and speed matter more than technical showmanship in the hero specifically.

**Known pitfalls already solved (do not repeat):**
- Do not attempt to reframe/outpaint portrait video into landscape — this caused morphing artifacts. The video was built natively in 16:9 via start/end frame interpolation instead.
- The house has exactly ONE garage door, located where the truck is parked. Do not allow any generation step to invent a second garage door elsewhere on the house.
- Keep all real branding text/logos on the truck legible — avoid any AI step that risks warping small text.

---

## 5B. SERVICES GRID SECTION (elevated from a plain bullet list)

The original site has no dedicated Services section on the homepage — just a plain text list at the end of the educational/polyaspartic copy. This is a genuine enhancement opportunity: an interactive grid where one service is always shown in expanded "detail" form, and clicking any other service swaps it into that role.

**Interaction pattern:** A fixed "detail slot" (top-left, larger) always displays the currently-selected service: number, name, one-line description, and an "Explore" link to its real page. The remaining services sit as compact cards (number, name, arrow) in a grid around it. Clicking any compact card swaps its content into the detail slot (animated), while the previously-selected service returns to compact form in the grid. Defaults to Garage Flooring selected on load. Use Framer Motion shared-layout animation (layoutId) so the transition feels like one element smoothly changing content/size, not a jarring swap.

**Content (name + one-line description each):**
- Garage Flooring: "Our specialty — 1-day polyaspartic systems, prepped, chipped, and clear coated in a single day."
- Commercial: "Durable, slip-resistant coatings built for warehouses, showrooms, and commercial kitchens — installed fast to minimize downtime."
- Residential: "4X stronger than epoxy, UV-stable, and low maintenance — a lasting upgrade for garages, patios, and pool decks."
- Patios, Sidewalks & Driveways: "100% UV-stable and 4X stronger than epoxy, with extra chip texture for slip resistance outdoors."
- Pool Decks: "Non-slip and UV-stable — and it drastically drops surface temperature, so bare feet stay comfortable even in Arizona summers."
- Paver Sealing: "Commercial-grade acrylic urethane sealer, backed by a 4-year warranty even under the Arizona sun."
- Grind & Seal: ⚠️ placeholder only — real copy not yet sourced (see section 11), use a short generic line until replaced
- Polished Concrete: ⚠️ placeholder only — real copy not yet sourced (see section 11), use a short generic line until replaced
- Concrete Coatings: "Premium resurfacing for garages, warehouses, offices, and patios — tailored coating systems built to last."

Each card/detail links to its real page per section 8.

**Design:** Sharp/minimal corner radius, single teal accent stripe per card (not full border), numbered treatment matching the Process section's rail typography — established in the previous pass, keep as-is.

**Accessibility:** Cards must be real focusable links (not div+onClick), with visible keyboard focus states, not just hover.

**Placement:** After the About preview section. **Color:** dark background, continuing alternating rhythm (2A). **Transition:** rough-edge-mask divider (4A) for About → Services. **Animation:** staggered scroll-triggered reveal on initial load, consistent with Why Trust Us and Process.

Fields: First Name, Last Name, Email, Phone, Zip Code, Project Description (dropdown: 2 Car / 3 Car / RV Garage / Commercial / Other). Plus a persistent "Call Now" button linking to `tel:+16232241097`.

---

## 6A. NAVIGATION / HEADER (persistent across every page — was missing from initial Hero build, add now)

A sticky header, present on every page (not just Home), containing:
- Logo (top-left), using the exact brand logo file — links back to Home
- Nav links matching the sitemap in section 8: Home, Services (dropdown or grouped: Garage Flooring, Commercial, Residential, Patios/Sidewalks/Driveways, Pool Decks, Paver Sealing, Grind & Seal, Polished Concrete), Flake Color Chart, Solid Color Chart, About, Blog, Contact
- A visible "Call Now" button in the header, always present, linking to `tel:+16232241097`
- On the Home page specifically, the header sits on top of the hero video/image — style it so it's legible against both the dark video background and lighter settled frame (e.g. semi-transparent dark background bar, or a subtle backdrop blur)
- Sticky/fixed position so it remains accessible while scrolling
- Mobile: collapse into a hamburger menu, keep the logo and Call Now button visible even when collapsed

---

## 7. BUSINESS INFO (use exactly as-is, everywhere)

- **Name:** Next Level Coatings
- **Owner:** Chase Gray
- **Phone:** 623-224-1097 → `tel:+16232241097`
- **Email:** nextlevelcoatingsaz@gmail.com
- **ROC License #:** 352138
- **Founded:** 2020
- **Address:** 25689 N 140th Ln, Surprise, AZ 85387
- **Service area:** All of Arizona — Peoria, Surprise, Sun City, Glendale, Phoenix, Scottsdale, Paradise Valley, Cave Creek, Goodyear
- **Social:** Instagram @nextlevelcoatings_, Facebook
- **Warranty:** Confirm Lifetime vs. 15-year discrepancy with owner before publishing; use consistently once confirmed
- **Tagline:** "Arizona's Top Concrete Coatings Specialists"

---

## 8. FULL SITEMAP

| Page | Current URL |
|---|---|
| Home | https://www.nextlevelcoatingsaz.com/ |
| About | https://www.nextlevelcoatingsaz.com/team-3 |
| Blog | https://www.nextlevelcoatingsaz.com/blog |
| Contact | https://www.nextlevelcoatingsaz.com/contact |
| Garage Flooring | https://www.nextlevelcoatingsaz.com/garage-flooring |
| Commercial | https://www.nextlevelcoatingsaz.com/commercial |
| Residential | https://www.nextlevelcoatingsaz.com/residential |
| Patios, Sidewalks, & Driveways | https://www.nextlevelcoatingsaz.com/patios |
| Pool Decks | https://www.nextlevelcoatingsaz.com/pool-decks |
| Paver Sealing | https://www.nextlevelcoatingsaz.com/paver-sealing |
| Grind & Seal | https://www.nextlevelcoatingsaz.com/grind-seal |
| Polished Concrete | https://www.nextlevelcoatingsaz.com/copy-of-grind-seal (recommend renaming to /polished-concrete with 301 redirect) |
| Concrete Coatings (general/SEO) | https://www.nextlevelcoatingsaz.com/concrete-coatings |
| Flake Color Chart | https://www.nextlevelcoatingsaz.com/chip-color-chart |
| Solid Color Chart | https://www.nextlevelcoatingsaz.com/copy-of-paver-sealing (recommend renaming to /solid-color-chart with 301 redirect) |

**Build order:** Home first (flagship, sets the design system pattern), then replicate to remaining pages.

---

## 9. PAGE CONTENT (verbatim copy — trim only where noted, preserve every unique claim)

### HOME
**Hero headline:** "Arizona's Top Concrete Coatings Specialists"
**Subhead:** "Specializing in garage floors, commercial, patios, sidewalks, driveways, grind n' seal, pool decks, and pavers"

**"The Next Level Process" — Six Steps:**
1. **GRIND** — We begin our process by diamond grinding every concrete floor, whether new or old. Using a 1000 lb machine, we ensure sufficient weight for proper grinding, supplemented by a hand grinder for edging the entire floor. Each floor undergoes diamond testing to guarantee the appropriate bond diamond. These machines are connected to three dustless vacuums to maintain cleanliness.
2. **REPAIR** — The floor undergoes thorough vacuuming using our dustless vacuums, clearing out expansion joints and saw cuts. Following this, a dry mop loosens any remaining debris, leading to a meticulous blowing out, leaving a pristine, prepped foundation. The final step in preparation involves patching or repairing any imperfections in the concrete, such as cracks, chips, or holes, utilizing a flexible 2-part epoxy patch designed to withstand movement over time.
3. **COAT** — We apply a self-priming, pre-pigmented 100% UV stable fast-cure polyaspartic base coat, using a squeegee and roller. This base coat is meticulously measured and rolled out in all directions to ensure uniform coverage.
4. **FLAKE** — Next, the floor receives a hand-flaked treatment, ensuring 100% full broadcast chip coverage for comprehensive protection. Optionally, stem walls are meticulously treated beforehand, ensuring straight lines for an impeccable finish.
5. **SCRAPE** — After the fast-cure polyaspartic base coat has fully cured, we remove all excess flake and meticulously scrape the floor in all directions to ensure a smooth finish, leaving no area untouched. Edges, joints, and stem walls undergo hand sanding to eliminate any standing flakes, ensuring a flawless surface. The floor undergoes a final dustless vacuuming to remove any remaining debris and flake before receiving its polyaspartic clear coat.
6. **SEAL** — We then apply our 100% UV stable, slow-cure polyaspartic clear coat, meticulously measuring and applying it with a squeegee and roller in all directions to achieve a flawless spread. Optional non-slip additives can be incorporated at this stage if desired. This meticulous process results in our Next Level finish. While the exact thickness of our clear coat remains proprietary, its robust application ensures an unbeatable shine, facilitating effortless maintenance during cleaning and care of your floor.

**"Why Trust Us":**
- 4X's Stronger Than Epoxy
- Lifetime Warranty
- One Day Installation
- Family Owned and Operated
- Five Star Google Rated Company

**About preview:** "A family owned business providing top-tier concrete coating services to all of Arizona." → "Read Full Story" button

**Educational copy (trim candidate — condense to 2-3 sentences on homepage, full version can live on a dedicated page):**
"Polyaspartic floor coating is a type of resin used for protecting and enhancing concrete surfaces. Derived from polyurea, it's a highly advanced coating that cures quickly and offers exceptional durability. Unlike traditional materials like epoxy or polyurethane, polyaspartic coatings boast a unique chemical structure that allows them to deliver superior performance, no matter the application."

---

### ABOUT (`/team-3`)
"Founded in 2020, we are a family-owned and operated garage floor coating company committed to delivering exceptional results with every project. I am Chase Gray, the owner and operator, and alongside my dedicated team, we ensure that each installation is completed to the highest standards of quality and craftsmanship. As a detail-oriented professional, I have spent years in the field personally training our crew to meet my exacting standards. While our company is growing rapidly, we remain focused on maintaining the highest level of quality in everything we do. To ensure the best possible results, we utilize top-of-the-line equipment, advanced technology, and premium materials, all designed to provide our customers with the fastest turnaround time without compromising on quality. My wife, Lisa, and I manage the business while balancing the joys and challenges of raising our four children: Bryley, Paxton, Nixon, and Remi."

*(Do not trim — this is unique, personal, differentiating trust content.)*

---

### GARAGE FLOORING (`/garage-flooring`) — flagship service
"Without a proper coating, your concrete floor may quickly develop cracks, stains, and other forms of damage. With our polyaspartic garage floor coating you have the option of a solid single-color floor, or a full broadcast flake floor. Whatever your goals are, our expertise is sure to offer the perfect solution.

Here at Next Level, garage floors are our specialty! When you hire one of our professionals, they'll handle the entire process from start to finish. We offer 1-day polyaspartic systems — prepped, poured, chipped and clear coated in just one day. We also offer a double polyaspartic clear coat system to achieve a smoother, glossier finish.

Upgrading your garage floor with a durable, aesthetically pleasing coating is a worthwhile investment, but taking a DIY approach often leads to unnecessary stress and subpar results. At Next Level Coatings, we bring precision, efficiency, and peace of mind to the table."

*(Note: "1-day install" and "double clear coat" upsell are strong differentiators — consider pulling into a visual comparison element.)*

---

### RESIDENTIAL (`/residential`)
"When it comes to upgrading your home, every detail matters. Your floors, especially in high-traffic areas like garages, patios, and pool decks, deserve as much attention as the rest of your living space. Our residential polyaspartic floor coating services give homeowners in Arizona a practical and stunning solution for concrete surfaces.

**Why Choose Residential Polyaspartic Floor Coatings?**
- Built to last: 4X stronger than residential epoxy flooring
- UV stability: resists fading and discoloration even under Arizona's blazing sun
- Low maintenance: seamless, nonporous surfaces wipe clean easily
- Visual appeal: sleek modern finishes to vibrant chip designs
- Safety first: optional nonslip additives for pool decks or moisture-prone areas

Licensed, bonded, and insured (ROC #352138), we back every residential polyaspartic floor coating with a lifetime warranty."

*(Six-step process repeats homepage content here — condense to 2 sentences with a link back to the full process on Home, rather than repeating in full.)*

---

### COMMERCIAL (`/commercial`)
"Next Level Coating takes pride in delivering commercial floor coatings that perfectly balance durability and aesthetics. Our high-performance commercial polyaspartic coating will meet the needs of any business space, whether it's a bustling warehouse, a sleek showroom, or a busy commercial kitchen. Designed to withstand heavy foot traffic, machinery, and daily operations, these coatings provide a safe, slip-resistant surface that lasts for years.

From warehouses and showrooms to commercial kitchens and golf courses, concrete coatings are the best way to enhance and protect any commercial area. With fast installation that minimizes downtime, we help you get back to business quickly."

*(Strongest lines: "fast installation minimizes downtime" + "slip-resistant" — surface these prominently for B2B buyers.)*

---

### PATIOS, SIDEWALKS, & DRIVEWAYS (`/patios`)
"Concrete patio coatings serve as a protective barrier for your patio surface. Better than epoxy, our coatings are made from polyaspartic material to better shield the concrete from weather damage, wear, and tear. Our polyaspartic system is 100% UV stable and 4X's stronger than epoxy to last a lifetime outside in the AZ sun. We leave our patios with more chip texture than our garage floors for slip resistance."

*(The "more chip texture for slip resistance" detail is a good expertise signal — worth its own callout.)*

---

### POOL DECKS (`/pool-decks`)
"Next Level Coating specializes in revitalizing pool decks with our top-tier polyaspartic pool deck coating. We completely remove and double diamond grind your old pool decking and replace it with our non-slip polyaspartic flake system. Not only is our polyaspartic coating 100% UV stable, but it also drastically drops the temperature of your concrete surface — making poolside stay cool and comfortable even under Arizona's blazing sun."

*(The "drops the temperature" claim is the single best sales hook on the site for AZ homeowners — feature prominently, not buried.)*

---

### PAVER SEALING (`/paver-sealing`)
"Our advanced acrylic urethane formula delivers unmatched protection, ensuring your pavers resist wear, fading, and damage caused by the intense Arizona sun. Our meticulous process includes comprehensive cleaning with high-pressure washing and an expert application of sealant. We offer the strongest commercial grade paver sealer on the market — backed by a 4-year warranty even in the Arizona sun."

---

### GRIND & SEAL, POLISHED CONCRETE, SOLID COLOR CHART, BLOG
Content for these pages needs to be pulled directly from the live site (copy/paste from browser) — not fully indexed/available via search. Flag to owner: the "Polished Concrete" and "Solid Color Chart" pages currently live at Wix auto-generated duplicate slugs (`copy-of-grind-seal`, `copy-of-paver-sealing`), suggesting they may still be near-duplicate content of the pages they were cloned from — worth writing unique copy for both as a genuine SEO fix.

---

### CONCRETE COATINGS — general/SEO page (`/concrete-coatings`)
"At Next Level Coatings, we provide durable, high-performance flooring solutions designed to handle Arizona's heat, dust, and daily wear. We specialize in premium resurfacing services, including concrete floor coatings, epoxy systems, and polyaspartic concrete coatings for residential and commercial properties."

---

### FLAKE COLOR CHART (`/chip-color-chart`)
"Choose from our wide variety of color options for your floor. Click into any color to see example projects using that color." — interactive, image-driven page; preserve the click-through-to-examples interaction.

---

### CONTACT (`/contact`)
"NEXTLEVELCOATINGSAZ@GMAIL.COM · 623-224-1097 · Here at Next Level Coatings our name speaks for itself. We strive off of attention to detail. All floors are backed with a 15 year warranty. Servicing: Peoria, Surprise, Sun City, Glendale, Phoenix, Scottsdale, Paradise Valley, Cave Creek, Goodyear..." *(get full uncut service-area list from owner)*

---

## 10. ASSET MANIFEST (what's in /reference)

- `logo.png` — transparent background, exact brand logo
- Original homepage screenshots (desktop + mobile)
- Real truck/trailer/home photo (used as hero video start frame)
- Real photo of Chase (used as likeness reference for generated stills)
- Generated still: garage door open, single door, matching real home
- Generated still: Chase throwing flake (corrected fine black/gray flake)
- Final hero video: ~8 seconds, 1080p, 16:9, truck → garage opens → Chase throwing flake

---

## 11. WHAT'S STILL NEEDED FROM THE OWNER

- Full, uncut service-area list for Contact page
- Clarification: Lifetime vs. 15-year warranty (used inconsistently across current site)
- Real copy for Grind & Seal, Polished Concrete, Solid Color Chart, Blog pages
- Confirmation on whether `/our-process` (orphaned legacy URL, not in current nav) should redirect or be removed
