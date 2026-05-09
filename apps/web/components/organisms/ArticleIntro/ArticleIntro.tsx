import React from 'react'
import type { ArticleIntroProps as ArticleIntroSharedProps } from '@portfolio/types/components'
import { cn } from '@/utils/cn'

export interface ArticleIntroProps extends ArticleIntroSharedProps {
  className?: string
}

function padEdition(n: number): string {
  return String(n).padStart(3, '0')
}

const ArticleIntro: React.FC<ArticleIntroProps> = ({
  title,
  dateLabel,
  readTimeLabel,
  tags,
  deck,
  editionNumber,
  className,
}) => {
  const headline = title?.trim()
  const firstTag = tags?.[0]
  const year = dateLabel
    ? new Date(dateLabel).getFullYear()
    : new Date().getFullYear()
  const editionLabel =
    editionNumber != null
      ? `N° ${padEdition(editionNumber)} / ${year}`
      : undefined
  const topicsLabel = tags?.join(', ')

  return (
    <section
      data-organism="article-intro"
      className={cn('bg-background text-black dark:text-foreground', className)}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-24 pb-10 md:px-8 md:pt-28 md:pb-12 xl:px-28 xl:pt-32 xl:pb-[60px]">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3 font-heading text-[11px] uppercase tracking-[0.12em] text-black/55 dark:text-foreground/55">
          <span>Journal</span>
          {firstTag && (
            <>
              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-current opacity-50"
              />
              <span>{firstTag}</span>
            </>
          )}
          {editionLabel && (
            <>
              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-current opacity-50"
              />
              <span>{editionLabel}</span>
            </>
          )}
        </div>

        {/* Title */}
        {headline && (
          <h1
            className="mb-6 max-w-[16ch] font-heading font-normal leading-[0.96] tracking-[-0.035em] text-balance text-black dark:text-foreground"
            style={{ fontSize: 'clamp(2.75rem, 8.5vw, 8rem)' }}
          >
            {headline}
          </h1>
        )}

        {/* Deck */}
        {deck && (
          <p
            className="mb-12 max-w-[56ch] font-body leading-[1.45] text-black/78 dark:text-foreground/80"
            style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.4rem)' }}
          >
            {deck}
          </p>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-t border-gray-100 pt-6 dark:border-gray-100 md:grid-cols-12 md:gap-6">
          {/* Author — always present */}
          <div className="col-span-2 flex flex-col gap-1.5 md:col-span-4">
            <span className="font-heading text-[10px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55">
              Written by
            </span>
            <span className="flex items-center gap-2.5 font-heading text-[15px] tracking-[-0.01em] text-black dark:text-foreground">
              <span
                aria-hidden="true"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-black font-heading text-[12px] font-bold text-white dark:bg-foreground dark:text-black"
              >
                FC
              </span>
              Federico Corradi
            </span>
          </div>

          {/* Published */}
          {dateLabel && (
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <span className="font-heading text-[10px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55">
                Published
              </span>
              <span className="font-heading text-[15px] tracking-[-0.01em] text-black dark:text-foreground">
                {dateLabel}
              </span>
            </div>
          )}

          {/* Reading time */}
          {readTimeLabel && (
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <span className="font-heading text-[10px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55">
                Reading time
              </span>
              <span className="font-heading text-[15px] tracking-[-0.01em] text-black dark:text-foreground">
                {readTimeLabel}
              </span>
            </div>
          )}

          {/* Topics */}
          {topicsLabel && (
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <span className="font-heading text-[10px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55">
                Topics
              </span>
              <span className="font-heading text-[15px] tracking-[-0.01em] text-black dark:text-foreground">
                {topicsLabel}
              </span>
            </div>
          )}

          {/* Edition */}
          {editionLabel && (
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <span className="font-heading text-[10px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55">
                Edition
              </span>
              <span className="font-heading text-[15px] tracking-[-0.01em] text-black dark:text-foreground">
                {editionLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ArticleIntro
export { ArticleIntro }
