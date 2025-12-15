import React, { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface ComponentLayoutProps extends HTMLAttributes<HTMLElement> {
  fullBleed?: boolean
  overflowHidden?: boolean
  contentClassName?: string
}

export const ComponentLayout = ({
  className,
  contentClassName,
  children,
  fullBleed,
  overflowHidden = true,
  ...props
}: ComponentLayoutProps) => {
  return (
    <section
      className={cn(
        'relative bg-background px-4 py-16 md:px-8 lg:px-12',
        overflowHidden && 'overflow-hidden',
        fullBleed && '!px-0',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'mx-auto grid w-full max-w-full grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-6 md:gap-y-16 lg:gap-x-10 xl:gap-x-12',
          fullBleed && 'max-w-none px-0',
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  )
}
