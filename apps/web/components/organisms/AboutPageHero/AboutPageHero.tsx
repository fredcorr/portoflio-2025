import type { AboutPageHeroComponent } from '@portfolio/types/components'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { Heading } from '@/components/atoms/Heading/Heading'
import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import Image from '@/components/atoms/Image/Image'
import { makeComponentId } from '@/utils/makeComponentId'
import { getContactEmail } from '@/utils/get-contact-email'
import Icon from '@/components/atoms/Icon/Icon'
import { cn } from '@/utils/cn'

const AboutPageHero = ({
  _id,
  _key,
  title,
  image,
  body,
  showCta,
}: AboutPageHeroComponent) => {
  const headingId = makeComponentId({
    value: _id || _key,
    prefix: 'about-hero',
  })
  const headline = title?.heading?.trim()
  const headingLevel = title?.headingLevel
  const contactEmail = showCta && getContactEmail()
  const hasImage = Boolean(image?.asset?.url)

  return (
    <ComponentLayout
      aria-labelledby={headingId}
      className="text-black dark:text-foreground"
      contentClassName="gap-y-10 lg:gap-y-14"
      overflowHidden={false}
    >
      <div className="md:col-span-12 grid grid-cols-1 items-start gap-8 md:grid-cols-12 lg:gap-10">
        <div className="md:col-span-7 lg:col-span-7">
          {headline && (
            <Heading
              id={headingId}
              level={headingLevel}
              className="font-heading text-display-2xl font-semibold leading-[0.95] tracking-tight whitespace-pre-line"
            >
              {headline}
            </Heading>
          )}
        </div>

        {hasImage && (
          <div className="md:col-span-5 flex items-start justify-center md:justify-end">
            <Image
              src={image?.asset?.url as string}
              alt={image?.alt || ''}
              width={image?.asset?.metadata?.dimensions?.width}
              height={image?.asset?.metadata?.dimensions?.height}
              priority
              className="object-cover"
              wrapperClassName="w-full max-w-[440px] rounded-[64px]"
            />
          </div>
        )}
      </div>

      <div className="md:col-span-9 lg:col-span-8">
        {body && (
          <RichText
            value={body}
            size={RichTextSize.Md}
            className="space-y-4 text-black/80 dark:text-foreground/80"
          />
        )}
      </div>

      <div className="md:col-span-3 lg:col-span-3 md:col-start-10 flex md:justify-end">
        {contactEmail && (
          <a
            href={`mailto:${contactEmail}`}
            className={cn(
              'inline-flex items-center gap-3 rounded-full bg-gray-50 px-6 py-3 font-heading text-body-lg font-medium text-black shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:ring-black/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black',
              'dark:bg-gray-100 dark:text-black'
            )}
          >
            <span>{contactEmail}</span>
            <Icon name="arrow-up-right" className="size-5" title="Email" />
          </a>
        )}
      </div>
    </ComponentLayout>
  )
}

export default AboutPageHero
export { AboutPageHero }
