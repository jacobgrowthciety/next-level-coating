import { Helmet } from 'react-helmet-async'
import { SITE_URL, SITE_NAME } from './Seo'

/**
 * Site-wide LocalBusiness JSON-LD (reference/BRIEF.md §7 — NAP data used exactly as documented
 * there). Rendered once in App.tsx outside <Routes> so it's present on every page regardless of
 * route, same as the header/footer.
 */
export default function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: SITE_NAME,
    image: `${SITE_URL}/hero-poster.jpg`,
    logo: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: '+16232241097',
    email: 'nextlevelcoatingsaz@gmail.com',
    foundingDate: '2020',
    founder: {
      '@type': 'Person',
      name: 'Chase Gray',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '25689 N 140th Ln',
      addressLocality: 'Surprise',
      addressRegion: 'AZ',
      postalCode: '85387',
      addressCountry: 'US',
    },
    areaServed: [
      'Peoria, AZ',
      'Surprise, AZ',
      'Sun City, AZ',
      'Glendale, AZ',
      'Phoenix, AZ',
      'Scottsdale, AZ',
      'Paradise Valley, AZ',
      'Cave Creek, AZ',
      'Goodyear, AZ',
    ],
    sameAs: ['https://instagram.com/nextlevelcoatings_'],
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
