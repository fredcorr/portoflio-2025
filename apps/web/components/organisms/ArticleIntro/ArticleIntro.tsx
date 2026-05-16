import React from 'react'
import type { ArticleIntroProps as ArticleIntroSharedProps } from '@portfolio/types/components'
import { cn } from '@/utils/cn'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import ArticleMeta from '@/components/organisms/ArticleMeta/ArticleMeta'

export interface ArticleIntroProps extends ArticleIntroSharedProps {
  className?: string
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
  const headline = title?.trim()
  const firstTag = tags?.[0]
  const year = dateLabel
    ? new Date(dateLabel).getFullYear()
    : new Date().getFullYear()
  const editionLabel =
    editionNumber != null
      ? `N° ${String(editionNumber).padStart(3, '0')} / ${year}`
      : undefined

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

      {/* Meta — desktop only; mobile instance is rendered in the template after content */}
      <ArticleMeta
        author={author}
        dateLabel={dateLabel}
        readTimeLabel={readTimeLabel}
        tags={tags}
        editionNumber={editionNumber}
        className="md:col-span-12 hidden md:block"
      />
    </ComponentLayout>
  )
}

export default ArticleIntro
export { ArticleIntro }
