import React from 'react'
import type { ArticleContentProps as ArticleContentSharedProps } from '@portfolio/types/components'
import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import Icon from '@/components/atoms/Icon/Icon'
import { cn } from '@/utils/cn'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import Shares from '@/components/molecules/Shares/Shares'
import ArticleMeta from '@/components/molecules/ArticleMeta/ArticleMeta'

export interface ArticleContentProps extends ArticleContentSharedProps {
  className?: string
}

const ArticleContent: React.FC<ArticleContentProps> = ({
  content,
  shareUrl,
  shareTitle,
  tags,
  author,
  dateLabel,
  readTimeLabel,
  editionNumber,
  showReaderCount = false,
  prevUrl,
  nextUrl,
  className,
}) => {
  const hasContent = Boolean(content && content.length)
  const hasShare = shareUrl && shareTitle
  const hasNav = Boolean(prevUrl || nextUrl)

  if (!hasContent) return null

  return (
    <ComponentLayout
      data-organism="article-content"
      overflowHidden={false}
      className={cn('bg-background text-black dark:text-foreground', className)}
      contentClassName="gap-y-10 md:gap-y-12"
    >
      {/* Body + share rail */}
      <div
        className={
          'md:col-span-12 grid gap-8 md:grid-cols-[56px_1fr] xl:grid-cols-[80px_1fr]'
        }
        // style={{ counterReset: 'chapter' }}
      >
        {!!hasShare && (
          <Shares
            shareUrl={shareUrl}
            shareTitle={shareTitle}
            showReaderCount={showReaderCount}
          />
        )}
        {/* Body */}
        {hasContent && (
          <div className={'max-w-[100ch] mx-auto'}>
            <RichText
              value={content ?? []}
              size={RichTextSize.Lg}
              className="text-black dark:text-foreground"
              components={{
                block: {
                  h2: ({ children }) => (
                    <div
                      className="mt-16 mb-6 first:mt-0"
                      style={{ counterIncrement: 'chapter' }}
                    >
                      <div
                        className="mb-3 flex items-center gap-3.5 font-heading text-[11px] uppercase tracking-[0.18em] text-black/55 dark:text-foreground/55"
                        aria-hidden="true"
                        style={
                          {
                            '--tw-content': 'counter(chapter, decimal)',
                          } as React.CSSProperties
                        }
                      >
                        <span className="chapter-label" />
                        <span className="h-px flex-1 bg-current opacity-30" />
                      </div>
                      <h2
                        className="font-heading font-normal leading-[1.1] tracking-[-0.025em] text-black dark:text-foreground text-balance"
                        style={{ fontSize: 'clamp(1.75rem, 3.4vw, 2.6rem)' }}
                      >
                        {children}
                      </h2>
                    </div>
                  ),
                  blockquote: ({ children }) => (
                    <div className="my-12">
                      <blockquote
                        className="font-heading font-normal leading-[1.15] tracking-[-0.025em] text-black dark:text-foreground text-balance"
                        style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}
                      >
                        <span
                          aria-hidden="true"
                          className="mr-0.5 align-[-0.18em] text-[1.2em] leading-none"
                        >
                          {'"'}
                        </span>
                        {children}
                      </blockquote>
                    </div>
                  ),
                },
              }}
            />

            {/* End mark */}
            <div
              aria-hidden="true"
              className="my-14 text-center font-heading text-[11px] uppercase tracking-[0.18em] text-black/55 dark:text-foreground/55"
            >
              <span className="mb-3 block text-sm leading-none">■</span>
              End
            </div>
          </div>
        )}
      </div>

      {/* Sign-off bar */}
      <div className="md:col-span-12 grid grid-cols-1 items-center gap-6 border-b border-t border-gray-100 py-10 dark:border-gray-100 md:grid-cols-2">
        {/* Tag pills */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-start gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center border border-gray-100 px-3.5 py-2 font-heading text-[12px] text-black/78 dark:border-gray-100 dark:text-foreground/78"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Prev / next */}
        {hasNav && (
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {prevUrl && (
              <a
                href={prevUrl}
                aria-label="Previous article"
                className="inline-flex items-center gap-2 border border-gray-100 px-4 py-3 font-heading text-[13px] text-black dark:border-gray-100 dark:text-foreground transition hover:-translate-y-0.5"
              >
                <Icon name="chevron-left" className="size-3.5" />
                Previous
              </a>
            )}
            {nextUrl && (
              <a
                href={nextUrl}
                aria-label="Next article"
                className="inline-flex items-center gap-2 border border-gray-100 px-4 py-3 font-heading text-[13px] text-black dark:border-gray-100 dark:text-foreground transition hover:-translate-y-0.5"
              >
                Next
                <Icon name="chevron-right" className="size-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Meta — mobile only; desktop instance lives inside ArticleIntro */}
      <ArticleMeta
        author={author}
        dateLabel={dateLabel}
        readTimeLabel={readTimeLabel}
        tags={tags}
        editionNumber={editionNumber}
        className="md:col-span-12 md:hidden"
      />
    </ComponentLayout>
  )
}

export default ArticleContent
export { ArticleContent }
