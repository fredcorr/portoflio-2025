import React, { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { getComponentSectionId } from '@/utils/get-component-section-id'

interface ComponentLayoutProps extends HTMLAttributes<HTMLElement> {
  fullBleed?: boolean
  overflowHidden?: boolean
  contentClassName?: string
  sectionId?: string
  componentKey?: string
  componentIndex?: number
}

export const ComponentLayout = ({
  className,
  contentClassName,
  children,
  fullBleed,
  overflowHidden = true,
  sectionId,
  componentKey,
  componentIndex,
  id,
  ...props
}: ComponentLayoutProps) => {
  const resolvedSectionId = getComponentSectionId({
    sectionId,
    componentKey,
    componentIndex,
  })

  return (
    <section
      className={cn(
        'relative mx-auto bg-background px-4 py-12 md:px-6 md:py-16',
        overflowHidden && 'overflow-hidden',
        fullBleed && '!px-0',
        className
      )}
      id={id ?? resolvedSectionId}
      {...props}
    >
      <div
        className={cn(
          'mx-auto grid w-full max-w-full grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-6 md:gap-y-16 lg:max-w-[1440px] lg:gap-x-10 xl:gap-x-12',
          fullBleed && 'max-w-none px-0',
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  )
}
