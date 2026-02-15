import type { CollaborateHighlightsComponent } from '@portfolio/types/components'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { RichTextSize } from '@/components/atoms/RichText/RichText'
import { Heading } from '@/components/atoms/Heading/Heading'
import { makeComponentId } from '@/utils/makeComponentId'
import { CardSpacing } from '@/components/molecules/Card/Card'
import Card from '@/components/molecules/Card/Card'

const CollaborateHighlights = ({
  _id,
  _key,
  title,
  highlights,
  sectionId,
  componentIndex,
}: CollaborateHighlightsComponent) => {
  const headingId = makeComponentId({
    value: _id || _key,
    prefix: 'collaborate-highlights',
  })

  return (
    <ComponentLayout
      sectionId={sectionId}
      componentKey={_key}
      componentIndex={componentIndex}
      aria-labelledby={headingId}
      className="text-black dark:text-foreground"
      contentClassName="gap-y-12 lg:gap-y-14"
    >
      {title?.heading && (
        <Heading
          id={headingId}
          level={title.headingLevel}
          className="md:col-span-6 font-heading text-heading-1 leading-[1.1] tracking-tight whitespace-pre-line"
        >
          {title.heading}
        </Heading>
      )}

      {highlights && highlights.length > 0 ? (
        <div className="md:col-span-12 grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-14">
          {highlights.map(
            ({ title: itemTitle, subtitle, _key: itemKey, icon }, index) => (
              <Card
                key={itemKey || `${index}-${itemTitle}`}
                title={itemTitle ?? ''}
                subtitle={subtitle}
                subtitleSize={RichTextSize.Md}
                spacing={CardSpacing.Compact}
                iconName={icon}
                iconWrapperClassName="size-12 rounded-full bg-black text-background"
                iconClassName="size-7 text-background"
                className="h-full bg-transparent shadow-none hover:translate-y-0 !rounded-none"
              />
            )
          )}
        </div>
      ) : (
        <div className="md:col-span-12 rounded-3xl border border-dashed border-black/10 bg-gray-50 px-6 py-10 text-center font-body text-body-lg text-black/60 dark:border-gray-200/40 dark:bg-gray-100 dark:text-foreground/70">
          Highlights will appear here once they are published.
        </div>
      )}
    </ComponentLayout>
  )
}

export default CollaborateHighlights
export { CollaborateHighlights }
