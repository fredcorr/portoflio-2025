import React from 'react'

export interface UseClickOutsideOptions {
  active: boolean
  containerRef: React.RefObject<HTMLElement | null>
  onOutsideClick: () => void
}

/**
 * Calls `onOutsideClick` when a pointer-down lands outside `containerRef`.
 * Only listens while `active` is true.
 */
const useClickOutside = ({
  active,
  containerRef,
  onOutsideClick,
}: UseClickOutsideOptions) => {
  React.useEffect(() => {
    if (!active) return

    const handlePointerDown = (event: MouseEvent) => {
      const container = containerRef.current
      if (container && !container.contains(event.target as Node)) {
        onOutsideClick()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [active, containerRef, onOutsideClick])
}

export default useClickOutside
