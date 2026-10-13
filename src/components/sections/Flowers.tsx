import { siteConfig } from '../../content/site.config'
import { flowers } from '../../content/flowers'
import { SectionHead } from '../layout/SectionHead'
import { Picture } from '../ui/Picture'
import styles from './Flowers.module.css'

export function Flowers({ onPick, active }: { onPick: (id: string) => void; active: string | null }) {
  const f = siteConfig.flowers
  return (
    <section id="flowers" className={`theme-wine ${styles.section}`} aria-labelledby="flowers-title">
      <div className="container">
        <SectionHead numeral="IV" caption={f.caption} title={f.title} intro={f.intro} />
      </div>
      <div className={styles.strip} data-reveal-group>
        <ul className={styles.list}>
          {flowers.map((fl, i) => (
            <li key={fl.id} className={styles.card} data-reveal>
              <button type="button" className={`${styles.button} ${active === fl.id ? styles.active : ''}`} onClick={() => onPick(fl.id)} aria-pressed={active === fl.id}>
                <span className={styles.media}>
                  <Picture name={fl.image ? `flowers/${fl.image}` : null} alt={fl.name} placeholderTitle={fl.name} widths={[480, 960]} sizes="(max-width: 767px) 70vw, 300px" />
                  <span className={styles.index}>/{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span className={styles.body}>
                  <span className={styles.name}>{fl.name}</span>
                  <span className={styles.season}>{fl.season}</span>
                  <span className={styles.desc}>{fl.description}</span>
                  <span className={styles.meaning}>{fl.meaning}</span>
                  <span className={styles.cta}>Показать композиции →</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
