'use client'

import React from 'react'
import type { FooterProps } from '@portfolio/types/components'
import Icon from '@/components/atoms/Icon/Icon'
import { cn } from '@/utils/cn'
import getLinkHref from '@/utils/get-link-href'

const Footer: React.FC<FooterProps> = ({
  email,
  socialLinks,
  navigationItems,
  openForProjects,
  availabilityText,
  className,
}) => {
  const year = new Date().getFullYear()
  const hasEmail = Boolean(email)
  const hasSocialLinks = Boolean(socialLinks?.length)
  const hasNavItems = Boolean(navigationItems?.length)
  const availabilityLabel = availabilityText
    ? `Open for projects · ${availabilityText}`
    : 'Open for projects'

  return (
    <footer
      className={cn(
        'w-full bg-background px-4 py-16 text-foreground md:px-10 xl:px-28',
        className
      )}
    >
      <div className="mx-auto w-full max-w-[1440px]">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-6 border-b border-gray-100 pb-12 text-center md:gap-8 xl:gap-10 xl:pb-20">
          {openForProjects && (
            <span className="inline-flex items-center gap-2.5 font-heading text-[11px] uppercase tracking-[0.14em] text-black/55 dark:text-foreground/55">
              <span className="size-2 rounded-full bg-status-success shadow-[0_0_0_4px_rgba(41,174,41,0.18)]" />
              {availabilityLabel}
            </span>
          )}

          <h2 className="font-heading text-heading-1 font-normal leading-[0.95] tracking-[-0.04em] text-foreground xl:text-display-xl">
            Let&rsquo;s{' '}
            <em className="not-italic text-accent-orange">talk.</em>
          </h2>

          {hasEmail && (
            <a
              href={`mailto:${email}`}
              aria-label={`Email ${email}`}
              className={cn(
                'inline-flex items-center gap-3 bg-foreground px-[22px] py-4 text-background',
                'font-heading text-[15px] tracking-[-0.005em]',
                'transition hover:-translate-y-0.5',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground'
              )}
            >
              {email}
              <Icon name="arrow-up-right" className="size-3.5" title="Send email" />
            </a>
          )}
        </div>

        {/* ── 4-column sitemap grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-2 md:gap-10 xl:grid-cols-[1.6fr_1fr_1fr_1fr] xl:gap-16 xl:py-16">

          {/* Signature */}
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-3 font-heading text-[18px] font-bold tracking-[-0.015em] text-foreground">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-foreground text-[10px] tracking-[0.04em] text-background">
                FC
              </span>
              Federico Corradi
            </span>
            <p className="max-w-[32ch] font-heading text-sm leading-[1.55] text-black/78 dark:text-foreground/82">
              Creative web developer building considered, fast-loading interfaces for studios &amp; founders.
            </p>
            <div className="flex flex-col gap-1.5 pt-1.5 font-heading text-[12px] tracking-[0.02em] text-black/55 dark:text-foreground/55">
              <span>Milan, IT · CET (UTC+1)</span>
              {openForProjects && (
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full bg-status-success shadow-[0_0_0_3px_rgba(41,174,41,0.18)]" />
                  {availabilityLabel}
                </span>
              )}
            </div>
          </div>

          {/* Sitemap */}
          {hasNavItems && (
            <div className="flex flex-col gap-4">
              <span className="font-heading text-[10px] uppercase tracking-[0.18em] text-black/55 dark:text-foreground/55">
                Sitemap
              </span>
              <ul className="flex flex-col gap-2.5">
                {navigationItems?.map((item) => (
                  <li key={item._id}>
                    <a
                      href={`/${item.slug.current}`}
                      className="font-heading text-[15px] tracking-[-0.005em] text-foreground transition hover:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Elsewhere (social links) */}
          {hasSocialLinks && (
            <div className="flex flex-col gap-4">
              <span className="font-heading text-[10px] uppercase tracking-[0.18em] text-black/55 dark:text-foreground/55">
                Elsewhere
              </span>
              <ul className="flex flex-col gap-2.5">
                {socialLinks?.map((link, index) => {
                  const href = getLinkHref(link)
                  const label = link?.name || link?.internal_ref?.title || link?.url
                  const linkKey =
                    link?.internal_ref?._id ||
                    link?.url ||
                    link?.name ||
                    `footer-social-${index}`
                  const isExternal = Boolean(href?.startsWith('http'))

                  return href && label ? (
                    <li key={linkKey}>
                      <a
                        href={href}
                        className="inline-flex items-center gap-1.5 font-heading text-[15px] tracking-[-0.005em] text-foreground transition hover:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                        {...(isExternal && { target: '_blank', rel: 'noreferrer' })}
                      >
                        {label}
                        {isExternal && (
                          <span className="text-[11px] opacity-50">↗</span>
                        )}
                      </a>
                    </li>
                  ) : null
                })}
              </ul>
            </div>
          )}

          {/* Direct */}
          {hasEmail && (
            <div className="flex flex-col gap-4">
              <span className="font-heading text-[10px] uppercase tracking-[0.18em] text-black/55 dark:text-foreground/55">
                Direct
              </span>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="font-heading text-[15px] tracking-[-0.005em] text-foreground transition hover:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                  >
                    {email}
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* ── Baseline ──────────────────────────────────────────── */}
        <div
          className={cn(
            'grid grid-cols-1 gap-2 border-t border-gray-100 pt-6 pb-9',
            'font-heading text-[12px] tracking-[0.02em] text-black/55 dark:text-foreground/55',
            'md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6'
          )}
        >
          <span>© {year} — Federico Corradi</span>
          <span className="md:justify-self-center">Designed &amp; built in-house</span>
          <a
            href="#main-content"
            className="text-foreground transition hover:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground md:justify-self-end"
          >
            Back to top ↑
          </a>
        </div>

      </div>
    </footer>
  )
}

export default Footer
