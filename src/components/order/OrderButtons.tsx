import { channelLabel, channelUrl, onChannelClick, type Channel, type OrderContext } from '../../lib/order'
import { useToast } from '../ui/toastContext'
import { InstagramIcon, MailIcon, TelegramIcon, WhatsAppIcon } from '../ui/Icons'
import styles from './OrderButtons.module.css'

const icons: Record<Channel, () => React.JSX.Element> = {
  telegram: TelegramIcon,
  whatsapp: WhatsAppIcon,
  instagram: InstagramIcon,
  email: MailIcon,
}

type Props = {
  ctx?: OrderContext
  /** Цветовая тема: кнопки на винном или на кремовом фоне */
  theme?: 'wine' | 'cream'
  /** row — в ряд, stack — столбиком, grid — 2×2 */
  layout?: 'row' | 'stack' | 'grid'
  /** Только Telegram */
  primaryOnly?: boolean
  primaryLabel?: string
  size?: 'm' | 's'
  className?: string
  /** Коллбек после клика (например, закрыть шторку) */
  onPick?: (channel: Channel) => void
}

const ORDER: Channel[] = ['telegram', 'whatsapp', 'instagram', 'email']

export function OrderButtons({
  ctx = {},
  theme = 'wine',
  layout = 'row',
  primaryOnly = false,
  primaryLabel = 'Заказать в Telegram',
  size = 'm',
  className,
  onPick,
}: Props) {
  const toast = useToast()
  const channels = primaryOnly ? (['telegram'] as Channel[]) : ORDER
  const primaryClass = theme === 'wine' ? 'btn--primary' : 'btn--ink'
  const ghostClass = theme === 'wine' ? 'btn--ghost-cream' : 'btn--ghost-ink'

  return (
    <div className={`${styles.group} ${styles[layout]} ${className ?? ''}`}>
      {channels.map((channel) => {
        const Icon = icons[channel]
        const isPrimary = channel === 'telegram'
        const isMail = channel === 'email'
        return (
          <a
            key={channel}
            href={channelUrl(channel, ctx)}
            target={isMail ? undefined : '_blank'}
            rel={isMail ? undefined : 'noopener noreferrer'}
            className={`btn ${isPrimary ? primaryClass : ghostClass} ${size === 's' ? 'btn--sm' : ''} ${isPrimary ? styles.primary : ''}`}
            onClick={() => {
              onChannelClick(channel, ctx, toast.show)
              onPick?.(channel)
            }}
            data-channel={channel}
          >
            <Icon />
            <span>{isPrimary ? primaryLabel : channelLabel[channel]}</span>
          </a>
        )
      })}
    </div>
  )
}
