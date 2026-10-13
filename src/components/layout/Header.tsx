import { useEffect, useState } from 'react'
import { siteConfig } from '../../content/site.config'
import { scrollToId, startScroll, stopScroll } from '../../lib/scroll'
import { onChannelClick } from '../../lib/order'
import { Logo } from '../ui/Logo'
import { TelegramIcon } from '../ui/Icons'
import { useToast } from '../ui/toastContext'
import styles from './Header.module.css'

export function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const toast = useToast()

  // Шапка прозрачна на первом экране; когда открытка заполняет экран — кремовая с blur
  useEffect(() => {
    const onState = (e: Event) => setSolid(Boolean((e as CustomEvent<{ cream: boolean }>).detail?.cream))
    document.addEventListener('hero:state', onState)
    return () => document.removeEventListener('hero:state', onState)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    if (open) {
      stopScroll()
      document.body.style.overflow = 'hidden'
    } else {
      startScroll()
      document.body.style.overflow = ''
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // дождаться закрытия панели, чтобы Lenis снова был активен
    window.setTimeout(() => scrollToId(id), open ? 60 : 0)
  }

  const tg = siteConfig.contacts.telegramManager

  return (
    <>
      <header className={`${styles.header} ${solid || open ? styles.solid : ''} ${open ? styles.open : ''}`}>
        <div className={`container ${styles.inner}`}>
          <a href="/" className={styles.logo} aria-label="A.FLOWERS — на главную" onClick={go('hero')}>
            <Logo variant={solid || open ? 'ink' : 'cream'} size="s" />
          </a>

          <nav className={styles.nav} aria-label="Разделы сайта">
            {siteConfig.nav.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={go(item.id)}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <a
              href={tg.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn--sm ${solid || open ? 'btn--ink' : 'btn--primary'} ${styles.cta}`}
              onClick={() => onChannelClick('telegram', {}, toast.show)}
            >
              <TelegramIcon />
              <span>Заказать в Telegram</span>
            </a>
            <button
              type="button"
              className={styles.burger}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`${styles.panel} ${open ? styles.panelOpen : ''}`} aria-hidden={!open}>
        <nav className={styles.panelNav} aria-label="Мобильное меню">
          {siteConfig.nav.map((item, i) => (
            <a key={item.id} href={`#${item.id}`} onClick={go(item.id)} tabIndex={open ? 0 : -1}>
              <span className={styles.panelNum}>{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.panelFooter}>
          <a
            href={tg.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ink"
            tabIndex={open ? 0 : -1}
            onClick={() => onChannelClick('telegram', {}, toast.show)}
          >
            <TelegramIcon />
            <span>Заказать в Telegram</span>
          </a>
          <p className={styles.panelContacts}>
            {tg.handle} · {siteConfig.contacts.email}
          </p>
        </div>
      </div>
    </>
  )
}
