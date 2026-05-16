'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'

interface OverlapAnimationProps {
  children: React.ReactNode
  className?: string
  stickyClassName?: string
}

const OverlapAnimation = ({
  children,
  className,
  stickyClassName,
}: OverlapAnimationProps) => {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const measure = () => {
      const h = inner.getBoundingClientRect().height
      const vhPx = window.innerHeight
      const fitsViewport = h <= vhPx

      if (fitsViewport) {
        outer.style.height = `${h + vhPx}px`
        outer.style.marginBottom = `-${h}px`
        inner.style.position = 'sticky'
      } else {
        outer.style.height = `${h + vhPx}px`
        outer.style.marginBottom = `-${vhPx}px`
        inner.style.position = 'relative'
      }
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(inner)
    window.addEventListener('resize', measure, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div
      ref={outerRef}
      className={cn('relative h-[200vh] -mb-[100vh]', className)}
    >
      <div
        ref={innerRef}
        className={cn('sticky top-0', stickyClassName)}
      >
        {children}
      </div>
    </div>
  )
}

export default OverlapAnimation
