import React from 'react'
import { cn } from '@/utils/cn'

interface OverlapAnimationProps {
  children: React.ReactNode
  className?: string
  stickyClassName?: string
  mobileFlow?: boolean
}

const OverlapAnimation = ({
  children,
  className,
  stickyClassName,
  mobileFlow = false,
}: OverlapAnimationProps) => {
  return (
    <div
      className={cn(
        'relative',
        mobileFlow ? 'md:h-[200vh] md:-mb-[100vh]' : 'h-[200vh] -mb-[100vh]',
        className
      )}
    >
      <div
        className={cn(
          'top-0',
          mobileFlow ? 'md:sticky md:min-h-screen' : 'sticky min-h-screen',
          stickyClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default OverlapAnimation
