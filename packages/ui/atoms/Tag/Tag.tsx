import React, { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type TagVariant = 'default' | 'outline'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: TagVariant
  className?: string
}

export const Tag = ({
  children, variant = 'default', className, ...props
}: TagProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
      variant === 'default' && 'bg-[--color-bg-subtle] text-[--color-fg-default]',
      variant === 'outline' &&
        'border border-[--color-border-default] text-[--color-fg-default]',
      className
    )}
    {...props}
  >
    {children}
  </span>
)

export default Tag
