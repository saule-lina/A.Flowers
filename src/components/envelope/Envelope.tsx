import { useLayoutEffect, useRef } from 'react'
import { siteConfig } from '../../content/site.config'
import { isMobile, loadMotion, prefersReducedMotion, type MotionModule } from '../../lib/motion'
import { LotusMark } from '../ui/Logo'
import { Seal } from './Seal'
import styles from './Envelope.module.css'

const PETAL = 'M12 0C19.5 5.5 24 15 21 27c-2 7.5-6.5 10.5-9 11-2.5-.5-7-3.5-9-11C0 15 4.5 5.5 12 0z'

/**
 * Первый экран: конверт с сургучной печатью, который открывается по мере скролла.
 * Секция закреплена (pin), анимация привязана к прогрессу (scrub), при скролле вверх — в обратном порядке.
 * Этапы: 0–20% приближение и блик на печати · 20–40% печать ломается · 40–65% клапан открывается в 3D ·
 * 65–90% открытка выезжает · 90–100% открытка разворачивается на весь экран и становится фоном блока «О студии».
 */
export function Envelope() {
  const heroRef = useRef<HTMLElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const envRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const cardInnerRef = useRef<HTMLDivElement>(null)
  const flapRef = useRef<HTMLDivElement>(null)
  const sealRef = useRef<HTMLDivElement>(null)
  const sealLeft = useRef<SVGGElement>(null)
  const sealRight = useRef<SVGGElement>(null)
  const sealGlow = useRef<SVGEllipseElement>(null)
  const particles = useRef<SVGGElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const paperInnerRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const kickerRef = useRef<HTMLParagraphElement>(null)
  const bodyRefs = useRef<HTMLDivElement[]>([])
  const petalRefs = useRef<HTMLDivElement[]>([])

  const reduced = typeof window !== 'undefined' && prefersReducedMotion()

  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    // React отрисовал настоящий конверт — статичную заглушку из index.html можно убрать
    document.getElementById('pre-hero')?.remove()

    const emit = (cream: boolean) => document.dispatchEvent(new CustomEvent('hero:state', { detail: { cream } }))

    if (reduced) {
      // Без анимации: шапка становится кремовой, когда первый экран уходит
      const io = new IntersectionObserver(([e]) => emit(!e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' })
      io.observe(hero)
      return () => io.disconnect()
    }

    const card = cardRef.current!
    let dead = false
    let ctx: { revert: () => void } | null = null
    const build = ({ gsap, ScrollTrigger }: MotionModule) => {
      if (dead) return
      ctx = gsap.context(() => {
      // «дыхание» конверта: амплитуда 3 px, период ~7 с
      const breathe = gsap.to(floatRef.current, {
        y: 3,
        rotation: 0.35,
        duration: 3.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      const fullScale = () => {
        const w = card.offsetWidth || 1
        const h = card.offsetHeight || 1
        return (Math.max(window.innerWidth / w, window.innerHeight / h) / 1.06) * 1.12
      }

      let creamState = false
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: () => (isMobile() ? '+=180%' : '+=280%'),
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress > 0.06) breathe.pause()
            else breathe.play()
            const cream = self.progress > 0.93
            if (cream !== creamState) {
              creamState = cream
              emit(cream)
            }
          },
        },
      })

      // подсказка и подпись исчезают сразу
      tl.to([hintRef.current, kickerRef.current], { autoAlpha: 0, duration: 0.05 }, 0)

      // 1. 0–20%: приближение, блик на печати
      tl.to(envRef.current, { scale: 1.06, duration: 0.2, ease: 'power1.out' }, 0)
      tl.to(sealGlow.current, { opacity: 1, duration: 0.12 }, 0.06)
      tl.to(sealGlow.current, { opacity: 0, duration: 0.08 }, 0.22)

      // 2. 20–40%: печать ломается — половинки расходятся, частицы сургуча
      tl.to(sealLeft.current, { x: -34, y: -12, rotation: -26, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.2)
      tl.to(sealRight.current, { x: 38, y: 16, rotation: 30, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.2)
      const dots = particles.current ? Array.from(particles.current.children) : []
      tl.set(particles.current, { opacity: 1 }, 0.22)
      dots.forEach((dot, i) => {
        const angle = (i / dots.length) * Math.PI * 2 + 0.4
        tl.fromTo(
          dot,
          { x: 0, y: 0, opacity: 1, scale: 0.6 },
          { x: Math.cos(angle) * (26 + i * 4), y: Math.sin(angle) * (22 + i * 3) + 10, opacity: 0, scale: 1, duration: 0.18, ease: 'power2.out' },
          0.22 + i * 0.01,
        )
      })
      tl.set(sealRef.current, { visibility: 'hidden' }, 0.42)

      // 3. 40–65%: клапан раскрывается в 3D вокруг верхней кромки
      tl.to(flapRef.current, { rotateX: 180, duration: 0.25, ease: 'power1.inOut' }, 0.4)
      tl.set(flapRef.current, { zIndex: 1 }, 0.525)

      // 4. 65–90%: открытка выезжает из конверта, выпадают лепестки
      tl.to(card, { y: () => -card.offsetHeight * 0.92, duration: 0.25, ease: 'power2.inOut' }, 0.65)
      petalRefs.current.forEach((p, i) => {
        tl.fromTo(
          p,
          { x: (i - 1) * 30, y: 0, rotation: 0, opacity: 0 },
          { x: (i - 1) * 110 + (i % 2 ? 30 : -20), y: 260 + i * 60, rotation: 200 + i * 90, opacity: 0.9, duration: 0.3, ease: 'power1.in' },
          0.68 + i * 0.03,
        )
        tl.to(p, { opacity: 0, duration: 0.06 }, 0.94 + i * 0.01)
      })

      // 5. 90–100%: конверт уходит, открытка разворачивается на весь экран
      tl.to(bodyRefs.current, { y: 60, autoAlpha: 0, duration: 0.1, ease: 'power1.in' }, 0.88)
      tl.to(cardInnerRef.current, { autoAlpha: 0, duration: 0.05 }, 0.9)
      tl.set(card, { zIndex: 5 }, 0.9) // открытка «идёт к читателю» поверх конверта
      tl.to(card, { y: 0, scale: fullScale, duration: 0.1, ease: 'power2.in' }, 0.9)
      tl.to(paperRef.current, { autoAlpha: 1, duration: 0.05 }, 0.95)
      tl.fromTo(paperInnerRef.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.04 }, 0.97)

      if (import.meta.env.DEV) {
        // отладка в dev: window.__heroTl.scrollTrigger.disable(); window.__heroTl.progress(0.5)
        ;(window as unknown as { __heroTl?: unknown }).__heroTl = tl
      }
      }, hero)
      const onLoad = () => ScrollTrigger.refresh()
      window.addEventListener('load', onLoad, { once: true })
    }
    loadMotion().then(build)

    return () => {
      dead = true
      ctx?.revert()
    }
  }, [reduced])

  const setBody = (i: number) => (el: HTMLDivElement | null) => {
    if (el) bodyRefs.current[i] = el
  }
  const setPetal = (i: number) => (el: HTMLDivElement | null) => {
    if (el) petalRefs.current[i] = el
  }

  return (
    <section id="hero" ref={heroRef} className={`${styles.hero} ${reduced ? styles.static : ''}`} aria-label="Первый экран">
      <p ref={kickerRef} className={`caption ${styles.kicker}`}>
        {siteConfig.hero.kicker}
      </p>

      <div className={styles.scene}>
        <div ref={floatRef} className={styles.float}>
          <div ref={envRef} className={styles.envelope}>
            <div ref={setBody(0)} className={styles.shadow} />
            <div ref={setBody(1)} className={`${styles.layer} ${styles.back} ${styles.velvet}`} />
            <div ref={setBody(2)} className={`${styles.layer} ${styles.lining}`} />

            {/* лепестки, выпадающие из конверта */}
            {[0, 1, 2].map((i) => (
              <div key={i} ref={setPetal(i)} className={styles.petal} aria-hidden="true">
                <svg viewBox="0 0 24 38">
                  <path d={PETAL} fill="currentColor" />
                </svg>
              </div>
            ))}

            {/* открытка */}
            <div ref={cardRef} className={styles.card}>
              <div ref={cardInnerRef} className={styles.cardInner}>
                <LotusMark size={44} title="Логотип A.FLOWERS — лотос" />
                <h1 className={styles.cardTitle}>{siteConfig.brand.name}</h1>
                <p className={styles.cardSlogan}>{siteConfig.brand.cardSlogan}</p>
                <p className={styles.cardNote}>{siteConfig.brand.cardNote}</p>
              </div>
            </div>

            {/* передняя часть (карман) */}
            <div ref={setBody(3)} className={`${styles.layer} ${styles.pocket}`}>
              <div className={`${styles.face} ${styles.faceL}`} />
              <div className={`${styles.face} ${styles.faceR}`} />
              <div className={`${styles.face} ${styles.faceB}`} />
              <svg className={styles.folds} viewBox="0 0 600 420" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 0 300 239 600 0" fill="none" stroke="rgba(0,0,0,.3)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                <path d="M0 420 300 202 600 420" fill="none" stroke="rgba(255,170,180,.12)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d="M0 420 300 202 600 420" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="1.2" transform="translate(0 1.5)" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            {/* клапан: лицевая сторона (бордо, кружево по кромке) и внутренняя (кремовая подкладка) */}
            <div ref={flapRef} className={`${styles.layer} ${styles.flap}`}>
              <div className={`${styles.flapFace} ${styles.flapBack}`} />
              <div className={`${styles.flapFace} ${styles.flapFront}`}>
                <svg className={styles.lace} viewBox="0 0 600 420" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    {/* кружевная лента: решётка, цветочные розетки и фестоны по внутреннему краю */}
                    <pattern id="hero-lace" width="24" height="30" patternUnits="userSpaceOnUse">
                      <rect width="24" height="30" fill="#8d2634" fillOpacity=".22" />
                      <path d="M0 4h24M0 10h24M0 16h24M0 22h24M4 0v30M12 0v30M20 0v30" stroke="#a7303f" strokeOpacity=".5" strokeWidth=".7" />
                      <g fill="#b8404f" fillOpacity=".75">
                        <circle cx="12" cy="13" r="1.2" />
                        <circle cx="12" cy="9.4" r="1.1" />
                        <circle cx="12" cy="16.6" r="1.1" />
                        <circle cx="8.4" cy="13" r="1.1" />
                        <circle cx="15.6" cy="13" r="1.1" />
                        <circle cx="9.5" cy="10.5" r=".8" />
                        <circle cx="14.5" cy="10.5" r=".8" />
                        <circle cx="9.5" cy="15.5" r=".8" />
                        <circle cx="14.5" cy="15.5" r=".8" />
                        <circle cx="0" cy="27" r="1.3" />
                        <circle cx="24" cy="27" r="1.3" />
                      </g>
                      <path d="M0 24a6 6 0 0 1 12 0a6 6 0 0 1 12 0" fill="#8d2634" fillOpacity=".3" stroke="#b8404f" strokeOpacity=".7" strokeWidth=".9" />
                      <path d="M0 2a3 3 0 0 0 6 0a3 3 0 0 0 6 0a3 3 0 0 0 6 0a3 3 0 0 0 6 0" fill="none" stroke="#b8404f" strokeOpacity=".6" strokeWidth=".8" />
                    </pattern>
                  </defs>
                  {/* левая кромка: от (0,0) к (300,252); правая — зеркально */}
                  <g transform="rotate(40.03) scale(1 -1)">
                    <rect x="-6" y="-2" width="404" height="31" fill="url(#hero-lace)" />
                    <path d="M-6 6h404" stroke="#c45563" strokeOpacity=".55" strokeWidth="1" strokeDasharray="2.5 2.5" />
                  </g>
                  <g transform="translate(600 0) rotate(139.97)">
                    <rect x="-6" y="-2" width="404" height="31" fill="url(#hero-lace)" />
                    <path d="M-6 6h404" stroke="#c45563" strokeOpacity=".55" strokeWidth="1" strokeDasharray="2.5 2.5" />
                  </g>
                  {/* кромка клапана: тонкая тень и блик */}
                  <path d="M0 0 300 252 600 0" fill="none" stroke="rgba(0,0,0,.45)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                  <path d="M0 0 300 252 600 0" fill="none" stroke="rgba(255,160,170,.14)" strokeWidth="1" transform="translate(0 -1.5)" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            </div>

            {/* печать */}
            <div ref={sealRef} className={styles.seal}>
              <Seal id="hero-seal" leftRef={sealLeft} rightRef={sealRight} glowRef={sealGlow} particlesRef={particles} />
            </div>
          </div>
        </div>
      </div>

      <div ref={hintRef} className={styles.hint} aria-hidden="true">
        <span>{siteConfig.hero.scrollHint}</span>
        <span className={styles.hintLine} />
      </div>

      <div ref={paperRef} className={styles.paper} aria-hidden="true">
        <div ref={paperInnerRef} className={styles.paperInner}>
          <LotusMark size={40} />
          <p className={styles.paperLine}>{siteConfig.brand.cardSlogan}</p>
          <span className={styles.paperHint}>Читайте дальше ↓</span>
        </div>
      </div>
    </section>
  )
}
