import { isPlaceholder, siteConfig } from '../../content/site.config'
import { SectionHead } from '../layout/SectionHead'
import styles from './Delivery.module.css'

export function Delivery() {
  const d = siteConfig.delivery
  const text = isPlaceholder(d.info) ? d.fallback : d.info
  return (
    <section id="delivery" className={`theme-cream ${styles.section}`} aria-labelledby="delivery-title">
      <div className={`container ${styles.grid}`}>
        <SectionHead numeral="VII" caption={d.caption} title={d.title} className={styles.head} />
        <div className={styles.body} data-reveal-group>
          <p className={styles.text} data-reveal>
            {text}
          </p>
          <ul className={styles.points}>
            {d.points.map((p, i) => (
              <li key={i} data-reveal>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
