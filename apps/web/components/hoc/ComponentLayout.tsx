import React, { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type ComponentLayoutProps = HTMLAttributes<HTMLElement> & {
  contentClassName?: string
}

export const ComponentLayout = ({
  className,
  contentClassName,
  children,
  ...props
}: ComponentLayoutProps) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-background px-4 py-16 md:px-8 lg:px-12',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'mx-auto grid w-full max-w-full grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-6 md:gap-y-16 lg:gap-x-10 xl:gap-x-12',
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  )
}
