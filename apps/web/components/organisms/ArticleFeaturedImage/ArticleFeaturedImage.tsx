import React from 'react'
import type { ArticleFeaturedImageProps } from '@portfolio/types/components'
import Image from '@/components/atoms/Image/Image'
import { cn } from '@/utils/cn'

interface Props extends ArticleFeaturedImageProps {
  className?: string
}

const ArticleFeaturedImage: React.FC<Props> = ({ heroImage, className }) => {
  const imageUrl = heroImage?.asset?.url
  if (!imageUrl) return null

  const imageAlt = heroImage?.alt || ''

  return (
    <figure
      data-organism="article-featured-image"
      aria-label="Featured image"
      className={cn('px-4 md:px-8 xl:px-28', className)}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="relative aspect-video overflow-hidden rounded-[32px] bg-primary-600">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1440px) 1440px, 100vw"
            className="object-cover"
            wrapperClassName="absolute inset-0"
          />
        </div>
        {imageAlt && (
          <figcaption className="mt-3.5 flex items-center justify-between gap-4 font-heading text-[11px] uppercase tracking-[0.12em] text-black/55 dark:text-foreground/55">
            <span>{imageAlt}</span>
          </figcaption>
        )}
      </div>
    </figure>
  )
}

export default ArticleFeaturedImage
export { ArticleFeaturedImage }
