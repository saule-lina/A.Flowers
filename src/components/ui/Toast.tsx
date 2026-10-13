import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Toast.module.css'
import { CheckIcon } from './Icons'
import { ToastContext } from './toastContext'

type PopoverEl = HTMLDivElement & { showPopover?: () => void; hidePopover?: () => void }

/**
 * Тост «Текст заказа скопирован». Использует Popover API (top layer), чтобы
 * показываться поверх модального окна композиции; без поддержки — обычный fixed-блок.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const ref = useRef<PopoverEl>(null)

  const show = useCallback((msg: string) => {
    window.clearTimeout(timer.current)
    setMessage(msg)
    setVisible(true)
    timer.current = window.setTimeout(() => setVisible(false), 3400)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || typeof el.showPopover !== 'function') return
    try {
      if (visible) el.showPopover?.()
      else window.setTimeout(() => el.hidePopover?.(), 400)
    } catch {
      /* popover уже в нужном состоянии */
    }
  }, [visible])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        ref={ref}
        popover="manual"
        className={`${styles.toast} ${visible ? styles.visible : ''}`}
        role="status"
        aria-live="polite"
      >
        {message && (
          <>
            <CheckIcon />
            <span>{message}</span>
          </>
        )}
      </div>
    </ToastContext.Provider>
  )
}
