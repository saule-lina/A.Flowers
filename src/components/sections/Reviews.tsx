import { siteConfig } from '../../content/site.config'
import { SectionHead } from '../layout/SectionHead'
import styles from './Reviews.module.css'

/** Отзывы: заложено в вёрстку, по умолчанию скрыто (reviews.enabled: false). Вымышленных отзывов нет. */
export function Reviews() {
  const r = siteConfig.reviews
  if (!r.enabled || r.items.length === 0) return null
  return (
    <section id="reviews" className={`theme-wine ${styles.section}`} aria-labelledby="reviews-title">
      <div className="container">
        <SectionHead numeral="VIII" caption={r.caption} title={r.title} />
        <ul className={styles.list} data-reveal-group>
          {r.items.map((item, i) => (
            <li key={i} className={styles.item} data-reveal>
              <p className={styles.text}>«{item.text}»</p>
              <p className={styles.author}>
                {item.author}
                {item.source && <span> · {item.source}</span>}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
