import React from 'react'
import Link from 'next/link'
import type { NavigationItem } from '@portfolio/types/components'

import { cn } from '@/utils/cn'
import getPagePath from '@/utils/get-page-path'

export enum NavItemLayout {
  Row = 'row',
  Column = 'column',
}

export interface NavItemProps {
  item: NavigationItem
  currentPath: string
  projectCount?: number
  layout?: NavItemLayout
  isOpen?: boolean
  index?: number
  onNavigate?: () => void
  className?: string
}

const NavItem = ({
  item,
  currentPath,
  projectCount,
  layout = NavItemLayout.Row,
  isOpen,
  index,
  onNavigate,
  className,
}: NavItemProps) => {
  const isColumn = layout === NavItemLayout.Column
  const label = item.title?.trim() ?? ''
  const href = getPagePath({ slug: item.slug.current, fallback: '/' })
  const normalizedLabel = label.toLowerCase()
  const isProjects = normalizedLabel === 'projects'
  const showCount =
    isProjects &&
    typeof projectCount === 'number' &&
    Number.isFinite(projectCount) &&
    projectCount > 0
  const hasCount = Boolean(showCount)
  const isActive = currentPath === href
  let transitionDelay = '0ms'
  isOpen &&
    typeof index === 'number' &&
    Number.isFinite(index) &&
    (transitionDelay = `${index * 60}ms`)
  let ariaCurrent: 'page' | undefined
  isActive && (ariaCurrent = 'page')
  let ariaLabel = label
  hasCount && (ariaLabel = `${label} (${projectCount})`)
  const shouldRender = Boolean(label)
  const style = transitionDelay && { transitionDelay }

  return (
    shouldRender && (
      <li
        data-molecule="nav-item"
        style={style || undefined}
        className={cn('transition-all duration-300', isColumn && 'w-full')}
      >
        <Link
          href={href}
          onClick={onNavigate}
          aria-current={ariaCurrent}
          aria-label={ariaLabel}
          className={cn(
            'group inline-flex items-center gap-2 rounded-full px-3 py-2 font-body text-[20px] font-normal leading-[1.4] tracking-[-0.02em] text-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:text-foreground dark:focus-visible:outline-white',
            isColumn && 'px-1',
            className
          )}
        >
          <span
            data-active={isActive}
            className={cn(
              'relative inline-flex items-center',
              'after:absolute after:-bottom-1 after:left-1/2 after:h-[1px] after:w-full after:-translate-x-1/2 after:bg-black after:opacity-0 after:transition-opacity after:duration-300 dark:after:bg-white',
              'group-hover:after:opacity-100 data-[active=true]:after:opacity-100'
            )}
          >
            {label}
          </span>
          {hasCount && (
            <span
              data-development="Displays the total published project pages."
              className="inline-flex size-4 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white"
            >
              {projectCount}
            </span>
          )}
        </Link>
      </li>
    )
  )
}

export default NavItem
export { NavItem }
