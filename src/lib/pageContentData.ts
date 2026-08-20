/**
 * The copy the 12 fixed marketing pages shipped with — the fallback the site renders whenever
 * Sanity has nothing better, and the seed data those Sanity documents were created from.
 *
 * This module deliberately imports nothing. scripts/seed-page-content.ts runs it directly under
 * Node (which strips the types but does not resolve extensionless or browser-only imports), so
 * adding an import here — React, the Sanity client, anything — breaks seeding. The behaviour
 * that consumes this data lives in ./pageContent.ts instead.
 *
 * Copy is verbatim from each page's components, and must stay that way: this is the regression
 * baseline. If a value here drifts from what the component renders with Sanity unavailable, the
 * fallback has quietly become a second, competing version of the page.
 */

/** Routes that accept editable content. Mirrors PAGE_ROUTE_OPTIONS in src/admin/schemas/pageContent.ts. */
export const PAGE_ROUTES = [
  '/',
  '/about',
  '/commercial',
  '/concrete-coatings',
  '/garage-flooring',
  '/patios',
  '/pool-decks',
  '/residential',
  '/polished-concrete',
  '/solid-color-chart',
  '/flake-color-chart',
  '/contact',
] as const

export type PageRoute = (typeof PAGE_ROUTES)[number]

/**
 * One prose slot in a page's main body.
 *
 * These are *slots*, not free-form blocks: each page's Details component renders a fixed number
 * of them in fixed positions, interleaved with structural pieces that stay in code (the category
 * chips, benefit cards, the Residential process list). Slot 0 is the lead copy above the first
 * structural piece; slot 1's heading introduces that piece and its body follows it; and so on.
 *
 * That is why the array length here is authoritative and the Studio field is locked against
 * adding, removing and reordering — a page has as many slots as its layout draws, and an extra
 * section would have nowhere to render.
 */
export interface PageBodySectionFallback {
  /** Rendered as the section's H2. Omitted where the layout has no heading in that position. */
  heading?: string
  body: string[]
}

/** Shipped copy for one route. Prose is plain paragraphs; Portable Text conversion is elsewhere. */
export interface PageContentFallback {
  metaTitle: string
  metaDescription: string
  h1: string
  /** The intro paragraph(s) directly under the H1, in the page's header band. */
  body: string[]
  /** Main body prose slots. Empty for pages whose layout has no prose section. */
  sections: PageBodySectionFallback[]
  /** Absolute URL. Omitted where the page uses the site-wide default share image. */
  ogImage?: string
}

const SITE = 'https://www.nextlevelcoatingsaz.com'

export const PAGE_CONTENT_FALLBACKS: Record<PageRoute, PageContentFallback> = {
  '/': {
    metaTitle: 'Polyaspartic Floor Coating in Arizona | Next Level Coatings',
    metaDescription:
      "Arizona's top-rated concrete coating specialists — garage floors, patios, driveways & pool decks. 1-day installs, lifetime warranty. Free quotes.",
    h1: "Arizona's Top Concrete Coatings Specialists",
    body: [
      'Specializing in garage floors, commercial, patios, sidewalks, driveways, pool decks, and polished concrete.',
    ],
    // The homepage is a sequence of bespoke sections (featured work, services grid, process,
    // reviews), none of which is a prose slot. Its editable copy is the headline and subhead.
    sections: [],
  },
  '/about': {
    metaTitle: 'About Us | Next Level Coatings',
    metaDescription:
      'Meet Chase Gray and the family-owned team behind Next Level Coatings, bringing top-tier concrete coatings to homes and businesses across Arizona since 2020.',
    h1: 'About Us',
    body: [
      'A family owned business providing top-tier concrete coating services to all of Arizona.',
    ],
    // The founder story pairs each paragraph with its own photo, caption and alt text, so it is
    // not a prose slot — making it editable needs a schema of its own (paragraph + image), not
    // this one. Left in code until that is built.
    sections: [],
  },
  '/commercial': {
    metaTitle: 'Commercial Floor Coatings | Next Level Coatings',
    metaDescription:
      'High-performance commercial polyaspartic coatings for warehouses, showrooms, and commercial kitchens. Slip-resistant, durable, and installed fast. Free quotes.',
    h1: 'Commercial Coatings',
    body: [
      "Durable, slip-resistant polyaspartic coatings built for warehouses, showrooms, and commercial kitchens that can't afford downtime.",
    ],
    ogImage: `${SITE}/services/commercial/commercial-01.webp`,
    sections: [
      {
        body: [
          "Next Level Coating takes pride in delivering commercial floor coatings that perfectly balance durability and aesthetics. Our high-performance commercial polyaspartic coating meets the needs of any business space, whether it's a bustling warehouse, a sleek showroom, or a busy commercial kitchen. Designed to withstand heavy foot traffic, machinery, and daily operations, these coatings provide a safe, slip-resistant surface that lasts for years.",
          'From warehouses and showrooms to commercial kitchens and golf courses, concrete coatings are the best way to enhance and protect any commercial area. Using premium products alongside state-of-the-art equipment, and supported by certified installers, we get you the best results that last a lifetime. There is no job too big for us.',
        ],
      },
      {
        heading: 'Built For Business',
        body: [
          'Beyond their strength, our commercial polyaspartic coatings are customizable and come in a range of colors and finishes to enhance the style of your space. Our meticulous application ensures a flawless finish, transforming ordinary concrete into a polished, professional foundation. With fast installation that minimizes downtime, we help you get back to business quickly while upgrading your flooring to something extraordinary.',
        ],
      },
    ],
  },
  '/concrete-coatings': {
    metaTitle: 'Concrete Coatings in Phoenix | Next Level Coatings',
    metaDescription:
      'Family-owned epoxy and polyaspartic concrete coatings for garages, warehouses, offices, and patios across the Greater Phoenix area. Fast cure times. Free quotes.',
    h1: 'Concrete Coatings',
    body: [
      'Premium epoxy and polyaspartic resurfacing for garages, warehouses, offices, and patios across the Greater Phoenix area.',
    ],
    ogImage: `${SITE}/services/concrete-coatings/concrete-coatings-01.webp`,
    sections: [
      {
        body: [
          "At Next Level Coatings, we provide durable, high-performance flooring solutions designed to handle Arizona's heat, dust, and daily wear. As a family-owned business serving the Greater Phoenix area, we specialize in premium resurfacing services, including concrete floor coatings, epoxy systems, and polyaspartic concrete coatings for residential and commercial properties.",
        ],
      },
      {
        heading: 'Coatings For Every Space',
        body: [
          'Our advanced epoxy and polyaspartic systems create a seamless, professional finish while resisting moisture, stains, chemicals, UV exposure, and heavy use, perfect for homes and businesses alike.',
          "What makes our process different is the attention we give to every project. We don't believe in shortcuts or cookie-cutter solutions. Instead, we take the time to assess your space, discuss your goals, and recommend the best coating system for your needs.",
          'Our polyaspartic concrete coatings are especially popular for their fast cure times, durability, and modern appearance. We complete many projects in as little as one day, minimizing downtime without sacrificing quality. As a local, family-run company, Next Level Coatings is built on trust, quality craftsmanship, and clear communication.',
        ],
      },
    ],
  },
  '/garage-flooring': {
    metaTitle: 'Garage Floor Coating in Arizona | Next Level Coatings',
    metaDescription:
      '1-day polyaspartic garage floor coatings, 4X stronger than epoxy, with a lifetime warranty. Serving Phoenix, Surprise, Peoria & the Valley. Free quotes.',
    h1: 'Garage Flooring',
    body: [
      'Solid color or full broadcast flake, prepped and finished by a crew that treats garage floors as our specialty — not a side job.',
    ],
    ogImage: `${SITE}/services/garage-flooring/Garage-Flooring-5.webp`,
    sections: [
      {
        body: [
          'Without a proper coating, your concrete floor may quickly develop cracks, stains, and other forms of damage. With our polyaspartic garage floor coating you have the option of a solid single-color floor, or a full broadcast flake floor. Whatever your goals are, our expertise is sure to offer the perfect solution.',
          "Here at Next Level, garage floors are our specialty! When you hire one of our professionals, they'll handle the entire process from start to finish.",
        ],
      },
      {
        heading: 'Two Ways To Level Up',
        body: [
          'Upgrading your garage floor with a durable, aesthetically pleasing coating is a worthwhile investment, but taking a DIY approach often leads to unnecessary stress and subpar results. At Next Level Coatings, we bring precision, efficiency, and peace of mind to the table.',
        ],
      },
    ],
  },
  '/patios': {
    metaTitle: 'Concrete Patio Coatings | Next Level Coatings',
    metaDescription:
      '100% UV-stable polyaspartic patio, sidewalk, and driveway coatings, 4X stronger than epoxy. Cooler underfoot, built for the Arizona sun. Free quotes.',
    h1: 'Patios, Sidewalks & Driveways',
    body: [
      "100% UV-stable polyaspartic that's 4X stronger than epoxy, built to handle the Arizona sun and drop the surface temperature underfoot.",
    ],
    ogImage: `${SITE}/services/patios/patios-01.webp`,
    sections: [
      {
        body: [
          'Our patios, sidewalks, and driveways are an affordable solution to bring your concrete to life. Our polyaspartic system is 100% UV stable and 4X stronger than epoxy, built to last a lifetime outside in the Arizona sun. We leave our patios with more chip texture than our garage floors to create more traction, but can also add a non-slip additive for even more grip. Not only is it a strength and aesthetic upgrade, but this material will drop the surface temperature from the heat as well.',
          'Applying concrete patio coatings requires precision. Achieving an even and smooth finish involves techniques that take time and practice to perfect, such as rolling, spraying, and troweling. Our professionals use specialized tools to evenly spread the coating without streaks, bubbles, or patches.',
        ],
      },
      {
        heading: 'Made For The Arizona Sun',
        body: [
          'Concrete patio coatings serve as a protective barrier for your patio surface. Better than epoxy, our coatings are made from polyaspartic material to better shield the concrete from weather damage, wear, and tear. We offer finishes ranging from high gloss to natural textures.',
          'Your concrete patio should be a space to gather, relax, and create lasting memories. A professional-grade polyaspartic patio coating adds years to its lifespan, ensures safety, and enhances its visual appeal, turning your patio into an investment rather than an expense.',
        ],
      },
    ],
  },
  '/pool-decks': {
    metaTitle: 'Polyaspartic Pool Deck Coating | Next Level Coatings',
    metaDescription:
      'Non-slip, 100% UV-stable polyaspartic pool deck coatings that stay cool underfoot. Double diamond ground and full-flake finished. Free quotes.',
    h1: 'Pool Decks',
    body: [
      'Non-slip, UV-stable polyaspartic that keeps pool decks cool underfoot and looking sharp for years.',
    ],
    ogImage: `${SITE}/services/pool-decks/pool-decks-01.webp`,
    sections: [
      {
        body: [
          'Next Level Coating specializes in revitalizing pool decks with our top-tier polyaspartic pool deck coating. Our process turns aging, cracked surfaces into smooth, modern spaces that are stunning and durable. We completely remove and double diamond grind your old pool decking and replace it with our non-slip polyaspartic flake system.',
        ],
      },
      {
        heading: 'Built For Poolside',
        body: [
          "Our team handles every detail with precision, from double diamond grinding to full-flake coverage and sealing. These enhancements blend form and function, creating a pool deck that doesn't just look amazing but stands strong against wear and tear for years. Transform your pool area into a sleek, safe retreat with the lasting performance of our polyaspartic pool deck coating today.",
        ],
      },
    ],
  },
  '/residential': {
    metaTitle: 'Residential Polyaspartic Floor Coating | Next Level Coatings',
    metaDescription:
      '4X stronger than epoxy with a lifetime warranty. Our six-step polyaspartic process upgrades garages, patios, and pool decks. Licensed, bonded & insured. Free quotes.',
    h1: 'Residential',
    body: [
      '4X stronger than epoxy with a lifetime warranty, our six-step polyaspartic process upgrades garages, patios, and pool decks alike.',
    ],
    ogImage: `${SITE}/services/residential/residential-01.webp`,
    // The only page with three slots: its layout interleaves two structural pieces (the benefit
    // cards and the six-step process list) rather than one.
    sections: [
      {
        body: [
          'When it comes to upgrading your home, every detail matters. Your floors, especially in high-traffic areas like garages, patios, and pool decks, deserve as much attention as the rest of your living space. Our residential polyaspartic floor coating services give homeowners in Arizona a practical and stunning solution for concrete surfaces.',
        ],
      },
      {
        heading: 'Why Choose Residential Polyaspartic',
        body: [
          "At Next Level Coating, we're proud of the meticulous process we've developed to ensure every project exceeds expectations. Our six-step method guarantees the perfect balance of precision and efficiency, offering same-day completion without cutting corners.",
        ],
      },
      {
        body: [
          "We're licensed, bonded, and insured (ROC #352138), and we back every residential polyaspartic floor coating with a lifetime warranty. Our family-owned business treats your home like our own, ensuring attention to detail, respect for your space, and high-quality results.",
          "Is your home in need of a refresh? Whether it's your garage, patio, pool deck, or walkway, our residential polyaspartic floor coating can give your space the durability, functionality, and beauty it deserves.",
        ],
      },
    ],
  },
  '/polished-concrete': {
    metaTitle: 'Polished Concrete Flooring | Next Level Coatings',
    metaDescription:
      'Diamond-ground and honed polished concrete flooring, a sleek, low-maintenance finish with no topical coating to maintain. Free quotes.',
    h1: 'Polished Concrete',
    body: [
      'A smooth, high-shine finish achieved through precision diamond grinding, for a sleek, low-maintenance surface.',
    ],
    ogImage: `${SITE}/services/polished-concrete/polished-concrete-01.webp`,
    sections: [
      {
        body: [
          'Polished concrete is your existing slab, ground down in progressive steps and honed to a smooth, reflective finish. There is no epoxy, no polyaspartic, no topical layer applied on top. The shine comes from the concrete itself, which is what gives it a clean, modern look that holds up without the upkeep a coated floor needs.',
          "It's a strong choice for a garage, showroom, or any space where you want a sleek surface without the maintenance schedule of a coating. Since the finish is the concrete itself, there is nothing to chip, peel, or recoat down the road, just a surface that gets swept and mopped like any other floor.",
        ],
      },
      {
        heading: 'Why Choose Polished Concrete',
        body: [
          "Our process starts the same way every polyaspartic project does: heavy-duty diamond grinding to prep the slab and repair any cracks or imperfections along the way. From there, we work through progressively finer diamond grits, honing the surface step by step until it reaches the level of shine you're after, from a soft satin look to a high-gloss finish.",
          "The result is a durable, low-maintenance floor that's ready to use as soon as we finish, with none of the cure time a coated system needs.",
        ],
      },
    ],
  },
  '/solid-color-chart': {
    metaTitle: 'Solid Color Chart | Next Level Coatings',
    metaDescription:
      "Browse our solid polyaspartic garage floor color options — 16 single-color base coat shades, from concrete grays to safety colors. Get a free quote from Arizona's top concrete coating specialists.",
    h1: 'Solid Color Chart',
    body: [
      'Prefer a clean, single-color floor over a full flake broadcast? Choose from our solid polyaspartic base coat colors below.',
    ],
    // A swatch grid, not prose — nothing between the header and the CTA to edit.
    sections: [],
  },
  '/flake-color-chart': {
    metaTitle: 'Flake Color Chart | Next Level Coatings',
    metaDescription:
      "Browse 28 flake color options for your polyaspartic garage floor coating. Tap any color to see it up close, then get a free quote from Arizona's top concrete coating specialists.",
    h1: 'Flake Color Chart',
    body: [
      'Choose from our wide variety of color options for your floor. Tap any color to see it up close, or hit Learn More for real project photos.',
    ],
    sections: [],
  },
  '/contact': {
    metaTitle: 'Contact | Next Level Coatings',
    metaDescription:
      "Get a free quote from Arizona's top concrete coating specialists. Call (623) 224-1097 or send us your project details — serving Phoenix, Surprise, Peoria & the Valley.",
    h1: 'Contact Us',
    // Intentionally empty: this page's header shows the phone number and email address instead
    // of a paragraph. Seeding invented copy here would change the live page, not preserve it.
    body: [],
    sections: [],
  },
}

/**
 * Stable Sanity document id for a route's content, e.g. `/pool-decks` → `pageContent-pool-decks`.
 *
 * Derived rather than random so re-running the seed updates the same documents instead of
 * creating a second set that the schema's uniqueness check would then reject.
 */
export function pageContentDocId(route: PageRoute): string {
  return `pageContent-${route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')}`
}
