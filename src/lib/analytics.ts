import { siteConfig } from '../content/site.config'

type Ym = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number }

declare global {
  interface Window {
    ym?: Ym
  }
}

const id = siteConfig.analytics.yandexMetrikaId

export const analyticsEnabled = Boolean(id)

/** Подключение Яндекс Метрики (только если указан ID в site.config.ts) */
export function initAnalytics(): void {
  if (!analyticsEnabled || typeof window === 'undefined' || window.ym) return
  const ym: Ym = (...args: unknown[]) => {
    ;(ym.a = ym.a || []).push(args)
  }
  ym.l = Date.now()
  window.ym = ym
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://mc.yandex.ru/metrika/tag.js'
  document.head.appendChild(script)
  ym(Number(id), 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false,
  })
}

/** Достижение цели. Без Метрики — тихо ничего не делает. */
export function track(goal: string, params?: Record<string, unknown>): void {
  if (!analyticsEnabled) return
  window.ym?.(Number(id), 'reachGoal', goal, params)
}
