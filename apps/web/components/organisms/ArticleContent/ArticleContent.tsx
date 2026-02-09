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

const buildShareItems = (
  shareUrl?: string,
  shareTitle?: string
): ShareItem[] => {
  if (!shareUrl) {
    return []
  }

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = shareTitle ? encodeURIComponent(shareTitle) : undefined

  return [
    {
      label: 'Facebook',
      icon: 'facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'X',
      icon: 'x',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}${
        encodedTitle ? `&text=${encodedTitle}` : ''
      }`,
    },
    {
      label: 'LinkedIn',
      icon: 'linkedin',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ]
}

const ArticleContent: React.FC<ArticleContentProps> = ({
  content,
  shareUrl,
  shareTitle,
  className,
}) => {
  const hasContent = Boolean(content && content.length)
  const [copied, setCopied] = React.useState(false)
  const shareItems = buildShareItems(shareUrl, shareTitle)
  const hasShare = Boolean(shareItems.length)

  const handleCopy = React.useCallback(async () => {
    if (!shareUrl) {
      return
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }, [shareUrl])

  const shareActions: ShareItem[] = hasShare
    ? [
        ...shareItems,
        {
          label: copied ? 'Copied' : 'Copy link',
          icon: 'link',
          onClick: handleCopy,
        },
      ]
    : []

  if (!hasContent && !hasShare) {
    return null
  }

  return (
    <section
      data-organism="article-content"
      data-development="Figma: Article body with share column and rich text."
      className={cn('bg-background text-black dark:text-foreground', className)}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 md:py-12 xl:px-28 xl:py-[73px]">
        <div className="grid gap-8 md:grid-cols-12 xl:gap-[34px]">
          {hasShare && (
            <div className="md:col-span-2 xl:col-span-1">
              <div className="flex flex-col items-start gap-4">
                <span className="text-body-lg font-body font-medium tracking-tight text-black/60 dark:text-foreground/60">
                  Share
                </span>
                <ul className="flex flex-row gap-3 md:flex-col md:gap-4">
                  {shareActions.map(action => {
                    const isButton = typeof action.onClick === 'function'
                    const contentNode = (
                      <span className="inline-flex size-12 items-center justify-center rounded-[8px] bg-gray-50 text-black/80 transition hover:text-black dark:bg-surface-2 dark:text-foreground">
                        <Icon
                          name={action.icon}
                          className="size-5"
                          title={action.label}
                        />
                      </span>
                    )

                    return (
                      <li key={action.label}>
                        {isButton && (
                          <button
                            type="button"
                            aria-label={action.label}
                            onClick={action.onClick}
                            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:focus-visible:outline-white"
                          >
                            {contentNode}
                          </button>
                        )}
                        {!isButton && action.href && (
                          <a
                            href={action.href}
                            aria-label={action.label}
                            target="_blank"
                            rel="noreferrer"
                            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:focus-visible:outline-white"
                          >
                            {contentNode}
                          </a>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}

          {hasContent && (
            <div
              className={cn('md:col-span-10', !hasShare && 'md:col-span-12')}
            >
              <RichText
                value={content ?? []}
                size={RichTextSize.Lg}
                className="text-black dark:text-foreground"
                components={{
                  block: {
                    h1: ({ children }) => (
                      <h2 className="mb-6 mt-8 font-display text-heading-2 font-normal tracking-tight text-black dark:text-foreground">
                        {children}
                      </h2>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-6 mt-8 font-display text-heading-2 font-normal tracking-tight text-black dark:text-foreground">
                        {children}
                      </h2>
                    ),
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ArticleContent
export { ArticleContent }
