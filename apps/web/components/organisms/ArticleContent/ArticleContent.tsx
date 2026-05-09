'use client'

import React from 'react'
import type { ArticleContentProps as ArticleContentSharedProps } from '@portfolio/types/components'
import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import Icon from '@/components/atoms/Icon/Icon'
import { cn } from '@/utils/cn'

export interface ArticleContentProps extends ArticleContentSharedProps {
  className?: string
}

interface ShareItem {
  label: string
  icon: string
  href?: string
  onClick?: () => void
}

function buildShareItems(shareUrl?: string, shareTitle?: string): ShareItem[] {
  if (!shareUrl) return []

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = shareTitle ? encodeURIComponent(shareTitle) : undefined

  return [
    {
      label: 'LinkedIn',
      icon: 'linkedin',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'X',
      icon: 'twitter',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}${encodedTitle ? `&text=${encodedTitle}` : ''}`,
    },
    {
      label: 'Facebook',
      icon: 'facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ]
}

const ArticleContent: React.FC<ArticleContentProps> = ({
  content,
  shareUrl,
  shareTitle,
  tags,
  className,
}) => {
  const hasContent = Boolean(content && content.length)
  const [copied, setCopied] = React.useState(false)
  const shareItems = buildShareItems(shareUrl, shareTitle)
  const hasShare = Boolean(shareUrl)

  const handleCopy = React.useCallback(async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }, [shareUrl])

  const allShareActions: ShareItem[] = hasShare
    ? [
        ...shareItems,
        {
          label: copied ? 'Copied!' : 'Copy link',
          icon: copied ? 'check' : 'link',
          onClick: handleCopy,
        },
        { label: 'Bookmark', icon: 'bookmark' },
      ]
    : []

  if (!hasContent && !hasShare) return null

  const railBtn =
    'inline-flex size-10 items-center justify-center rounded-[12px] bg-surface-2 border border-transparent text-black/78 dark:text-foreground/78 transition hover:-translate-y-0.5 hover:text-black hover:border-gray-100 dark:hover:text-foreground dark:hover:border-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:focus-visible:outline-white'

  return (
    <section
      data-organism="article-content"
      className={cn('bg-background text-black dark:text-foreground', className)}
    >
      {/* ── Body + share rail ─────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-0 pt-10 md:px-8 md:pt-12 xl:px-28 xl:pt-[60px]">
        <div
          className={cn(
            'grid gap-8',
            hasShare
              ? 'xl:grid-cols-[1fr_2.4fr_1fr] md:grid-cols-[56px_1fr]'
              : 'grid-cols-1'
          )}
          style={{ counterReset: 'chapter' }}
        >
          {/* Share rail */}
          {hasShare && (
            <aside
              aria-label="Article actions"
              className="md:sticky md:top-24 md:self-start md:pt-1.5"
            >
              <div className="flex flex-row items-center gap-2 md:flex-col md:items-start md:gap-3">
                <span className="hidden font-heading text-[10px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55 md:mb-1.5 md:block">
                  Share
                </span>

                {allShareActions.map(action => {
                  const isButton =
                    typeof action.onClick === 'function' || !action.href
                  return (
                    <React.Fragment key={action.label}>
                      {isButton ? (
                        <button
                          type="button"
                          aria-label={action.label}
                          onClick={action.onClick}
                          className={railBtn}
                        >
                          <Icon
                            name={action.icon}
                            className="size-4"
                            title={action.label}
                          />
                        </button>
                      ) : (
                        <a
                          href={action.href}
                          aria-label={action.label}
                          target="_blank"
                          rel="noreferrer"
                          className={railBtn}
                        >
                          <Icon
                            name={action.icon}
                            className="size-4"
                            title={action.label}
                          />
                        </a>
                      )}
                    </React.Fragment>
                  )
                })}

                {/* Divider + reader count (desktop only, decorative) */}
                <span
                  aria-hidden="true"
                  className="my-1.5 hidden h-px w-6 bg-black/55 opacity-40 dark:bg-foreground/55 md:block"
                />
                <span
                  aria-hidden="true"
                  className="hidden font-heading text-[11px] tracking-[0.04em] text-black/55 dark:text-foreground/55 md:block"
                >
                  <strong className="block font-heading text-[22px] font-normal leading-none tracking-[-0.02em] text-black dark:text-foreground">
                    248
                  </strong>
                  readers
                </span>
              </div>
            </aside>
          )}

          {/* Body */}
          {hasContent && (
            <div className={cn('max-w-[64ch]', !hasShare && 'mx-auto w-full')}>
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
                            {'“'}
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

          {/* Right spacer for 3-col balance */}
          <div className="hidden xl:block" aria-hidden="true" />
        </div>
      </div>

      {/* ── Sign-off bar ──────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-28">
        <div className="grid grid-cols-1 items-center gap-6 border-b border-t border-gray-100 py-10 dark:border-gray-100 md:grid-cols-3">
          {/* Author */}
          <div className="flex items-center gap-3.5">
            <span
              aria-hidden="true"
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-black font-heading text-sm font-bold text-white dark:bg-foreground dark:text-black"
            >
              FC
            </span>
            <div>
              <div className="font-heading text-[18px] tracking-[-0.01em] text-black dark:text-foreground">
                Federico Corradi
              </div>
              <div className="font-body text-[13px] text-black/55 dark:text-foreground/55">
                Creative web developer · Milan
              </div>
            </div>
          </div>

          {/* Tag pills */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap justify-start gap-2 md:justify-center">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-gray-100 px-3.5 py-2 font-heading text-[12px] text-black/78 dark:border-gray-100 dark:text-foreground/78"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Prev / next */}
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <a
              href="#"
              aria-label="Previous article"
              className="inline-flex items-center gap-2 rounded-full border border-gray-100 px-4 py-3 font-heading text-[13px] text-black dark:border-gray-100 dark:text-foreground transition hover:-translate-y-0.5"
            >
              <Icon name="chevron-left" className="size-3.5" />
              Previous
            </a>
            <a
              href="#"
              aria-label="Next article"
              className="inline-flex items-center gap-2 rounded-full border border-gray-100 px-4 py-3 font-heading text-[13px] text-black dark:border-gray-100 dark:text-foreground transition hover:-translate-y-0.5"
            >
              Next
              <Icon name="chevron-right" className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ArticleContent
export { ArticleContent }
