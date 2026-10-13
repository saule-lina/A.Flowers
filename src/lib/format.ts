const NBSP = ' '

/** 14000 -> «14 000 ₽» (с неразрывными пробелами) */
export const formatPrice = (value: number): string =>
  `${value.toLocaleString('ru-RU').replace(/\s/g, NBSP)}${NBSP}₽`

/** 14000 -> «от 14 000 ₽» */
export const formatPriceFrom = (value: number): string => `от${NBSP}${formatPrice(value)}`
