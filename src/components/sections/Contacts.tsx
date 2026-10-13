import { isPlaceholder, siteConfig } from '../../content/site.config'
import { OrderButtons } from '../order/OrderButtons'
import { imageSrc } from '../../lib/images'
import { MiniEnvelope } from '../envelope/MiniEnvelope'
import styles from './Contacts.module.css'

export function Contacts() {
  const c = siteConfig.contactsBlock
  const k = siteConfig.contacts
  return (
    <section id="contacts" className={`theme-wine ${styles.section}`} aria-labelledby="contacts-title">
      <picture className={styles.photo} aria-hidden="true">
        <img
          src={imageSrc(c.photo, 1600)}
          srcSet={`${imageSrc(c.photo, 960)} 960w, ${imageSrc(c.photo, 1600)} 1600w, ${imageSrc(c.photo, 2400)} 2400w`}
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
          width={1600}
          height={900}
        />
      </picture>
      <div className={`container ${styles.inner}`} data-reveal-group>
        <div className={styles.envelope} data-reveal>
          <MiniEnvelope />
        </div>
        <p className="caption" data-reveal>
          {c.caption}
        </p>
        <h2 id="contacts-title" className={styles.title} data-reveal>
          {c.title}
        </h2>
        <p className={styles.text} data-reveal>
          {c.text}
        </p>
        <div data-reveal>
          <OrderButtons theme="wine" layout="row" primaryLabel="Написать в Telegram" className={styles.buttons} />
        </div>
        <ul className={styles.links} data-reveal>
          <li>
            <span>Telegram</span>
            <a href={k.telegramManager.url} target="_blank" rel="noopener noreferrer">
              {k.telegramManager.handle}
            </a>
            <a href={k.telegramBrand.url} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
              {k.telegramBrand.handle}
            </a>
          </li>
          <li>
            <span>Instagram*</span>
            <a href={k.instagram.url} target="_blank" rel="noopener noreferrer">
              {k.instagram.handle}
            </a>
          </li>
          <li>
            <span>Почта</span>
            <a href={`mailto:${k.email}`}>{k.email}</a>
          </li>
          {!isPlaceholder(k.phone) && (
            <li>
              <span>Телефон</span>
              <a href={`tel:${k.phone.replace(/[^\d+]/g, '')}`}>{k.phone}</a>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
