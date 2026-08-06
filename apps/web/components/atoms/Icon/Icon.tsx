import React from 'react'
import { icons } from 'lucide-react'

import { cn } from '@/utils/cn'
import { brandIcons, brandIconAliases } from './brand-icons'

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

const getBrandIcon = (name: string) => {
  const key = name.toLowerCase()
  return brandIcons[key] ?? brandIcons[brandIconAliases[key] ?? '']
}

export interface IconProps {
  name: string
  title?: string
  className?: string
}

export const Icon = ({ name, className, title }: IconProps) => {
  const iconName = String(name ?? '')
  const Component = getLucideIcon(iconName)

  if (Component) {
    return (
      <Component
        className={cn('inline-block', className)}
        data-icon={name}
        aria-hidden={title ? undefined : true}
        role={title ? 'img' : undefined}
      >
        {title && <title>{title}</title>}
      </Component>
    )
  }

  const brandPath = getBrandIcon(iconName)

  if (brandPath) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn('inline-block', className)}
        data-icon={name}
        aria-hidden={title ? undefined : true}
        role={title ? 'img' : undefined}
      >
        {title && <title>{title}</title>}
        <path d={brandPath} />
      </svg>
    )
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[Icon] "${iconName}" matched no lucide or brand icon and rendered nothing. ` +
        `lucide removed brand marks in v1 — add it to brand-icons.ts if it is one.`
    )
  }

  return null
}

export default Icon
