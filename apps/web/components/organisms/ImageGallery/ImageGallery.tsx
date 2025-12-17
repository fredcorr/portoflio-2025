import React from 'react'
import type { ImageGalleryComponent } from '@portfolio/types/components'

import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { Heading } from '@/components/atoms/Heading/Heading'
import Image from '@/components/atoms/Image/Image'
import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import { cn } from '@/utils/cn'
import { makeComponentId } from '@/utils/makeComponentId'

// Figma annotations:
// - ImageGallery component (node-id: 3591:2302)
// - Variants: "Default" (2-up tiles) and "Variant2" (single tile)

export interface ImageGalleryProps extends ImageGalleryComponent {}

const ImageGallery = ({
  _id,
  _key,
  title,
  subtitle,
  images,
}: ImageGalleryProps) => {
  const galleryImages = (Array.isArray(images) && images) || []
  const galleryImagesWithUrl = galleryImages.filter(image =>
    Boolean(image.asset?.url)
  )
  const hasHeading = Boolean(title?.heading)
  const hasSubtitle = Boolean(subtitle && subtitle.length)
  const headingId = makeComponentId({
    value: _id || _key,
    prefix: 'image-gallery',
  })

  const isSingleImage = galleryImagesWithUrl.length === 1
  const hasOddImages = galleryImagesWithUrl.length % 2 === 1

  return (
    <ComponentLayout
      aria-labelledby={(hasHeading && headingId) || undefined}
      className="py-[72px] px-4 md:px-8 lg:px-[112px]"
      contentClassName="gap-y-12 md:gap-y-12"
    >
      {(hasHeading || hasSubtitle) && (
        <div className="md:col-span-12 flex flex-col gap-4 text-black dark:text-foreground">
          {hasHeading && (
            <Heading
              id={headingId}
              level={title?.headingLevel}
              className="font-heading text-heading-2 font-semibold leading-tight tracking-tight"
            >
              {title?.heading}
            </Heading>
          )}
          {hasSubtitle && subtitle && (
            <RichText
              value={subtitle}
              size={RichTextSize.Xl}
              className="max-w-3xl text-black/70 dark:text-foreground/80"
            />
          )}
        </div>
      )}

      {galleryImagesWithUrl.length > 0 && (
        <div
          className={cn(
            'md:col-span-12 grid grid-cols-1 gap-8',
            !isSingleImage && 'lg:grid-cols-2'
          )}
        >
          {galleryImagesWithUrl.map((image, index) => {
            const isLastOddItem =
              hasOddImages && index === galleryImagesWithUrl.length - 1
            const src = image.asset?.url
            const dimensions = image.asset?.metadata?.dimensions
            const altText = image.alt || 'Project gallery image'

            return (
              <div
                key={(src && src) || `${_key || _id || 'image'}-${index}`}
                className={cn('min-w-0', isLastOddItem && 'lg:col-span-2')}
              >
                {src && (
                  <Image
                    src={src}
                    alt={altText}
                    width={dimensions?.width}
                    height={dimensions?.height}
                    sizes={
                      (isSingleImage && '(min-width: 1024px) 1216px, 100vw') ||
                      (isLastOddItem && '(min-width: 1024px) 1216px, 100vw') ||
                      '(min-width: 1024px) 592px, 100vw'
                    }
                    className="h-auto w-full object-contain"
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </ComponentLayout>
  )
}

export default ImageGallery
export { ImageGallery }
