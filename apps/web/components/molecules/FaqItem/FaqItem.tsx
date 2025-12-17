'use client'

import React from 'react'
import type { FaqItem as FaqItemShared } from '@portfolio/types/components'

import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import { makeComponentId } from '@/utils/makeComponentId'
import { useResizeObserver } from '@/hooks/use-resize-observer'
import { cn } from '@/utils/cn'

// Figma annotations:
// - FAQ item patterns (node-id: 75:1735, 3594:2406)
// - States: collapsed (plus) and expanded (minus)
// - Interaction: animated accordion (client-controlled for smooth transitions)

export interface FaqItemProps extends FaqItemShared {
  className?: string
}

const FaqItem = ({ _key, question, answer, className }: FaqItemProps) => {
  const hasQuestion = Boolean(question)
  const hasAnswer = Boolean(answer && answer.length)
  const [isOpen, setIsOpen] = React.useState(false)
  const [contentElement, setContentElement] =
    React.useState<HTMLDivElement | null>(null)
  const [contentHeight, setContentHeight] = React.useState(0)
  const reactId = React.useId()
  const baseId =
    makeComponentId({
      value: _key || question,
      prefix: 'faq-item',
      fallback: reactId,
    }) || reactId
  const buttonId = `${baseId}-trigger`
  const contentId = `${baseId}-content`

  if (!hasQuestion && !hasAnswer) {
    return null
  }

  const updateContentHeight = React.useCallback(() => {
    contentElement && setContentHeight(contentElement.scrollHeight)
  }, [contentElement])

  useResizeObserver({
    element: contentElement,
    disabled: !hasAnswer || !isOpen,
    onResize: updateContentHeight,
  })

  return (
    <div className={cn('w-full', className)} data-molecule="faq-item">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={(hasAnswer && contentId) || undefined}
        onClick={() => {
          updateContentHeight()
          setIsOpen(current => !current)
        }}
        className={cn(
          'flex w-full items-center justify-between gap-6 pt-10 pb-10 text-left text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:text-foreground dark:focus-visible:outline-foreground',
          isOpen && 'pb-0'
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
          <span
            className={cn(
              'absolute h-4 w-px bg-current transition-transform duration-200',
              'motion-reduce:transition-none',
              isOpen && 'scale-y-0'
            )}
          />
        </span>
      </button>

      {hasAnswer && answer && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={buttonId}
          className={cn(
            'overflow-hidden transition-[max-height] duration-300 ease-out',
            'motion-reduce:transition-none'
          )}
          style={{ maxHeight: (isOpen && contentHeight) || 0 }}
        >
          <div
            ref={setContentElement}
            className={cn(
              'pt-9 pb-10 text-black transition-[opacity,transform] duration-300 ease-out dark:text-foreground',
              'motion-reduce:transition-none motion-reduce:transform-none',
              !isOpen && 'opacity-0 translate-y-2',
              isOpen && 'opacity-100 translate-y-0'
            )}
          >
            <RichText
              value={answer}
              size={RichTextSize.Xl}
              className="md:pr-10"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default FaqItem
export { FaqItem }
