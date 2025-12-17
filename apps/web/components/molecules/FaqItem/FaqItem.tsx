import React from 'react'
import type { FaqItem as FaqItemShared } from '@portfolio/types/components'

import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import { cn } from '@/utils/cn'

// Figma annotations:
// - FAQ item patterns (node-id: 75:1735, 3594:2406)
// - States: collapsed (plus) and expanded (minus)
// - Interaction: native disclosure via <details>/<summary> (no client JS)

export interface FaqItemProps extends FaqItemShared {
  className?: string
}

const FaqItem = ({ question, answer, className }: FaqItemProps) => {
  const hasQuestion = Boolean(question)
  const hasAnswer = Boolean(answer && answer.length)

  if (!hasQuestion && !hasAnswer) {
    return null
  }

  return (
    <details className={cn('group w-full', className)} data-molecule="faq-item">
      <summary
        className={cn(
          'flex w-full cursor-pointer list-none items-center justify-between gap-6 pt-10 pb-10 text-left text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:text-foreground dark:focus-visible:outline-foreground',
          'group-open:pb-0',
          '[&::-webkit-details-marker]:hidden'
        )}
      >
        {hasQuestion && (
          <span className="font-heading text-heading-5 font-medium tracking-tight">
            {question}
          </span>
        )}

        <span
          aria-hidden="true"
          className="relative inline-flex size-10 shrink-0 items-center justify-center"
        >
          <span className="absolute h-px w-4 bg-current" />
          <span className="absolute h-4 w-px bg-current transition-transform duration-200 group-open:scale-y-0" />
        </span>
      </summary>

      {hasAnswer && answer && (
        <div
          className={cn(
            'grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out',
            'motion-reduce:transition-none',
            'group-open:grid-rows-[1fr]'
          )}
        >
          <div className="overflow-hidden">
            <div
              className={cn(
                'pt-9 pb-10 text-black transition-[opacity,transform] duration-300 ease-out dark:text-foreground',
                'motion-reduce:transition-none motion-reduce:transform-none',
                'opacity-0 translate-y-2',
                'group-open:opacity-100 group-open:translate-y-0'
              )}
            >
              <RichText
                value={answer}
                size={RichTextSize.Xl}
                className="md:pr-10"
              />
            </div>
          </div>
        </div>
      )}
    </details>
  )
}

export default FaqItem
export { FaqItem }
