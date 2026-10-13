import { useEffect, useRef } from 'react'
import type { Bouquet } from '../../content/types'
import { formatPriceFrom } from '../../lib/format'
import { startScroll, stopScroll } from '../../lib/scroll'
import { Picture } from '../ui/Picture'
import { CloseIcon } from '../ui/Icons'
import { OrderButtons } from '../order/OrderButtons'
import styles from './BouquetModal.module.css'

const sizeLabel: Record<Bouquet['size'], string> = {
  S: 'S — небольшой',
  M: 'M — средний',
  L: 'L — крупный',
  XL: 'XL — статусный',
}

export function BouquetModal({ bouquet, onClose }: { bouquet: Bouquet | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (bouquet && !dialog.open) {
      dialog.showModal()
      stopScroll()
      document.body.style.overflow = 'hidden'
    } else if (!bouquet && dialog.open) {
      dialog.close()
    }
  }, [bouquet])

  const handleClose = () => {
    startScroll()
    document.body.style.overflow = ''
    onClose()
  }

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close()
      }}
      aria-labelledby="bouquet-title"
    >
      {bouquet && (
        <div className={styles.inner}>
          <button type="button" className={styles.close} onClick={() => ref.current?.close()} aria-label="Закрыть">
            <CloseIcon />
          </button>
          <div className={styles.media}>
            <Picture name={bouquet.images[0] ? `bouquets/${bouquet.images[0]}` : null} alt={`Композиция «${bouquet.name}»`} placeholderTitle={bouquet.name} sizes="(max-width: 767px) 92vw, 44vw" priority />
            {bouquet.images[1] && (
              <div className={styles.second}>
                <Picture name={`bouquets/${bouquet.images[1]}`} alt={`Композиция «${bouquet.name}», второй ракурс`} sizes="30vw" />
              </div>
            )}
          </div>
          <div className={styles.body}>
            <p className="caption">Композиция</p>
            <h2 id="bouquet-title" className={styles.title}>
              {bouquet.name}
            </h2>
            <p className={styles.price}>{formatPriceFrom(bouquet.priceFrom)}</p>
            <p className={styles.why}>{bouquet.why}</p>
            <dl className={styles.specs}>
              <div>
                <dt>Состав</dt>
                <dd>{bouquet.composition.join(', ')}</dd>
              </div>
              <div>
                <dt>Размер</dt>
                <dd>{sizeLabel[bouquet.size]}</dd>
              </div>
              {bouquet.season && (
                <div>
                  <dt>Сезон</dt>
                  <dd>{bouquet.season}</dd>
                </div>
              )}
            </dl>
            <p className={styles.note}>Цена ориентировочная: зависит от сезона и состава. Точную стоимость назовёт флорист.</p>
            <OrderButtons theme="cream" layout="grid" ctx={{ bouquetName: bouquet.name, priceFrom: bouquet.priceFrom }} />
          </div>
        </div>
      )}
    </dialog>
  )
}
