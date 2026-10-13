export type MotionModule = typeof import('./gsap')

let modulePromise: Promise<MotionModule> | null = null

/** Ленивая загрузка GSAP/ScrollTrigger/Lenis (один общий чанк) */
export const loadMotion = (): Promise<MotionModule> => {
  if (!modulePromise) modulePromise = import('./gsap')
  return modulePromise
}

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    // ручная проверка статичной версии: ?reduce-motion
    new URLSearchParams(window.location.search).has('reduce-motion'))

export const isMobile = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

/** Обёртка: асинхронная инициализация с синхронной функцией отмены */
function deferred(setup: (m: MotionModule) => () => void): () => void {
  let dead = false
  let kill: () => void = () => undefined
  loadMotion().then((m) => {
    if (dead) return
    kill = setup(m)
  })
  return () => {
    dead = true
    kill()
  }
}

/**
 * Единые микроанимации появления: fade + сдвиг 24 px, лёгкий stagger внутри группы.
 * Разметка: data-reveal на элементе; data-reveal-group на контейнере с детьми [data-reveal].
 */
export function initReveals(root: ParentNode = document): () => void {
  if (prefersReducedMotion()) return () => undefined
  return deferred(({ gsap, ScrollTrigger }) => {
    const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal-group]'))
    const singles = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
      (el) => !el.closest('[data-reveal-group]'),
    )
    const triggers: InstanceType<typeof ScrollTrigger>[] = []
    const animate = (targets: HTMLElement[]) =>
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power3.out', stagger: 0.09, overwrite: 'auto' },
      )
    groups.forEach((group) => {
      const items = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal]'))
      if (!items.length) return
      gsap.set(items, { autoAlpha: 0, y: 26 })
      triggers.push(ScrollTrigger.create({ trigger: group, start: 'top 85%', once: true, onEnter: () => animate(items) }))
    })
    singles.forEach((el) => {
      gsap.set(el, { autoAlpha: 0, y: 26 })
      triggers.push(ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => animate([el]) }))
    })
    return () => triggers.forEach((t) => t.kill())
  })
}

/** Параллакс декоративных элементов: data-parallax="0.2" (доля высоты экрана) */
export function initParallax(root: ParentNode = document): () => void {
  if (prefersReducedMotion()) return () => undefined
  return deferred(({ gsap }) => {
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'))
    const tweens = els.map((el) => {
      const speed = parseFloat(el.dataset.parallax || '0.2')
      return gsap.fromTo(
        el,
        { y: () => -speed * window.innerHeight * 0.5 },
        {
          y: () => speed * window.innerHeight * 0.5,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })
    return () => tweens.forEach((t) => t.kill())
  })
}

/** Пауза всех анимаций, когда вкладка не активна */
export function pauseWhenHidden(): () => void {
  return deferred(({ gsap }) => {
    const onVisibility = () => {
      if (document.hidden) gsap.globalTimeline.pause()
      else gsap.globalTimeline.resume()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  })
}

/** Пересчёт ScrollTrigger (после загрузки изображений/шрифтов) */
export function refreshScroll(): void {
  loadMotion().then(({ ScrollTrigger }) => ScrollTrigger.refresh())
}
