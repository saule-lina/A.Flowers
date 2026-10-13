/**
 * Отдельный чанк с GSAP, ScrollTrigger и Lenis.
 * Загружается динамически после первой отрисовки, чтобы не задерживать LCP.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger, Lenis }
