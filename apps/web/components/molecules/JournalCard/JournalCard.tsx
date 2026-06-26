'use client'

import Card from '@/components/molecules/Card/Card'
import { formatDate } from '@/utils/format-date'
import type { JournalListingArticle } from '@portfolio/types/components'

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}

interface JournalCardProps {
  article: JournalListingArticle
  priority?: boolean
}

export default function JournalCard({ article, priority }: JournalCardProps) {
  const href = article.slug?.current ? `/${article.slug.current}` : undefined
  const date = formatDate({ value: article._createdAt, options: DATE_FORMAT })
  const editionLabel =
    article.editionNumber != null
      ? `N° ${String(article.editionNumber).padStart(3, '0')}`
      : undefined

  return (
    <Card
      as="article"
      href={href}
      title={article.title}
      image={article.cardImage}
      imageAspectClassName="aspect-[3/2]"
      indexLabel={editionLabel}
      tag={article.tags?.[0]}
      footerDate={date ?? undefined}
      footerReadTime={article.readTime ?? undefined}
      priority={priority}
      className="hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)]"
    />
  )
}
