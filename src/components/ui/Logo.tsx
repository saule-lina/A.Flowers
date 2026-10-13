/**
 * Логотип A.FLOWERS — SVG-реконструкция по фото открытки клиента:
 * тёмный овал со скруглёнными углами, внутри белый лотос (пять лепестков, стебель с листьями).
 * При появлении оригинального файла логотипа заменить разметку здесь.
 */
type Props = {
  size?: number
  /** Цвет овала */
  color?: string
  /** Цвет лотоса */
  mark?: string
  className?: string
  title?: string
}

export function LotusMark({ size = 48, color = 'var(--c-ink)', mark = 'var(--c-cream)', className, title }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size * 1.18}
      viewBox="0 0 100 118"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect x="4" y="4" width="92" height="110" rx="34" fill={color} />
      <g fill={mark}>
        <path d="M50 30c6.2 8 8.5 17.4 6.9 27.5-1.5 9.5-4 14.6-6.9 17.4-2.9-2.8-5.4-7.9-6.9-17.4C41.5 47.4 43.8 38 50 30z" />
        <path d="M32.5 42.8c8.4 3.3 13.9 8.6 16.3 16.3 1.6 5.2 1.3 9.5.2 12-4.7-1.4-9.4-5-13.3-10.7-3.9-5.8-5-11.7-3.2-17.6z" />
        <path d="M67.5 42.8c-8.4 3.3-13.9 8.6-16.3 16.3-1.6 5.2-1.3 9.5-.2 12 4.7-1.4 9.4-5 13.3-10.7 3.9-5.8 5-11.7 3.2-17.6z" />
        <path d="M23 58.5c7.6.5 13.8 3.2 18.6 8.3 3.3 3.5 5.2 6.8 5.9 9-5.2 1-10.8.2-15.8-2.9-5-3.1-7.9-7.8-8.7-14.4z" />
        <path d="M77 58.5c-7.6.5-13.8 3.2-18.6 8.3-3.3 3.5-5.2 6.8-5.9 9 5.2 1 10.8.2 15.8-2.9 5-3.1 7.9-7.8 8.7-14.4z" />
        <path d="M49 76h2v14h-2z" />
        <path d="M50 84c-4.6-1.2-8.4-.3-11.3 2.7 3.6 1.9 7.4 1 11.3-2.7z" />
        <path d="M50 84c4.6-1.2 8.4-.3 11.3 2.7-3.6 1.9-7.4 1-11.3-2.7z" />
      </g>
    </svg>
  )
}

export function Logo({
  variant = 'cream',
  withMark = true,
  size = 'm',
}: {
  variant?: 'cream' | 'ink'
  withMark?: boolean
  size?: 's' | 'm' | 'l'
}) {
  const color = variant === 'cream' ? 'var(--c-cream)' : 'var(--c-ink)'
  const markSize = size === 'l' ? 56 : size === 's' ? 22 : 28
  const fontSize = size === 'l' ? '1.9rem' : size === 's' ? '1.05rem' : '1.25rem'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'l' ? 16 : 10,
        color,
        fontFamily: 'var(--f-serif)',
        fontWeight: 500,
        letterSpacing: '0.14em',
        fontSize,
        lineHeight: 1,
      }}
    >
      {withMark && (
        <LotusMark
          size={markSize}
          color={variant === 'cream' ? 'var(--c-cream)' : 'var(--c-ink)'}
          mark={variant === 'cream' ? 'var(--c-wine)' : 'var(--c-cream)'}
        />
      )}
      <span>A.FLOWERS</span>
    </span>
  )
}
