import React from 'react'
import { icons } from 'lucide-react'

import { cn } from '@/utils/cn'

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

const normalizeLucideName = (name: string) =>
  name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const getLucideIcon = (name: string) => {
  const lucideIcons = icons as Record<string, IconComponent>
  return lucideIcons[name] ?? lucideIcons[normalizeLucideName(name)]
}

export interface IconProps {
  name: string
  title?: string
  className?: string
}

export const Icon = ({ name, className, title }: IconProps) => {
  const Component = getLucideIcon(String(name ?? ''))

  if (!Component) {
    return null
  }

  return (
    <Component className={cn('inline-block', className)} data-icon={name} />
  )
}

export default Icon
