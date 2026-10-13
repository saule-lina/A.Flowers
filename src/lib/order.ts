import { siteConfig } from '../content/site.config'
import { formatPriceFrom } from './format'
import { track } from './analytics'

export type Channel = 'telegram' | 'whatsapp' | 'instagram' | 'email'

export type OrderContext = {
  bouquetName?: string
  priceFrom?: number
  occasionLabel?: string
  recipientLabel?: string
}

/** Текст заказа: «Здравствуйте! Хочу заказать композицию „Бордо“ (от 20 000 ₽), повод: день рождения, для: неё» */
export function buildOrderText(ctx: OrderContext = {}): string {
  const parts: string[] = []
  if (ctx.bouquetName) {
    const price = ctx.priceFrom ? ` (${formatPriceFrom(ctx.priceFrom)})` : ''
    parts.push(`Здравствуйте! Хочу заказать композицию „${ctx.bouquetName}“${price}`)
  } else {
    parts.push('Здравствуйте! Хочу заказать букет')
  }
  if (ctx.occasionLabel) parts.push(`повод: ${ctx.occasionLabel.toLowerCase()}`)
  if (ctx.recipientLabel) parts.push(`для: ${ctx.recipientLabel.toLowerCase()}`)
  return parts.join(', ').replace(/ /g, ' ')
}

export function buildMailto(ctx: OrderContext = {}): string {
  const subject = ctx.bouquetName ? `Заказ композиции „${ctx.bouquetName}“` : 'Заказ букета'
  const body = `${buildOrderText(ctx)}\n\nДата и время доставки:\nАдрес:\nПожелания:\n`
  return `mailto:${siteConfig.contacts.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function channelUrl(channel: Channel, ctx: OrderContext = {}): string {
  const c = siteConfig.contacts
  switch (channel) {
    case 'telegram':
      return c.telegramManager.url
    case 'whatsapp':
      return c.whatsapp.url
    case 'instagram':
      return c.instagram.directUrl
    case 'email':
      return buildMailto(ctx)
  }
}

export const channelLabel: Record<Channel, string> = {
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  email: 'Почта',
}

/** Синхронное копирование в буфер — работает внутри клика даже в Safari */
export function copyText(text: string): boolean {
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '-1000px'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    ta.setSelectionRange(0, text.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    if (ok) return true
  } catch {
    /* переходим к async API */
  }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => undefined)
    return true
  }
  return false
}

const goalByChannel: Record<Channel, string> = {
  telegram: siteConfig.analytics.goals.telegram,
  whatsapp: siteConfig.analytics.goals.whatsapp,
  instagram: siteConfig.analytics.goals.instagram,
  email: siteConfig.analytics.goals.email,
}

/**
 * Обработчик клика по кнопке канала. Сама ссылка открывается браузером (href),
 * здесь — копирование текста заказа, тост и цель Метрики.
 */
export function onChannelClick(
  channel: Channel,
  ctx: OrderContext,
  notify: (message: string) => void,
): void {
  track(goalByChannel[channel], { bouquet: ctx.bouquetName ?? null })
  if (channel === 'email') return
  const ok = copyText(buildOrderText(ctx))
  notify(ok ? siteConfig.order.toastCopied : siteConfig.order.toastCopyFailed)
}
