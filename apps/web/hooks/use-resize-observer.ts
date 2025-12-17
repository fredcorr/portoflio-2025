import React from 'react'

export interface UseResizeObserverOptions<T extends Element> {
  element: T | null
  onResize: () => void
  disabled?: boolean
}

export const useResizeObserver = <T extends Element>({
  element,
  onResize,
  disabled,
}: UseResizeObserverOptions<T>) => {
  const onResizeRef = React.useRef(onResize)

  React.useEffect(() => {
    onResizeRef.current = onResize
  }, [onResize])

  React.useEffect(() => {
    if (disabled) {
      return
    }

    if (!element) {
      return
    }

    let rafId: number | undefined
    let timeoutId: number | undefined

    const schedule = () => {
      rafId && window.cancelAnimationFrame(rafId)
      rafId = window.requestAnimationFrame(() => {
        onResizeRef.current()
      })
    }

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        schedule()
      })

      observer.observe(element)

      return () => {
        rafId && window.cancelAnimationFrame(rafId)
        observer.disconnect()
      }
    }

    const handleResize = () => {
      timeoutId && window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        onResizeRef.current()
      }, 150)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      rafId && window.cancelAnimationFrame(rafId)
      timeoutId && window.clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [disabled, element])
}

export default useResizeObserver
