import React from 'react'

import ArrowUpRight from '@/components/svgs/ArrowUpRight'
import Sparkle from '@/components/svgs/Sparkle'
import { cn } from '@/utils/cn'

type IconComponent = (props: React.SVGProps<SVGSVGElement>) => JSX.Element

export enum IconName {
  ArrowUpRight = 'arrow-up-right',
  Sparkle = 'sparkle',
}

const iconMap: Record<IconName, IconComponent> = {
  [IconName.ArrowUpRight]: ArrowUpRight,
  [IconName.Sparkle]: Sparkle,
}

export interface IconProps {
  name: IconName
  title?: string
  className?: string
}

export const Icon = ({ name, className }: IconProps) => {
  const Component = iconMap[name]

  if (!Component) {
    return null
  }

  return (
    <Component className={cn('inline-block', className)} data-icon={name} />
  )
}

export default Icon
