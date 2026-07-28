import React, { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

type TextAs = 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small' | 'li'

export interface TextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  as?: TextAs
  className?: string
}

export const Text = ({ children, as: Tag = 'p', className, ...props }: TextProps) => (
  <Tag className={cn(className)} {...props}>
    {children}
  </Tag>
)

export default Text
