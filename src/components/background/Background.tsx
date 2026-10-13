import { useEffect, useRef, useState } from 'react'
import { isMobile, loadMotion, prefersReducedMotion } from '../../lib/motion'
import styles from './Background.module.css'

const PETAL_PATH = 'M12 0C19.5 5.5 24 15 21 27c-2 7.5-6.5 10.5-9 11-2.5-.5-7-3.5-9-11C0 15 4.5 5.5 12 0z'

type Petal = { size: number; left: number; depth: number; tone: 'rose' | 'bordeaux' }

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function makePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    size: rand(14, 34),
    left: (i / count) * 100 + rand(-4, 4),
    depth: rand(0, 1), // 0 — далеко (мелко, размыто, медленно), 1 — близко
    tone: Math.random() > 0.35 ? 'rose' : 'bordeaux',
  }))
}

/**
 * Живой фон: мягкие пятна света в корпоративных цветах + редкие падающие лепестки.
 * Только transform/opacity. Выключается при prefers-reduced-motion.
 */
export function Background() {
  const ref = useRef<HTMLDivElement>(null)
  const [petals] = useState<Petal[]>(() => makePetals(isMobile() ? 5 : 10))

  useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return
    let dead = false
    let ctx: { revert: () => void } | null = null
    loadMotion().then(({ gsap }) => {
      if (dead) return
      ctx = gsap.context(() => {
      // пятна света: цикл 25–40 с
      gsap.utils.toArray<HTMLElement>(`.${styles.blob}`).forEach((blob, i) => {
        gsap.to(blob, {
          xPercent: i % 2 ? -18 : 18,
          yPercent: i % 2 ? 14 : -12,
          scale: 1.15,
          duration: 26 + i * 7,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
      // лепестки
      gsap.utils.toArray<HTMLElement>(`.${styles.petal}`).forEach((petal) => {
        const depth = parseFloat(petal.dataset.depth || '0.5')
        const duration = 38 - depth * 16 // ближние падают быстрее
        const fall = () =>
          gsap.fromTo(
            petal,
            { y: () => -window.innerHeight - 80, rotation: rand(-40, 40) },
            {
              y: 0,
              rotation: `+=${rand(160, 420)}`,
              duration,
              ease: 'none',
              delay: rand(0, duration),
              repeat: -1,
              repeatDelay: rand(2, 8),
            },
          )
        fall()
        const inner = petal.firstElementChild as HTMLElement
        gsap.to(inner, {
          x: rand(24, 70),
          rotationY: rand(40, 100),
          duration: rand(3.5, 6.5),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
      }, root)
    })
    return () => {
      dead = true
      ctx?.revert()
    }
  }, [])

  return (
    <div ref={ref} className={styles.bg} aria-hidden="true">
      <div className={`${styles.blob} ${styles.blobA}`} />
      <div className={`${styles.blob} ${styles.blobB}`} />
      <div className={`${styles.blob} ${styles.blobC}`} />
      <div className={styles.petals}>
        {petals.map((p, i) => (
          <div
            key={i}
            className={`${styles.petal} ${p.tone === 'rose' ? styles.rose : styles.bordeaux}`}
            data-depth={p.depth.toFixed(2)}
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.6,
              opacity: 0.25 + p.depth * 0.45,
              filter: p.depth < 0.35 ? 'blur(1.5px)' : p.depth < 0.6 ? 'blur(0.6px)' : 'none',
            }}
          >
            <svg viewBox="0 0 24 38" width="100%" height="100%">
              <path d={PETAL_PATH} fill="currentColor" />
              <path d="M12 2v30" stroke="rgba(0,0,0,.18)" strokeWidth="0.6" />
            </svg>
          </div>
        ))}
      </div>
      <div className={styles.grain} />
    </div>
  )
}
