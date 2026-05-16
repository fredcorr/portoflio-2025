import type { JournalsFeedComponent } from '@portfolio/types/components'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { Heading } from '@/components/atoms/Heading/Heading'
import { makeComponentId } from '@/utils/makeComponentId'
import { getLinkHref } from '@/utils/get-link-href'
import { formatDate } from '@/utils/format-date'
import { getReadTimeLabel } from '@/utils/calculate-read-time'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const formatArticleNumber = (index: number): string => {
  const n = (index + 1).toString().padStart(3, '0')
  return `N° ${n}`
}

const JournalsFeed = ({
  _id,
  _key,
  sectionId,
  componentIndex,
  kicker,
  title,
  ctaLabel,
  ctaLink,
  articles,
}: JournalsFeedComponent) => {
  const headingId = makeComponentId({
    value: _id || _key,
    prefix: 'journals-feed',
  })

  const ctaHref = getLinkHref(ctaLink)

  return (
    <ComponentLayout
      sectionId={sectionId}
      componentKey={_key}
      componentIndex={componentIndex}
      contentClassName="col-span-full flex flex-col gap-y-0"
      aria-labelledby={headingId}
    >
      {/* Section header */}
      <header className="grid grid-cols-[auto_1fr_auto] items-end gap-x-8 border-b border-foreground/10 pb-7 mb-10 md:mb-14">
        {kicker && (
          <span className="inline-flex items-center gap-3 font-heading text-[11px] uppercase tracking-[0.14em] text-foreground/55 before:block before:size-1.5 before:rounded-full before:bg-foreground before:opacity-60">
            {kicker}
          </span>
        )}

        <span />

        {ctaHref && ctaLabel && (
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-3 font-heading text-sm text-foreground transition-transform duration-200 hover:-translate-y-0.5 hover:border-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            {ctaLabel}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        )}

        {title?.heading && (
          <Heading
            level={title.headingLevel}
            id={headingId}
            className="col-span-full mt-4 font-heading text-[clamp(2.5rem,7vw,6rem)] font-normal leading-[0.95] tracking-[-0.035em] text-balance"
          >
            {title.heading}
          </Heading>
        )}
      </header>

      {/* Article list */}
      {articles?.length ? (
        <ol>
          {articles.map((article, i) => {
            const href = article.slug?.current
              ? `/${article.slug.current}`
              : undefined
            const date = formatDate({
              value: article._createdAt,
              options: { day: 'numeric', month: 'short', year: 'numeric' },
            })
            const readTime = getReadTimeLabel(article.articleContent)
            const topic = article.tags?.join(' · ')

            const row = (
              <>
                <span className="font-heading text-[11px] tracking-[0.14em] text-foreground/55">
                  {formatArticleNumber(i)}
                </span>

                <span className="font-heading text-[clamp(1.25rem,2.4vw,1.75rem)] font-normal leading-snug tracking-tight text-foreground text-balance transition-[letter-spacing] duration-200 ease-out group-hover:tracking-[-0.022em]">
                  {article.title}
                </span>

                {topic && (
                  <span className="hidden font-heading text-[11px] uppercase tracking-[0.14em] text-foreground/55 md:block">
                    {topic}
                  </span>
                )}

                <span className="hidden text-right md:block">
                  {date && (
                    <span className="block font-heading text-sm tracking-[-0.01em] text-foreground">
                      {date}
                    </span>
                  )}
                  {readTime && (
                    <span className="font-heading text-[11px] tracking-[0.04em] text-foreground/55">
                      {readTime}
                    </span>
                  )}
                </span>

                <span
                  className="inline-flex size-7 items-center justify-center rounded-full border border-foreground/15 text-foreground opacity-55 transition-[transform,opacity] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <ArrowUpRight className="size-3" />
                </span>
              </>
            )

            const sharedClassName =
              'group grid grid-cols-[48px_1fr_28px] md:grid-cols-[64px_1fr_200px_140px_28px] items-center gap-4 md:gap-6 border-b border-foreground/10 py-5 px-3 rounded-xl text-inherit no-underline transition-[background,padding] duration-200 first:border-t first:border-t-foreground/10 hover:bg-foreground/[0.035] hover:pl-5'

            return href ? (
              <li key={article._id}>
                <Link href={href} className={sharedClassName}>
                  {row}
                </Link>
              </li>
            ) : (
              <li key={article._id} className={sharedClassName}>
                {row}
              </li>
            )
          })}
        </ol>
      ) : (
        <div className="rounded-3xl bg-foreground/5 px-6 py-10 text-foreground/60">
          Articles will appear here once they are published.
        </div>
      )}
    </ComponentLayout>
  )
}

export default JournalsFeed
