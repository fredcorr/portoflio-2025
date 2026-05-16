import React from 'react'
import type { ArticleIntroProps } from '@portfolio/types/components'
import { cn } from '@/utils/cn'

export interface ArticleMetaProps
  extends Pick<
    ArticleIntroProps,
    'author' | 'dateLabel' | 'readTimeLabel' | 'tags' | 'editionNumber'
  > {
  className?: string
}

function padEdition(n: number): string {
  return String(n).padStart(3, '0')
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({
  author,
  dateLabel,
  readTimeLabel,
  tags,
  editionNumber,
  className,
}) => {
  const authorName =
    [author?.firstName, author?.secondName].filter(Boolean).join(' ') ||
    'Author'
  const authorInitials =
    [author?.firstName?.[0], author?.secondName?.[0]]
      .filter(Boolean)
      .join('') || '?'
  const year = dateLabel
    ? new Date(dateLabel).getFullYear()
    : new Date().getFullYear()
  const editionLabel =
    editionNumber != null
      ? `N° ${padEdition(editionNumber)} / ${year}`
      : undefined
  const topicsLabel = tags?.join(', ')

  return (
    <dl
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-5 border-t border-gray-100 pt-6 dark:border-gray-100 md:grid-cols-12 md:gap-6',
        className
      )}
    >
      {/* Author */}
      <div className="col-span-2 flex flex-col gap-1.5 md:col-span-4">
        <dt className="font-heading text-[10px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55">
          Written by
        </dt>
        <dd className="flex items-center gap-2.5 font-heading text-[15px] tracking-[-0.01em] text-black dark:text-foreground">
          <span
            aria-hidden="true"
            className="inline-flex size-9 shrink-0 items-center justify-center bg-black font-heading text-[12px] font-bold text-white dark:bg-foreground dark:text-background"
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
  )
}

export default ArticleMeta
export { ArticleMeta }
