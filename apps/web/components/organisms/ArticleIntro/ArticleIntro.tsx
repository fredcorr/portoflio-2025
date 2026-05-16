import React from 'react'
import type { ArticleIntroProps as ArticleIntroSharedProps } from '@portfolio/types/components'
import { cn } from '@/utils/cn'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import ArticleMeta from '@/components/molecules/ArticleMeta/ArticleMeta'
import { FadeIn } from '@/components/animation/FadeIn/FadeIn'

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
      <FadeIn
        as="div"
        duration={0.6}
        delay={0}
        viewport={{ once: true, amount: 0.3 }}
        className="md:col-span-12 flex items-center gap-3 font-heading text-[11px] uppercase tracking-[0.12em] text-black/55 dark:text-foreground/55"
      >
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
      </FadeIn>

      {/* Title */}
      {headline && (
        <FadeIn
          as="h1"
          duration={0.6}
          delay={0.1}
          viewport={{ once: true, amount: 0.3 }}
          className="md:col-span-12 max-w-[16ch] font-heading font-normal leading-[0.96] tracking-[-0.035em] text-balance text-black dark:text-foreground"
          style={{ fontSize: 'clamp(2.75rem, 8.5vw, 8rem)' }}
        >
          {headline}
        </FadeIn>
      )}

      {/* Deck */}
      {deck && (
        <FadeIn
          as="p"
          duration={0.6}
          delay={0.2}
          viewport={{ once: true, amount: 0.3 }}
          className="md:col-span-12 max-w-[56ch] font-body leading-[1.45] text-black/78 dark:text-foreground/80"
          style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.4rem)' }}
        >
          {deck}
        </FadeIn>
      )}

      {/* Meta — desktop only; mobile instance is rendered in ArticleContent */}
      <FadeIn
        duration={0.6}
        delay={0.3}
        viewport={{ once: true, amount: 0.3 }}
        className="md:col-span-12 hidden md:block"
      >
        <ArticleMeta
          author={author}
          dateLabel={dateLabel}
          readTimeLabel={readTimeLabel}
          tags={tags}
          editionNumber={editionNumber}
        />
      </FadeIn>
    </ComponentLayout>
  )
}

export default ArticleIntro
export { ArticleIntro }
