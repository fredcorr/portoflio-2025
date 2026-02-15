import React from 'react'
import type { StatsComponent } from '@portfolio/types/components'

import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import AnimatedStatValue from '@/components/molecules/AnimatedStatValue/AnimatedStatValue'

// Figma annotations:
// - Stats component (node-id: 3595:2418)
// - Note: "Ideally we want to animate this numbers" (handled by AnimatedStatValue)

const Stats = ({ _key, items, sectionId, componentIndex }: StatsComponent) => {
  const hasItems = Boolean(items && items.length)

  if (!hasItems) {
    return null
  }

  return (
    <ComponentLayout
      sectionId={sectionId}
      componentKey={_key}
      componentIndex={componentIndex}
      className="text-black dark:text-foreground"
      contentClassName="gap-y-10"
      data-organism="stats"
      data-figma-node-id="3595:2418"
    >
      {!!hasItems && (
        <ul className="md:col-span-12 grid grid-cols-2 gap-8 text-left sm:gap-x-20 sm:gap-y-12 md:grid-cols-4 md:justify-items-center md:gap-x-[141px] md:gap-y-10">
          {items?.map((item, index) => {
            const value = item.title?.trim()
            const label = item.subtitle?.trim()

            if (!value && !label) {
              return null
            }

            return (
              <li
                key={item._key ?? `stat-${index}`}
                className="flex min-w-0 flex-col items-start gap-4"
              >
                {value && (
                  <p className="font-heading text-heading-1 font-medium leading-[1.1] tracking-tight">
                    <AnimatedStatValue value={value} />
                  </p>
                )}
                {label && (
                  <p className="font-body text-body-l font-normal leading-[1.4] tracking-tight text-black/80 dark:text-foreground/80">
                    {label}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </ComponentLayout>
  )
}

export default Stats
export { Stats }
