import { siteConfig } from '../../content/site.config'
import { formatPriceFrom } from '../../lib/format'
import { SectionHead } from '../layout/SectionHead'
import styles from './Pricing.module.css'

const numerals = ['I', 'II', 'III', 'IV']

export function Pricing() {
  const p = siteConfig.pricing
  return (
    <section id="prices" className={`theme-cream ${styles.section}`} aria-labelledby="prices-title">
      <div className="container">
        <SectionHead numeral="V" caption={p.caption} title={p.title} />
        <ul className={styles.menu} data-reveal-group>
          {p.tiers.map((t, i) => (
            <li key={t.id} className={styles.tier} data-reveal>
              <span className={styles.num}>{numerals[i]}</span>
              <div className={styles.head}>
                <h3 className={styles.name}>{t.name}</h3>
                <span className={styles.dots} aria-hidden="true" />
                <span className={styles.price}>{formatPriceFrom(t.priceFrom)}</span>
              </div>
              <p className={styles.desc}>{t.description}</p>
            </li>
          ))}
        </ul>
        <p className={styles.note} data-reveal>
          {p.note}
        </p>
      </div>
    </section>
  )
}
