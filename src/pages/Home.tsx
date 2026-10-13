import { useCallback, useEffect, useState } from 'react'
import { siteConfig } from '../content/site.config'
import { getBouquet } from '../content/bouquets'
import type { Bouquet } from '../content/types'
import { initParallax, initReveals, refreshScroll } from '../lib/motion'
import { scrollToId } from '../lib/scroll'
import { Envelope } from '../components/envelope/Envelope'
import { About } from '../components/sections/About'
import { Finder } from '../components/sections/Finder'
import { Gallery } from '../components/sections/Gallery'
import { Flowers } from '../components/sections/Flowers'
import { Pricing } from '../components/sections/Pricing'
import { HowToOrder } from '../components/sections/HowToOrder'
import { Delivery } from '../components/sections/Delivery'
import { Reviews } from '../components/sections/Reviews'
import { Contacts } from '../components/sections/Contacts'
import { Footer } from '../components/layout/Footer'
import { Marquee } from '../components/layout/Marquee'
import { BouquetModal } from '../components/sections/BouquetModal'
import { MobileOrderBar } from '../components/order/MobileOrderBar'

const BOUQUET_PARAM = 'bouquet'

export function Home({ navigate: _navigate }: { navigate: (path: string) => void }) {
  const [flowerFilter, setFlowerFilter] = useState<string | null>(null)
  const [openBouquet, setOpenBouquet] = useState<Bouquet | null>(() => {
    const id = new URLSearchParams(window.location.search).get(BOUQUET_PARAM)
    return (id && getBouquet(id)) || null
  })

  useEffect(() => {
    document.title = siteConfig.seo.title
    const stopReveal = initReveals()
    const stopParallax = initParallax()
    const t = window.setTimeout(() => refreshScroll(), 300)
    return () => {
      window.clearTimeout(t)
      stopReveal()
      stopParallax()
    }
  }, [])

  const open = useCallback((b: Bouquet) => {
    const url = new URL(window.location.href)
    url.searchParams.set(BOUQUET_PARAM, b.id)
    window.history.replaceState(window.history.state, '', url.toString())
    setOpenBouquet(b)
  }, [])

  const close = useCallback(() => {
    const url = new URL(window.location.href)
    url.searchParams.delete(BOUQUET_PARAM)
    window.history.replaceState(window.history.state, '', url.toString())
    setOpenBouquet(null)
  }, [])

  const pickFlower = (id: string) => {
    setFlowerFilter((cur) => (cur === id ? null : id))
    window.setTimeout(() => scrollToId('compositions'), 50)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    name: siteConfig.brand.name,
    description: siteConfig.seo.description,
    url: siteConfig.siteUrl,
    email: siteConfig.contacts.email,
    image: `${siteConfig.siteUrl}/og.jpg`,
    priceRange: siteConfig.seo.business.priceRange,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.seo.business.addressLocality,
      addressCountry: siteConfig.seo.business.addressCountry,
    },
    areaServed: { '@type': 'City', name: siteConfig.seo.business.addressLocality },
    sameAs: [siteConfig.contacts.instagram.url, siteConfig.contacts.telegramBrand.url],
    openingHours: siteConfig.seo.business.openingHours,
  }

  return (
    <>
      <main>
        <Envelope />
        <About />
        <Finder onOpenBouquet={open} />
        <Marquee items={[siteConfig.brand.name, 'Москва', 'Авторские букеты', 'Цветы под заказ']} />
        <Gallery filterFlower={flowerFilter} onClearFilter={() => setFlowerFilter(null)} onOpen={open} />
        <Flowers onPick={pickFlower} active={flowerFilter} />
        <Pricing />
        <HowToOrder />
        <Delivery />
        <Reviews />
        <Contacts />
      </main>
      <Footer />
      <BouquetModal bouquet={openBouquet} onClose={close} />
      <MobileOrderBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
