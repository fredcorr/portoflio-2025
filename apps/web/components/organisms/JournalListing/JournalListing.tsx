import type { JournalListingComponent } from '@portfolio/types/components'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { toHeadingTag } from '@/components/atoms/Heading/Heading'
import JournalListingClient from '@/components/hoc/JournalListingClient'
import { makeComponentId } from '@/utils/makeComponentId'
import { SlideIn } from '@/components/animation/SlideIn/SlideIn'
import { FadeIn } from '@/components/animation/FadeIn/FadeIn'

export default function JournalListing({
  _id,
  _key,
  sectionId,
  componentIndex,
  kicker,
  title,
  initialData,
}: JournalListingComponent) {
  const headingId = makeComponentId({
    value: _id || _key,
    prefix: 'journal-listing',
  })

  const total = initialData?.total ?? 0

  return (
    <ComponentLayout
      sectionId={sectionId}
      componentKey={_key}
      componentIndex={componentIndex}
      overflowHidden={false}
      contentClassName="col-span-full flex flex-col"
      aria-labelledby={headingId}
    >
      <div className="grid grid-cols-[1fr_auto] items-end gap-8 border-b border-foreground/10 pb-10 pt-4">
        <div className="flex flex-col gap-5">
          {kicker && (
            <SlideIn
              delay={0.1}
              as="span"
              className="inline-flex items-center gap-2.5 font-heading text-[11px] uppercase tracking-[0.14em] text-foreground/55 before:block before:size-1.5 before:rounded-full before:bg-foreground/50"
            >
              {kicker}
            </SlideIn>
          )}

          {title?.heading && (
            <SlideIn
              delay={0.2}
              as={toHeadingTag(title.headingLevel)}
              id={headingId}
              className="font-heading text-[clamp(3rem,8vw,7rem)] font-normal leading-[0.95] tracking-[-0.035em] text-balance"
            >
              {title.heading}
            </SlideIn>
          )}
        </div>

        <FadeIn
          as="p"
          delay={0.35}
          className="self-start pt-2 text-right"
        >
          <strong className="block font-heading text-[44px] font-normal leading-none tracking-[-0.03em]">
            {total}
          </strong>
          <span className="font-heading text-[11px] tracking-[0.06em] text-foreground/55">
            entries
          </span>
        </FadeIn>
      </div>

      {initialData && (
        <JournalListingClient initialData={initialData} apiEndpoint="/api/journal" />
      )}
    </ComponentLayout>
  )
}
