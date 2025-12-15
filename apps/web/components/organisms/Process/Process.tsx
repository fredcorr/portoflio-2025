import type { ProcessComponent } from '@portfolio/types/components'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { Heading } from '@/components/atoms/Heading/Heading'
import { RichTextSize } from '@/components/atoms/RichText/RichText'
import Card, {
  CardSpacing,
  CardTitleSize,
} from '@/components/molecules/Card/Card'
import { formatStepNumber } from '@/utils/format-step-number'
import { makeComponentId } from '@/utils/makeComponentId'
import { cn } from '@/utils/cn'
import React from 'react'

const Process = ({ _id, _key, title, steps }: ProcessComponent) => {
  const headingId = makeComponentId({
    value: _id || _key,
    prefix: 'process',
  })

  return (
    <ComponentLayout
      aria-labelledby={headingId}
      className="text-black dark:text-foreground"
      contentClassName="gap-y-12 lg:gap-y-16"
    >
      {title?.heading && (
        <Heading
          id={headingId}
          level={title.headingLevel}
          className="md:col-span-12 font-heading text-heading-2 font-semibold leading-[1.2] tracking-tight"
        >
          {title.heading}
        </Heading>
      )}

      {Array.isArray(steps) && steps.length > 0 ? (
        <div
          className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 md:gap-x-10 md:gap-y-10"
          style={{ gridTemplateRows: `repeat(${steps.length}, 'auto')` }}
        >
          {steps.map((step, index) => {
            const isRightColumn = index % 2 === 1
            return (
              <Card
                key={_key}
                title={`${formatStepNumber(index)} ${step.title}`}
                titleSize={CardTitleSize.Small}
                subtitle={step.subtitle}
                subtitleSize={RichTextSize.Md}
                spacing={CardSpacing.Compact}
                style={{ gridRow: `${index + 1} / span 1` }}
                className={cn(
                  'h-full bg-transparent shadow-none hover:translate-y-0 !rounded-none',
                  'md:col-span-5',
                  isRightColumn ? 'md:col-start-7' : 'md:col-start-1',
                  index >= 1 &&
                    'border-t border-black/10 pt-8 dark:border-foreground/20'
                )}
              />
            )
          })}
        </div>
      ) : (
        <div className="md:col-span-12 rounded-3xl border border-dashed border-black/10 bg-gray-50 px-6 py-10 text-center font-body text-body-lg text-black/60 dark:border-gray-200/40 dark:bg-gray-100 dark:text-foreground/70">
          Process steps will appear here once they are published.
        </div>
      )}
    </ComponentLayout>
  )
}

export default Process
export { Process }
