import type { ReactNode } from 'react'
import styles from './SectionHead.module.css'

type Props = {
  numeral?: string
  caption: string
  title: string
  intro?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

/** Единый заголовок секции: номер (I, II, III), капительная подпись, заголовок антиквой, вводный текст */
export function SectionHead({ numeral, caption, title, intro, align = 'left', className }: Props) {
  return (
    <header className={`${styles.head} ${align === 'center' ? styles.center : ''} ${className ?? ''}`} data-reveal-group>
      <div className={styles.top} data-reveal>
        {numeral && <span className={styles.numeral}>{numeral}</span>}
        <span className="caption">{caption}</span>
      </div>
      <h2 className={styles.title} data-reveal>
        {title}
      </h2>
      {intro && (
        <p className={styles.intro} data-reveal>
          {intro}
        </p>
      )}
    </header>
  )
}
