import { useState } from 'react'
import { siteConfig } from '../../content/site.config'
import { analyticsEnabled } from '../../lib/analytics'
import styles from './CookieBanner.module.css'

const KEY = 'aflowers-cookie-ok'

/** Ненавязчивый баннер про cookies: показывается, только если включена Метрика */
export function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    if (!analyticsEnabled) return false
    try {
      return !localStorage.getItem(KEY)
    } catch {
      return true
    }
  })
  if (!visible) return null
  const accept = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* приватный режим */
    }
    setVisible(false)
  }
  return (
    <div className={styles.banner} role="region" aria-label="Уведомление о cookies">
      <p>
        {siteConfig.legal.cookieBanner} <a href="/privacy">Подробнее</a>
      </p>
      <button type="button" className="btn btn--sm btn--ink" onClick={accept}>
        {siteConfig.legal.cookieAccept}
      </button>
    </div>
  )
}
