'use client'

import React from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'outline'
  size?: 'sm'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'ghost', size = 'sm', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'font-heading uppercase tracking-[0.14em] transition-colors duration-200 disabled:cursor-default disabled:opacity-25',
        size === 'sm' && 'px-5 py-2.5 text-body-md',
        variant === 'ghost' && 'text-foreground/55 hover:text-foreground',
        variant === 'outline' && [
          'border border-foreground/10 text-foreground/55',
          'hover:border-foreground hover:text-foreground',
        ],
        className
      )}
      {...props}
    />
  )
)

Button.displayName = 'Button'

export default Button
export type { ButtonProps }
