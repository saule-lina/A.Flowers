import { useEffect } from 'react'
import { siteConfig } from '../content/site.config'
import { Footer } from '../components/layout/Footer'
import styles from './Privacy.module.css'

export function Privacy({ navigate }: { navigate: (path: string) => void }) {
  useEffect(() => {
    document.title = `${siteConfig.legal.privacyTitle} — ${siteConfig.brand.name}`
    document.dispatchEvent(new CustomEvent('hero:state', { detail: { cream: true } }))
    return () => {
      document.title = siteConfig.seo.title
    }
  }, [])

  return (
    <>
      <main className={`theme-cream ${styles.page}`}>
        <div className={`container ${styles.inner}`}>
          <a
            href="/"
            className={styles.back}
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
            }}
          >
            ← На главную
          </a>
          <p className="caption">Документ</p>
          <h1 className={styles.title}>{siteConfig.legal.privacyTitle}</h1>
          {siteConfig.legal.privacyDraft && (
            <p className={styles.draft}>
              Черновик. Текст политики нужно утвердить с владельцем студии (и при необходимости с юристом) перед публикацией.
            </p>
          )}
          <div className={styles.text}>
            <h2>1. Общие положения</h2>
            <p>
              Сайт {siteConfig.brand.name} ({siteConfig.siteUrl}) является витриной цветочной студии и не содержит форм для сбора
              персональных данных. Заказы оформляются через внешние мессенджеры и электронную почту, перечисленные в разделе
              «Контакты».
            </p>
            <h2>2. Какие данные обрабатываются</h2>
            <p>
              Сайт не собирает и не хранит имя, телефон, адрес или иные персональные данные посетителей. Данные, которые вы
              сообщаете нам в мессенджерах или по электронной почте, используются только для согласования и выполнения заказа.
            </p>
            <h2>3. Cookies и аналитика</h2>
            <p>
              Для анализа посещаемости сайт может использовать сервис Яндекс Метрика, который применяет cookies и собирает
              обезличенные технические данные (тип устройства, браузер, страницы просмотра). Вы можете отключить cookies в
              настройках браузера.
            </p>
            <h2>4. Контакты</h2>
            <p>
              По вопросам обработки данных пишите на {siteConfig.contacts.email}.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
