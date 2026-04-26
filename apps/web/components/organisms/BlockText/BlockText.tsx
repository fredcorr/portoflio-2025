import type { BlockTextComponent } from '@portfolio/types/components'

import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { Heading, toHeadingTag } from '@/components/atoms/Heading/Heading'
import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import { makeComponentId } from '@/utils/makeComponentId'
import { cn } from '@/utils/cn'
import { FadeIn } from '@/components/animation/FadeIn/FadeIn'

const BlockText = ({
  _id,
  _key,
  title,
  body,
  isHeadingLarge,
  splitLayout,
  sectionId,
  componentIndex,
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
      sectionId={sectionId}
      componentKey={_key}
      componentIndex={componentIndex}
      {...(hasHeading && headingId && { 'aria-labelledby': headingId })}
      className={'text-black dark:text-foreground'}
      contentClassName={cn(
        'gap-y-8 md:gap-y-10',
        isSplitLayout && 'md:gap-x-10'
      )}
      data-organism="block-text"
    >
      {hasHeading && headingText && (
        <FadeIn
          id={headingId}
          as={toHeadingTag(title?.headingLevel)}
          viewport={{ once: true, amount: 0.8 }}
          className={cn(
            headingColumnClassName,
            'font-heading font-medium tracking-tight',
            usesLargeHeading && 'text-heading-2 leading-[1.2]',
            !usesLargeHeading && 'text-heading-3 leading-[1.3]'
          )}
        >
          {headingText}
        </FadeIn>
      )}

      {hasBody && body && (
        <FadeIn className={bodyColumnClassName} delay={0.25}>
          <RichText value={body} size={RichTextSize.Lg} />
        </FadeIn>
      )}
    </ComponentLayout>
  )
}

export default BlockText
export { BlockText }
