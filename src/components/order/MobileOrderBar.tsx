import { useEffect, useState } from 'react'
import { siteConfig } from '../../content/site.config'
import { OrderButtons } from './OrderButtons'
import { CloseIcon } from '../ui/Icons'
import styles from './MobileOrderBar.module.css'

/** Закреплённая внизу кнопка «Заказать» (только мобильные) с шторкой выбора канала */
export function MobileOrderBar() {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('has-order-bar', shown)
    return () => document.body.classList.remove('has-order-bar')
  }, [shown])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <div className={`${styles.bar} ${shown ? styles.shown : ''}`}>
        <button type="button" className={`btn btn--primary ${styles.cta}`} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
          {siteConfig.order.mobileCta}
        </button>
      </div>
      <div className={`${styles.backdrop} ${open ? styles.open : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div className={`${styles.sheet} ${open ? styles.open : ''}`} role="dialog" aria-modal="true" aria-label={siteConfig.order.sheetTitle} aria-hidden={!open}>
        <div className={styles.sheetHead}>
          <p className={styles.sheetTitle}>{siteConfig.order.sheetTitle}</p>
          <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Закрыть" tabIndex={open ? 0 : -1}>
            <CloseIcon />
          </button>
        </div>
        <OrderButtons theme="cream" layout="stack" onPick={() => setOpen(false)} />
        <p className={styles.hint}>Текст заказа скопируется — вставьте его в чат.</p>
      </div>
    </>
  )
}
