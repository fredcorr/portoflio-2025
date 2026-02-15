import React from 'react'
import type { FaqsComponent } from '@portfolio/types/components'

import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { Heading } from '@/components/atoms/Heading/Heading'
import FaqItem from '@/components/molecules/FaqItem/FaqItem'
import { makeComponentId } from '@/utils/makeComponentId'
import { cn } from '@/utils/cn'

// Figma annotations:
// - FAQ list card (node-id: 75:1735)
// - FAQ list with left title + right card (node-id: 3594:2406)
// - Accordion state uses native <details>/<summary>

const Faqs = ({ _id, _key, title, questions, sectionId }: FaqsComponent) => {
  const headingText = title?.heading
  const hasHeading = Boolean(headingText)
  const hasQuestions = Boolean(questions && questions.length)
  const headingId = makeComponentId({
    value: _id ?? _key ?? headingText,
    prefix: 'faqs',
  })

  if (!hasHeading && !hasQuestions) {
    return null
  }

  const cardColumnClassName = cn(
    hasHeading && 'md:col-span-8',
    hasHeading && 'md:col-start-5',
    !hasHeading && 'md:col-span-10 md:col-start-2',
    !hasHeading && 'lg:col-span-8 lg:col-start-3'
  )

  return (
    <ComponentLayout
      sectionId={sectionId}
      {...(hasHeading && headingId && { 'aria-labelledby': headingId })}
      className={'text-black dark:text-foreground'}
      contentClassName="gap-y-10"
      data-organism="faqs"
      data-figma-node-id="75:1735"
    >
      {hasHeading && headingText && (
        <Heading
          id={headingId}
          level={title?.headingLevel}
          className="max-w-sm font-heading text-heading-2 font-medium tracking-tight md:col-span-4"
        >
          {headingText}
        </Heading>
      )}

      {hasQuestions && questions && (
        <div
          className={cn(
            cardColumnClassName,
            'min-w-0 divide-y divide-black/10 rounded-[32px] p-6 md:p-0'
          )}
        >
          {questions.map((item, index) => (
            <FaqItem
              key={item._key ?? `faq-${index}`}
              question={item.question}
              answer={item.answer}
              {...(index === 0 && { className: '[&>button]:pt-0' })}
            />
          ))}
        </div>
      )}
    </ComponentLayout>
  )
}

export default Faqs
export { Faqs }
