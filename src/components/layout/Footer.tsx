import { isPlaceholder, siteConfig } from '../../content/site.config'
import { Logo } from '../ui/Logo'
import styles from './Footer.module.css'

const year = new Date().getFullYear()

export function Footer() {
  const k = siteConfig.contacts
  return (
    <footer className={`theme-wine ${styles.footer}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo variant="cream" size="m" />
          <p className={styles.tagline}>{siteConfig.brand.tagline}</p>
        </div>
        <ul className={styles.contacts}>
          <li>
            <a href={k.telegramManager.url} target="_blank" rel="noopener noreferrer">
              Telegram {k.telegramManager.handle}
            </a>
          </li>
          <li>
            <a href={k.telegramBrand.url} target="_blank" rel="noopener noreferrer">
              Telegram {k.telegramBrand.handle}
            </a>
          </li>
          <li>
            <a href={k.whatsapp.url} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </li>
          <li>
            <a href={k.instagram.url} target="_blank" rel="noopener noreferrer">
              Instagram* {k.instagram.handle}
            </a>
          </li>
          <li>
            <a href={`mailto:${k.email}`}>{k.email}</a>
          </li>
          {!isPlaceholder(k.phone) && (
            <li>
              <a href={`tel:${k.phone.replace(/[^\d+]/g, '')}`}>{k.phone}</a>
            </li>
          )}
        </ul>
        <div className={styles.meta}>
          <p>
            © {year} {siteConfig.brand.name}, {siteConfig.brand.city}
          </p>
          <a href="/privacy">Политика конфиденциальности</a>
        </div>
      </div>
      <div className={`container ${styles.footnote}`}>
        <p>{siteConfig.legal.instagramFootnote}</p>
      </div>
    </footer>
  )
}
