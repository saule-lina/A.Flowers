import { loadMotion, prefersReducedMotion, type MotionModule } from './motion'

type LenisInstance = InstanceType<MotionModule['Lenis']>

let lenis: LenisInstance | null = null

/** Плавный скролл (Lenis) + синхронизация с ScrollTrigger. GSAP грузится лениво. */
export function initSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => undefined
  let dead = false
  loadMotion().then(({ gsap, ScrollTrigger, Lenis }) => {
    if (dead || lenis) return
    const instance = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    lenis = instance
  })
  return () => {
    dead = true
    lenis?.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis

const HEADER_OFFSET = 72

export function scrollToId(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset: -HEADER_OFFSET, duration: 1.4 })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}

export function stopScroll(): void {
  lenis?.stop()
}
export function startScroll(): void {
  lenis?.start()
}
