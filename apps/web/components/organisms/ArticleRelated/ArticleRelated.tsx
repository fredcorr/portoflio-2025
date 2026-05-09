import React from 'react'
import Link from 'next/link'
import type {
  ArticleRelatedProps,
  RelatedArticle,
} from '@portfolio/types/components'
import Image from '@/components/atoms/Image/Image'
import Icon from '@/components/atoms/Icon/Icon'
import { buildPageUrl } from '@/utils/slug'
import { getSiteUrl } from '@/utils/get-site-url'
import { formatDate } from '@/utils/format-date'
import { cn } from '@/utils/cn'

interface Props extends ArticleRelatedProps {
  className?: string
}

function padEdition(n: number): string {
  return String(n).padStart(3, '0')
}

function PostCard({
  article,
  index,
}: {
  article: RelatedArticle
  index: number
}) {
  const slug = article.slug?.current
  const href = slug ? buildPageUrl(getSiteUrl(), slug) : '#'
  const imageUrl = article.heroImage?.asset?.url
  const imageAlt = article.heroImage?.alt || article.title || ''
  const dateStr = article._createdAt
    ? formatDate({
        value: article._createdAt,
        options: { year: 'numeric', month: 'short' },
      })
    : undefined
  const firstTag = article.tags?.[0]
  const editionLabel =
    article.editionNumber != null
      ? `N° ${padEdition(article.editionNumber)}`
      : String(index + 1).padStart(2, '0')

  return (
    <a
      href={href}
      className="group flex flex-col gap-4 text-inherit no-underline transition hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[1.18/1] overflow-hidden rounded-[28px] bg-primary-600">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            wrapperClassName="absolute inset-0"
          />
        ) : (
          <div
            className={cn(
              'absolute inset-0',
              index === 0 &&
                'bg-gradient-to-br from-primary-400 to-primary-700',
              index === 1 &&
                'bg-gradient-to-br from-primary-300 to-primary-600',
              index === 2 && 'bg-gradient-to-br from-primary-200 to-primary-500'
            )}
          />
        )}
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-2 px-1.5">
        <span className="font-heading text-[11px] tracking-[0.12em] text-black/55 dark:text-foreground/55">
          {editionLabel}
        </span>
        {article.title && (
          <span
            className="font-heading font-normal leading-[1.2] tracking-[-0.015em] text-black dark:text-foreground text-balance"
            style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)' }}
          >
            {article.title}
          </span>
        )}
        <span className="flex items-center gap-3 font-heading text-[11px] uppercase tracking-[0.12em] text-black/55 dark:text-foreground/55">
          {firstTag && <span>{firstTag}</span>}
          {firstTag && dateStr && <span>·</span>}
          {dateStr && <span>{dateStr}</span>}
        </span>
      </div>
    </a>
  )
}

const ArticleRelated: React.FC<Props> = ({ relatedArticles, className }) => {
  if (!relatedArticles || relatedArticles.length === 0) return null

  return (
    <section
      data-organism="article-related"
      className={cn(
        'border-b border-gray-100 bg-background px-4 py-16 dark:border-gray-100 md:px-8 md:py-20 xl:px-28 xl:py-24',
        className
      )}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-gray-100 pb-7 dark:border-gray-100 md:mb-12">
          <h2
            className="font-heading font-normal leading-none tracking-[-0.025em] text-black dark:text-foreground"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Continue reading
          </h2>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-full border border-gray-100 px-4 py-2.5 font-heading text-sm text-black transition hover:-translate-y-0.5 dark:border-gray-100 dark:text-foreground"
          >
            All essays
            <Icon name="arrow-up-right" className="size-3.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {relatedArticles.map((article, i) => (
            <PostCard
              key={article.slug?.current ?? i}
              article={article}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ArticleRelated
export { ArticleRelated }
