'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { cn } from '@/utils/cn'

export interface PageTransitionBoundaryProps {
  children: React.ReactNode
  className?: string
  animationClassName?: string
}

const DEFAULT_ANIMATION_CLASS =
  'animate-page-transition motion-reduce:animate-none'
const SESSION_KEY = 'page-transition-seen'

export const PageTransitionBoundary = ({
  children,
  className,
  animationClassName = DEFAULT_ANIMATION_CLASS,
}: PageTransitionBoundaryProps) => {
  const pathname = usePathname()
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    const hasSeenTransition = window.sessionStorage.getItem(SESSION_KEY) === '1'

    if (!hasSeenTransition) {
      window.sessionStorage.setItem(SESSION_KEY, '1')
      return
    }

    setShouldAnimate(true)
  }, [pathname])

  return (
    <div className={cn('relative w-full', className)}>
      <div
        key={pathname}
        className={cn('relative w-full', shouldAnimate && animationClassName)}
      >
        {children}
      </div>
    </div>
  )
}

export default PageTransitionBoundary
