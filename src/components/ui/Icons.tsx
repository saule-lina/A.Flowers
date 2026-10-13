import type { SVGProps } from 'react'

const base: SVGProps<SVGSVGElement> = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const TelegramIcon = () => (
  <svg {...base}>
    <path d="M21 4 3.5 10.8c-.9.4-.9 1.3 0 1.6l4.4 1.4 1.7 5.3c.2.6.9.8 1.4.3l2.4-2.3 4.7 3.4c.6.4 1.4.1 1.5-.6L22 5.2c.2-.9-.5-1.5-1-1.2z" />
    <path d="m8 13.8 9.5-7.3" />
  </svg>
)

export const WhatsAppIcon = () => (
  <svg {...base}>
    <path d="M4 20l1.3-3.8A8.5 8.5 0 1 1 8.6 19L4 20z" />
    <path d="M9.3 8.6c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2.1.4 0 .5l-.5.7c-.1.2-.1.3 0 .5a6 6 0 0 0 2.9 2.6c.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .4-.1 1.1-.5 1.5-.5.5-1.4.8-2 .7-1.3-.2-3-1-4.6-2.6-1.5-1.5-2.3-3-2.4-4.3 0-.6.3-1.3.9-1.5z" />
  </svg>
)

export const InstagramIcon = () => (
  <svg {...base}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r=".8" fill="currentColor" stroke="none" />
  </svg>
)

export const MailIcon = () => (
  <svg {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const ArrowIcon = () => (
  <svg {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const CloseIcon = () => (
  <svg {...base} width={20} height={20}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const CheckIcon = () => (
  <svg {...base}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
)
