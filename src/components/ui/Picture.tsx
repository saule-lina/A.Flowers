import styles from './Picture.module.css'
import { imageSrc } from '../../lib/images'

type Props = {
  /** Базовое имя: «bouquets/bordeaux-1» → /images/bouquets/bordeaux-1-480.webp … */
  name?: string | null
  alt: string
  /** Доступные ширины (должны совпадать с scripts/images.mjs) */
  widths?: number[]
  sizes?: string
  /** Для первых экранов: грузить сразу */
  priority?: boolean
  /** Соотношение сторон рамки, по умолчанию 4/5 */
  ratio?: string
  /** Заголовок заглушки (название композиции курсивом) */
  placeholderTitle?: string
  className?: string
  /** Тональная «живописная» плёнка поверх фото */
  tone?: boolean
}

export function Picture({
  name,
  alt,
  widths = [480, 960, 1440],
  sizes = '(max-width: 767px) 50vw, 33vw',
  priority = false,
  ratio = '4 / 5',
  placeholderTitle,
  className,
  tone = true,
}: Props) {
  if (!name) {
    return (
      <div className={`${styles.frame} ${styles.placeholder} ${className ?? ''}`} style={{ aspectRatio: ratio }} role="img" aria-label={alt}>
        <span className={styles.placeholderTitle}>{placeholderTitle ?? alt}</span>
        <span className={styles.placeholderNote}>фото скоро</span>
      </div>
    )
  }
  const srcSet = widths.map((w) => `${imageSrc(name, w)} ${w}w`).join(', ')
  const [w0] = widths
  const h0 = Math.round(w0 / (4 / 5))
  return (
    <div className={`${styles.frame} ${tone ? styles.tone : ''} ${className ?? ''}`} style={{ aspectRatio: ratio }}>
      <img
        src={imageSrc(name, widths[Math.min(1, widths.length - 1)])}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={w0}
        height={h0}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </div>
  )
}
