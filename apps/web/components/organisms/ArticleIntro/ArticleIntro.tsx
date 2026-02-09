import React from 'react'
import type { ArticleIntroProps as ArticleIntroSharedProps } from '@portfolio/types/components'
import Image from '@/components/atoms/Image/Image'
import { cn } from '@/utils/cn'

export interface ArticleIntroProps extends ArticleIntroSharedProps {
  className?: string
}

const ArticleIntro: React.FC<ArticleIntroProps> = ({
  title,
  dateLabel,
  readTimeLabel,
  tags,
  heroImage,
  className,
}) => {
  const headline = title?.trim()
  const imageUrl = heroImage?.asset?.url
  const imageAlt = heroImage?.alt || headline || ''
  const hasMeta = Boolean(dateLabel || readTimeLabel)
  const hasTags = Boolean(tags && tags.length)
  const hasImage = Boolean(imageUrl)

  return (
    <section
      data-organism="article-intro"
      data-development="Figma: Article intro with meta, tags, and hero image."
      className={cn('bg-background text-black dark:text-foreground', className)}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 md:py-12 xl:px-28 xl:py-[73px]">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12 xl:gap-[35px]">
          <div className="md:col-span-6 flex flex-col gap-4">
            {hasMeta && (
              <div className="flex flex-wrap items-center gap-2 font-body text-body-md text-black/80 dark:text-foreground/80">
                {dateLabel && <span>{dateLabel}</span>}
                {dateLabel && readTimeLabel && (
                  <span aria-hidden="true">•</span>
                )}
                {readTimeLabel && <span>{readTimeLabel}</span>}
              </div>
            )}

            {headline && (
              <h1 className="font-display text-heading-1 font-normal leading-[1.1] tracking-tight text-black dark:text-foreground md:text-heading-1 xl:text-[64px]">
                {headline}
              </h1>
            )}

            {hasTags && (
              <ul className="flex flex-wrap items-center gap-2">
                {tags?.map((tag, index) => {
                  const label = typeof tag === 'string' ? tag : ''

                  return (
                    label && (
                      <li key={`${label}-${index}`}>
                        <span className="inline-flex items-center rounded-[8px] bg-gray-50 px-3 py-1 text-sm font-body text-black/80 dark:bg-surface-2 dark:text-foreground/80">
                          {label}
                        </span>
                      </li>
                    )
                  )
                })}
              </ul>
            )}
          </div>

          {hasImage && imageUrl && (
            <div className="md:col-span-6 md:justify-self-end">
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={heroImage?.asset?.metadata?.dimensions?.width}
                height={heroImage?.asset?.metadata?.dimensions?.height}
                sizes="(min-width: 1280px) 589px, (min-width: 768px) 50vw, 100vw"
                wrapperClassName="w-full max-w-[589px]"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ArticleIntro
export { ArticleIntro }
