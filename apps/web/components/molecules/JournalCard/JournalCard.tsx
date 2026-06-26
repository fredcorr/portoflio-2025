'use client'

import Link from 'next/link'
import Image from '@/components/atoms/Image/Image'
import { formatDate } from '@/utils/format-date'
import type { JournalListingArticle } from '@portfolio/types/components'

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}

function padEdition(n: number): string {
  return String(n).padStart(3, '0')
}

interface JournalCardProps {
  article: JournalListingArticle
  priority?: boolean
}

export default function JournalCard({ article, priority }: JournalCardProps) {
  const href = article.slug?.current ? `/${article.slug.current}` : undefined
  const imageUrl = article.cardImage?.asset?.url
  const imageAlt = (article.cardImage as { alt?: string } | undefined)?.alt || article.title || ''
  const date = formatDate({ value: article._createdAt, options: DATE_FORMAT })
  const firstTag = article.tags?.[0]
  const editionLabel =
    article.editionNumber != null
      ? `N° ${padEdition(article.editionNumber)}`
      : undefined

  const inner = (
    <>
      <div className="relative aspect-[3/2] overflow-hidden bg-foreground/[0.06]">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            wrapperClassName="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-4 py-3.5">
        <div className="flex items-center justify-between">
          {editionLabel && (
            <span className="font-heading text-[11px] tracking-[0.14em] text-foreground/55">
              {editionLabel}
            </span>
          )}
          {firstTag && (
            <span className="border border-foreground/20 px-2 py-0.5 font-heading text-[10px] uppercase tracking-[0.12em] text-foreground/55">
              {firstTag}
            </span>
          )}
        </div>

        <p className="flex-1 text-balance font-heading text-[clamp(1rem,1.4vw,1.3rem)] font-normal leading-[1.2] tracking-[-0.02em] text-foreground">
          {article.title}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-foreground/10 pt-4">
          {date && (
            <span className="font-heading text-[13px] tracking-[-0.01em] text-foreground">
              {date}
            </span>
          )}
          {article.readTime != null && (
            <span className="font-heading text-[11px] tracking-[0.04em] text-foreground/55">
              {article.readTime} min read
            </span>
          )}
        </div>
      </div>
    </>
  )

  const className =
    'group flex flex-col bg-background text-inherit no-underline transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)]'

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <article className={className}>{inner}</article>
  )
}
