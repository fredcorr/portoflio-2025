'use client'

import { useState } from 'react'
import useSWR from 'swr'

import Card from '@/components/molecules/Card/Card'
import Button from '@/components/atoms/Button/Button'
import SkeletonCard from '@/components/molecules/SkeletonCard/SkeletonCard'
import { StaggerChildren } from '@/components/animation/StaggerChildren/StaggerChildren'
import { FadeInStagger } from '@/components/animation/FadeIn/FadeInStagger'
import { formatDate } from '@/utils/format-date'
import { cn } from '@/utils/cn'
import type {
  JournalsListingArticle,
  JournalsListingInitialData,
} from '@portfolio/types/components'

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}

const PAGE_SIZE = 6

interface ApiResponse {
  articles: JournalsListingArticle[]
  total: number
}

interface JournalsListingClientProps {
  initialData: JournalsListingInitialData
  apiEndpoint: string
}

const fetcher = async (url: string): Promise<ApiResponse> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json() as Promise<ApiResponse>
}

const buildKey = (apiEndpoint: string, category: string, page: number): string => {
  const params = new URLSearchParams({ page: String(page) })
  if (category !== 'All') params.set('category', category)
  return `${apiEndpoint}?${params.toString()}`
}

const buildPageNumbers = (current: number, total: number): (number | '...')[] => {
  const candidates = [1, total, current, current - 1, current + 1].filter(
    n => n >= 1 && n <= total
  )
  const show = Array.from(new Set(candidates)).sort((a, b) => a - b)
  const result: (number | '...')[] = []
  show.forEach((n, i) => {
    if (i > 0 && n - show[i - 1] > 1) result.push('...')
    result.push(n)
  })
  return result
}

const articleToCardProps = (article: JournalsListingArticle, index: number) => ({
  href: article.slug?.current ? `/${article.slug.current}` : undefined,
  title: article.title,
  image: article.cardImage,
  imageAspectClassName: 'aspect-[3/2]',
  indexLabel:
    article.editionNumber != null
      ? `N° ${String(article.editionNumber).padStart(3, '0')}`
      : undefined,
  tag: article.tags?.[0],
  footerDate: formatDate({ value: article._createdAt, options: DATE_FORMAT }) ?? undefined,
  footerReadTime: article.readTime ?? undefined,
  priority: index < 3,
  className: 'hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)]',
})

const JournalsListingClient = ({
  initialData,
  apiEndpoint,
}: JournalsListingClientProps) => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage] = useState(1)

  const isInitialState = activeCategory === 'All' && page === 1

  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    isInitialState ? null : buildKey(apiEndpoint, activeCategory, page),
    fetcher
  )

  const articles = isInitialState ? initialData.articles : (data?.articles ?? [])
  const total = isInitialState ? initialData.total : (data?.total ?? 0)
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const showSkeleton = !isInitialState && isLoading

  const categoryCounts = initialData.allTags.reduce<Record<string, number>>(
    (acc, tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1
      return acc
    },
    {}
  )

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Filter nav */}
      <nav
        className="overflow-x-auto border-b border-foreground/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Filter by category"
      >
        <ul className="flex" role="list">
          {['All', ...initialData.categories].map(cat => {
            const isActive = cat === activeCategory
            const count = cat === 'All' ? initialData.total : (categoryCounts[cat] ?? 0)
            return (
              <li key={cat}>
                <Button
                  variant="ghost"
                  aria-pressed={isActive}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    'relative flex-shrink-0 whitespace-nowrap py-5',
                    'after:absolute after:bottom-0 after:left-5 after:right-5 after:h-px after:bg-foreground',
                    'after:transition-transform after:duration-[250ms] after:ease-[cubic-bezier(0.22,1,0.36,1)]',
                    isActive
                      ? 'text-foreground after:scale-x-100'
                      : 'text-foreground/55 hover:text-foreground after:scale-x-0'
                  )}
                >
                  {cat}
                  <span className="ml-1.5 inline-flex h-4 min-w-[18px] items-center justify-center bg-foreground/[0.06] px-1 font-heading text-[9px] tracking-[0.04em] text-foreground align-middle">
                    {count}
                  </span>
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Grid */}
      <div className="py-12">
        {showSkeleton ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-start gap-4 py-20">
            <p className="font-heading text-foreground/55">
              Couldn&apos;t load articles — try again.
            </p>
            <Button variant="outline" onClick={() => void mutate()}>
              Retry
            </Button>
          </div>
        ) : articles.length === 0 ? (
          <p className="py-20 font-heading text-[clamp(1.5rem,3vw,2.5rem)] font-normal tracking-[-0.02em] text-foreground/55">
            No entries in this category yet.
          </p>
        ) : (
          <StaggerChildren
            as="div"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            staggerDelay={0.05}
            amount={0.1}
          >
            {articles.map((article, i) => (
              <Card
                key={article._id}
                {...articleToCardProps(article, i)}
                AnimationComponent={FadeInStagger}
              />
            ))}
          </StaggerChildren>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-end gap-1 pb-16"
          aria-label="Pagination"
        >
          <Button
            variant="outline"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="inline-flex items-center gap-2 px-[18px]"
          >
            <svg
              className="size-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Prev
          </Button>

          {buildPageNumbers(page, totalPages).map((item, i) =>
            item === '...' ? (
              <span
                key={`sep-${i}`}
                className="px-1.5 font-heading text-body-md text-foreground/55"
              >
                …
              </span>
            ) : (
              <Button
                key={item}
                variant="outline"
                onClick={() => handlePageChange(item as number)}
                aria-current={item === page ? 'page' : undefined}
                className={cn(
                  'inline-flex size-10 items-center justify-center p-0',
                  item === page &&
                    'border-foreground bg-foreground text-background hover:border-foreground hover:text-background'
                )}
              >
                {item}
              </Button>
            )
          )}

          <Button
            variant="outline"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="inline-flex items-center gap-2 px-[18px]"
          >
            Next
            <svg
              className="size-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </Button>
        </nav>
      )}
    </div>
  )
}

export default JournalsListingClient
