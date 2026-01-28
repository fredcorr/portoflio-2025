import React from 'react'

export interface UseFocusTrapOptions {
  active: boolean
  containerRef: React.RefObject<HTMLElement | null>
  onDeactivate?: () => void
  initialFocusSelector?: string
}

const DEFAULT_FOCUS_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

const useFocusTrap = ({
  active,
  containerRef,
  onDeactivate,
  initialFocusSelector,
}: UseFocusTrapOptions) => {
  const lastActiveRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const container = containerRef.current
    const selector = initialFocusSelector ?? DEFAULT_FOCUS_SELECTOR

    const resolveFocusable = () =>
      container
        ? Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
            element => !element.hasAttribute('disabled')
          )
        : []

    active &&
      (() => {
        const activeElement = document.activeElement
        lastActiveRef.current =
          activeElement instanceof HTMLElement ? activeElement : null
        const focusable = resolveFocusable()
        const initialFocus = focusable[0] ?? container
        initialFocus && initialFocus.focus()
      })()

    !active && lastActiveRef.current && lastActiveRef.current.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      const isEscape = event.key === 'Escape'
      const isTab = event.key === 'Tab'
      const focusable = resolveFocusable()
      const hasFocusable = focusable.length > 0

      active && isEscape && event.preventDefault()
      active && isEscape && onDeactivate && onDeactivate()

      active &&
        isTab &&
        hasFocusable &&
        (() => {
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          const activeElement = document.activeElement
          const isShiftTab = event.shiftKey
          const isOnFirst = activeElement === first
          const isOnLast = activeElement === last

          isShiftTab &&
            isOnFirst &&
            (() => {
              event.preventDefault()
              last && last.focus()
            })()

          !isShiftTab &&
            isOnLast &&
            (() => {
              event.preventDefault()
              first && first.focus()
            })()
        })()
    }

    active && document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [active, containerRef, initialFocusSelector, onDeactivate])
}

export default useFocusTrap
