import React from 'react'
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
  return (
    <div className={cn('relative h-[200vh] -mb-[100vh]', className)}>
      <div className={cn('sticky top-0 min-h-screen', stickyClassName)}>
        {children}
      </div>
    </div>
  )
}

export default OverlapAnimation
