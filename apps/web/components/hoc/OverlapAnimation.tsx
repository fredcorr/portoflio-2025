'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface OverlapAnimationProps {
  children: React.ReactNode
  className?: string
  stickyClassName?: string
}

const OverlapAnimation = ({ children, className, stickyClassName }: OverlapAnimationProps) => {
  const innerRef = useRef<HTMLDivElement>(null)
  const [outerHeight, setOuterHeight] = useState('200vh')
  const [stickyTop, setStickyTop] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = innerRef.current
      if (!el) return
      const contentH = el.scrollHeight
      const vh = window.innerHeight
      const overflow = Math.max(0, contentH - vh)
      setOuterHeight(`${contentH + vh}px`)
      setStickyTop(-overflow)
    }

    const ro = new ResizeObserver(update)
    if (innerRef.current) ro.observe(innerRef.current)
    window.addEventListener('resize', update)
    update()

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      className={cn('relative -mb-[100vh]', className)}
      style={{ height: outerHeight }}
    >
      <div
        ref={innerRef}
        className={cn('sticky min-h-screen', stickyClassName)}
        style={{ top: stickyTop }}
      >
        {children}
      </div>
    </div>
  )
}

export default OverlapAnimation
