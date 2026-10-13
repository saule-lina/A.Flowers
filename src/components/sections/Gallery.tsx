import { useMemo } from 'react'
import { siteConfig } from '../../content/site.config'
import { bouquets } from '../../content/bouquets'
import { flowers } from '../../content/flowers'
import type { Bouquet } from '../../content/types'
import { formatPriceFrom } from '../../lib/format'
import { SectionHead } from '../layout/SectionHead'
import { Picture } from '../ui/Picture'
import styles from './Gallery.module.css'

type Props = {
  filterFlower: string | null
  onClearFilter: () => void
  onOpen: (b: Bouquet) => void
}

export function Gallery({ filterFlower, onClearFilter, onOpen }: Props) {
  const g = siteConfig.gallery
  const list = useMemo(
    () => (filterFlower ? bouquets.filter((b) => b.flowerIds.includes(filterFlower)) : bouquets),
    [filterFlower],
  )
  const flowerName = flowers.find((f) => f.id === filterFlower)?.name

  return (
    <section id="compositions" className={`theme-wine ${styles.section}`} aria-labelledby="gallery-title">
      <div className="container">
        <SectionHead numeral="III" caption={g.caption} title={g.title} intro={g.intro} />

        <div className={styles.filterRow} aria-live="polite">
          {filterFlower ? (
            <>
              <span className={styles.filterLabel}>
                Композиции с цветком: <em>{flowerName}</em> · {list.length}
              </span>
              <button type="button" className={styles.clear} onClick={onClearFilter}>
                Показать все ×
              </button>
            </>
          ) : (
            <span className={styles.filterLabel}>Все композиции · {list.length}</span>
          )}
        </div>

        <ul className={styles.grid} data-reveal-group>
          {list.map((b, i) => (
            <li key={b.id} className={`${styles.card} ${styles[`pos${i % 3}`]}`} data-reveal>
              <button type="button" className={styles.cardButton} onClick={() => onOpen(b)}>
                <span className={styles.media}>
                  <Picture name={b.images[0] ? `bouquets/${b.images[0]}` : null} alt={`Композиция «${b.name}»: ${b.composition.join(', ')}`} placeholderTitle={b.name} />
                  {b.images[1] && (
                    <span className={styles.hover} aria-hidden="true">
                      <Picture name={`bouquets/${b.images[1]}`} alt="" />
                    </span>
                  )}
                  <span className={styles.index}>/{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span className={styles.body}>
                  <span className={styles.top}>
                    <span className={styles.name}>{b.name}</span>
                    <span className={styles.price}>{formatPriceFrom(b.priceFrom)}</span>
                  </span>
                  <span className={styles.composition}>{b.composition.join(', ')}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className={styles.empty}>С этим цветком композиций пока нет — соберём индивидуально.</p>}
      </div>
    </section>
  )
}
