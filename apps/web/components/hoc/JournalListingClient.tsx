'use client'

import { useState } from 'react'
import useSWR from 'swr'
import JournalCard from '@/components/molecules/JournalCard/JournalCard'
import { StaggerChildren } from '@/components/animation/StaggerChildren/StaggerChildren'
import { FadeInStagger } from '@/components/animation/FadeIn/FadeInStagger'
import type {
  JournalListingArticle,
  JournalListingInitialData,
} from '@portfolio/types/components'

const PAGE_SIZE = 6

interface ApiResponse {
  articles: JournalListingArticle[]
  total: number
}

interface JournalListingClientProps {
  initialData: JournalListingInitialData
}

async function fetcher(url: string): Promise<ApiResponse> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json() as Promise<ApiResponse>
}

function buildKey(category: string, page: number): string {
  const params = new URLSearchParams({ page: String(page) })
  if (category !== 'All') params.set('category', category)
  return `/api/journal?${params.toString()}`
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
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

function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col">
      <div className="aspect-[3/2] bg-foreground/[0.06]" />
      <div className="flex flex-col gap-2.5 px-4 py-3.5">
        <div className="flex justify-between">
          <div className="h-3 w-16 rounded-sm bg-foreground/[0.06]" />
          <div className="h-3 w-12 rounded-sm bg-foreground/[0.06]" />
        </div>
        <div className="h-5 w-3/4 rounded-sm bg-foreground/[0.06]" />
        <div className="h-4 w-1/2 rounded-sm bg-foreground/[0.06]" />
        <div className="mt-2 flex justify-between border-t border-foreground/10 pt-4">
          <div className="h-3 w-20 rounded-sm bg-foreground/[0.06]" />
          <div className="h-3 w-14 rounded-sm bg-foreground/[0.06]" />
        </div>
      </div>
    </div>
  )
}

export default function JournalListingClient({
  initialData,
}: JournalListingClientProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage] = useState(1)

  const isInitialState = activeCategory === 'All' && page === 1

  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    isInitialState ? null : buildKey(activeCategory, page),
    fetcher
  )

  const articles = isInitialState
    ? initialData.articles
    : (data?.articles ?? [])
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

  function handleCategoryChange(category: string) {
    setActiveCategory(category)
    setPage(1)
  }

  const filterBtnBase =
    'relative flex-shrink-0 whitespace-nowrap px-5 py-5 font-heading text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 after:absolute after:bottom-0 after:left-5 after:right-5 after:h-px after:bg-foreground after:transition-transform after:duration-[250ms] after:ease-[cubic-bezier(0.22,1,0.36,1)]'

  return (
    <div>
      {/* Filter bar */}
      <div
        className="overflow-x-auto border-b border-foreground/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Filter by category"
        role="tablist"
      >
        <div className="flex">
          {['All', ...initialData.categories].map(cat => {
            const isActive = cat === activeCategory
            const count =
              cat === 'All' ? initialData.total : (categoryCounts[cat] ?? 0)
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(cat)}
                className={`${filterBtnBase} ${
                  isActive
                    ? 'text-foreground after:scale-x-100'
                    : 'text-foreground/55 hover:text-foreground after:scale-x-0'
                }`}
              >
                {cat}
                <span className="ml-1.5 inline-flex h-4 min-w-[18px] items-center justify-center bg-foreground/[0.06] px-1 font-heading text-[9px] tracking-[0.04em] text-foreground align-middle">
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

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
            <button
              onClick={() => void mutate()}
              className="border border-foreground/15 px-4 py-2.5 font-heading text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground"
            >
              Retry
            </button>
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
              <FadeInStagger key={article._id}>
                <JournalCard article={article} priority={i < 3} />
              </FadeInStagger>
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
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="inline-flex items-center gap-2 border border-foreground/10 px-[18px] py-2.5 font-heading text-[11px] uppercase tracking-[0.14em] text-foreground/55 transition-colors duration-200 hover:border-foreground hover:text-foreground disabled:cursor-default disabled:opacity-25"
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
          </button>

          {buildPageNumbers(page, totalPages).map((item, i) =>
            item === '...' ? (
              <span
                key={`sep-${i}`}
                className="px-1.5 font-heading text-[11px] text-foreground/55"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => handlePageChange(item as number)}
                aria-current={item === page ? 'page' : undefined}
                className={`inline-flex size-10 items-center justify-center border font-heading text-[11px] tracking-[0.14em] transition-colors duration-200 ${
                  item === page
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-foreground/10 text-foreground/55 hover:border-foreground hover:text-foreground'
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="inline-flex items-center gap-2 border border-foreground/10 px-[18px] py-2.5 font-heading text-[11px] uppercase tracking-[0.14em] text-foreground/55 transition-colors duration-200 hover:border-foreground hover:text-foreground disabled:cursor-default disabled:opacity-25"
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
          </button>
        </nav>
      )}
    </div>
  )

  function handlePageChange(newPage: number) {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
