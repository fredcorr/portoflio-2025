'use client'

import React, { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface LinkComponentProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button'
    href?: never
    LinkComponent?: never
  }

type ButtonAsLink = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a'
    href: string
    LinkComponent?: React.ComponentType<LinkComponentProps>
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-[--button-bg] text-[--button-fg] hover:bg-[--button-bg-hover]',
  secondary: 'border border-[--color-border-default] text-[--color-fg-default] hover:bg-[--color-bg-subtle]',
  ghost:     'text-[--color-fg-default] hover:bg-[--color-bg-subtle]',
}

const baseClasses =
  'inline-flex items-center justify-center rounded-[--button-radius] font-medium ' +
  'transition-colors focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-[--color-accent] ' +
  'disabled:pointer-events-none disabled:opacity-50'

export const Button = ({
  as, variant = 'primary', size = 'md', className, children, ...props
}: ButtonProps) => {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className)

  if (as === 'a') {
    const { href, LinkComponent, ...rest } = props as ButtonAsLink
    const Comp: React.ElementType = LinkComponent ?? 'a'
    return (
      <Comp href={href} className={classes} {...rest}>
        {children}
      </Comp>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
