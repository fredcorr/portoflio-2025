import React from 'react'
import type { ArticleIntroProps as ArticleIntroSharedProps } from '@portfolio/types/components'
import { cn } from '@/utils/cn'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'

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
  author,
  className,
}) => {
  const authorName =
    [author?.firstName, author?.secondName].filter(Boolean).join(' ') ||
    'Author'
  const authorInitials =
    [author?.firstName?.[0], author?.secondName?.[0]]
      .filter(Boolean)
      .join('') || '?'
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
    <ComponentLayout
      data-organism="article-intro"
      className={cn('bg-background text-black dark:text-foreground', className)}
      contentClassName="gap-y-4 md:gap-y-6"
    >
      {/* Eyebrow */}
      <div className="md:col-span-12 flex items-center gap-3 font-heading text-[11px] uppercase tracking-[0.12em] text-black/55 dark:text-foreground/55">
        <span>Journal</span>
        {firstTag && (
          <>
            <span aria-hidden="true" className="size-1 bg-current opacity-50" />
            <span>{firstTag}</span>
          </>
        )}
        {editionLabel && (
          <>
            <span aria-hidden="true" className="size-1 bg-current opacity-50" />
            <span>{editionLabel}</span>
          </>
        )}
      </div>

      {/* Title */}
      {headline && (
        <h1
          className="md:col-span-12 max-w-[16ch] font-heading font-normal leading-[0.96] tracking-[-0.035em] text-balance text-black dark:text-foreground"
          style={{ fontSize: 'clamp(2.75rem, 8.5vw, 8rem)' }}
        >
          {headline}
        </h1>
      )}

      {/* Deck */}
      {deck && (
        <p
          className="md:col-span-12 max-w-[56ch] font-body leading-[1.45] text-black/78 dark:text-foreground/80"
          style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.4rem)' }}
        >
          {deck}
        </p>
      )}

      {/* Meta grid */}
      <dl className="md:col-span-12 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-gray-100 pt-6 dark:border-gray-100 md:grid-cols-12 md:gap-6">
        {/* Author — always present */}
        <div className="col-span-2 flex flex-col gap-1.5 md:col-span-4">
          <dt className="font-heading text-[10px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55">
            Written by
          </dt>
          <dd className="flex items-center gap-2.5 font-heading text-[15px] tracking-[-0.01em] text-black dark:text-foreground">
            <span
              aria-hidden="true"
              className="inline-flex size-9 shrink-0 items-center justify-center bg-black font-heading text-[12px] font-bold text-white dark:bg-foreground dark:text-foreground"
            >
              {authorInitials}
            </span>
            {authorName}
          </dd>
        </div>

        {/* Published */}
        {dateLabel && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <dt className="font-heading text-[10px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55">
              Published
            </dt>
            <dd className="font-heading text-[15px] tracking-[-0.01em] text-black dark:text-foreground">
              {dateLabel}
            </dd>
          </div>
        )}

        {/* Reading time */}
        {readTimeLabel && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <dt className="font-heading text-[10px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55">
              Reading time
            </dt>
            <dd className="font-heading text-[15px] tracking-[-0.01em] text-black dark:text-foreground">
              {readTimeLabel}
            </dd>
          </div>
        )}

        {/* Topics */}
        {topicsLabel && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <dt className="font-heading text-[10px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55">
              Topics
            </dt>
            <dd className="font-heading text-[15px] tracking-[-0.01em] text-black dark:text-foreground">
              {topicsLabel}
            </dd>
          </div>
        )}

        {/* Edition */}
        {editionLabel && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <dt className="font-heading text-[10px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55">
              Edition
            </dt>
            <dd className="font-heading text-[15px] tracking-[-0.01em] text-black dark:text-foreground">
              {editionLabel}
            </dd>
          </div>
        )}
      </dl>
    </ComponentLayout>
  )
}

export default ArticleIntro
export { ArticleIntro }
