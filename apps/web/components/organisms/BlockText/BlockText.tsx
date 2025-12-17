import React from 'react'
import type { BlockTextComponent } from '@portfolio/types/components'

import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { Heading } from '@/components/atoms/Heading/Heading'
import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import { makeComponentId } from '@/utils/makeComponentId'
import { cn } from '@/utils/cn'

const BlockText = ({
  _id,
  _key,
  title,
  body,
  isHeadingLarge,
  splitLayout,
}: BlockTextComponent) => {
  const headingText = title?.heading
  const hasHeading = Boolean(headingText)
  const hasBody = Boolean(body && body.length)
  const isSplitLayout = Boolean(splitLayout)
  const usesLargeHeading = Boolean(isHeadingLarge)
  const headingId = makeComponentId({
    value: _id || _key || headingText,
    prefix: 'block-text',
  })

  if (!hasHeading && !hasBody) {
    return null
  }

  const headingColumnClassName = cn(
    isSplitLayout && 'md:col-span-5',
    !isSplitLayout && 'md:col-span-9'
  )
  const bodyColumnClassName = cn(
    isSplitLayout && 'md:col-span-6 md:col-start-7',
    !isSplitLayout && 'md:col-span-9'
  )

  return (
    <ComponentLayout
      {...(hasHeading && headingId && { 'aria-labelledby': headingId })}
      className={'text-black dark:text-foreground'}
      contentClassName={cn(
        'gap-y-8 md:gap-y-10',
        isSplitLayout && 'md:gap-x-10'
      )}
      data-organism="block-text"
    >
      {hasHeading && headingText && (
        <Heading
          id={headingId}
          level={title?.headingLevel}
          className={cn(
            headingColumnClassName,
            'font-heading font-medium tracking-tight',
            usesLargeHeading && 'text-heading-2 leading-[1.2]',
            !usesLargeHeading && 'text-heading-3 leading-[1.3]'
          )}
        >
          {headingText}
        </Heading>
      )}

      {hasBody && body && (
        <RichText
          value={body}
          size={RichTextSize.Lg}
          className={bodyColumnClassName}
        />
      )}
    </ComponentLayout>
  )
}

export default BlockText
export { BlockText }
