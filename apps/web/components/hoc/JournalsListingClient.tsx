'use client'

import { useState, useRef } from 'react'
import useSWR from 'swr'

import Card from '@/components/molecules/Card/Card'
import Button from '@/components/atoms/Button/Button'
import Select from '@/components/atoms/Select/Select'
import SkeletonCard from '@/components/molecules/SkeletonCard/SkeletonCard'
import { StaggerChildren } from '@/components/animation/StaggerChildren/StaggerChildren'
import { FadeInStagger } from '@/components/animation/FadeIn/FadeInStagger'
import { formatDate } from '@/utils/format-date'
import useClickOutside from '@/utils/use-click-outside'
import { cn } from '@/utils/cn'
import type {
  JournalsListingArticle,
  JournalsListingData,
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
  initialData: JournalsListingData
  apiEndpoint: string
}

const fetcher = async (url: string): Promise<ApiResponse> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json() as Promise<ApiResponse>
}

const buildKey = (
  apiEndpoint: string,
  categories: string[],
  page: number
): string => {
  const params = new URLSearchParams({ page: String(page) })
  if (categories.length > 0) params.set('categories', categories.join(','))
  return `${apiEndpoint}?${params.toString()}`
}

const buildPageNumbers = (
  current: number,
  total: number
): (number | '...')[] => {
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

const articleToCardProps = (
  article: JournalsListingArticle,
  index: number
) => ({
  href: article.slug?.current ? `/${article.slug.current}` : undefined,
  title: article.title,
  image: article.cardImage,
  imageAspectClassName: 'aspect-[3/2]',
  indexLabel:
    article.editionNumber != null
      ? `N° ${String(article.editionNumber).padStart(3, '0')}`
      : undefined,
  tag: article.tags?.[0],
  footerDate:
    formatDate({ value: article._createdAt, options: DATE_FORMAT }) ??
    undefined,
  footerReadTime: article.readTime ?? undefined,
  priority: index < 3,
  className:
    'hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)]',
})

const JournalsListingClient = ({
  initialData,
  apiEndpoint,
}: JournalsListingClientProps) => {
  const [activeCategories, setActiveCategories] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isInitialState = activeCategories.length === 0 && page === 1

  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    isInitialState ? null : buildKey(apiEndpoint, activeCategories, page),
    fetcher
  )

  useClickOutside({
    active: isDropdownOpen,
    containerRef: dropdownRef,
    onOutsideClick: () => setIsDropdownOpen(false),
  })

  const toggleCategory = (cat: string) => {
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
    setPage(1)
  }

  const removeCategory = (cat: string) => {
    setActiveCategories(prev => prev.filter(c => c !== cat))
    setPage(1)
  }

  const categoryCounts = initialData.allTags.reduce<Record<string, number>>(
    (acc, tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1
      return acc
    },
    {}
  )

  const articles = isInitialState
    ? initialData.articles
    : (data?.articles ?? [])
  const total = isInitialState ? initialData.total : (data?.total ?? 0)
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const showSkeleton = !isInitialState && isLoading

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Filter */}
      <nav
        className="relative border-b border-foreground/10"
        aria-label="Filter by topic"
      >
        {/* Mobile: native multi-select */}
        <Select
          multiple
          wrapperClassName="md:hidden py-4"
          label="Filter by topic"
          options={initialData.categories.map(cat => ({
            value: cat,
            label: `${cat} (${categoryCounts[cat] ?? 0})`,
          }))}
          value={activeCategories}
          onChange={e => {
            setActiveCategories(
              Array.from(
                (e.target as HTMLSelectElement).selectedOptions,
                o => o.value
              )
            )
            setPage(1)
          }}
        />

        {/* Desktop: dropdown trigger + chips */}
        <div
          ref={dropdownRef}
          className="relative hidden md:flex items-center gap-4"
        >
          <Button
            variant="ghost"
            onClick={() => setIsDropdownOpen(v => !v)}
            className="inline-flex items-center gap-2 py-5"
          >
            Filter by Topic
            <span aria-hidden="true" className="text-[10px]">
              {isDropdownOpen ? '∧' : '∨'}
            </span>
          </Button>

          {activeCategories.map(cat => (
            <button
              key={cat}
              onClick={() => removeCategory(cat)}
              className={cn(
                'relative py-5 font-heading text-body-md uppercase tracking-[0.14em] text-foreground',
                'transition-colors hover:text-foreground/55',
                'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-foreground'
              )}
            >
              {cat}
              <span aria-hidden="true" className="ml-1.5">
                ×
              </span>
              <span className="sr-only">(remove filter)</span>
            </button>
          ))}

          {isDropdownOpen && (
            <ul
              className="absolute left-0 top-full z-10 min-w-52 border border-foreground/10 bg-background"
              role="listbox"
              aria-multiselectable="true"
              aria-label="Categories"
            >
              {initialData.categories.map(cat => {
                const isSelected = activeCategories.includes(cat)
                return (
                  <li
                    key={cat}
                    className="border-b border-foreground/10 last:border-0"
                  >
                    <button
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        'flex w-full justify-between px-4 py-3 text-left',
                        'font-heading text-body-md uppercase tracking-[0.14em]',
                        'transition-colors',
                        isSelected ? 'text-foreground/40' : 'text-foreground'
                      )}
                    >
                      <span>{cat}</span>
                      <span>{categoryCounts[cat] ?? 0}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
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
