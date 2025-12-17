import React from 'react'

export interface UseResizeObserverOptions<T extends Element> {
  element: T | null
  onResize: (entry: ResizeObserverEntry) => void
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

    const schedule = (entry: ResizeObserverEntry) => {
      rafId && window.cancelAnimationFrame(rafId)
      rafId = window.requestAnimationFrame(() => {
        onResizeRef.current(entry)
      })
    }

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(entries => {
        const entry = entries[0]
        entry && schedule(entry)
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
        onResizeRef.current({ target: element } as ResizeObserverEntry)
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
