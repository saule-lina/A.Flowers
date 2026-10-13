import styles from './Marquee.module.css'

/** Бегущая строка между блоками (мотив из референса Maison Rouge) */
export function Marquee({ items, theme = 'wine' }: { items: string[]; theme?: 'wine' | 'cream' }) {
  const row = [...items, ...items]
  return (
    <div className={`${styles.marquee} ${theme === 'cream' ? styles.cream : ''}`} aria-hidden="true">
      <div className={styles.track}>
        {[0, 1].map((n) => (
          <div className={styles.row} key={n}>
            {row.map((item, i) => (
              <span className={styles.item} key={i}>
                <span>{item}</span>
                <span className={styles.dot}>·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
