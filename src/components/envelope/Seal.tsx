/**
 * Сургучная печать A.FLOWERS по референсу клиента: растёкшийся сургуч с неровным
 * медно-золотым ободком, точечная окантовка и рельефный лотос из логотипа.
 * Печать разделена на две половины (clip-path), чтобы «ломаться» при скролле.
 */

/** Лотос из логотипа A.FLOWERS (viewBox 0 0 100 100): пять лепестков, чашелистики, стебель с листьями */
export const LOGO_LOTUS = (
  <>
    <path d="M50 64C38 46 40 26 50 11c10 15 12 35 0 53z" />
    <path d="M50 64C33 54 27 36 30 19c12 9 19 25 20 45z" />
    <path d="M50 64c1-20 8-36 20-45 3 17-3 35-20 45z" />
    <path d="M50 64C30 60 18 46 14 29c16 5 29 17 36 35z" />
    <path d="M50 64c7-18 20-30 36-35-4 17-16 31-36 35z" />
    <path d="M50 67c-10-9-21-10-30-5 7 9 19 12 30 5z" />
    <path d="M50 67c10-9 21-10 30-5-7 9-19 12-30 5z" />
    <path d="M48.4 69h3.2v18.5c0 2-.8 3.2-1.6 4-.8-.8-1.6-2-1.6-4z" />
    <path d="M50 78c-7-3-13-1-17 6 7 3 13 1 17-6z" />
    <path d="M50 78c7-3 13-1 17 6-7 3-13 1-17-6z" />
  </>
)

function Face({ id }: { id: string }) {
  return (
    <g>
      {/* растёкшийся сургуч: неровный край */}
      <path
        d="M60 7c8-1 15 2 21 7 7 5 13 10 15 19 2 9 1 19-3 27-4 8-10 14-18 17-8 3-17 3-25 0-8-3-15-8-19-15-5-8-6-18-4-27 2-9 8-16 15-21 6-4 11-6 18-7z"
        fill={`url(#${id}-waxOut)`}
      />
      {/* медно-золотой ободок с переливами, чуть неровный */}
      <circle cx="60" cy="60" r="46.5" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="5" />
      <ellipse cx="60.5" cy="59.5" rx="47.5" ry="46" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="2.2" strokeOpacity=".8" transform="rotate(-18 60 60)" />
      <circle cx="60" cy="60" r="47" fill="none" stroke="#F2D59A" strokeOpacity=".4" strokeWidth="1.1" strokeDasharray="7 11 3 17" strokeLinecap="round" transform="rotate(-40 60 60)" />
      {/* тело печати */}
      <circle cx="60" cy="60" r="44" fill={`url(#${id}-wax)`} />
      {/* внутренняя тень у ободка — объём */}
      <circle cx="60" cy="60" r="42.5" fill="none" stroke="rgba(40,4,8,.5)" strokeWidth="3" />
      <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(255,190,190,.14)" strokeWidth="1" />
      {/* точечная окантовка */}
      <circle cx="60" cy="60" r="35.5" fill="none" stroke="#3E060B" strokeOpacity=".7" strokeWidth="1.8" strokeDasharray="0.2 3.1" strokeLinecap="round" transform="translate(.5 .7)" />
      <circle cx="60" cy="60" r="35.5" fill="none" stroke="#D98E8E" strokeOpacity=".75" strokeWidth="1.8" strokeDasharray="0.2 3.1" strokeLinecap="round" />
      {/* рельефный лотос: тень снизу-справа, свет сверху-слева, тело */}
      <g transform="translate(31 30) scale(.58)">
        <g fill="#3A0509" fillOpacity=".8" transform="translate(2.2 2.6)">
          {LOGO_LOTUS}
        </g>
        <g fill="#F4C9C4" fillOpacity=".55" transform="translate(-1.3 -1.6)">
          {LOGO_LOTUS}
        </g>
        <g fill={`url(#${id}-relief)`}>{LOGO_LOTUS}</g>
      </g>
      {/* блик сверху слева и мягкая тень снизу */}
      <ellipse cx="42" cy="38" rx="22" ry="13" fill="#fff" fillOpacity=".1" transform="rotate(-32 42 38)" />
      <ellipse cx="72" cy="86" rx="24" ry="9" fill="#000" fillOpacity=".12" transform="rotate(-20 72 86)" />
    </g>
  )
}

export function Seal({
  id = 'seal',
  leftRef,
  rightRef,
  glowRef,
  particlesRef,
  className,
}: {
  id?: string
  leftRef?: React.Ref<SVGGElement>
  rightRef?: React.Ref<SVGGElement>
  glowRef?: React.Ref<SVGEllipseElement>
  particlesRef?: React.Ref<SVGGElement>
  className?: string
}) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-wax`} cx="36%" cy="30%" r="78%">
          <stop offset="0" stopColor="#B33A42" />
          <stop offset="0.45" stopColor="#8E1B22" />
          <stop offset="0.85" stopColor="#5E0C12" />
          <stop offset="1" stopColor="#4A080D" />
        </radialGradient>
        <radialGradient id={`${id}-waxOut`} cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#7A141B" />
          <stop offset="1" stopColor="#4A0A0F" />
        </radialGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E3C27E" />
          <stop offset="0.22" stopColor="#8F5A2C" />
          <stop offset="0.42" stopColor="#D9A95C" />
          <stop offset="0.6" stopColor="#7A4A24" />
          <stop offset="0.8" stopColor="#CFA057" />
          <stop offset="1" stopColor="#6E3F1E" />
        </linearGradient>
        <linearGradient id={`${id}-relief`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C9555C" />
          <stop offset="1" stopColor="#8A1A22" />
        </linearGradient>
        <clipPath id={`${id}-left`}>
          <path d="M0 0h61v52l-4 10 4 10v48H0z" />
        </clipPath>
        <clipPath id={`${id}-right`}>
          <path d="M61 0h59v120H61V72l4-10-4-10z" />
        </clipPath>
      </defs>
      <g ref={leftRef} clipPath={`url(#${id}-left)`} style={{ transformOrigin: '40px 60px' }}>
        <Face id={id} />
      </g>
      <g ref={rightRef} clipPath={`url(#${id}-right)`} style={{ transformOrigin: '80px 60px' }}>
        <Face id={id} />
      </g>
      {/* световой акцент на печати (0–20% скролла) */}
      <ellipse ref={glowRef} cx="60" cy="60" rx="52" ry="52" fill="#fff" fillOpacity=".14" style={{ opacity: 0 }} />
      {/* частицы сургуча */}
      <g ref={particlesRef} fill="#8E1B22" style={{ opacity: 0 }}>
        <circle cx="60" cy="60" r="2.2" />
        <circle cx="60" cy="60" r="1.6" />
        <circle cx="60" cy="60" r="2.8" />
        <circle cx="60" cy="60" r="1.3" />
        <circle cx="60" cy="60" r="2" />
        <circle cx="60" cy="60" r="1.7" />
        <circle cx="60" cy="60" r="2.4" />
      </g>
    </svg>
  )
}
