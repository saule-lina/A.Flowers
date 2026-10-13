import { siteConfig } from '../../content/site.config'
import { Picture } from '../ui/Picture'
import { LotusMark } from '../ui/Logo'
import styles from './About.module.css'

export function About() {
  const a = siteConfig.about
  return (
    <section id="about" className={`theme-cream ${styles.section}`} aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.text} data-reveal-group>
          <div className={styles.top} data-reveal>
            <LotusMark size={30} />
            <span className={styles.numeral}>I</span>
            <span className="caption">{a.caption}</span>
          </div>
          <h2 id="about-title" className={styles.title} data-reveal>
            {a.title}
          </h2>
          {a.paragraphs.map((p, i) => (
            <p key={i} className={styles.p} data-reveal>
              {p}
            </p>
          ))}
          <blockquote className={styles.quote} data-reveal>
            <p>«{a.quote}»</p>
            <cite>— из открытки, которую мы вкладываем в каждый букет</cite>
          </blockquote>
        </div>
        <div className={styles.media}>
          <div className={styles.photo} data-reveal>
            <Picture name={a.photo.name} alt={a.photo.alt} sizes="(max-width: 767px) 92vw, 40vw" />
          </div>
          <div className={styles.photoSmall} data-parallax="0.12" data-reveal>
            <Picture name={a.photoSecondary.name} alt={a.photoSecondary.alt} widths={[480, 960]} sizes="(max-width: 767px) 40vw, 16vw" />
          </div>
          <span className={styles.ring} data-parallax="-0.08" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
