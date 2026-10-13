import { isPlaceholder, siteConfig } from '../../content/site.config'
import { SectionHead } from '../layout/SectionHead'
import { OrderButtons } from '../order/OrderButtons'
import styles from './HowToOrder.module.css'

const numerals = ['I', 'II', 'III', 'IV']

export function HowToOrder() {
  const h = siteConfig.howToOrder
  const payment = isPlaceholder(h.paymentMethods) ? h.paymentFallback : h.paymentMethods
  return (
    <section id="how" className={`theme-cream ${styles.section}`} aria-labelledby="how-title">
      <div className="container">
        <SectionHead numeral="VI" caption={h.caption} title={h.title} />
        <ol className={styles.steps} data-reveal-group>
          {h.steps.map((s, i) => (
            <li key={i} className={styles.step} data-reveal>
              <span className={styles.num}>{numerals[i]}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepText}>{s.text}</p>
            </li>
          ))}
        </ol>
        <div className={styles.footer} data-reveal-group>
          <div className={styles.noteBox} data-reveal>
            <p className={styles.note}>{h.note}</p>
            <p className={styles.payment}>
              <span>Оплата:</span> {payment}
            </p>
          </div>
          <div data-reveal>
            <OrderButtons theme="cream" layout="row" />
          </div>
        </div>
      </div>
    </section>
  )
}
